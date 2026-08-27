package com.llp.agent.memory;

import lombok.Data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Agent 会话上下文（序列化为 JSON 存入 Redis）
 */
@Data
public class AgentSession {
    /** 多轮对话历史：user、assistant 交替 */
    private List<String> history = new ArrayList<>();
    /** 最近一次查询的店铺ID，用于补全「查这家店的券」之类的省略 */
    private Long lastShopId;
    /** 最近一次查询到的优惠券列表，用于解析「第N张」 */
    private List<Map<String, Object>> lastVouchers = new ArrayList<>();
    /** 最近一次查询到的店铺列表，用于解析「第一家」「第二家」等省略表达 */
    private List<Map<String, Object>> lastShops = new ArrayList<>();
}
