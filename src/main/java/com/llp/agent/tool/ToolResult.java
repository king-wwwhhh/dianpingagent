package com.llp.agent.tool;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 工具执行结果：自然语言消息 + 可选结构化数据
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ToolResult {
    /** 给用户的自然语言结果 */
    private String message;
    /** 结构化数据（如优惠券列表），可被会话上下文引用 */
    private Object payload;
    /** 是否执行成功 */
    private boolean success = true;

    public static ToolResult ok(String message) {
        return new ToolResult(message, null, true);
    }

    public static ToolResult ok(String message, Object payload) {
        return new ToolResult(message, payload, true);
    }

    public static ToolResult fail(String message) {
        return new ToolResult(message, null, false);
    }
}
