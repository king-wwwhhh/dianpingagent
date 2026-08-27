package com.llp.agent.intent;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

/**
 * 意图识别结果：意图 + 抽取出的参数 + 券序号（第N张）
 */
@Data
public class IntentResult {
    private Intent intent = Intent.UNKNOWN;
    private Map<String, Object> params = new HashMap<>();
    /** 用户说「第N张券」时抽取出的序号（从1开始），用于结合上下文解析具体券ID */
    private Integer voucherIndex;
}
