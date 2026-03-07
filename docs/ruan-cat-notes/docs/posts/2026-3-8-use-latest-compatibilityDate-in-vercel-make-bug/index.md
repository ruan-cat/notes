---
juejin: todo
desc: xxx todo
---

# 因 compatibilityDate 兼容性日期配置而导致在 vercel 平台部署项目出现的路径 bug

> **摘要**：
>
> todo

如果面向 `vercel` 平台的 `compatibilityDate` 兼容性日期，设置成 `latest`，这会生成符号链接的目录文件。如下图所示：

> ![2026-02-27-00-24-46](https://gh-img-store.ruan-cat.com/img/2026-02-27-00-24-46.png)

---

如果这是在单体架构，且直接在 `vercel` 平台内走工作流部署时，这样的写法是安全的，不会触发任何错误。

但是健壮性很差，不同的项目架构，和部署方式。都会触发错误，如下截图所示：

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

## 结论及解决方案

在 `compatibilityDate` 设置成 `latest` 时，符号链接目录产物，在不同的项目架构，和部署方式下，其成功情况如下表所示：

|                   | 单体架构 | monorepo 架构 |
| :---------------: | :------: | :-----------: |
| vercel 工作流部署 |   成功   |     失败      |
|  cli 命令行部署   |   失败   |     失败      |

因此我们不应该设置成 `latest` 最晚日期，而是保守一点，设置成和 `cloudflare worker` 一样的 `2024-09-19` 即可。

---

## 正常情况

正常情况下，其构建产物应该如下图所示，没有出现多余的符号链接目录：

> ![2026-02-27-00-38-48](https://gh-img-store.ruan-cat.com/img/2026-02-27-00-38-48.png)

---
