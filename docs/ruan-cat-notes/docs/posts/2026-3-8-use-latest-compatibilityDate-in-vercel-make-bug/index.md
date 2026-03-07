---
juejin: todo
desc: 将 compatibilityDate 配置为 latest 后，Vercel 在部分部署场景下会生成符号链接目录，并进一步触发路径解析错误。
---

# 因将 compatibilityDate 配置为 latest 而导致 Vercel 平台部署项目出现路径 bug

> **摘要**：
>
> 在面向 Vercel 平台的部署场景中，如果把 `compatibilityDate` 直接设置为 `latest`，构建产物中可能会出现额外的符号链接目录。
> 这个问题在不同的项目架构和部署方式下表现并不一致，但一旦触发，就可能导致严重的路径解析错误。
> 相比继续追逐 `latest`，显式固定为一个稳定日期会更稳妥。

如果面向 `Vercel` 平台部署时，把 `compatibilityDate` 设置为 `latest`，就可能生成带有符号链接的目录产物。如下图所示：

> ![2026-02-27-00-24-46](https://gh-img-store.ruan-cat.com/img/2026-02-27-00-24-46.png)

---

如果项目是单体架构，并且直接在 `Vercel` 平台内通过工作流完成部署，那么这样的配置暂时是安全的，不会触发明显错误。

但是，这种写法的健壮性很差。一旦换成不同的项目架构或部署方式，就可能触发错误。如下截图所示：

> ![2026-02-27-00-29-37](https://gh-img-store.ruan-cat.com/img/2026-02-27-00-29-37.png)

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

## 1. 结论及解决方案

当 `compatibilityDate` 被设置为 `latest` 时，构建产物中出现的符号链接目录，在不同项目架构和部署方式下的表现如下表所示：

|                   | 单体架构 | Monorepo 架构 |
| :---------------: | :------: | :-----------: |
| Vercel 工作流部署 |   成功   |     失败      |
|  CLI 命令行部署   |   失败   |     失败      |

因此，不建议把它配置成 `latest` 这样的浮动日期，而应当采取更保守的做法，显式固定为与 `Cloudflare Worker` 一致的 `2024-09-19`。

---

## 2. 正常情况

正常情况下，构建产物应如下图所示，不会出现多余的符号链接目录：

> ![2026-02-27-00-38-48](https://gh-img-store.ruan-cat.com/img/2026-02-27-00-38-48.png)

---
