# neon,serverless 云数据库供应商

为什么选择这个？而不是 supabase？我看网站说 neon 很适合做小项目，额度给的够，哪怕数据库不用，也会长期保留。

- 低频运行的长期保存数据库实例。
- 高频运行自动扩容。
- 对免费用户提供慷慨额度。

- 实现注册登录逻辑： https://neon.com/guides/admin-dashboard-neon-auth
- 实现 JWT 接口鉴权： https://neon.com/guides/react-neon-auth-hono
- 让 AI 自己实现认证： https://neon.com/blog/teaching-ai-how-to-do-auth
- neon 的 AI 技能仓库： https://github.com/neondatabase/ai-rules

## 入门 Neon CLI

初始化基于 neon 的 AI 配置和 MCP：

```bash
npx neonctl@latest init
```

- 入门 Neon CLI ： https://neon.com/docs/reference/neon-cli

## 与 Drizzle ORM 协作

- neon 链接 Drizzle ORM： https://neon.com/docs/guides/drizzle
- Drizzle ORM 更新数据库表： https://neon.com/docs/guides/drizzle-migrations
- 和 Drizzle ORM 协作的 neon AI 技能：https://neon.com/docs/ai/ai-rules-neon-drizzle

## @neondatabase/serverless

- 入门 `@neondatabase/serverless` 包： https://neon.com/docs/serverless/serverless-driver

## vercel

- vercel 开启预览分支与 neon 测试环境数据库： https://neon.com/docs/guides/vercel-managed-integration
