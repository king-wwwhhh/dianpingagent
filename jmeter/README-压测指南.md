# 秒杀接口压测指南（JMeter）

目标：拿到 `/voucher-order/seckill/{id}` 的**真实 QPS / P99 / 错误率**，替换简历上没有依据的吞吐数字。

## 文件说明

| 文件 | 作用 |
|---|---|
| `seckill-test.jmx` | 压测计划：200 线程 / 10s ramp-up / 持续 60s（均可用参数覆盖） |
| `run-seckill-test.bat` | Windows 一键运行（CLI 模式 + 自动生成 HTML 报告） |
| `tokens.csv` | 自建：压测用户 token，一行一个（首行写 `token`） |

## 运行前准备（三件事）

### 1. 启动依赖
MySQL、Redis、Kafka（zookeeper）必须在线，应用以 `local` 配置启动（端口 8081）。

### 2. 准备秒杀券
用管理端或 SQL 给某张券设置秒杀库存，记下 voucherId（如 10），并确认 `flash:stock:10` 已预热进 Redis（或让应用的按需预热逻辑生效）。

### 3. 准备压测用户 token（最关键的一步）
一人一单限定了**每个用户只能成功秒杀一次**，所以要先准备一批已登录用户的 token：

```bash
# 方式一：从 Redis 直接捞已有登录态（快速）
redis-cli --scan --pattern "login:token:*" | sed "s/login:token://" > tokens.csv
# 然后在文件第一行插入表头 token

# 方式二：脚本批量注册+登录（用户量大时）
# 对 /user/code 发验证码、/user/login 提交手机号+验证码（本地测试码 000000），
# 循环 N 次收集响应里的 token
```

> 建议准备 ≥ 线程数的 token（200 线程 → 200+ 个），否则 token 用完后请求返回"重复下单"，成功样本会停止增长（错误率升高属于预期，见下文解读）。

## 运行

```bat
:: 默认参数：200 线程、10s ramp-up、60s、voucherId=10
run-seckill-test.bat

:: 自定义参数
jmeter -n -t seckill-test.jmx -Jthreads=500 -Jrampup=20 -Jduration=120 -JvoucherId=10 ^
       -Jhost=localhost -Jport=8081 ^
       -l results\seckill.jtl -e -o results\report
```

跑完打开 `results\report\index.html` 看 HTML 报告。

## 结果怎么读（写简历前必看）

| 指标 | 在哪看 | 怎么用 |
|---|---|---|
| **Throughput（QPS）** | 聚合报告 | 这才是你系统的真实秒杀吞吐——简历只允许写这个数字 |
| P90 / P95 / P99 | HTML 报告 | 谈"延迟表现"用 P99，别用平均值 |
| Error% | 聚合报告 | 分清"业务拒绝"和"系统错误"（见下） |
| 各层瓶颈 | 观察 | QPS 不涨时看 CPU（应用）、Redis `slowlog`、MySQL 连接数/行锁等待 |

**错误率解读（面试必会被问）**：
- 响应 `订单已存在` / `库存不足` = **业务拒绝**，是防超卖/防重单在正常工作，不是 bug；压测成功下单数应 ≈ 库存数，订单表数量 = 通过 Lua 资格判断的请求数，**一条不多一条不少就是防超卖成立的证据**。
- HTTP 5xx / 超时 = 系统错误，才需要优化。

**压测后把数字填进简历话术**（示例格式，数字以实测为准）：
> "JMeter 200 并发压测秒杀接口，单机 QPS 实测 X，P99 延迟 Xms，2000 请求对应库存 100 生成订单恰好 100 条，无超卖。"

## 常见问题

- **报 connection refused**：应用没起 / 端口不对，检查 `-Jport`。
- **全部 401**：tokens.csv 为空或格式错（首行必须有表头 `token`，token 不含 `login:token:` 前缀）。
- **QPS 上不去但资源空闲**：token 数太少，全部在"重复下单"快速返回，属于正常；换新 token 再压。
