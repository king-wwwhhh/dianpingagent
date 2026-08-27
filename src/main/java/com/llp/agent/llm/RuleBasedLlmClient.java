package com.llp.agent.llm;

import cn.hutool.core.util.StrUtil;

import java.util.List;

/**
 * 离线规则对话客户端：不依赖任何外部服务。
 * 有业务结果时直接返回结果；无结果时返回能力介绍。
 */
public class RuleBasedLlmClient implements LlmClient {

    private static final String INTRO = "我是惠生活智能助手，可以帮你：\n"
            + "1）查询店铺分类，例如「有哪些店铺分类」；\n"
            + "2）按分类或关键词查店铺，例如「美食都有什么店铺」「帮我找烧烤店」；\n"
            + "3）查询某家店的优惠券，例如「查店铺1的优惠券」；\n"
            + "4）帮你秒杀抢券，例如「帮我秒杀第2张」。\n"
            + "请问需要我帮你做什么？";

    @Override
    public String generate(String systemPrompt, String userMessage, List<String> history, String toolResult) {
        if (StrUtil.isNotBlank(toolResult)) {
            return toolResult;
        }
        return INTRO;
    }
}
