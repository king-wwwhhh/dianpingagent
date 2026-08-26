package com.hmdp.agent.llm;

import java.util.List;

/**
 * 大模型对话客户端抽象。返回 null 表示调用失败，由上层回退到规则模式。
 */
public interface LlmClient {
    /**
     * 生成自然语言回复
     *
     * @param systemPrompt 系统提示词
     * @param userMessage  当前用户消息
     * @param history      历史对话（user/assistant 交替）
     * @param toolResult   业务工具返回的结果（可能为 null）
     * @return 回复文本；失败返回 null
     */
    String generate(String systemPrompt, String userMessage, List<String> history, String toolResult);
}
