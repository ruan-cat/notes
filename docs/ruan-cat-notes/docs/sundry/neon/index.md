# neon,serverless 云数据库供应商

为什么选择这个？而不是 supabase？我看网站说 neon 很适合做小项目，额度给的够，哪怕数据库不用，也会长期保留。

- 低频运行的长期保存数据库实例。
- 高频运行自动扩容。
- 对免费用户提供慷慨额度。

- 实现注册登录逻辑： https://neon.com/guides/admin-dashboard-neon-auth
- 实现 JWT 接口鉴权： https://neon.com/guides/react-neon-auth-hono
- Drizzle ORM 更新数据库表： https://neon.com/docs/guides/drizzle-migrations

初始化基于 neon 的 AI 配置和 MCP：

```bash
npx neonctl@latest init
```
