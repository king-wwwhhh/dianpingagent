package com.llp.agent.service.impl;

import cn.hutool.core.util.StrUtil;
import com.llp.agent.dto.ChatRequest;
import com.llp.agent.dto.ChatResponse;
import com.llp.agent.intent.Intent;
import com.llp.agent.intent.IntentRecognizer;
import com.llp.agent.intent.IntentResult;
import com.llp.agent.llm.LlmClient;
import com.llp.agent.llm.RuleBasedLlmClient;
import com.llp.agent.memory.AgentSession;
import com.llp.agent.memory.SessionStore;
import com.llp.agent.service.AgentService;
import com.llp.agent.tool.AgentTool;
import com.llp.agent.tool.ToolRegistry;
import com.llp.agent.tool.ToolResult;
import com.llp.dto.Result;
import com.llp.utils.UserHolder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Agent 编排核心：
 * 识别意图 → 结合会话上下文补全参数 → 调用对应工具（即现有业务接口） → 生成自然语言回复 → 持久化会话。
 * 另含接口限流，防止大模型接口被刷。
 */
@Service
public class AgentServiceImpl implements AgentService {

    @Resource
    private IntentRecognizer intentRecognizer;
    @Resource
    private ToolRegistry toolRegistry;
    @Resource
    private SessionStore sessionStore;
    @Resource
    private LlmClient llmClient;
    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Value("${agent.rate-limit.enabled:true}")
    private boolean rateLimitEnabled;
    @Value("${agent.rate-limit.max-requests:10}")
    private int rateLimitMax;
    @Value("${agent.rate-limit.window-seconds:60}")
    private int rateLimitWindow;

    private static final String SYSTEM_PROMPT = "你是「惠生活」平台的智能购物助手。请用中文简洁、友好地回复用户；"
            + "只能基于已提供的业务数据回答，不要编造店铺、优惠券或订单信息；"
            + "如果业务系统已返回店铺/优惠券列表，请直接告诉用户具体名称、评分、价格等关键信息，不要笼统地说『未返回』；"
            + "不确定时如实告知用户，并给出可操作的替代建议（如换个关键词或分类）。";

    @Override
    public Result chat(ChatRequest request) {
        if (request == null || StrUtil.isBlank(request.getMessage())) {
            return Result.fail("消息不能为空");
        }
        Long userId = UserHolder.getUser() == null ? null : UserHolder.getUser().getId();
        String sessionKey = StrUtil.isNotBlank(request.getSessionId())
                ? request.getSessionId() : ("u:" + userId);

        // 接口限流：按会话/用户维度防止大模型接口被刷
        if (rateLimitEnabled) {
            String rlKey = "agent:ratelimit:" + sessionKey;
            Long cnt = stringRedisTemplate.opsForValue().increment(rlKey);
            if (cnt != null && cnt == 1) {
                stringRedisTemplate.expire(rlKey, Duration.ofSeconds(rateLimitWindow));
            }
            if (cnt != null && cnt > rateLimitMax) {
                return Result.fail("操作过于频繁，请稍后再试～");
            }
        }

        AgentSession session = sessionStore.get(sessionKey);
        IntentResult ir = intentRecognizer.recognize(request.getMessage());

        String toolResult = null;
        Object data = null;
        AgentTool tool = toolRegistry.get(ir.getIntent());
        if (tool != null) {
            Map<String, Object> params = new HashMap<>(ir.getParams());
            // 用会话上下文补全参数
            if (ir.getVoucherIndex() != null && params.get("voucherId") == null
                    && session.getLastVouchers() != null && !session.getLastVouchers().isEmpty()) {
                int idx = ir.getVoucherIndex() - 1;
                if (idx >= 0 && idx < session.getLastVouchers().size()) {
                    params.put("voucherId", session.getLastVouchers().get(idx).get("id"));
                }
            }
            if (ir.getIntent() == Intent.QUERY_VOUCHERS && params.get("shopId") == null
                    && session.getLastShopId() != null) {
                params.put("shopId", session.getLastShopId());
            }

            ToolResult tr = tool.execute(params);
            toolResult = tr.getMessage();
            data = tr.getPayload();

            // 维护会话上下文，供后续「第N张」「这家店的券」等省略表达使用
            if (ir.getIntent() == Intent.QUERY_VOUCHERS && data instanceof List) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> vouchers = (List<Map<String, Object>>) data;
                session.setLastVouchers(vouchers);
            }
            if (ir.getIntent() == Intent.QUERY_SHOPS && data instanceof List) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> shops = (List<Map<String, Object>>) data;
                session.setLastShops(shops);
                if (!shops.isEmpty()) {
                    session.setLastShopId(Long.valueOf(shops.get(0).get("id").toString()));
                }
            }
            if (params.get("shopId") != null) {
                session.setLastShopId(Long.valueOf(params.get("shopId").toString()));
            }
        }

        List<String> history = session.getHistory();
        String reply = llmClient.generate(SYSTEM_PROMPT, request.getMessage(), history, toolResult);
        if (reply == null) {
            reply = new RuleBasedLlmClient().generate(SYSTEM_PROMPT, request.getMessage(), history, toolResult);
        }

        history.add(request.getMessage());
        history.add(reply);
        if (history.size() > 20) {
            history.subList(0, history.size() - 20).clear();
        }
        sessionStore.save(sessionKey, session);

        return Result.ok(new ChatResponse(reply, ir.getIntent().name(), data));
    }
}
