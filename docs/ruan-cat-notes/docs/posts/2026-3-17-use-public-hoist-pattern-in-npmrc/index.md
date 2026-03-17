---
juejin: https://juejin.cn/post/7618068222886477878
desc: 通过 .npmrc 的 public-hoist-pattern 配置，解决 pnpm 严格隔离导致的幽灵依赖缺失和 IDE 插件模块解析失败两类典型问题。
title: "pnpm 踩坑实录：用 public-hoist-pattern 拯救被严格隔离坑掉的依赖"
date: 2026-03-17
categories: ["pnpm", "Node.js", "工程化", "避坑指南"]
tags: ["pnpm", "public-hoist-pattern", ".npmrc", "prettier", "element-plus"]
---

# pnpm 踩坑实录：用 public-hoist-pattern 拯救被严格隔离坑掉的依赖

> **摘要**：
>
> pnpm 的严格 `node_modules` 隔离机制是一把双刃剑——它杜绝了幽灵依赖，却也会让那些"偷偷摸摸"引用未声明依赖的第三方包当场翻车。
> 本文记录了两个真实案例：Element Plus 隐式依赖 `@vue/shared` 导致运行时报错，以及 VS Code/Cursor 的 Prettier 扩展无法解析 pnpm 虚拟存储中的插件模块。
> 最终通过 `.npmrc` 的 `public-hoist-pattern` 配置精准提升指定包，在不破坏隔离性的前提下优雅解决了问题。

> **AI 协助编写的博客文章**：
>
> 这篇文章有参与 AI 协助的。使用了 AI 润色文章。

## 1. 前言：pnpm 的严格隔离是把双刃剑

