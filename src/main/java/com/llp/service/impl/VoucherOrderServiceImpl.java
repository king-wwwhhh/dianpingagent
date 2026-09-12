package com.llp.service.impl;

import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.llp.config.KafkaConfig;
import com.llp.dto.Result;
import com.llp.dto.SeckillOrderMessage;
import com.llp.entity.SeckillVoucher;
import com.llp.entity.Shop;
import com.llp.entity.Voucher;
import com.llp.entity.VoucherOrder;
import com.llp.mapper.VoucherOrderMapper;
import com.llp.service.ISeckillVoucherService;
import com.llp.service.IShopService;
import com.llp.service.IVoucherOrderService;
import com.llp.service.IVoucherService;
import com.llp.utils.RedisConstants;
import com.llp.utils.RedisIdWorker;
import com.llp.utils.UserHolder;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;
import org.springframework.util.concurrent.ListenableFuture;

import javax.annotation.Resource;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * <p>
 * 服务实现类（秒杀异步下单：基于 Kafka 消息队列）
 * </p>
 *
 * @author 虎哥
 * @since 2021-12-22
 */
@Slf4j
@Service
public class VoucherOrderServiceImpl extends ServiceImpl<VoucherOrderMapper, VoucherOrder> implements IVoucherOrderService {

    @Resource
    private ISeckillVoucherService seckillVoucherService;

    @Resource
    private com.llp.service.IVoucherService voucherService;
    @Resource
    private com.llp.service.IShopService shopService;

    @Resource
    private RedisIdWorker redisIdWorker;
    @Resource
    private RedissonClient redissonClient;
    @Resource
    private StringRedisTemplate stringRedisTemplate;

    /** Kafka 生产者模板 */
    @Resource
    private KafkaTemplate<String, String> kafkaTemplate;

    private static final DefaultRedisScript<Long> SECKILL_SCRIPT;

    static {
        SECKILL_SCRIPT = new DefaultRedisScript<>();
        SECKILL_SCRIPT.setLocation(new ClassPathResource("seckill.lua"));
        SECKILL_SCRIPT.setResultType(Long.class);
    }

    @Override
    public Result seckillVoucher(Long voucherId) {
        Long userId = UserHolder.getUser().getId();
        long orderId = redisIdWorker.nextId("order");
        // 0.库存未预热时按需预热，避免 Redis 重启后秒杀 500
        preheatStockIfAbsent(voucherId);
        // 1.执行lua脚本（原子：校验库存 + 一人一单 + 扣库存 + 记录下单用户）
        Long result = stringRedisTemplate.execute(
                SECKILL_SCRIPT,
                Collections.emptyList(),
                voucherId.toString(), userId.toString(), String.valueOf(orderId)
        );
        int r = result == null ? 1 : result.intValue();
        // 2.判断结果是否为0
        if (r != 0) {
            // 2.1.不为0 ，代表没有购买资格
            return Result.fail(r == 1 ? "库存不足" : "不能重复下单");
        }
        // 3.发送下单消息到 Kafka，由消费者异步落库
        SeckillOrderMessage message = new SeckillOrderMessage(orderId, userId, voucherId);
        sendOrderMessage(message);
        // 4.返回订单id（落库在消费者侧异步完成）
        return Result.ok(orderId);
    }

    /**
     * 发送秒杀下单消息到 Kafka。
     * 若 broker 不可用导致发送失败，则退化为同步落库，保证下单功能始终可用。
     */
    private void sendOrderMessage(SeckillOrderMessage message) {
        try {
            ListenableFuture<SendResult<String, String>> future =
                    kafkaTemplate.send(KafkaConfig.SECKILL_ORDER_TOPIC, JSONUtil.toJsonStr(message));
            future.addCallback(
                    sendResult -> {
                        // 发送成功，订单将由 Kafka 消费者异步落库
                    },
                    ex -> {
                        // 发送失败（如 broker 不可用），退化为同步落库，保证下单可用
                        log.error("Kafka 发送下单消息失败，退化为同步落库：{}", ex.getMessage());
                        createVoucherOrder(message);
                    }
            );
        } catch (Exception e) {
            log.error("Kafka 发送下单消息异常，退化为同步落库", e);
            createVoucherOrder(message);
        }
    }

