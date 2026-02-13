# 基于 minimax 官方网站的配置

- [订阅 Coding Plan 套餐](https://platform.minimaxi.com/subscribe/coding-plan)
- [获取 key](https://platform.minimaxi.com/user-center/basic-information/interface-key)
- [获取 Coding Plan 的 key](https://platform.minimaxi.com/user-center/payment/coding-plan)
- [在 claude-code 中使用 minimax m2（推荐）](https://platform.minimaxi.com/docs/guides/text-ai-coding-tools#在-claude-code-中使用-minimax-m2（推荐）)
- [使用 Coding Plan 提供的 MCP](https://platform.minimaxi.com/docs/guides/coding-plan-mcp-guide)
- [查看额度](https://platform.minimaxi.com/user-center/payment/coding-plan)

我们是购买 `Coding Plan` 套餐。

```bash
$env:ANTHROPIC_AUTH_TOKEN = "这里填在会员页面生成的 API Key";
$env:ANTHROPIC_BASE_URL = "https://api.minimaxi.com/anthropic";
$env:ANTHROPIC_MODEL = "MiniMax-M2.5";
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL = "MiniMax-M2.5";
$env:ANTHROPIC_DEFAULT_SONNET_MODEL = "MiniMax-M2.5";
$env:ANTHROPIC_DEFAULT_OPUS_MODEL = "MiniMax-M2.5";
claude --dangerously-skip-permissions
```

## 使用体验

### 持久不泄

在长任务场景下，能够高强度的，主动的使用子代理，完成划分的子任务。且没有出现普遍情况的代码幻觉。

![2025-12-13-17-41-10](https://gh-img-store.ruan-cat.com/img/2025-12-13-17-41-10.png)
