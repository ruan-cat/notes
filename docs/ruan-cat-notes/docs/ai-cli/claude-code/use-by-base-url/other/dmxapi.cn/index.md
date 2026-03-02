# 基于 dmxapi.cn 中转商的配置

- https://www.dmxapi.cn/ClaudeCode
- 配置文档： http://doc.dmxapi.cn/claude-code.html
- 获取 key： https://www.dmxapi.cn/token

::: warning 关于 token 安全

钱用完了，暴露出来也无所谓。以后也不用这个平台了。太贵。

:::

```bash
$env:ANTHROPIC_AUTH_TOKEN = "sk-5rPkJIudrGyl7F733Qx3vklSit3jgiK47FVMDyYJy7jYfBkj";
$env:ANTHROPIC_BASE_URL = "https://www.dmxapi.cn";
claude --dangerously-skip-permissions
```

这是一个国内中转商，可以付费，确实能用，但是用 token 确实太多了。
