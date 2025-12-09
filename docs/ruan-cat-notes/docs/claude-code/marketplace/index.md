# 制作自己的 claude code 插件

## 安装命令

```bash
/plugin marketplace add 你的用户名/仓库名
```

## 删减掉过时冗余的插件

我启动项目都会出现这样的报错：

<<< ./use-close-window-port@ruan-cat-tools-error.log

问 AI，回答如下图所示：

![2025-11-01-22-25-58](https://gh-img-store.ruan-cat.com/img/2025-11-01-22-25-58.png)

所以我不应该存在 `close-window-port@ruan-cat-tools` 这个 claude code 插件，可是每次都会加载这个插件，显示报错。

### 检查全局配置

去 `C:\Users\pc\.claude\settings.json` 内检查自己的全局 `.claude\settings.json` 配置，发现存在这个过时的配置，所以导致每次启动都会加载不存在的插件。手动删除即可。

![2025-11-01-22-29-00](https://gh-img-store.ruan-cat.com/img/2025-11-01-22-29-00.png)

## 参考资料

### 官方文档

- https://www.anthropic.com/news/claude-code-plugins
- [插件市场](https://docs.claude.com/zh-CN/docs/claude-code/plugin-marketplaces)
- [插件](https://docs.claude.com/zh-CN/docs/claude-code/plugins)

### 插件结构参考仓库

- https://github.com/ananddtyagi/claude-code-marketplace
- https://github.com/wshobson/agents

### 博客

- https://juejin.cn/post/7559818022971097129
- https://www.aivi.fyi/llms/introduce-Claude-Code-Plugins

## 已做好的 claude code 插件

```bash
/plugin marketplace add ruan-cat/monorepo
```
