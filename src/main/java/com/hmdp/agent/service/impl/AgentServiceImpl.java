package com.hmdp.agent.service.impl;

import cn.hutool.core.util.StrUtil;
import com.hmdp.agent.dto.ChatRequest;
import com.hmdp.agent.dto.ChatResponse;
import com.hmdp.agent.intent.Intent;
import com.hmdp.agent.intent.IntentRecognizer;
import com.hmdp.agent.intent.IntentResult;
import com.hmdp.agent.llm.LlmClient;
import com.hmdp.agent.llm.RuleBasedLlmClient;
import com.hmdp.agent.memory.AgentSession;
import com.hmdp.agent.memory.SessionStore;
import com.hmdp.agent.service.AgentService;
import com.hmdp.agent.tool.AgentTool;
import com.hmdp.agent.tool.ToolRegistry;
import com.hmdp.agent.tool.ToolResult;
import com.hmdp.dto.Result;
import com.hmdp.utils.UserHolder;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Agent 编排核心：
 * 识别意图 → 结合会话上下文补全参数 → 调用对应工具（即现有业务接口） → 生成自然语言回复 → 持久化会话。
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

    private static final String SYSTEM_PROMPT = "你是黑马点评的智能购物助手，请用中文简洁、友好地回复用户。";

    @Override
    public Result chat(ChatRequest request) {
        if (request == null || StrUtil.isBlank(request.getMessage())) {
            return Result.fail("消息不能为空");
        }
        Long userId = UserHolder.getUser() == null ? null : UserHolder.getUser().getId();
        String sessionKey = StrUtil.isNotBlank(request.getSessionId())
                ? request.getSessionId() : ("u:" + userId);

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
