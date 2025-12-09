# task-master-ai

- 仓库： https://github.com/eyaltoledano/claude-task-master
- 文档： https://www.task-master.dev/
- 快速开始： https://docs.task-master.dev/getting-started/quick-start/quick-start
- [`Claude Code效率神器：claude-task-master让AI任务管理变得如此简单`](https://www.wangyiyang.cc/2025/07/08/claude-task-master-efficiency-guide/#-claude-code集成配置零配置的魅力)

据说是一个 mcp，能完成 AI 的任务调度。但是看了官网文档，发现这个包既可以作为 mcp 工具，又可以作为 cli 命令行工具。

## 只考虑在 claude code 场景下使用

由于该工具需要使用其他 AI 厂商的 key，但是对于 claude code 是无缝衔接的，所以本工具的使用在考虑 claude code 场景下使用。

- claude code 快速安装： https://github.com/eyaltoledano/claude-task-master/blob/main/README.md#claude-code-quick-install

官方命令：

```bash
claude mcp add taskmaster-ai -- npx -y task-master-ai
```

我这里将 `task-master-ai` 包作为 node 全局依赖：

```bash
pnpm i -g task-master-ai
```

在项目内安装，结合参考资料，这里我的安装命令为：

```bash
claude mcp add taskmaster-ai -- task-master-ai --scope project
```

## TODO: 未来再继续跟进学习

task-master-ai 太复杂了，任务调度机制很多，很杂乱。以后再考虑，至少现在知道这个工具可以无缝衔接 claude code 了。
