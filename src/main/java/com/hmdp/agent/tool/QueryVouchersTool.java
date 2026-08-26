package com.hmdp.agent.tool;

import com.hmdp.agent.intent.Intent;
import com.hmdp.dto.Result;
import com.hmdp.entity.Voucher;
import com.hmdp.service.IVoucherService;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 查询某店铺的优惠券 —— 复用原有 IVoucherService.queryVoucherOfShop（走 CacheClient 缓存）
 */
@Component
public class QueryVouchersTool implements AgentTool {

    @Resource
    private IVoucherService voucherService;

    @Override
    public Intent supports() {
        return Intent.QUERY_VOUCHERS;
    }

    @Override
    @SuppressWarnings("unchecked")
    public ToolResult execute(Map<String, Object> params) {
        Object shopObj = params.get("shopId");
        if (shopObj == null) {
            return ToolResult.ok("请告诉我你想查看哪家店铺的优惠券，例如「查店铺1的优惠券」。");
        }
        Long shopId = Long.valueOf(shopObj.toString());
        Result result = voucherService.queryVoucherOfShop(shopId);
        if (!result.getSuccess()) {
            return ToolResult.fail("查询失败：" + result.getErrorMsg());
        }
        List<Voucher> list = (List<Voucher>) result.getData();
        if (list == null || list.isEmpty()) {
            return ToolResult.ok("该店铺暂时没有可领取的优惠券。");
        }
        StringBuilder sb = new StringBuilder();
        sb.append("共找到 ").append(list.size()).append(" 张优惠券：\n");
        List<Map<String, Object>> payload = new ArrayList<>();
        for (int i = 0; i < list.size(); i++) {
            Voucher v = list.get(i);
            sb.append("第").append(i + 1).append("张：").append(v.getTitle())
                    .append("（券ID：").append(v.getId()).append("）\n");
            Map<String, Object> m = new HashMap<>(2);
            m.put("id", v.getId());
            m.put("title", v.getTitle());
            payload.add(m);
        }
        sb.append("需要抢券的话，可以对我说「帮我秒杀第2张」。");
        return ToolResult.ok(sb.toString().trim(), payload);
    }
}
