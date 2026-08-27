package com.llp.agent.service;

import com.llp.agent.dto.ChatRequest;
import com.llp.dto.Result;

public interface AgentService {
    Result chat(ChatRequest request);
}