    /**
     * Kafka 消费者：消费秒杀下单消息，异步创建订单落库。
     */
    @KafkaListener(topics = KafkaConfig.SECKILL_ORDER_TOPIC, groupId = "seckill-order-group")
    public void consumeOrderMessage(ConsumerRecord<String, String> record) {
        try {
            SeckillOrderMessage message = JSONUtil.toBean(record.value(), SeckillOrderMessage.class);
            createVoucherOrder(message);
        } catch (Exception e) {
            // 捕获异常，避免消费者反复重试导致消息阻塞；订单幂等已保证不重复创建
            log.error("消费下单消息失败，消息内容={}", record.value(), e);
        }
    }

    /**
     * 创建秒杀订单（被 Kafka 消费者与降级逻辑复用）。
     */
    private void createVoucherOrder(SeckillOrderMessage message) {
        Long userId = message.getUserId();
        Long voucherId = message.getVoucherId();
        // 创建锁对象
        RLock redisLock = redissonClient.getLock("lock:order:" + userId);
        // 尝试获取锁
        boolean isLock = redisLock.tryLock();
        // 判断
        if (!isLock) {
            // 获取锁失败，直接返回失败或者重试
            log.error("不允许重复下单！");
            return;
        }

        try {
            // 5.1.查询订单
            int count = query().eq("user_id", userId).eq("voucher_id", voucherId).count();
            // 5.2.判断是否存在
            if (count > 0) {
                // 用户已经购买过了
                log.error("不允许重复下单！");
                return;
            }

            // 6.扣减库存
            boolean success = seckillVoucherService.update()
                    .setSql("stock = stock - 1") // set stock = stock - 1
                    .eq("voucher_id", voucherId).gt("stock", 0) // where id = ? and stock > 0
                    .update();
            if (!success) {
                // 扣减失败
                log.error("库存不足！");
                return;
            }

            // 7.创建订单
            VoucherOrder voucherOrder = new VoucherOrder();
            voucherOrder.setId(message.getOrderId());
            voucherOrder.setUserId(userId);
            voucherOrder.setVoucherId(voucherId);
            save(voucherOrder);
        } finally {
            // 释放锁
            redisLock.unlock();
        }
    }

    /**
     * 库存未预热时，从数据库加载并写入 Redis，避免 Redis 重启后秒杀直接 500。
     */
    private void preheatStockIfAbsent(Long voucherId) {
        String key = RedisConstants.SECKILL_STOCK_KEY + voucherId;
        if (Boolean.FALSE.equals(stringRedisTemplate.hasKey(key))) {
            SeckillVoucher sv = seckillVoucherService.getById(voucherId);
            if (sv != null && sv.getStock() != null) {
                stringRedisTemplate.opsForValue().set(key, sv.getStock().toString());
            }
        }
    }

    @Override
    public Result queryMyOrders() {
        Long userId = UserHolder.getUser().getId();
        // 1.查询当前用户的订单
        List<VoucherOrder> orders = query().eq("user_id", userId).orderByDesc("create_time").list();
        if (orders == null || orders.isEmpty()) {
            return Result.ok(Collections.emptyList());
        }
        // 2.批量查询关联优惠券，得到券标题/面额/所属商户
        List<Long> voucherIds = orders.stream().map(VoucherOrder::getVoucherId).collect(Collectors.toList());
        List<Voucher> vouchers = voucherService.listByIds(voucherIds);
        Map<Long, Voucher> voucherMap = vouchers.stream()
                .collect(Collectors.toMap(Voucher::getId, v -> v, (a, b) -> a));
        // 3.批量查询关联商户名称
        List<Long> shopIds = vouchers.stream().map(Voucher::getShopId)
                .filter(Objects::nonNull).collect(Collectors.toList());
        Map<Long, String> shopNameMap = new HashMap<>();
        if (!shopIds.isEmpty()) {
            List<Shop> shops = shopService.listByIds(shopIds);
            shops.forEach(s -> shopNameMap.put(s.getId(), s.getName()));
        }
        // 4.组装前端展示结构
        List<Map<String, Object>> result = orders.stream().map(o -> {
            Map<String, Object> m = new HashMap<>(8);
            m.put("id", o.getId());
            m.put("status", o.getStatus());
            m.put("payType", o.getPayType());
            m.put("createTime", o.getCreateTime());
            Voucher v = voucherMap.get(o.getVoucherId());
            if (v != null) {
                m.put("title", v.getTitle());
                m.put("actualValue", v.getActualValue());
                m.put("payValue", v.getPayValue());
                m.put("shopName", shopNameMap.get(v.getShopId()));
            }
            return m;
        }).collect(Collectors.toList());
        return Result.ok(result);
    }
}
