# 初始化你的开发环境

安装必要的环境和软件。

## 前端项目技术栈介绍

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

## node 与 nvm-desktop

- https://notes.ruan-cat.com/nvm-desktop/

推荐大家安装 NVM Desktop 软件，确保自己能够随时切换 node 环境。在本项目中，可能会遇到被迫降低 node 版本的情况。大家可以看情况选择合适的 node 版本切换工具。

我们的 node 环境版本范围在 `20.15.0` 以上。但是我要求安装 `node22.14.0` 以上。

你并不需要辛苦地去找指定版本的 node 环境去安装，我们有高效率的安装方案。我们推荐你使用 [nvm-desktop](https://github.com/1111mp/nvm-desktop) 来安装、切换、管理你的全部 node 环境。

点击 [releases](https://github.com/1111mp/nvm-desktop/releases)，看情况下载好本工具。

nvm-desktop 看起来应该是这样的：

::: details nvm-desktop

![2025-02-26-16-20-57](https://gh-img-store.ruan-cat.com/01s-docs/10wms/2025-02-26-16-20-57.png)

:::

### 配置 nvm-desktop 的镜像地址

你应该配置成淘宝源，否则你下载 node 环境的速度会非常慢，配置过程请看以下动图：

::: details 配置镜像源

![2025-02-26-16-22-45](https://gh-img-store.ruan-cat.com/01s-docs/10wms/2025-02-26-16-22-45.gif)

:::

### 安装并启用 node 环境

如图所示：

::: details 启用 node 环境

![2025-02-26-16-27-16](https://gh-img-store.ruan-cat.com/01s-docs/10wms/2025-02-26-16-27-16.png)

:::

### 校验 node 是否安装成功

在控制台输入以下命令，显示出对应的 node 版本号，就说明已经安装好对应的 node 环境了。

```bash
node -v
```

::: details 输出 node 版本号

![2025-02-26-16-29-03](https://gh-img-store.ruan-cat.com/01s-docs/10wms/2025-02-26-16-29-03.png)

:::

## 配置 npm 镜像源

接下来我们需要设置镜像源。否则我们安装依赖时容易出错。

```bash
npm config set registry https://registry.npmmirror.com/
npm config set COREPACK_NPM_REGISTRY https://registry.npmmirror.com/
```

::: tip 为 npx 准备全局镜像源

我们项目会运行 `npx only-allow pnpm` 命令，该命令会安装一次性的 `only-allow` 包，如果没有安装，那么项目就会出现卡死，类似于下面这样：

![2025-05-14-21-30-12](https://gh-img-store.ruan-cat.com/01s-docs/10wms/2025-05-14-21-30-12.png)

项目会长期无反应。

:::

::: tip 为 corepack 准备镜像源

具体细节可以阅读[该笔记](https://notes.ruan-cat.com/corepack/#全局配置)。

:::

## pnpm

- https://pnpm.io/zh/

1. 安装 pnpm。
2. 必须掌握并学会 pnpm 在 monorepo 架构下的使用。学会如何安装依赖，如何给指定的包安装依赖。

## pnpm 管控下的全局依赖

- commitizen 代码提交约束规范
- cz-git 代码提交约束工具
- rimraf 删除工具库
- turbo monorepo 包构建缓存库
- vercel 部署平台工具包
- degit 克隆工具

- memorix AI 记忆 MCP 工具包
- @fission-ai/openspec AI 工作流
- skills AI 技能安装工具

::: tip 全局安装命令

你必须用以下命令来完成 pnpm 安装全局依赖：

```bash
pnpm i -g commitizen cz-git rimraf turbo vercel degit
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

### 赋予 vscode 管理员运行权限

我们要在 vscode 的终端内运行 node 命令，大多数操作都需要管理员权限，请阅读以下文章，按要求设置你的 vscode。

- https://blog.csdn.net/moqidian/article/details/137554066

### 将 vscode 设置成中文

当你第一次使用 vscode 时，他是纯英文的。请按照以下教程完成中文设置。

- https://zhuanlan.zhihu.com/p/263036716

### 为项目准备好必要的 vscode 插件

你并不需要专门去下载这些插件，我们前端组已经为你准备好了一份项目启动所需要的 vscode 插件清单。

你也并不需要逐个安装，在你第一次用 vscode 打开项目时，你的右下角会弹出弹框，提示你是否要批量安装本项目推荐的插件，你点击是即可。

### 手动批量安装项目推荐插件

假设你不小心错过了这个弹框，你仍旧有办法批量安装插件。

如下图所示：

1. 点击拓展。
2. 输入命令 `@recommended` 。

你逐个点击安装并启用即可。

::: details 本项目推荐的插件

![2025-02-26-16-07-27](https://gh-img-store.ruan-cat.com/01s-docs/10wms/2025-02-26-16-07-27.png)

:::

### 调出 vscode 的 npm 脚本菜单栏

我们推荐你点击命令，而不是去输入命令。vscode 已经为我们集成好可视化的，可点击的 npm 命令栏了。

::: details 显示出 npm 脚本栏

![2025-02-26-16-42-59](https://gh-img-store.ruan-cat.com/01s-docs/10wms/2025-02-26-16-42-59.png)

:::

你应该要看到该页面：

::: details 本项目的 npm 命令

![2025-02-26-16-45-02](https://gh-img-store.ruan-cat.com/01s-docs/10wms/2025-02-26-16-45-02.png)

:::

### 学会 vscode 常用的命令

调用命令的快捷键： `Ctrl+Shift+P`

1. **重启 vscode**： `reloadwindow`
2. **打开个人用户全局配置**： `openusersetjson`

### 学习 vscode 插件`git graph`

插件 id： `mhutchie.git-graph`

学会使用合适的 git 历史记录查看工具，查看当前项目的提交记录。

## AI 编程 IDE

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
