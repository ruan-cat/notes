# 基于 aiping.cn 官方网站的配置

[aiping.cn](https://www.aiping.cn/)，是一个通用的 AI 大模型供应商，类似于硅基流动。该站点也提供直接对接编程工具的 api 端口。

- [获取 key](https://www.aiping.cn/user/apikey)
- [在 claude-code 中使用 AI Ping（推荐）](https://www.aiping.cn/docs/UseCases/coding-assistant#在-claude-code-中使用-ai-ping-推荐)
- [查看额度](https://www.aiping.cn/user/called-records)

::: warning 关于 token 安全

没充钱。而且只有国产模型。没有国外模型。

:::

```bash
$env:ANTHROPIC_AUTH_TOKEN = "QC-83b3085abc628a26501833eeb4b78faa-d49322c1db4529bb29ee778b8ce35aec";
$env:ANTHROPIC_BASE_URL = "https://aiping.cn/api/v1/anthropic";
$env:ANTHROPIC_MODEL = "MiniMax-M2";
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL = "MiniMax-M2";
$env:ANTHROPIC_DEFAULT_SONNET_MODEL = "MiniMax-M2";
$env:ANTHROPIC_DEFAULT_OPUS_MODEL = "MiniMax-M2";
claude --dangerously-skip-permissions
```
