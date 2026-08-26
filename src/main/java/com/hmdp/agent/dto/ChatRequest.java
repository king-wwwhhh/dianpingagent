package com.hmdp.agent.dto;

import lombok.Data;

/**
 * Agent 对话请求
 */
@Data
public class ChatRequest {
    /** 用户自然语言消息 */
    private String message;
    /** 会话 id，留空则按当前登录用户隔离会话 */
    private String sessionId;
}
