# 5-11 统一用户名、全局环境准备、安装开发软件

## 阅读群公告

请大家阅读本群的群公告。花时间去充分地阅读我给大家准备的文档。

## 明确自己统一的用户名

我们的用户名在多个平台内都要使用的。必须统一清楚用户名：

1. QQ 群昵称
2. 云效账号名称
3. git 提交的用户名
4. apifox 的用户名
5. 腾讯会议的用户名
6. 腾讯文档内写的名称

::: warning 下一次会议必须设置好自己的会议用户名

在下一次会议内，每一个人设置好自己的名称。确保名称统一。

下一次加入会议时，可以直接选择已经进入的会议，

![2025-05-11-23-46-49](https://s2.loli.net/2025/05/11/xnVKeHuLq2Zhdtk.png)

在这里设置你的用户名，务必设置统一。

![2025-05-11-23-47-39](https://s2.loli.net/2025/05/11/NtdmnZzW3Oyge84.png)

:::

## 阅读项目原型

大概地用一遍这个系统。了解清楚这个智慧社区系统是做什么的？用来解决什么问题的。

## 做好环境准备

### node

- https://notes.ruan-cat.com/nvm-desktop/

推荐大家安装 NVM Desktop 软件，确保自己能够随时切换 node 环境。在本项目中，可能会遇到被迫降低 node 版本的情况。大家可以看情况选择合适的 node 版本切换工具。

### pnpm

- https://pnpm.io/zh/

1. 安装 pnpm。
2. 必须掌握并学会 pnpm 在 monorepo 架构下的使用。学会如何安装依赖，如何给指定的包安装依赖。

### pnpm 管控下的全局依赖

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

### 网络环境

- [Watt Toolkit](https://steampp.net/)
- 确保自己能够翻墙，能够正常访问 github，能够正常的安装来自 npm 官方镜像源的 node 依赖。

::: tip

这里推荐使用[大机场](https://bigairport-mirror.com/)提供的节点来翻墙。

:::

### vscode

在下一次会议补充说明。

### AI 编程工具

在下一次会议补充说明。

## 调整心态

带着上班的心态来完成项目，而不是小组作业。

最终目的是做出一个能够写在简历上面的好项目，而不是太潦草的项目。

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

## 个人介绍环节

每个人现场编辑好群公告提供的[小组信息总表](https://docs.qq.com/sheet/DTURndGZLenZzV05h)。并介绍以下信息：

1. 自己的学历。在校或就业情况。
2. 自己的 github 开源项目。
3. 介绍自己学习前端的进度。
4. 介绍自己为什么要参加大项目，期望在大项目内学到什么内容。
5. 说明自己能够在这个项目内投入多少时间，能吃多少苦。