如果你正在使用 [pnpm](https://pnpm.io/) 管理项目依赖，你一定对它引以为傲的**严格 `node_modules` 结构**不陌生。

与 npm/yarn 将所有依赖"平铺"到 `node_modules` 根目录不同，pnpm 使用 **内容寻址存储 + 符号链接** 构建出一棵隔离性极强的依赖树。你在 `package.json` 里声明了什么，`node_modules` 里就只能看到什么——那些没有被你显式声明的包，即使被你的某个依赖间接安装了，你也**访问不到**。

这本是件好事。它从根源上杜绝了臭名昭著的 **"幽灵依赖"（Phantom Dependencies）** 问题，让你的依赖关系更加清晰、可控。

但现实世界中，总有一些不那么"规矩"的第三方包，以及一些有着独立模块解析上下文的 IDE 扩展，会在这种严格隔离机制面前狠狠地栽跟头。

接下来，我就通过两个我亲身踩到的坑，介绍如何通过 `public-hoist-pattern` 精准修复这类问题。

## 2. 案例一：Element Plus 隐式依赖 @vue/shared

### 2.1. 问题现象

在一个使用 pnpm workspace 的 Monorepo 项目中，安装了 `element-plus` 作为 UI 组件库。项目在开发和构建时突然报出类似以下的错误：

```log
Error: Cannot find module '@vue/shared'
```

### 2.2. 原因分析

翻开 `element-plus` 的源码就会发现，它在内部直接 `import` 了 `@vue/shared` 这个包：

```typescript
import { isObject } from "@vue/shared";
```

但问题在于，`element-plus` 的 `package.json` 的 `dependencies` 中**并没有显式声明** `@vue/shared` 这个依赖。它之所以能正常工作，完全依赖于一个"潜规则"：`vue` 包自身依赖了 `@vue/shared`，而在 npm/yarn 的扁平化 `node_modules` 结构下，`@vue/shared` 会被提升到顶层，任何包都能无差别地访问到它。

这就是一个典型的**幽灵依赖**问题。在 pnpm 的严格隔离下，`element-plus` 无法穿透自己的 `node_modules` 边界去访问 `@vue/shared`，于是直接报错。

### 2.3. 解决方案

在项目根目录的 `.npmrc` 中，添加如下配置：

```ini
public-hoist-pattern[]=@vue/*
```

这行配置告诉 pnpm：**将所有匹配 `@vue/*` 模式的包，公开提升到根 `node_modules/` 目录下**。这样 `element-plus` 就能在标准的模块解析路径中找到 `@vue/shared` 了。

## 3. 案例二：VS Code/Cursor 的 Prettier 扩展无法识别插件

### 3.1. 问题现象

项目中配置了 `prettier`，并且按照 [`@prettier/plugin-oxc`](https://github.com/prettier/prettier/tree/main/packages/plugin-oxc) 和 [`prettier-plugin-lint-md`](https://github.com/nicolo-ribaudo/prettier-plugin-lint-md) 的官方文档完成了插件集成。

`prettier.config.mjs` 的写法完全遵循官方示例：

```js
import * as prettierPluginOxc from "@prettier/plugin-oxc";

/** @type {import("prettier").Config} */
const config = {
	plugins: ["prettier-plugin-lint-md"],
	overrides: [
		{
			files: "**/*.{js,mjs,cjs,jsx}",
			parser: "oxc",
			plugins: [prettierPluginOxc],
		},
		{
			files: "**/*.{ts,mts,cts,tsx}",
			parser: "oxc-ts",
			plugins: [prettierPluginOxc],
		},
	],
};

export default config;
```

在终端中通过 `pnpm prettier --write .` 运行 CLI 格式化，一切正常。

但是，在 VS Code/Cursor 中按下 `Ctrl+S` 触发保存格式化时，Prettier 扩展的输出面板却飙出了刺眼的红色错误：

```log
["ERROR" - 18:38:36] Invalid prettier configuration file detected. See log for details.
["ERROR" - 18:38:36] Cannot find package '@prettier/plugin-oxc' imported from d:\code\...\prettier.config.mjs
Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@prettier/plugin-oxc' imported from d:\code\...\prettier.config.mjs
```

### 3.2. 原因分析

这是一个非常隐蔽的问题。同一套配置，**CLI 能跑，IDE 不能跑**，根源在于**两者的模块解析上下文完全不同**：

|              |                      CLI（`pnpm prettier`）                       |                       IDE 扩展（`esbenp.prettier-vscode`）                        |
| :----------: | :---------------------------------------------------------------: | :-------------------------------------------------------------------------------: |
| Node.js 进程 |             由 pnpm 启动，自动注入正确的模块解析路径              |                   扩展自带的 Node.js 运行时，独立于项目包管理器                   |
| 模块解析能力 | 可以穿透 `.pnpm` 虚拟存储，正确找到 `@prettier/plugin-oxc` 等依赖 | 只能从标准的 `node_modules/` 目录中查找，**无法穿透 pnpm 的虚拟存储符号链接结构** |

当 VS Code 的 Prettier 扩展尝试加载 `prettier.config.mjs` 时，文件头部的 `import * as prettierPluginOxc from "@prettier/plugin-oxc"` 会立即触发 Node.js 的模块解析。由于 pnpm 没有将 `@prettier/plugin-oxc` 提升到根 `node_modules/`，扩展的 Node.js 进程自然找不到这个包，配置文件在加载阶段就直接失败了。

用一句话总结：**IDE 扩展不走 pnpm 的模块解析通道，它只认标准的 `node_modules` 层级结构。**

### 3.3. 解决方案

同样，在 `.npmrc` 中添加 prettier 相关包的提升规则：

```ini
public-hoist-pattern[]=prettier
public-hoist-pattern[]=prettier-plugin-*
public-hoist-pattern[]=@prettier/*
```

添加后执行 `pnpm install` 重新链接依赖，再重启 IDE（或执行 `Developer: Reload Window`），VS Code/Cursor 的 Prettier 扩展就能正常加载配置和插件了。

## 4. 理解 public-hoist-pattern

### 4.1. 它是什么？

[`public-hoist-pattern`](https://pnpm.io/zh/npmrc#public-hoist-pattern) 是 pnpm 提供的一个 `.npmrc` 配置项。它允许你指定一组 glob 模式，匹配到的包会被**符号链接到根 `node_modules/` 目录**，使它们对所有项目代码和外部工具（如 IDE 扩展）可见。

### 4.2. 与 shamefully-hoist 的区别

你可能见过另一个配置：`shamefully-hoist=true`。它的效果是把**所有**依赖都提升到根 `node_modules/`，等同于回退到 npm/yarn 的扁平化结构。这虽然简单粗暴地解决了问题，但也彻底放弃了 pnpm 严格隔离带来的好处。

而 `public-hoist-pattern` 是一把手术刀——**只提升你明确指定的包**，其余包依然保持严格隔离。这样既修复了兼容性问题，又最大限度地保留了 pnpm 的隔离优势。

### 4.3. 完整配置示例

以下是本文两个案例最终的 `.npmrc` 相关配置：

```ini
# 公开提升 @vue/* 包到根 node_modules，解决 element-plus 直接引用
# @vue/shared 但其 package.json 未声明该依赖的 pnpm 严格隔离问题
public-hoist-pattern[]=@vue/*

# 公开提升 prettier 及其插件到根 node_modules，解决 VS Code/Cursor
# 的 Prettier 扩展无法从 pnpm 虚拟存储解析插件模块的问题
public-hoist-pattern[]=prettier
public-hoist-pattern[]=prettier-plugin-*
public-hoist-pattern[]=@prettier/*
```

> **注意**：修改 `.npmrc` 的 `public-hoist-pattern` 后，必须重新执行 `pnpm install`，pnpm 才会按照新规则重新组织 `node_modules` 的结构。

## 5. 总结

pnpm 的严格隔离机制是现代前端工程化的一大进步，但在实际项目中，你难免会遇到以下两类"不兼容选手"：

1. **未正确声明依赖的第三方包**（如 Element Plus 隐式依赖 `@vue/shared`）
2. **使用独立 Node.js 进程的 IDE 扩展**（如 VS Code Prettier 扩展无法穿透 pnpm 虚拟存储）

面对这些问题，`public-hoist-pattern` 就是你的精准修复工具。它不会像 `shamefully-hoist` 那样"一刀切"地破坏隔离性，而是让你**按需提升、精准打击**，在兼容性和隔离性之间取得最佳平衡。

下次再遇到 pnpm 项目里某个依赖莫名其妙地 `Cannot find module`，不妨先检查一下——它是不是又被"严格隔离"误伤了？
