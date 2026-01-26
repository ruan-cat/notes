# OpenSpec,规范驱动的 AI 任务管理提示词系统

这个工具看起来类似于 `taskmaster-ai` ，是一个定义任务规格，任务进度的工具。

需要专门学习学会如何使用该工具提供的一系列命令。

- https://github.com/hex-novaflow-ai/OpenSpec-Chinese
- https://github.com/Fission-AI/OpenSpec
- [`🚀开发者福音！现有项目用AI迭代？OpenSpec规范驱动开发！让AI按规范写代码，真正做到零失误！支持Cursor、Claude Code、Codex！`](https://www.bilibili.com/video/BV1fFWJztEAu/)

## 初始化环境

安装全局依赖：

```bash
pnpm install -g @org-hex/openspec-chinese@latest
```

## 使用流程

1. 在一个全新的项目内，运行全局命令 `openspec-chinese init`。在交互式 cli 内，完成初始化规格目录结构、对接给各个 AI 编程客户端的指令集。
2. 自己先写一整套提示词文件。
3. 运行提供给我们的 `openspec-proposal` 命令，用该命令读取识别我们写的提示词文件，然后生成一揽子完整的规格文件和任务清单。
4. 运行 `openspec-apply` 命令，执行指定规格文件内全部的 task 任务。
5. 最后运行 `openspec-archive` 命令，归档任务。

## 常用命令
