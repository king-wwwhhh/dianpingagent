package com.llp.service;

import com.llp.dto.Result;
import com.llp.entity.VoucherOrder;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author 虎哥
 * @since 2021-12-22
 */
public interface IVoucherOrderService extends IService<VoucherOrder> {

    Result seckillVoucher(Long voucherId);

    /** 查询当前登录用户的订单列表（含券与商户信息） */
    Result queryMyOrders();
}
