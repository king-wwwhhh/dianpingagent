package com.llp.service.impl;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.llp.dto.Result;
import com.llp.entity.Shop;
import com.llp.mapper.ShopMapper;
import com.llp.service.IShopService;
import com.llp.utils.CacheClient;
import com.llp.utils.ShopBloomFilter;
import com.llp.utils.SystemConstants;
import lombok.var;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.GeoResult;
import org.springframework.data.geo.GeoResults;
import org.springframework.data.redis.connection.RedisGeoCommands;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.domain.geo.GeoReference;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.*;
import java.util.concurrent.TimeUnit;

import static com.llp.utils.RedisConstants.*;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author 虎哥
 * @since 2021-12-22
 */
@Service
public class ShopServiceImpl extends ServiceImpl<ShopMapper, Shop> implements IShopService {


    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Resource
    private CacheClient cacheClient;

    @Resource
    private ShopBloomFilter shopBloomFilter;

    @Override
    public Result queryById(Long id) {
        // 0. 布隆过滤器防穿透（第一级）：id 一定不存在时直接拒绝，请求到不了缓存和 DB；
        //    过滤器不可用时 fail-open 恒放行，主链路零风险
        if (!shopBloomFilter.mightContain(id)) {
            return Result.fail("店铺不存在！");
        }

        // 1. 空对象缓存防穿透（第二级）：兜底布隆过滤器 ~1% 的误放请求
        Shop shop = cacheClient
                .queryWithPassThrough(CACHE_SHOP_KEY, id, Shop.class, this::getById, CACHE_SHOP_TTL, TimeUnit.MINUTES);

        // 互斥锁解决缓存击穿
        // Shop shop = cacheClient
        //         .queryWithMutex(CACHE_SHOP_KEY, id, Shop.class, this::getById, CACHE_SHOP_TTL, TimeUnit.MINUTES);

        // 逻辑过期解决缓存击穿
        // Shop shop = cacheClient
        //         .queryWithLogicalExpire(CACHE_SHOP_KEY, id, Shop.class, this::getById, 20L, TimeUnit.SECONDS);

        if (shop == null) {
            return Result.fail("店铺不存在！");
        }
        // 2. 懒加载补充：重启预热之后新增的商铺，首次查到时补进布隆过滤器
        shopBloomFilter.add(id);
        // 3.返回
        return Result.ok(shop);
    }

    @Override
    @Transactional
    public Result update(Shop shop) {
        Long id = shop.getId();
        if (id == null) {
            return Result.fail("店铺id不能为空");
        }
        // 1.更新数据库
        updateById(shop);
        // 2.删除缓存
        stringRedisTemplate.delete(CACHE_SHOP_KEY + id);
        return Result.ok();
    }

    @Override
    public Result queryShopByType(Integer typeId, Integer current, Double x, Double y, String sortBy) {
        // 1.判断是否需要根据坐标查询
        if (x == null || y == null) {
            // 不需要坐标查询，按数据库查询
            return Result.ok(queryByTypeFromDb(typeId, current, sortBy));
        }

        // 2.计算分页参数
        int from = (current - 1) * SystemConstants.DEFAULT_PAGE_SIZE;
        int end = current * SystemConstants.DEFAULT_PAGE_SIZE;

        // 3.查询redis、按照距离排序、分页。结果：shopId、distance
        String key = SHOP_GEO_KEY + typeId;
        GeoResults<RedisGeoCommands.GeoLocation<String>> results;
        try {
            results = stringRedisTemplate.opsForGeo() // GEOSEARCH key BYLONLAT x y BYRADIUS 10 WITHDISTANCE
                    .search(
                            key,
                            GeoReference.fromCoordinate(x, y),
                            new Distance(5000),
                            RedisGeoCommands.GeoSearchCommandArgs.newGeoSearchArgs().includeDistance().limit(end)
                    );
        } catch (Exception e) {
            // Redis 异常时降级为数据库查询，保证页面始终能展示数据
            log.warn("GEO 查询失败，降级为数据库查询：" + e.getMessage());
            return Result.ok(queryByTypeFromDb(typeId, current, sortBy));
        }
        // 4.解析出id
        if (results == null) {
            // GEO 数据为空（如 Redis 未预热），降级为数据库查询
            return Result.ok(queryByTypeFromDb(typeId, current, sortBy));
        }
        List<GeoResult<RedisGeoCommands.GeoLocation<String>>> list = results.getContent();
        if (list.size() <= from) {
            // 没有下一页了，结束
            return Result.ok(Collections.emptyList());
        }
        // 4.1.截取 from ~ end的部分
        List<Long> ids = new ArrayList<>(list.size());
        Map<String, Distance> distanceMap = new HashMap<>(list.size());
        list.stream().skip(from).forEach(result -> {
            // 4.2.获取店铺id
            String shopIdStr = result.getContent().getName();
            ids.add(Long.valueOf(shopIdStr));
            // 4.3.获取距离
            Distance distance = result.getDistance();
            distanceMap.put(shopIdStr, distance);
        });
        // 5.根据id查询Shop
        String idStr = StrUtil.join(",", ids);
        List<Shop> shops = query().in("id", ids).last("ORDER BY FIELD(id," + idStr + ")").list();
        for (Shop shop : shops) {
            shop.setDistance(distanceMap.get(shop.getId().toString()).getValue());
        }
        // 6.按人气/评分排序（距离排序已隐含在 GEO 结果中）
        sortShops(shops, sortBy);
        // 7.返回
        return Result.ok(shops);
    }

    /** 数据库兜底查询：当 GEO 数据缺失或异常时使用 */
    private List<Shop> queryByTypeFromDb(Integer typeId, Integer current, String sortBy) {
        var query = query().eq("type_id", typeId);
        if ("comments".equals(sortBy)) {
            query.orderByDesc("comments");
        } else if ("score".equals(sortBy)) {
            query.orderByDesc("score");
        }
        return query.page(new Page<>(current, SystemConstants.DEFAULT_PAGE_SIZE)).getRecords();
    }

    /** 按人气/评分对结果排序 */
    private void sortShops(List<Shop> shops, String sortBy) {
        if (shops == null || shops.isEmpty()) {
            return;
        }
        if ("comments".equals(sortBy)) {
            shops.sort((a, b) -> Integer.compare(b.getComments() == null ? 0 : b.getComments(),
                    a.getComments() == null ? 0 : a.getComments()));
        } else if ("score".equals(sortBy)) {
            shops.sort((a, b) -> Integer.compare(b.getScore() == null ? 0 : b.getScore(),
                    a.getScore() == null ? 0 : a.getScore()));
        }
    }
}
