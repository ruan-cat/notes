# 基于 Kimi 官方网站的配置

## 基于官方教程的方案

- 官网博客 [`Claude Code 与 Kimi K2：终极 AI 编程助手组合`](https://kimi-k2.org/zh/blog/07-ai-coding-assistant-zh)
- https://platform.moonshot.ai/docs/guide/agent-support.en-US#windows-1
- https://platform.moonshot.cn/docs/guide/agent-support#配置环境变量
- 获取 key： https://platform.moonshot.cn/console/api-keys

这两个文章讲的事情不是一回事，官网博客说要用到专门的 `claude-code-router` 路由器，而且配置明显的非常复杂，相比于其他常见的 claude code 供应商配置方式，该方案太离谱了，故不考虑。

按照这个官方文档，结合 GLM 的配置写法，Kimi 的写法如下：

```bash
$env:ANTHROPIC_AUTH_TOKEN = "在kimi官网内新建的token"
$env:ANTHROPIC_BASE_URL = "https://api.moonshot.cn/anthropic"
$env:ANTHROPIC_MODEL = "kimi-k2-0905-preview"
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL = "kimi-k2-0905-preview"
$env:ANTHROPIC_DEFAULT_SONNET_MODEL = "kimi-k2-0905-preview"
$env:ANTHROPIC_DEFAULT_OPUS_MODEL = "kimi-k2-0905-preview"
```

::: error 无法连接

总是 404 。都换成国内的 baseUrl 了，还是不行，模型也换了两个了。不弄了。

:::

## 基于博客文章的配置方案

- 博客 [`Kimi K2驱动Claude Code终极指南 | Claude国内使用新姿势`](https://aigc.bar/Claude教程/2025/07/12/kimi-k2-claude-code-guide)

本质上是配置由 Kimi 提供的 token 和 baseUrl，模仿上面的配置，如下：

```bash
$env:ANTHROPIC_AUTH_TOKEN = "在kimi官网内新建的token"
$env:ANTHROPIC_BASE_URL = "https://api.moonshot.cn/v1/messages"
```

### 对 ANTHROPIC_BASE_URL 有疑惑

- https://platform.moonshot.cn/docs/guide/agent-support#配置-anthropic-api

该文档称要配置成 `https://api.moonshot.cn/anthropic` 。

## 体验：月之暗面速度太慢

目前，我使用国内`月之暗面`提供的 url 地址，响应速度太慢。故不继续使用该方案。
