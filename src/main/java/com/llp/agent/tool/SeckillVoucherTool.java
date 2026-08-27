package com.llp.agent.tool;

import com.llp.agent.intent.Intent;
import com.llp.dto.Result;
import com.llp.service.IVoucherOrderService;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.Map;

/**
 * 秒杀抢券 —— 复用原有 IVoucherOrderService.seckillVoucher。
 * 该方法内部执行 seckill.lua（库存+一人一单原子扣减）并通过 Redis Stream 异步下单，
 * 因此秒杀的亮点逻辑原样生效、零改动。需登录（自动取当前用户）。
 */
@Component
public class SeckillVoucherTool implements AgentTool {

    @Resource
    private IVoucherOrderService voucherOrderService;

    @Override
    public Intent supports() {
        return Intent.SECKILL;
    }

    @Override
    public ToolResult execute(Map<String, Object> params) {
        Object vidObj = params.get("voucherId");
        if (vidObj == null) {
            return ToolResult.ok("请先查看某家店的优惠券，然后对我说「帮我秒杀第2张」，或直接指定券ID，例如「秒杀券123」。");
        }
        Long voucherId = Long.valueOf(vidObj.toString());
        Result result = voucherOrderService.seckillVoucher(voucherId);
        if (result.getSuccess()) {
            return ToolResult.ok("秒杀成功！订单号：" + result.getData() + "，可在「我的订单」中查看。", result.getData());
        }
        return ToolResult.fail("秒杀失败：" + result.getErrorMsg());
    }
}
