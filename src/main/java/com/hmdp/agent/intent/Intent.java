package com.hmdp.agent.intent;

/**
 * Agent 支持的意图类型
 */
public enum Intent {
    /** 查询店铺分类 */
    QUERY_SHOP_TYPES,
    /** 查询某店铺的优惠券 */
    QUERY_VOUCHERS,
    /** 秒杀抢券 */
    SECKILL,
    /** 闲聊 / 能力介绍 */
    CHITCHAT,
    /** 未识别 */
    UNKNOWN
}
