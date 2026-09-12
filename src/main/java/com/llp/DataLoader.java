package com.llp;

import com.llp.entity.SeckillVoucher;
import com.llp.entity.Shop;
import com.llp.service.ISeckillVoucherService;
import com.llp.service.IShopService;
import com.llp.utils.RedisConstants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.geo.Point;
import org.springframework.data.redis.connection.RedisGeoCommands;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 应用启动时预热缓存：
 * 1）将商户坐标写入 Redis GEO（merchant:geo:{typeId}），供“地图/附近”页面按距离检索；
 * 2）将秒杀券库存写入 Redis（flash:stock:{id}），供秒杀 Lua 校验。
 * 若 Redis 未启动，捕获异常仅记录日志，不影响应用启动（相关功能会走数据库兜底/按需预热）。
 */
@Slf4j
@Component
public class DataLoader implements CommandLineRunner {

    @Resource
    private IShopService shopService;
    @Resource
    private ISeckillVoucherService seckillVoucherService;
    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Override
    public void run(String... args) {
        loadShopGeo();
        preheatSeckillStock();
    }

    private void loadShopGeo() {
        try {
            List<Shop> shops = shopService.list();
            Map<Long, List<Shop>> map = shops.stream()
                    .filter(s -> s.getX() != null && s.getY() != null)
                    .collect(Collectors.groupingBy(Shop::getTypeId));
            for (Map.Entry<Long, List<Shop>> entry : map.entrySet()) {
                String key = RedisConstants.SHOP_GEO_KEY + entry.getKey();
                List<RedisGeoCommands.GeoLocation<String>> locations = new ArrayList<>(entry.getValue().size());
                for (Shop shop : entry.getValue()) {
                    locations.add(new RedisGeoCommands.GeoLocation<>(
                            shop.getId().toString(),
                            new Point(shop.getX(), shop.getY())
                    ));
                }
                if (!locations.isEmpty()) {
                    stringRedisTemplate.opsForGeo().add(key, locations);
                }
            }
            log.info("GEO 商户坐标预热完成，商户数={}", shops.size());
        } catch (Exception e) {
            log.warn("GEO 商户坐标预热失败（Redis 可能未启动）：{}", e.getMessage());
        }
    }

    private void preheatSeckillStock() {
        try {
            List<SeckillVoucher> list = seckillVoucherService.list();
            for (SeckillVoucher sv : list) {
                if (sv.getStock() != null) {
                    stringRedisTemplate.opsForValue().set(
                            RedisConstants.SECKILL_STOCK_KEY + sv.getVoucherId(),
                            sv.getStock().toString()
                    );
                }
            }
            log.info("秒杀库存预热完成，券数={}", list.size());
        } catch (Exception e) {
            log.warn("秒杀库存预热失败（Redis 可能未启动）：{}", e.getMessage());
        }
    }
}
