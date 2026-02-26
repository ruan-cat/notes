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

如果面向 vercel 平台的 compatibilityDate 兼容性日期，设置成 latest，这会生成符号链接的目录文件。如下图所示：

![2026-02-27-00-24-46](https://gh-img-store.ruan-cat.com/img/2026-02-27-00-24-46.png)

---

如果这是在单体架构，且直接在 vercel 平台内走工作流部署时，这样的写法是安全的，不会触发任何错误。

但是健壮性很差，不同的项目架构，和部署方式。都会触发错误，如下截图所示：

![2026-02-27-00-29-37](https://gh-img-store.ruan-cat.com/img/2026-02-27-00-29-37.png)

---

日志如下：

```log
Error: Could not find target "vercel/path0/apps/.vercel/output/functions/__server" Lambda or EdgeFunction for path "db-version"
    at Xor (/var/task/sandbox.js:1295:10430)
    at async Promise.all (index 0)
    at async /var/task/sandbox.js:1366:49125
    at async wmn (/var/task/sandbox.js:1366:47297)
    at async qja (/var/task/sandbox.js:1368:1299)
    at async jja (/var/task/sandbox.js:1368:1100)
```

出现严重的 `Error: Could not find target "vercel/path0/apps/.vercel/output/functions/__server" Lambda or EdgeFunction for path` 错误。

### 结论及解决方案

在 compatibilityDate 设置成 latest 时，符号链接目录产物，在不同的项目架构，和部署方式下，其成功情况如下表所示：

|                   | 单体架构 | monorepo 架构 |
| :---------------: | :------: | :-----------: |
| vercel 工作流部署 |   成功   |     失败      |
|  cli 命令行部署   |   失败   |     失败      |

因此我们不应该设置成 latest 最晚日期，而是保守一点，设置成和 cloudflare worker 一样的 `2024-09-19` 即可。

---

### 正常情况

正常情况下，其构建产物应该如下图所示，没有出现多余的符号链接目录：

![2026-02-27-00-38-48](https://gh-img-store.ruan-cat.com/img/2026-02-27-00-38-48.png)
