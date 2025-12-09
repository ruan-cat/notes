# nuxt,vue 全栈框架

## 参考资料

- https://github.com/atinux/nuxt-todos-edge
- https://github.com/tlebeitsuk/nuxt-cloudflare-lucia

## 踩坑

- https://juejin.cn/post/7236635191379509308

## 尝试全栈开发-1

用 nuxthub、`cloudflare D1`、和 drizzle ORM 实现后端。

技术栈选型：

- 边缘运行时 cloudflare worker
- 数据库 cloudflare D1
- ORM drizzle
- 后端接口实现框架 nuxt（nitro preset with cloudflare）

## 目前需要解决的几个问题

### 本地怎么初始化数据库？

在 nuxthub 提供的数款 demo 中，都没有涉及到明确的数据库表插入的语句。初始化数据库要专门用 nitro 的实验性功能，写一个 task，一个接口请求来手动插入数据。

目前也没有发现 drizzle 的 migrate 命令能够生成带有插入语句的 sql。

### 怎么同步到 D1 云数据库？

用 wrangler 的 D1 数据库部署命令，运行 sql 语句。

或者是用 drizzle-kit push 命令完成 D1 的更新。

### drizzle 怎么实现 D1 数据库的远程连接？

::: details 先配置`drizzle.config.ts`文件

<!--
	敏感的token 不直接显示出来
	accountId: "3412269ab0def154c8806e38acd1b493",
	databaseId: "22850cc9-7519-4d48-bf90-ea886519f86f",
	token: "SFJXyE38Aa8qcMfLpCHueuYB4PAgyN_O14d0vkn7",
-->

```js
// drizzle.config.ts
import type { Config } from "drizzle-kit";

export default {
	dialect: "sqlite",
	schema: "./server/database/schema.ts",
	out: "./server/database/migrations",

	driver: "d1-http",
	dbCredentials: {
		accountId: "3412269ab0def154c8806e38acd1b493",
		databaseId: "22850cc9-7519-4d48-bf90-ea886519f86f",
		token: "SFJXyE38Aa8qcMfLpCHueuYB4PAgyN_O14d0vkn7",
	},
	migrations: {
		prefix: "none",
	},
} satisfies Config;
```

:::

::: details 使用命令`studio`本地运行页面并浏览远程数据库

```bash
drizzle-kit studio
```

该方案还是有缺陷的。虽然远程连接，查看了 cloudflare D1，但是不能轻松地新增、修改数据库。表、记录的修改不方便。

:::

## api.cloudflare.com 有故障

不知道怎么回事，家里宽带就是无法弄 api.cloudflare.com 的接口。无论是 nuxthub、drizzle、还是 wrangler，都要使用该接口做数据请求。

比如以下的命令：

```bash
wrangler whoami
```

该命令用于查询 cloudflare 用户目前的应用权限，在不同的网络环境下，表现不同。

::: details 笔记本

![2024-08-14-10-32-11](https://gh-img-store.ruan-cat.com/img/2024-08-14-10-32-11.png)

:::

::: details 家用台式机

![2024-08-14-10-38-58](https://gh-img-store.ruan-cat.com/img/2024-08-14-10-38-58.png)

:::

目前无法有效的解决该问题。故不得不弃用 cloudflare D1。

## 更换技术选型-2

技术栈选型：

- 边缘运行时 vercel serverless
- 数据库 vercel postgres
- ORM drizzle
- 后端接口实现框架 nuxt（nitro preset with vercel）

- 模板项目 https://vscode.dev/github/vercel/examples/blob/main/storage/postgres-nuxt

- 参考文档
  - drizzle+Vercel Postgres https://orm.drizzle.team/docs/get-started-postgresql#usage-with-cloudflare-workers
  - 从 vercel 初始化模板项目 https://vercel.com/new/ruanzhongnans-projects/templates/nuxt/postgres-nuxt
  - https://vercel.com/templates/nuxt/postgres-nuxt
  - vercel postgres 入门 https://vercel.com/docs/storage/vercel-postgres/quickstart

## vercel postgres 数据库可创建数量不够

仅有 1 个。cloudflare D1 允许我们新建多个数据库，而 vercel 只能新建 1 个。

需要更换数据库选型了。

::: details

![2024-08-15-11-31-40](https://gh-img-store.ruan-cat.com/img/2024-08-15-11-31-40.png)

- https://vercel.com/docs/storage/vercel-postgres/usage-and-pricing#pricing

:::

## 更换技术选型-3

技术栈选型：

- 边缘运行时 vercel serverless
- 数据库
- ORM drizzle
- 后端接口实现框架 nuxt（nitro preset with vercel）

- https://neon.tech/docs/get-started-with-neon/connect-neon

## postgresql

TODO: 看看 navicat 怎么去便捷地连接该数据库？现在 neon 创建的数据库，能否便捷地可视化，并且插入大量数据？
