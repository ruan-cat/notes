# claude code，AI 编程工具

命令行交互的 AI 编程工具。相比于 cursor，用起来有点古怪。

## 全局安装 claude code

```bash
pnpm i -g @anthropic-ai/claude-code
```

### 校验是否安装成功

```bash
claude -v
```

输出版本号即说明安装成功。

## 常用快捷键

### 切换计划模式

Tip: Use Plan Mode to prepare for a complex request before making changes. Press alt+m twice to enable.

alt+m 两次

### 切换思考模式

按 tab

## 思考

看到过一个 B 站视频，讲的是用 claude code 调用 gemini cli，这样可以让 gemini 去完成那些低水准的，简单的，重复性强的，上下文 token 消耗大的任务。让 claude code 专注于任务调度即可。

## 安装 MCP

- 按照特定范围安装 claude code 的 mcp： https://docs.claude.com/en/docs/claude-code/mcp#choosing-the-right-scope

通常文件会安装到 `C:\Users\pc\.claude.json` ，即用户目录的 `.claude.json` 内。

实际实践下来，`.claude.json` 文件长度会变得非常大。

## 利用 `Magic Words` 控制 claude code 思考预算

- [`把钱花在刀刃上：我的 Claude Code 省钱指南`](https://www.hats-land.com/archives/skills/2025-claude-code-usage-guide.html)

从使用的思考预算来看，`think` < `think hard` < `think harder` (`ultrathink`)。

- 基础思考 (`think`): 将消耗约 4K Tokens 预算用于思考，适用于大部分常规任务。
- 深度思考 (`think hard`): 将消耗约 10K Tokens 预算用于思考，当你需要它进行更复杂的逻辑推理或重构时使用。
- 极限思考 (`ultrathink`): 将消耗约 32K Tokens 预算用于思考，用于攻克极其复杂、需要多步骤规划的难题。

## 拓展待办

1. 阅读官方文档、掌握核心概念： https://docs.anthropic.com/zh-CN/home
