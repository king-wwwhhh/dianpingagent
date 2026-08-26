package com.hmdp.agent.config;

import cn.hutool.core.util.StrUtil;
import com.hmdp.agent.llm.LlmClient;
import com.hmdp.agent.llm.OpenAiCompatibleClient;
import com.hmdp.agent.llm.RuleBasedLlmClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Agent 配置：按 application.yaml 的 agent.llm.* 决定使用真实大模型还是离线规则客户端。
 * 未开启或不完整配置时，默认使用离线规则客户端（零外部依赖）。
 */
@Configuration
public class AgentConfig {

    @Value("${agent.llm.enabled:false}")
    private boolean enabled;

    @Value("${agent.llm.base-url:}")
    private String baseUrl;

    @Value("${agent.llm.api-key:}")
    private String apiKey;

    @Value("${agent.llm.model:gpt-3.5-turbo}")
    private String model;

    @Bean
    public LlmClient llmClient() {
        if (enabled && StrUtil.isNotBlank(apiKey) && StrUtil.isNotBlank(baseUrl)) {
            return new OpenAiCompatibleClient(baseUrl, apiKey, model);
        }
        return new RuleBasedLlmClient();
    }
}
