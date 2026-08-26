package com.hmdp.agent.tool;

import com.hmdp.agent.intent.Intent;
import com.hmdp.entity.ShopType;
import com.hmdp.service.IShopTypeService;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 查询店铺分类 —— 复用原有 IShopTypeService（与 ShopTypeController 同一代码路径）
 */
@Component
public class QueryShopTypesTool implements AgentTool {

    @Resource
    private IShopTypeService shopTypeService;

    @Override
    public Intent supports() {
        return Intent.QUERY_SHOP_TYPES;
    }

    @Override
    public ToolResult execute(Map<String, Object> params) {
        List<ShopType> list = shopTypeService.query().orderByAsc("sort").list();
        if (list == null || list.isEmpty()) {
            return ToolResult.ok("暂时没有查到店铺分类信息。");
        }
        String names = list.stream().map(ShopType::getName).collect(Collectors.joining("、"));
        return ToolResult.ok("当前平台共有以下店铺分类：" + names + "。");
    }
}
