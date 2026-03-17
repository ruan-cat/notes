---
juejin: https://juejin.cn/post/7617269065950740516
desc: 解析用 tsx 执行 NPM 脚本报 ERR_MODULE_NOT_FOUND 的原因：CLI 认路径而非模块名。本文揭示标准 bin 字段与包装脚本两套解法，带你跳出加载陷阱。

title: "避坑指南：为什么 tsx 执行 NPM 包导出的脚本会报错 ERR_MODULE_NOT_FOUND？"
date: 2026-03-16
categories: ["TypeScript", "Node.js", "CLI工具", "避坑指南"]
tags: ["tsx", "模块解析", "Node.js", "monorepo"]
---

# 避坑指南：为什么 tsx 执行 NPM 包导出的脚本会报错 ERR_MODULE_NOT_FOUND？

> **摘要**：
>
> 解析用 `tsx` 执行 `NPM` 脚本报 `ERR_MODULE_NOT_FOUND` 的原因：CLI 认路径而非模块名。本文揭示标准 `bin` 字段与包装脚本两套解法，带你跳出加载陷阱。

> **AI 协助编写的博客文章**：
>
> 这篇文章有参与 AI 协助的。使用了 AI 润色文章。

在日常开发中，[`tsx`](https://github.com/privatenumber/tsx) 已经成为了我们运行和测试 TypeScript 脚本的首选工具。它几乎零配置，并且完美支持原生 ESM。但是，当你试图用 `tsx` 去直接运行一个通过 NPM 安装的包里面暴露出来的脚本代码时，你可能会结结实实地踩进一个“模块解析”的陷阱。

今天我们就通过一个我在重构 Monorepo CI/CD 流程时遇到的真实案例，来聊聊这个常见的误区。

## 场景重现：看起来完美的设计

为了解决 Vercel 在 Pnpm workspace 下由于构建输出路径所产生的问题，我在共用工具包 `@ruan-cat/utils` 里编写了一个自动化搬运脚本。

在包作者（也就是我）的心智模型里，我在 `@ruan-cat/utils` 的 `package.json` 中的 `exports` 字段做了一个堪称“教科书般完美”的导出配置：

```json
{
	"name": "@ruan-cat/utils",
	"exports": {
		"./move-vercel-output-to-root": "./src/node-esm/scripts/move-vercel-output-to-root/index.ts"
	}
}
```

按照 ESM 的工作原理，使用者在代码库的任意地方通过 `import ... from "@ruan-cat/utils/move-vercel-output-to-root"` 都可以完美地加载到对应的 TypeScript 文件。

既然如此，我理所当然地在子应用 `apps/admin/package.json` 的 npm scripts 中这样写，期望它一步到位：

```json
{
	"scripts": {
		"build:vercel": "nuxi build --preset vercel && tsx @ruan-cat/utils/move-vercel-output-to-root --dry-run"
	}
}
```

## 💥 意外的爆炸：ERR_MODULE_NOT_FOUND

运行 `pnpm run build:vercel` 后，终端直接抛出了一长串报错：

```bash
> tsx @ruan-cat/utils/move-vercel-output-to-root

Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'D:\code\monorepo\apps\admin\@ruan-cat\utils\move-vercel-output-to-root' imported from D:\code\monorepo\apps\admin\
    at resolve (node:internal/modules/esm/resolve:860:10)
    ...
```

等等…… 仔细看这个报错的物理路径：
`D:\code\monorepo\apps\admin\@ruan-cat\utils\...`

为什么它去 `apps/admin` 的当前工作目录下找这个文件，而不是去 `node_modules` 里面找这个 NPM 包？我们的包名导出难道失效了？

## 剖析误区：文件路径 vs 模块描述符

这就是大家最容易混淆的误区：**CLI 的参数解析逻辑，与代码中的模块解析逻辑是两码事。**

不管是 `tsx`、`ts-node`，还是 Node.js 原生的 `node` 命令，它们接收的第一个运行参数，**永远被当作基于进程当前工作目录 (CWD) 的相对或绝对文件路径 (File Path)**，而不是**包标识符 (Package Specifier)**。

换句话说：

- 当你在 JS/TS 代码里写 `import '@ruan-cat/utils/...'` 时，Node 的 [模块解析算法（Module Resolution）](https://nodejs.org/api/esm.html#resolution-algorithm-specification) 启动了。它会去检查 `node_modules`，读取 `package.json` 的 `exports` 字段，找到真正的物理路径加载执行。
- 当你在终端敲下 `tsx @ruan-cat/utils/move-vercel-output-to-root` 时，`tsx` 只是一个冰冷的搬运工。它想：“哦，主人让我执行当前目录下一个叫做 `@ruan-cat/utils/move-vercel-output-to-root` 的文件或目录呢。”

由于我们的当前目录是 `apps/admin`，它强行把包名拼接成了物理路径去探测，自然落得个 `ERR_MODULE_NOT_FOUND` 的下场。

## 破局：规范的做法是什么？

如果不能像上面那样想当然地运行，我们该如何优雅地让消费方（应用侧）跑出这串脚本呢？这里介绍上中下三种解法：

### 🌟 上策：提供标准的 `bin` 字段（库作者最佳实践）

如果你是库作者，希望别人能在命令行里通过短小的命令执行你的脚本工具，**唯一标准的做法是暴露 `bin` 字段**。

在 `@ruan-cat/utils/package.json` 中配置：

```json
{
	"name": "@ruan-cat/utils",
	"bin": {
		"move-vercel-output-to-root": "./dist/node-esm/scripts/move-vercel-output-to-root/index.js"
	}
}
```

这样封装后，安装了你包的使用者直接就可以通过包管理器挂载的 `.bin` 来执行它：
`npx move-vercel-output-to-root --dry-run`
不仅干净利落，而且这是 Node 社区内完全符合规范的标准做法。

### 🛡️ 中策：编写 Wrapper 中间脚本

受限于各种历史原因（比如库还没有更新打包支持 CLI，或者脚本依旧是 TS 写的未经过编译），如果你一定要在使用者一侧去执行这个 TS 模块咋办？

创建一个专门的 Runner / Wrapper 文件，把它从“CLI 参数”变成真正的“模块引入”。

新建 `apps/admin/scripts/move-vercel-output-to-root.ts`:

```typescript
// 这里的 import 会触发正规的 npm 包模块解析啦！
import { runMoveVercelOutputToRootCli } from "@ruan-cat/utils/move-vercel-output-to-root";

runMoveVercelOutputToRootCli();
```

然后在你的 package.json 里去调用这个相对文件路径：

```json
{
	"scripts": {
		"move-vercel-output-to-root": "tsx ./scripts/move-vercel-output-to-root.ts --dry-run"
	}
}
```

这样做完美把运行权移交给了模块内部机制，代码也非常易读维护。

### ❌ 下策：生写丑陋晦涩的底层指令

你其实可以通过 Node 最新的模块装载器强行要求它当做包名来解释。即：在 Node 后面显式地注册 tsx loader，然后再用 `-e` （eval 代码块） 去作为模块 import：

```bash
node --import tsx/esm -e "import('@ruan-cat/utils/move-vercel-output-to-root')" -- --dry-run
```

这种写法虽然功能上能够成功跑通 ESM 和包寻址，但它简直像是在写底层 API，不仅难以阅读，更不利于新人理解。如果在 `package.json` 中塞满这种脚本，整个团队的开发者体验都会下降，故为下策。

## 总结思考

当我们沉浸于模块化时代各种工具链带来的便捷时，偶尔会忘了“命令行参数”和“模块解析器”中间隔着的那层厚厚的壁垒：

1. **指令的参数，通常是硬盘上找得到的文件系统路径（File Path）。**
2. **`import` 语句，才是触发 `node_modules` 中 `package.json -> exports` 的金钥匙。**

下次再设计前端自动化脚本或者是脚手架命令时，请一定牢记这层心智模型的差异，去正确拥抱 `bin` 或 wrapper 吧！
