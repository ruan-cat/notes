# claude code,AI 编程工具

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

- 按照特定范围安装 claude code 的 mcp：
  - 中文 https://docs.claude.com/zh-CN/docs/claude-code/mcp#choosing-the-right-scope
  - 英文 https://docs.claude.com/en/docs/claude-code/mcp#choosing-the-right-scope

命令举例：

```bash
claude mcp add chrome-devtools npx chrome-devtools-mcp@latest --scope user
claude mcp add --transport http gong-rzhe-office-word-mcp-server "https://server.smithery.ai/@GongRzhe/Office-Word-MCP-Server/mcp" --scope user
```

对我而言，我安装 mcp 都是安装全局 mcp。未来会逐步试着安装项目级别的，或者是 claude code 插件级别的 mcp。

通常配置会写入到 `C:\Users\pc\.claude.json` ，即用户目录的 `.claude.json` 内。

值得注意的是，本身 `.claude.json` 文件长度就很大，寻找全局配置会稍微麻烦一点。

全局配置的 mcp 也会占据 claude code 的上下文 token，所以安装全局 mcp 时，应该谨慎挑选最高频使用的，通用的 mcp 工具。

## 利用 `Magic Words` 控制 claude code 思考预算

- [`把钱花在刀刃上：我的 Claude Code 省钱指南`](https://www.hats-land.com/archives/skills/2025-claude-code-usage-guide.html)

从使用的思考预算来看，`think` < `think hard` < `think harder` (`ultrathink`)。

- 基础思考 (`think`): 将消耗约 4K Tokens 预算用于思考，适用于大部分常规任务。
- 深度思考 (`think hard`): 将消耗约 10K Tokens 预算用于思考，当你需要它进行更复杂的逻辑推理或重构时使用。
- 极限思考 (`ultrathink`): 将消耗约 32K Tokens 预算用于思考，用于攻克极其复杂、需要多步骤规划的难题。

## hooks 钩子

参考资料：

- https://aliceric27.github.io/claude-code-hooks/
- https://claudecodehub.github.io/hooks.html
- https://zhuanlan.zhihu.com/p/1950634615065809103

## 编写高效的 skill 技能文档

- 编写语法与格式： https://code.claude.com/docs/zh-CN/skills
- 最佳实践： https://platform.claude.com/docs/zh-CN/agents-and-tools/agent-skills/best-practices

## 重设 Ctrl + G 打开编辑器

设置全局环境变量 `EDITOR` 即可。

```bash
$env:EDITOR = "cursor --disable-extensions --wait";
```

- 参数 `--wait` ： 告诉命令行工具等待编辑器关闭后再继续执行。
- 参数 `--disable-extensions` ： 以`纯净模式`（不加载任何插件、不恢复之前的窗口、以最轻量化的方式运行）启动编辑器。
