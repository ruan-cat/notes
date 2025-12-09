# 11 智慧社区

目前（2025-5-3）还不知道确切的项目代号。

本次项目代号为`11智慧社区项目`。

## 项目周期

2025 年 5 月 10 日 - 2025 年 6 月 10 日

## 技术选型

### 面向业务的二次封装组件库

- https://github.com/plus-pro-components/plus-pro-components

### 项目模板 vue-pure-admin

- 仓库： https://github.com/pure-admin/vue-pure-admin
- 在线地址： https://pure-admin.github.io/vue-pure-admin/
- 教程文档： https://pure-admin.cn/

## 命令式弹框

## 普通业务表单

## 接口请求

## table 表格

## icon 图标

## 自动化路由

## layout 布局

## 其他答疑

### 应该用那个包管理器安装依赖

::: tip 问题

云效的 11community 项目，阿伟学长演示安装依赖用的 npm i 。我们安装依赖应该用 npm i 还是 pnpm i 呢？

:::

根据 package.json 的 packageManager 字段来决定当前 node 项目使用哪款包管理器。

在阿伟学长给出的基础入门模板内，没有给定任何 packageManager 字段，故该项目不会约束你使用的包管理器，你可以使用任意的管理器。比如 cnpm、yarn、ni、bun。这里阿伟学长用的是通用的 npm

::: details

![2025-05-14-15-20-31](https://s2.loli.net/2025/05/14/oylt7zV4FuMHe5C.png)

:::

在组长给出的参考性质的 10wms 项目内，给出了明确 packageManager 字段。

::: details

![2025-05-14-15-21-03](https://s2.loli.net/2025/05/14/QkusVlozKIXem8p.png)

:::

但是.npmrc 没有配置任何严格引擎控制，所以该项目提供的是软性的包管理器约束，不是强制约束。

`corepack enable && corepack install`，会自动为你安装指定版本 pnpm。

::: details

![2025-05-14-15-21-35](https://s2.loli.net/2025/05/14/3auFXG7PHwdTqjl.png)

:::

这里事实上是给出了比较宽松约束的条件，项目确实能为你安装并启用 pnpm，但是没有强迫你一定要用 pnpm。你仍旧可以犯病，故意使用其他的管理器。

宽松约束的目的是为了满足特定情况下只能使用 npm 运行项目的场景。比如在 win10 家庭版中，使用 pnpm 安装的依赖会出现文件名过长识别失败，且无法配置注册表。这种情况下就只能回退到 npm。

- 阿伟学长给出的项目*没有任何约束*。
- 组长给出的参考项目有*软性约束*。

### 如何学习了解新的依赖包

遇到全新的依赖包时，按照这样的方式自主探究：

1. 以 npm-run-all2 举例说明：运行命令 `npm v npm-run-all2` 。在当前上下文提供的镜像源内，查询包的信息。

::: details

![2025-05-14-15-23-12](https://s2.loli.net/2025/05/14/2ozO1VHDx6nZAI3.png)

:::

2. 自己打开包信息提供的链接，这里我们打开它提供的[github 仓库地址](https://github.com/bcomnes/npm-run-all2)。

3. 在浏览器翻译插件的帮助下，自己阅读。

::: details

![2025-05-14-15-23-32](https://s2.loli.net/2025/05/14/LCUEse7HnQFWDPq.png)

:::
