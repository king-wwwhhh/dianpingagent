package com.llp.agent.intent;

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
    /** 常见分类/店铺关键词，单独出现时也能触发查店铺 */
    private static final String[] COMMON_SHOP_KEYWORDS = {
            "美食", "烧烤", "火锅", "奶茶", "咖啡", "日料", "韩料", "中餐", "西餐",
            "快餐", "小吃", "甜品", "面包", "蛋糕", "面食", "饺子", "汉堡", "披萨",
            "烤肉", "串串", "麻辣烫", "米线", "粥", "寿司", "拉面", "烧烤", "火锅",
            "川菜", "湘菜", "粤菜", "鲁菜", "江浙菜", "东北菜", "新疆菜", "云南菜"
    };

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

        // 0. 提取通用关键词（用于QUERY_SHOPS）
        extractShopKeyword(result, t, text);

        if (containsAny(t, "店铺类型", "店铺分类", "店类型", "分类", "有哪些分类", "都有什么分类")) {
            result.setIntent(Intent.QUERY_SHOP_TYPES);
        } else if (containsAny(t, "秒杀", "抢券", "抢购", "抢一张", "帮我抢", "帮我秒", "下单买", "购买券", "立刻抢", "帮我买")) {
            result.setIntent(Intent.SECKILL);
        } else if (containsAny(t, "优惠券", "代金券", "查券", "看券", "有什么券", "券列表", "券有哪些", "领券")) {
            result.setIntent(Intent.QUERY_VOUCHERS);
        } else if (isQueryShops(t)) {
            result.setIntent(Intent.QUERY_SHOPS);
        } else if (containsAny(t, "你好", "您好", "hi", "hello", "你是谁", "你能做什么", "帮助", "帮忙", "介绍")) {
            result.setIntent(Intent.CHITCHAT);
        } else {
            result.setIntent(Intent.UNKNOWN);
        }
        return result;
    }

    /**
     * 识别「查店铺」类意图。
     * 例如：美食都有什么店铺、帮我找一下烧烤店、附近有什么火锅店、推荐几家奶茶店。
     */
    private boolean isQueryShops(String t) {
        if (containsAny(t, "优惠券", "代金券", "券")) {
            return false;
        }
        if (containsAny(t,
                "什么店铺", "哪些店铺", "什么店", "哪些店", "有什么商户", "哪些商户", "什么商家", "哪些商家",
                "找一下", "查一下", "看一下", "推荐", "附近", "有没有", "有没有卖", "我想吃", "吃",
                "店铺", "商户", "商家", "店")) {
            return true;
        }
        // 单独出现常见分类/店铺关键词，如「烧烤」「火锅」「奶茶」
        for (String kw : COMMON_SHOP_KEYWORDS) {
            if (t.contains(kw)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 从用户消息中提取店铺查询关键词。
     * 简单做法：去掉常见疑问词、动词、后缀后剩下的名词短语作为 keyword。
     */
    private void extractShopKeyword(IntentResult result, String t, String rawText) {
        String text = rawText.trim();
        // 去掉常见前缀动词/疑问词
        String[] prefixes = {"帮我找一下", "帮我查一下", "帮我看一下", "帮我找", "帮我查", "帮我推荐", "推荐", "查找", "查询",
                "附近", "有没有", "我想吃", "吃", "找一下", "查一下", "看一下", "请问", "我想"};
        for (String p : prefixes) {
            if (text.startsWith(p)) {
                text = text.substring(p.length());
                break;
            }
        }
        // 去掉常见后缀
        String[] suffixes = {"店铺", "商铺", "店", "商户", "商家", "都有什么", "有哪些", "有什么", "吗", "呢", "呀"};
        for (String s : suffixes) {
            if (text.endsWith(s)) {
                text = text.substring(0, text.length() - s.length());
            }
        }
        text = text.trim();
        if (StrUtil.isNotBlank(text) && text.length() <= 20) {
            result.getParams().put("keyword", text);
        }
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
