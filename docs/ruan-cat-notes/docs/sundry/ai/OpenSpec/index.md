# OpenSpec,规范驱动的 AI 任务管理提示词系统

## 0.x 版本的内容

[点此阅读](./v0.x.md)

## 1.x 版本的内容

- 中文版： https://github.com/hex-novaflow-ai/OpenSpec-Chinese
- 仓库（英文原版）： https://github.com/Fission-AI/OpenSpec

带来了那些巨大的差异？

- 提供了非常多细致的 skills 和 commands 命令。文件数量变得很多。
- 任务管理很细致，很复杂了。

- 生成的 AI 用的命令： https://github.com/Fission-AI/OpenSpec/blob/main/docs/opsx.md#commands

### 初始化与迁移命令

该命令可以将旧版本的规范文件，全部删除。并全部使用新版本的 skills 文件来约束。

```bash
openspec init
```

### 常用 AI 命令

```bash
# 新建
/opsx:new

# 应用
/opsx:apply

# 归档
/opsx:archive
```
