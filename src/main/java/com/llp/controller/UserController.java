package com.llp.controller;


import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.StrUtil;
import com.llp.dto.LoginFormDTO;
import com.llp.dto.Result;
import com.llp.dto.UserDTO;
import com.llp.entity.User;
import com.llp.entity.UserInfo;
import com.llp.service.IUserInfoService;
import com.llp.service.IUserService;
import com.llp.utils.RedisConstants;
import com.llp.utils.UserHolder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.concurrent.TimeUnit;

/**
 * <p>
 * 前端控制器
 * </p>
 *
 * @author 虎哥
 */
@Slf4j
@RestController
@RequestMapping("/user")
public class UserController {

    @Resource
    private IUserService userService;

    @Resource
    private IUserInfoService userInfoService;

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    /**
     * 发送手机验证码
     */
    @PostMapping("code")
    public Result sendCode(@RequestParam("phone") String phone, HttpSession session) {
        // 发送短信验证码并保存验证码
        return userService.sendCode(phone, session);
    }

    /**
     * 登录功能
     * @param loginForm 登录参数，包含手机号、验证码；或者手机号、密码
     */
    @PostMapping("/login")
    public Result login(@RequestBody LoginFormDTO loginForm, HttpSession session){
        // 实现登录功能
        return userService.login(loginForm, session);
    }

    /**
     * 登出功能
     * @return 无
     */
    @PostMapping("/logout")
    public Result logout(HttpServletRequest request){
        // 1.获取请求头中的token
        String token = request.getHeader("authorization");
        // 2.删除Redis中的登录信息，使token失效
        if (StrUtil.isNotBlank(token)) {
            stringRedisTemplate.delete(RedisConstants.LOGIN_USER_KEY + token);
        }
        // 3.返回
        return Result.ok();
    }

    @GetMapping("/me")
    public Result me(){
        // 获取当前登录的用户并返回
        UserDTO user = UserHolder.getUser();
        return Result.ok(user);
    }

    @GetMapping("/info/{id}")
    public Result info(@PathVariable("id") Long userId){
        // 查询详情
        UserInfo info = userInfoService.getById(userId);
        if (info == null) {
            // 没有详情，应该是第一次查看详情
            return Result.ok();
        }
        info.setCreateTime(null);
        info.setUpdateTime(null);
        // 返回
        return Result.ok(info);
    }

    @GetMapping("/{id}")
    public Result queryUserById(@PathVariable("id") Long userId){
        // 查询详情
        User user = userService.getById(userId);
        if (user == null) {
            return Result.ok();
        }
        UserDTO userDTO = BeanUtil.copyProperties(user, UserDTO.class);
        // 返回
        return Result.ok(userDTO);
    }

    /**
     * 修改个人基础资料（昵称、头像）
     */
    @PutMapping("")
    public Result updateUser(@RequestBody User user, HttpServletRequest request) {
        Long userId = UserHolder.getUser().getId();
        user.setId(userId);
        userService.updateById(user);
        // 同步更新会话中的昵称/头像
        UserDTO holder = UserHolder.getUser();
        if (user.getNickName() != null) {
            holder.setNickName(user.getNickName());
        }
        if (user.getIcon() != null) {
            holder.setIcon(user.getIcon());
        }
        // 同步更新 Redis 登录会话中的昵称/头像。
        // 否则 RefreshTokenInterceptor 每次请求都会从 Redis 登录快照重建 UserDTO，
        // 导致 /user/me 在重新登录前一直返回旧的昵称/头像，前端编辑后无法立即生效。
        String token = request.getHeader("authorization");
        if (StrUtil.isNotBlank(token)) {
            String key = RedisConstants.LOGIN_USER_KEY + token;
            if (user.getNickName() != null) {
                stringRedisTemplate.opsForHash().put(key, "nickName", user.getNickName());
            }
            if (user.getIcon() != null) {
                stringRedisTemplate.opsForHash().put(key, "icon", user.getIcon());
            }
            stringRedisTemplate.expire(key, RedisConstants.LOGIN_USER_TTL, TimeUnit.MINUTES);
        }
        return Result.ok();
    }

    /**
     * 修改个人详细资料（个人简介、性别、城市、生日）
     */
    @PutMapping("/info")
    public Result updateUserInfo(@RequestBody UserInfo info) {
        Long userId = UserHolder.getUser().getId();
        info.setUserId(userId);
        userInfoService.saveOrUpdate(info);
        return Result.ok();
    }

    @PostMapping("/sign")
    public Result sign(){
        return userService.sign();
    }

    @GetMapping("/sign/count")
    public Result signCount(){
        return userService.signCount();
    }
}