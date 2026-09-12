package com.llp.config;

import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.CreateTopicsResult;
import org.apache.kafka.clients.admin.NewTopic;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaAdmin;

import java.util.Collections;
import java.util.concurrent.TimeUnit;

/**
 * Kafka 配置：声明秒杀下单主题。
 *
 * 关键设计：主题创建改为 best-effort、非阻塞。
 * 原先使用 {@code @Bean NewTopic} 由 Spring KafkaAdmin 在上下文刷新阶段阻塞创建主题，
 * 一旦 broker 未启动就会抛出 TimeoutException 导致整个应用启动失败。
 *
 * 现在改为在 CommandLineRunner 中创建——该回调在 Spring 容器已刷新完成（即应用已经成功启动）之后才执行，
 * 即使 broker 暂时不可用也只记录告警并跳过，绝不阻断启动。
 * 发送侧（SeckillVoucherServiceImpl）在 broker 不可用时已退化为同步落库，功能不受影响。
 */
@Configuration
public class KafkaConfig {

    private static final Logger log = LoggerFactory.getLogger(KafkaConfig.class);

    /** 秒杀异步下单主题 */
    public static final String SECKILL_ORDER_TOPIC = "seckill-orders";

    private final KafkaAdmin kafkaAdmin;

    public KafkaConfig(KafkaAdmin kafkaAdmin) {
        this.kafkaAdmin = kafkaAdmin;
    }

    @Bean
    public CommandLineRunner createSeckillTopic() {
        return args -> {
            try {
                NewTopic topic = new NewTopic(SECKILL_ORDER_TOPIC, 1, (short) 1);
                try (AdminClient admin = AdminClient.create(kafkaAdmin.getConfigurationProperties())) {
                    CreateTopicsResult result = admin.createTopics(Collections.singletonList(topic));
                    // 限定等待时间，避免 broker 不可用时无限阻塞
                    result.all().get(10, TimeUnit.SECONDS);
                    log.info("Kafka 主题 {} 创建/校验成功", SECKILL_ORDER_TOPIC);
                }
            } catch (Exception e) {
                log.warn("Kafka 主题 {} 暂不可用（broker 未启动？），跳过自动创建；发送侧将退化为同步落库：{}",
                        SECKILL_ORDER_TOPIC, e.getMessage());
            }
        };
    }
}
