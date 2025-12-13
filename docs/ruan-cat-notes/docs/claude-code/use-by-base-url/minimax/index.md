# 基于 minimax 官方网站的配置

- [订阅套餐](https://platform.minimaxi.com/subscribe/coding-plan)
- [在 claude-code-中使用 minimax m2（推荐）](https://platform.minimaxi.com/docs/guides/text-ai-coding-tools#在-claude-code-中使用-minimax-m2（推荐）)

```bash
$env:ANTHROPIC_AUTH_TOKEN = "这里填在会员页面生成的 API Key";
$env:ANTHROPIC_BASE_URL = "https://api.minimaxi.com/anthropic";
$env:ANTHROPIC_MODEL = "MiniMax-M2";
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL = "MiniMax-M2";
$env:ANTHROPIC_DEFAULT_SONNET_MODEL = "MiniMax-M2";
$env:ANTHROPIC_DEFAULT_OPUS_MODEL = "MiniMax-M2";
claude --dangerously-skip-permissions
```
