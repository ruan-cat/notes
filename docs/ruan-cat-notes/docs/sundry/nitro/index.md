# nitro,node serverless 服务端接口开发库

这是 nuxt 内部实现后端接口的库。

- 官网 https://nitro.build/
- 仓库 https://github.com/nitrojs/nitro

## 自己长期更新跟进的学习性质仓库

- https://github.com/ruan-cat/learn-nitro-starter-with-vercel

## 安装依赖

```bash
pnpm i -D nitropack
```

## 内部依赖于 h3

nitro 是对 h3 的二次封装，部分文档应该阅读 h3

- 官网 https://h3.dev/
- 仓库 https://github.com/h3js/h3

## 快速初始化模板

- 文档 https://nitro.build/guide#quick-start
- 仓库 https://github.com/nitrojs/starter

```bash
pnpm dlx giget@latest nitro nitro-app --install
```

### vercel 平台提供的模板

vercel 本身也提供一个简单的平台，实现 nitro 项目初始化。

- 文档： https://vercel.com/docs/frameworks/backend/nitro

```bash
vc init nitro
```

## 可以以 github page 的方式部署一个单独的接口服务

- https://nitro.build/deploy/providers/github-pages

## 跨域？

- https://juejin.cn/post/7387539709218209842

## 新建中间件？

- https://nitro.zhcndoc.com/guide/routing#中间件
- https://nitro.build/guide/routing#middleware

概念性问题：什么时候新建：

- 缓存？
- 日志？
- 跨域？

## 在 vercel 平台部署 monorepo 架构下的 nitro 接口

见[专门的 vercel 文章](../../vercel/deploy-nitro-with-monorepo.md)。

## 因 compatibilityDate 兼容性日期配置而导致在 vercel 平台部署项目出现的路径 bug

该专题需要见专门的[掘金文章](../../posts/2026-3-8-use-latest-compatibilityDate-in-vercel-make-bug/index.md)。
