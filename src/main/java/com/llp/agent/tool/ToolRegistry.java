package com.llp.agent.tool;

import com.llp.agent.intent.Intent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 工具注册表：收集所有 AgentTool Bean，按意图快速查找
 */
@Component
public class ToolRegistry {

    @Autowired
    private List<AgentTool> tools;

    private final Map<Intent, AgentTool> registry = new HashMap<>();

    @PostConstruct
    public void init() {
        for (AgentTool tool : tools) {
            registry.put(tool.supports(), tool);
        }
    }

    public AgentTool get(Intent intent) {
        return registry.get(intent);
    }
}
