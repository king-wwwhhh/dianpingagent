package com.llp.agent.llm;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 兼容 OpenAI / ChatGPT 接口的大模型客户端（可选开启）。
 * 使用项目已有的 spring-web RestTemplate 发起 HTTP 请求，无需新增依赖。
 * 增强：连接/读取超时、响应空值保护、明确禁用流式，调用失败返回 null 由上层回退到规则模式。
 */
public class OpenAiCompatibleClient implements LlmClient {

    private final String baseUrl;
    private final String apiKey;
    private final String model;
    private final RestTemplate restTemplate;

    public OpenAiCompatibleClient(String baseUrl, String apiKey, String model) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
        this.model = model;
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10000);
        factory.setReadTimeout(30000);
        this.restTemplate = new RestTemplate(factory);
    }

    @Override
    public String generate(String systemPrompt, String userMessage, List<String> history, String toolResult) {
        try {
            List<Map<String, String>> messages = new ArrayList<>();
            Map<String, String> sys = new HashMap<>(2);
            sys.put("role", "system");
            sys.put("content", systemPrompt);
            messages.add(sys);

            if (history != null) {
                for (int i = 0; i + 1 < history.size(); i += 2) {
                    messages.add(role("user", history.get(i)));
                    messages.add(role("assistant", history.get(i + 1)));
                }
            }

            String finalUser = userMessage;
            if (toolResult != null) {
                finalUser = userMessage + "\n[业务系统返回结果]\n" + toolResult + "\n请基于以上结果，用简洁中文回复用户。";
            }
            messages.add(role("user", finalUser));

            Map<String, Object> body = new HashMap<>(4);
            body.put("model", model);
            body.put("messages", messages);
            body.put("temperature", 0.3);
            body.put("stream", false);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(baseUrl + "/chat/completions", entity, String.class);
            if (response.getBody() == null) {
                return null;
            }
            JSONObject json = JSONUtil.parseObj(response.getBody());
            JSONArray choices = json.getJSONArray("choices");
            if (choices == null || choices.isEmpty()) {
                return null;
            }
            JSONObject message = choices.getJSONObject(0).getJSONObject("message");
            if (message == null) {
                return null;
            }
            String content = message.getStr("content");
            if (StrUtil.isBlank(content)) {
                return null;
            }
            return content.trim();
        } catch (Exception e) {
            // 调用失败，返回 null 触发上层回退
            return null;
        }
    }

    private Map<String, String> role(String role, String content) {
        Map<String, String> m = new HashMap<>(2);
        m.put("role", role);
        m.put("content", content);
        return m;
    }
}
