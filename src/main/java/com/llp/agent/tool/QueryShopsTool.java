package com.llp.agent.tool;

import cn.hutool.core.util.StrUtil;
import com.llp.agent.intent.Intent;
import com.llp.dto.Result;
import com.llp.entity.Shop;
import com.llp.entity.ShopType;
import com.llp.service.IShopService;
import com.llp.service.IShopTypeService;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 查询店铺 —— 支持按分类或关键词模糊匹配。
 * 优先把用户提到的词当成分类名（如 美食/烧烤/火锅）去匹配 typeId；
 * 若未命中分类，则按店铺名/商圈/地址做数据库模糊查询。
 */
@Component
public class QueryShopsTool implements AgentTool {

    @Resource
    private IShopService shopService;
    @Resource
    private IShopTypeService shopTypeService;

    @Override
    public Intent supports() {
        return Intent.QUERY_SHOPS;
    }

    @Override
    public ToolResult execute(Map<String, Object> params) {
        // 1. 尝试把关键词解析成分类
        String keyword = params.get("keyword") == null ? "" : params.get("keyword").toString().trim();
        Long typeId = params.get("typeId") == null ? null : Long.valueOf(params.get("typeId").toString());

        if (typeId == null && StrUtil.isNotBlank(keyword)) {
            typeId = resolveTypeId(keyword);
        }

        List<Shop> shops;
        StringBuilder summary = new StringBuilder();

        if (typeId != null) {
            // 按分类查询（无坐标，默认第一页）
            Result result = shopService.queryShopByType(typeId.intValue(), 1, null, null);
            if (result.getData() instanceof List) {
                shops = (List<Shop>) result.getData();
            } else {
                shops = Collections.emptyList();
            }
            summary.append("为你找到「").append(keyword).append("」相关店铺：");
        } else if (StrUtil.isNotBlank(keyword)) {
            // 按关键词模糊匹配店铺名/商圈/地址
            shops = shopService.query()
                    .like("name", keyword)
                    .or().like("area", keyword)
                    .or().like("address", keyword)
                    .last("limit 10")
                    .list();
            summary.append("为你找到包含「").append(keyword).append("」的店铺：");
        } else {
            // 兜底：推荐最近/热门的若干店铺
            shops = shopService.query().orderByDesc("sold").last("limit 10").list();
            summary.append("为你推荐以下热门店铺：");
        }

        if (shops == null || shops.isEmpty()) {
            return ToolResult.ok("暂时没找到相关店铺，换个关键词或分类试试看～", Collections.emptyList());
        }

        String names = shops.stream()
                .map(s -> s.getName() + "（" + formatScore(s.getScore()) + "分" + ")")
                .collect(Collectors.joining("、", "", "。"));
        summary.append(names);

        // 给 LLM 更精简的结构化数据
        List<Map<String, Object>> payload = shops.stream().map(s -> {
            Map<String, Object> m = new java.util.HashMap<>();
            m.put("id", s.getId());
            m.put("name", s.getName());
            m.put("score", formatScore(s.getScore()));
            m.put("avgPrice", s.getAvgPrice());
            m.put("address", s.getAddress());
            return m;
        }).collect(Collectors.toList());

        return ToolResult.ok(summary.toString(), payload);
    }

    /**
     * 用所有分类名做模糊匹配，返回命中的 typeId
     */
    private Long resolveTypeId(String keyword) {
        List<ShopType> types = shopTypeService.query().orderByAsc("sort").list();
        if (types == null || types.isEmpty()) {
            return null;
        }
        for (ShopType type : types) {
            if (StrUtil.isBlank(type.getName())) {
                continue;
            }
            String name = type.getName().trim();
            if (name.contains(keyword) || keyword.contains(name)) {
                return type.getId();
            }
        }
        return null;
    }

    private double formatScore(Integer score) {
        if (score == null) {
            return 0.0;
        }
        return score / 10.0;
    }
}
