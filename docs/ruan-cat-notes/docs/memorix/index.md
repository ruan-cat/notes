# memorix,跨 AI 客户端的记忆工具

- 仓库： https://github.com/AVIDS2/memorix

## 主动触发项目安装记忆用途的工具包

- https://github.com/AVIDS2/memorix/issues/10#issuecomment-3977262945
- https://github.com/AVIDS2/memorix#auto-memory-hooks

```bash
memorix hooks install
```

## 安装 hooks

- https://github.com/AVIDS2/memorix/issues/18#issuecomment-4072913604

根据回复，加上自己实验，发现有效的客户端如下：

```bash
memorix hooks install --agent cursor
memorix hooks install --agent kiro
memorix hooks install --agent claude
memorix hooks install --agent codex
memorix hooks install --agent antigravity

# 这个客户端是错误的
memorix hooks install --agent claude-code
```

## 安装一揽子的 memorix 工具包

- 文档 https://github.com/AVIDS2/memorix/blob/main/docs/INTEGRATIONS.md

具体命令类似于：

```bash
memorix setup --agent claude --global
memorix setup --agent codex --global
memorix setup --agent cursor --global
```
