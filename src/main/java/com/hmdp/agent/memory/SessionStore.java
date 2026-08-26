package com.hmdp.agent.memory;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.concurrent.TimeUnit;

/**
 * 会话记忆存储：复用项目既有的 StringRedisTemplate，与 CacheClient 同源。
 * 对话上下文以 JSON 形式存放在 Redis，TTL 30 分钟。
 */
@Component
public class SessionStore {

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    private static final String KEY_PREFIX = "agent:session:";
    private static final long TTL_MINUTES = 30;

    public AgentSession get(String sessionId) {
        String json = stringRedisTemplate.opsForValue().get(KEY_PREFIX + sessionId);
        if (StrUtil.isBlank(json)) {
            return new AgentSession();
        }
        return JSONUtil.toBean(json, AgentSession.class);
    }

    public void save(String sessionId, AgentSession session) {
        stringRedisTemplate.opsForValue().set(KEY_PREFIX + sessionId, JSONUtil.toJsonStr(session), TTL_MINUTES, TimeUnit.MINUTES);
    }
}
