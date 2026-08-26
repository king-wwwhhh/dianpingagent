package com.hmdp.agent.intent;

import cn.hutool.core.util.StrUtil;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 轻量级意图识别器（离线、零依赖）。
 * 通过关键词与正则识别用户意图，并抽取参数（shopId / voucherId / 第N张）。
 */
@Component
public class IntentRecognizer {

    private static final Pattern SHOP_ID = Pattern.compile("(店铺|商户|shop)[^\\d]*?(\\d+)");
    private static final Pattern VOUCHER_ID = Pattern.compile("(代金券|券|voucher)[^\\d]*?(\\d+)");
    private static final Pattern INDEX = Pattern.compile("第\\s*([0-9一二三四五六七八九十]+)\\s*张");

    private static final Map<Character, Integer> CN_NUM = new HashMap<>();

    static {
        CN_NUM.put('一', 1);
        CN_NUM.put('二', 2);
        CN_NUM.put('三', 3);
        CN_NUM.put('四', 4);
        CN_NUM.put('五', 5);
        CN_NUM.put('六', 6);
        CN_NUM.put('七', 7);
        CN_NUM.put('八', 8);
        CN_NUM.put('九', 9);
        CN_NUM.put('十', 10);
    }

    public IntentResult recognize(String text) {
        IntentResult result = new IntentResult();
        if (StrUtil.isBlank(text)) {
            result.setIntent(Intent.CHITCHAT);
            return result;
        }
        String t = text.toLowerCase();

        Matcher m = SHOP_ID.matcher(text);
        if (m.find()) {
            result.getParams().put("shopId", Long.valueOf(m.group(2)));
        }

        m = VOUCHER_ID.matcher(text);
        if (m.find()) {
            result.getParams().put("voucherId", Long.valueOf(m.group(2)));
        }

        m = INDEX.matcher(text);
        if (m.find()) {
            result.setVoucherIndex(cnToInt(m.group(1)));
        }

        if (containsAny(t, "店铺类型", "店铺分类", "店类型", "分类", "有什么店", "店铺都有哪些", "都有哪些店")) {
            result.setIntent(Intent.QUERY_SHOP_TYPES);
        } else if (containsAny(t, "秒杀", "抢券", "抢购", "抢一张", "帮我抢", "帮我秒", "下单买", "购买券", "立刻抢", "帮我买")) {
            result.setIntent(Intent.SECKILL);
        } else if (containsAny(t, "优惠券", "代金券", "查券", "看券", "有什么券", "券列表", "券有哪些", "领券")) {
            result.setIntent(Intent.QUERY_VOUCHERS);
        } else if (containsAny(t, "你好", "您好", "hi", "hello", "你是谁", "你能做什么", "帮助", "帮忙", "介绍")) {
            result.setIntent(Intent.CHITCHAT);
        } else {
            result.setIntent(Intent.UNKNOWN);
        }
        return result;
    }

    private boolean containsAny(String text, String... keys) {
        for (String k : keys) {
            if (text.contains(k)) {
                return true;
            }
        }
        return false;
    }

    /** 将中文/阿拉伯数字（支持一到十、十、十二等常见写法）转为整数 */
    private int cnToInt(String s) {
        if (StrUtil.isBlank(s)) {
            return 0;
        }
        if (s.matches("\\d+")) {
            return Integer.parseInt(s);
        }
        int total = 0;
        int section = 0;
        for (char c : s.toCharArray()) {
            if (c == '十') {
                total += (section == 0 ? 10 : section * 10);
                section = 0;
            } else {
                Integer v = CN_NUM.get(c);
                if (v == null) {
                    v = 1;
                }
                section = (section == 0 ? v : section * 10 + v);
            }
        }
        total += section;
        return Math.max(total, 1);
    }
}
