package com.llp.utils;

import com.llp.entity.Shop;
import com.llp.service.IShopService;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RBloomFilter;
import org.redisson.api.RedissonClient;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.List;

/**
 * 商铺布隆过滤器（防缓存穿透）
 *
 * <p>与空对象缓存配合形成两级穿透防护：
 * <ul>
 *   <li>布隆过滤器：前置拦截"一定不存在"的恶意 id，请求根本到不了缓存和数据库；
 *       特点是不会误杀（存在的 id 一定返回 true），但有约 1% 的误放（不存在的 id 可能返回 true），
 *       误放的请求由空对象缓存兜底。</li>
 *   <li>空对象缓存（CacheClient.queryWithPassThrough）：兜底误放请求，防止反复打库。</li>
 * </ul>
 *
 * <p><b>fail-open 设计</b>：布隆过滤器是增强件而非必需件——Redis 异常导致初始化失败时，
 * available 置为 false，mightContain 恒返回 true（放行），查询链路退化为"空对象缓存 + DB"，
 * 主链路零风险。这与 rerank 降级是同一个设计原则：增强型组件的失败不能打穿主链路。
 *
 * @author 王浩杰
 */
@Slf4j
@Component
public class ShopBloomFilter implements ApplicationRunner {

    /** Redis 中布隆过滤器的位图 key */
    private static final String BLOOM_SHOP_KEY = "bloom:shop";
    /** 预期插入量：预估全量商铺数并留足余量，决定位数组大小 */
    private static final long EXPECTED_INSERTIONS = 1_000_000L;
    /** 误判率：1% 是空间成本与误放率的常见平衡点 */
    private static final double FALSE_POSITIVE_RATE = 0.01;

    @Resource
    private RedissonClient redissonClient;

    @Resource
    private IShopService shopService;

    private RBloomFilter<Long> bloomFilter;

    /** 过滤器可用标志；false 时 fail-open 放行所有请求 */
    private volatile boolean available = false;

    /**
     * 用 ApplicationRunner 而非 @PostConstruct：预热依赖 MyBatis-Plus 完整初始化的
     * IShopService（baseMapper 装配完成），ApplicationRunner 在容器刷新完成后执行，时序安全。
     */
    @Override
    public void run(ApplicationArguments args) {
        try {
            bloomFilter = redissonClient.getBloomFilter(BLOOM_SHOP_KEY);
            // 预期插入量 + 误判率初始化位数组；应用重启后过滤器已存在时 tryInit 返回 false，继续复用
            bloomFilter.tryInit(EXPECTED_INSERTIONS, FALSE_POSITIVE_RATE);
            // 启动预热：全量商铺 id 灌入过滤器
            List<Shop> shops = shopService.query().select("id").list();
            for (Shop shop : shops) {
                bloomFilter.add(shop.getId());
            }
            available = true;
            log.info("商铺布隆过滤器预热完成，共预热 {} 个商铺 id", shops.size());
        } catch (Exception e) {
            // fail-open：初始化失败不阻断应用启动，穿透防护退化为空对象缓存
            available = false;
            log.warn("商铺布隆过滤器初始化失败，穿透防护退化为空对象缓存：{}", e.getMessage());
        }
    }

    /**
     * 判断商铺 id 是否"可能存在"。
     *
     * @return false 表示一定不存在（可直接拒绝）；true 表示可能存在（需继续走缓存/DB）。
     *         过滤器不可用时恒返回 true（fail-open）。
     */
    public boolean mightContain(Long id) {
        return !available || bloomFilter.contains(id);
    }

    /** 新商铺落库后调用，加入过滤器（配合查询链路的懒加载，避免新增数据被误判为不存在） */
    public void add(Long id) {
        if (available) {
            bloomFilter.add(id);
        }
    }
}
