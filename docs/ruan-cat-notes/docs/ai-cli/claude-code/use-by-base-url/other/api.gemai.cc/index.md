# api.gemai.cc

- 官网： https://api.gemai.cc/
- 官方配置教程： https://docs.gemai.cc/dev-tools/ccswitch#注意事项

::: warning 关于 token 安全

免费公益站注册的。白送额度。无所谓。

:::

<!--
$env:ANTHROPIC_MODEL = "claude-opus-4-6";
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL = "claude-haiku-4-5-20251001";
$env:ANTHROPIC_DEFAULT_SONNET_MODEL = "claude-sonnet-4.6";
$env:ANTHROPIC_DEFAULT_OPUS_MODEL = "claude-opus-4-6";
 -->

<!--
[福利]claude-sonnet-4-5-20250929-thinking 无法执行，响应慢
[福利]claude-sonnet-4-5-20250929 无法执行，响应慢
claude-sonnet-4-5-20250929

[官B]claude-opus-4-6-thinking 太贵
[特价B]claude-opus-4-6-thinking 太贵
[特价]claude-opus-4-6-thinking 太贵

[特价]claude-sonnet-4-6 太贵

https://api.gemai.cc/v1 可以使用
https://api.gemai.cc/v1/chat/completions 无法使用
-->

TODO: 有时间再继续实验吧，找到合适的，能用的模型

```bash
$env:ANTHROPIC_AUTH_TOKEN = "sk-y83cZ4pb4vAhBsyFkG86qtIM0YH3r1swmCvf0WJmJP9GgZUX";
$env:ANTHROPIC_BASE_URL = "https://api.gemai.cc";
$env:ANTHROPIC_MODEL = "";
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL = "";
$env:ANTHROPIC_DEFAULT_SONNET_MODEL = "";
$env:ANTHROPIC_DEFAULT_OPUS_MODEL = "[特价B]claude-opus-4-6-thinking";
claude --dangerously-skip-permissions
```
