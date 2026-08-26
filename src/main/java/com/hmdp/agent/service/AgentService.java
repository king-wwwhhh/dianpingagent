package com.hmdp.agent.service;

import com.hmdp.agent.dto.ChatRequest;
import com.hmdp.dto.Result;

public interface AgentService {
    Result chat(ChatRequest request);
}
