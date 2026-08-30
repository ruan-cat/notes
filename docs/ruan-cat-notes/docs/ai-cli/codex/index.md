# codex,AI 工具

codex 有多个应用端、cli、App、vscode plugins。

截止 26 年 5 月，现在 codex 比 claude code 流行多了。

- 官网： https://chatgpt.com/codex
- 仓库： https://github.com/openai/codex
- 查看额度： https://chatgpt.com/codex/settings/usage
- codex 用量官方套餐额度： https://developers.openai.com/codex/pricing#what-are-the-usage-limits-for-my-plan
- 敏感的用户 session 信息： https://chatgpt.com/api/auth/session

## codex 接入其他模型

- https://vaitk.com/blog/codex-deepseek-third-party-api/

## codex 切换供应商后导致对话记录丢失

- 教程： https://leiyun.blog/article/codex-threadripper-provider-sync
- 解决方案： https://github.com/Wangnov/codex-threadripper

比如我需要同步全部记录到供应商 `custom` 内，那么就运行命令：

```bash
codex-threadripper bucket switch custom
```

我需要整体同步，运行命令：

```bash
codex-threadripper sync
```
