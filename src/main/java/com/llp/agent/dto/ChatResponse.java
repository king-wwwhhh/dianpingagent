package com.llp.agent.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Agent 对话响应
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    /** 给用户的自然语言回复 */
    private String reply;
    /** 识别出的意图 */
    private String intent;
    /** 业务返回的结构化数据（如优惠券列表） */
    private Object data;
}
