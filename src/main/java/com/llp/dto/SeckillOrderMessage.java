package com.llp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 秒杀下单消息：由下单接口生产，投递到 Kafka，由消费者异步落库。
 * 替代原 Redis Stream（stream.orders）的异步消息队列方案。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeckillOrderMessage implements Serializable {

    private static final long serialVersionUID = 1L;

    /** 订单id（与返回给客户端的下单id一致） */
    private Long orderId;

    /** 下单用户id */
    private Long userId;

    /** 秒杀优惠券id */
    private Long voucherId;
}
