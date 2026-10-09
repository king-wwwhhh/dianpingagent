# Dianping Agent · 本地生活服务与智能助手

基于 Spring Boot 的本地生活后端学习项目，将店铺查询、优惠券和秒杀业务接入对话式 Agent。项目用于实践 Java 后端、Redis 缓存、Kafka 异步订单处理与业务工具编排。

## 功能概览

- **本地生活业务**：用户、店铺分类、店铺、优惠券、订单、笔记与关注接口。
- **对话式工具调用**：识别用户意图，调用店铺分类、店铺查询、优惠券查询与秒杀工具，并结合会话上下文补全参数。
- **会话管理**：保留对话历史、最近查询的店铺与优惠券，支持「这家店的券」「第 N 张」等上下文表达。
- **秒杀下单**：Redis / Lua 校验库存与购买资格，Kafka 传递下单消息，Redisson 锁协调订单创建；消息发送失败时包含同步落库路径。
- **对话入口控制**：登录校验、会话请求限流与规则回复兜底。

## 技术栈

Java 8 · Spring Boot 2.3.12 · MyBatis-Plus · MySQL · Redis · Redisson · Kafka · Maven

Agent 模块采用项目内的意图识别、工具注册与模型客户端接口，包含 OpenAI 兼容客户端和规则回复客户端。

## 目录导航

```text
src/main/java/com/llp/
├── agent/            # 意图识别、工具、模型客户端、会话与编排
├── controller/       # 业务 REST 接口
├── service/impl/     # 店铺、优惠券、订单等业务实现
├── mapper/           # 数据访问
└── config/           # 应用组件配置

src/main/resources/
├── application.yaml  # 应用与外部服务配置
├── db/hmdp.sql       # 数据库初始化脚本
├── mapper/           # MyBatis 映射
└── seckill.lua       # 秒杀原子校验脚本
```

## 本地运行

1. 准备 JDK、Maven，以及 MySQL、Redis 和 Kafka 服务。Java 版本配置见 `pom.xml`。
2. 检查 `src/main/resources/application.yaml`，按实际环境设置服务连接、端口和模型配置。使用自己的凭据，不向公开仓库提交密码或 API Key。
3. 在开发数据库中检查并导入 `src/main/resources/db/hmdp.sql`。
4. 启动后端：

```bash
git clone https://github.com/king-wwwhhh/dianpingagent.git
cd dianpingagent
mvn spring-boot:run
```

这是后端仓库；业务访问与 Agent 调用需要配置依赖服务，并按接口要求完成登录。

## Agent 请求示例

`POST /agent/chat` 使用以下请求体，并携带当前业务用户的登录 token：

```json
{
  "message": "帮我查找店铺",
  "sessionId": "demo-session"
}
```

`sessionId` 可选；未指定时按当前登录用户生成会话标识。回复中的业务数据取决于数据库内容、识别出的意图和可用工具。

## 学习与来源说明

仓库保留了原有业务代码的作者注释。本项目作为学习与扩展实践展示，不将已有基础业务实现标为全部原创，也不声明未经测量的性能指标。阅读时可从 `AgentController` → `AgentServiceImpl` → `ToolRegistry` 开始，再查看秒杀订单流程。
