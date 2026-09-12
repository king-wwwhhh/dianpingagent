package com.llp.service;

import com.llp.dto.Result;
import com.llp.entity.Follow;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author 虎哥
 * @since 2021-12-22
 */
public interface IFollowService extends IService<Follow> {

    Result follow(Long followUserId, Boolean isFollow);

    Result isFollow(Long followUserId);

    Result followCommons(Long id);

    /** 查询我的粉丝列表（follow_user_id = 当前用户） */
    Result queryFans();

    /** 查询我的关注列表（user_id = 当前用户） */
    Result queryFollows();
}
