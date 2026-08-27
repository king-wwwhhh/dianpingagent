package com.llp.agent.controller;

import com.llp.agent.service.AgentService;
import com.llp.agent.dto.ChatRequest;
import com.llp.dto.Result;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * Agent 智能对话入口。
 * 端点 /agent/** 默认被登录拦截器拦截（需携带 token），因此秒杀自动取当前登录用户。
 */
@RestController
@RequestMapping("/agent")
public class AgentController {

    @Resource
    private AgentService agentService;

    @PostMapping("/chat")
    public Result chat(@RequestBody ChatRequest request) {
        return agentService.chat(request);
    }
}
