# 基于 Kimi 官方网站的配置

- https://platform.moonshot.ai/docs/guide/agent-support.en-US#windows-1
- 官网博客 [`Claude Code 与 Kimi K2：终极 AI 编程助手组合`](https://kimi-k2.org/zh/blog/07-ai-coding-assistant-zh)

<!-- TODO: 准备重构文档 -->

- 博客 [`Kimi K2驱动Claude Code终极指南 | Claude国内使用新姿势`](https://aigc.bar/Claude教程/2025/07/12/kimi-k2-claude-code-guide)

本质上是配置由 Kimi 提供的 token 和 baseUrl，模仿上面的配置，如下：

```bash
$env:ANTHROPIC_AUTH_TOKEN = "在kimi官网内新建的token"
$env:ANTHROPIC_BASE_URL = "https://api.moonshot.cn/v1/messages"
```

## 对 ANTHROPIC_BASE_URL 有疑惑

- https://platform.moonshot.cn/docs/guide/agent-support#配置-anthropic-api

该文档称要配置成 `https://api.moonshot.cn/anthropic` 。

## 月之暗面速度太慢

目前，我使用国内`月之暗面`提供的 url 地址，响应速度太慢。故不继续使用该方案。
