# 基于阿里云 qwen 的配置

- coding plan 说明文档： https://help.aliyun.com/zh/model-studio/coding-plan
- 以 coding plan 模式接入 claude code： https://help.aliyun.com/zh/model-studio/coding-plan
- 以按量付费模式接入 claude code： https://help.aliyun.com/zh/model-studio/claude-code
- 阿里云百炼，控制台面板： https://bailian.console.aliyun.com/cn-beijing/?tab=model#/model-usage/free-quota
  > 按量计费的免费额度面板
- 新建基于按量计费的 key： https://bailian.console.aliyun.com/cn-beijing/?tab=model#/api-key

## 以按量付费模式接入 claude code

```bash
$env:ANTHROPIC_AUTH_TOKEN = "申请的按量计费token";
$env:ANTHROPIC_BASE_URL = "https://dashscope.aliyuncs.com/apps/anthropic";
$env:ANTHROPIC_MODEL = "qwen3.5-plus";
claude --dangerously-skip-permissions
```
