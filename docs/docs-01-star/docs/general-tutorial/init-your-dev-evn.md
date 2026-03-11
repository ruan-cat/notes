# 初始化你的开发环境

安装必要的环境和软件。

## 项目技术栈介绍

提前学习对应的框架。核心的技术栈如下：

- typescript
- vue 组合式 api
- axios
- vueuse
- pnpm
- monorepo
- element-plus
- vitest
- vitepress

## node

- https://notes.ruan-cat.com/nvm-desktop/

推荐大家安装 NVM Desktop 软件，确保自己能够随时切换 node 环境。在本项目中，可能会遇到被迫降低 node 版本的情况。大家可以看情况选择合适的 node 版本切换工具。

## pnpm

- https://pnpm.io/zh/

1. 安装 pnpm。
2. 必须掌握并学会 pnpm 在 monorepo 架构下的使用。学会如何安装依赖，如何给指定的包安装依赖。

## pnpm 管控下的全局依赖

- commitizen
- cz-git
- rimraf
- turbo
- vercel
- degit

::: tip 全局安装命令

你必须用以下命令来完成 pnpm 安装全局依赖：

```bash
pnpm i -g commitizen
```

:::

## 网络环境

- [Watt Toolkit](https://steampp.net/)
- 确保自己能够翻墙，能够正常访问 github，能够正常的安装来自 npm 官方镜像源的 node 依赖。

::: tip

这里推荐使用[大机场](https://bigairport-mirror.com/)提供的节点来翻墙。

:::

## vscode

安装最新版本的 vscode，并确保自己的 vscode 处于管理员权限。

本次项目不要求使用 WebStorm。你可以酌情使用 webstorm。

## AI 编程工具

安装 Cursor / Trae / Windsurf 任意一款。务必保证手上有一款基于 vscode 的 AI 编程 IDE。

未来我们将配置目前最火热的 mcp 服务，利用 mcp 服务加速编程开发。

安装[Trae](https://notes.ruan-cat.com/trae/)务必安装国外版本。

## Apifox

[apifox](https://apifox.com/)，接口请求工具。未来接口联调、mock 数据请求的核心工具。

::: tip

注册 apifox 账户时，务必统一自己的用户名。

:::

## 亿图脑图 MindMaster

[亿图脑图 MindMaster](https://www.edrawsoft.cn/mind/ad/mindmapv12.html)，是打开 `*.emmx` 文件的工具，未来阅读 **版本计划.emmx** 文件时，就使用该软件。
