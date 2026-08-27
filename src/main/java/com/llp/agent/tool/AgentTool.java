package com.llp.agent.tool;

import com.llp.agent.intent.Intent;

import java.util.Map;

/**
 * Agent 工具抽象：每个工具包装一个「现有业务接口」的能力。
 * 工具内部直接注入并调用原有 Service Bean，因此自动复用 Redis 缓存 / Lua 秒杀等原有逻辑。
 */
public interface AgentTool {
    /** 该工具对应的意图 */
    Intent supports();

    /** 执行工具，params 为意图识别抽取出的参数 */
    ToolResult execute(Map<String, Object> params);
}
