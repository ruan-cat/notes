---
juejin: https://juejin.cn/post/7621911333945425947
desc: 手把手讲解simple-git-hooks、lint-staged、commitlint三件套的配置方法，渐进式理解每个工具用途与注意事项，帮助团队自动格式化代码并规范提交信息。
title: "前端工程化工具链从零配置：simple-git-hooks + lint-staged + commitlint"
date: 2026-03-29
categories: ["工程化", "Git", "工具链"]
tags: ["simple-git-hooks", "lint-staged", "commitlint", "git hooks", "前端工程化"]
---

# 前端工程化工具链从零配置：simple-git-hooks + lint-staged + commitlint

> **摘要**：
>
> 前端工程化涉及方方面面的配置，其中 Git 钩子工具链是团队协作的基础设施。本文聚焦三个核心工具：[simple-git-hooks](https://github.com/toplenboren/simple-git-hooks) 负责管理 Git 钩子，[lint-staged](https://github.com/lint-staged/lint-staged) 负责对暂存区文件执行格式化，[commitlint](https://github.com/conventional-changelog/commitlint) 负责校验提交信息的规范性。文章按照安装顺序逐步讲解，帮助你渐进式地理解每个工具的用途和配置细节。

> **AI 协助编写的博客文章**：
>
> 这篇文章有参与 AI 协助的。使用了 AI 润色文章。

## 1. 为什么需要这套工具链

在团队项目中，代码风格不统一和提交信息混乱是两个最常见的痛点。

- 张三喜欢两空格缩进，李四坚持四空格，王五直接用 Tab，合并代码时一片混乱。
- 提交信息形如 `"fix"` `"改了一下"` `"aaa"` ，三个月后完全看不懂到底改了什么。

解决方案就是在 **提交代码这个时机** 上做拦截：提交前自动格式化文件，提交时校验 commit 信息。这套流程的三个主角分别是 simple-git-hooks、lint-staged 和 commitlint。

## 2. simple-git-hooks：管理 Git 钩子

### 2.1. 它是什么

[simple-git-hooks](https://github.com/toplenboren/simple-git-hooks) 是一个轻量的 Git 钩子管理库。Git 原生支持在特定操作节点执行自定义脚本（即 hooks），simple-git-hooks 的作用就是让你把这些钩子配置写在项目的配置文件里，随着 `pnpm install` 自动生成到 `.git/hooks/` 目录下。

常见的钩子使用场景：

- `commit-msg` 钩子：在提交信息写入前做格式校验。
- `pre-commit` 钩子：在代码提交前执行格式化或 lint 检查。

### 2.2. 安装

```bash
pnpm i -D simple-git-hooks
```

### 2.3. 配置钩子命令

按照官方文档的 [`Additional configuration options`](https://github.com/toplenboren/simple-git-hooks/blob/master/README.md#additional-configuration-options)，推荐使用独立配置文件 `simple-git-hooks.mjs`。

> **注意**：配置文件的后缀必须是 `.mjs`，不能是 `.js`。如果使用 `simple-git-hooks.js`，后续运行 `npx simple-git-hooks` 时会直接报错，导致钩子生成失败。

配置示例如下：

```js
/**
 * 每次修改该文件后务必执行一次 `npx simple-git-hooks` 命令
 * 否则这些钩子不会生效
 */
export default {
	/**
	 * @see https://juejin.cn/post/7381372081915166739#heading-8
	 * @see https://fabric.modyqyw.top/zh-Hans/guide/git/commitlint.html#整合-simple-git-hooks
	 */
	"commit-msg": "npx --no-install commitlint --edit ${1}",
	"pre-commit": "npx lint-staged",
};
```

这里配置了两个钩子：

- `pre-commit`：提交前触发 lint-staged，对暂存区文件做格式化。
- `commit-msg`：提交信息写入时触发 commitlint，校验信息格式。`--edit ${1}` 是必须的参数，用于指定提交信息文件路径。

### 2.4. 配置命令行：让钩子随安装自动生成

推荐在 `package.json` 的 `postinstall` 钩子里，自动运行 `simple-git-hooks` 命令：

```json
{
	"scripts": {
		"postinstall": "pnpm run init-git-hooks",
		"init-git-hooks": "simple-git-hooks"
	}
}
```

这样，每次执行 `pnpm install` 之后，`postinstall` 钩子会自动触发，把配置文件中定义的钩子写入本地的 `.git/hooks/` 目录。

用以下命令确认钩子已正确生成：

```bash
ls .git/hooks
```

正常情况下，你应该能看到 `pre-commit` 和 `commit-msg` 等文件被创建出来。

![钩子文件生成效果](https://gh-img-store.ruan-cat.com/img/2025-09-14-01-23-01.png)

### 2.5. 注意事项

**关于 github workflow**：在 CI 流水线里，`postinstall` 触发 `simple-git-hooks` 是能正常执行的，不会引发错误，可以放心使用。

**关于对外发包的项目**：如果你的 package 会发布到 npm，`postinstall` 脚本会在用户安装你的包时被触发，可能影响用户的本地环境。请阅读官方文档中的 [`Note for npm package developers`](https://github.com/toplenboren/simple-git-hooks/blob/master/README.md#note-for-npm-package-developers) 部分。如果你的项目不发包，跳过此部分即可。

### 2.6. 与 husky 的对比

最出名的 Git 钩子管理库是 [husky](https://github.com/typicode/husky)，功能更完善，社区资料也更多。simple-git-hooks 的优势在于配置更简单，适合不需要复杂钩子逻辑的项目。本文不对 husky 做详细说明，感兴趣可以查阅 [husky 官网](https://typicode.github.io/husky/zh/)。

## 3. lint-staged：只格式化暂存区的文件

### 3.1. 它是什么

[lint-staged](https://github.com/lint-staged/lint-staged) 是一个借助 glob 语法匹配 git 暂存区文件，并对这些文件执行指定命令的库。

**为什么不直接对全项目做格式化？** 因为时间成本太高了。一个积累了几年的项目，全量格式化一次可能需要几十秒甚至更久。如果每次 `git commit` 都触发全量格式化，就会在最频繁的操作上制造最大的卡顿——这是不可接受的。

lint-staged 的解法很优雅：**只处理这次提交涉及的文件**。你改了 5 个文件，它就只格式化这 5 个文件，秒级完成。

### 3.2. 安装

```bash
pnpm i -D lint-staged
```

### 3.3. 配置格式化规则

按照[官方文档](https://github.com/lint-staged/lint-staged/blob/main/README.md#configuration)的说明，在项目根目录新建 `lint-staged.config.js` 配置文件。推荐使用带有 TypeScript 类型注解的写法，以获得 IDE 智能提示：

```js
/**
 * @filename lint-staged.config.js
 * @description 用于配置 lint-staged 的配置文件。
 * @type {import('lint-staged').Configuration}
 * @see https://github.com/lint-staged/lint-staged/blob/main/README.md#typescript
 */
export default {
	/** @see https://github.com/lint-staged/lint-staged/blob/main/README.md#automatically-fix-code-style-with-prettier-for-any-format-prettier-supports */
	"*": "prettier --ignore-unknown --experimental-cli --write",
};
```

这里用 `"*"` 匹配所有暂存文件，对它们统一执行 [Prettier](https://prettier.io/) 格式化。`--ignore-unknown` 参数会让 Prettier 跳过它不认识的文件类型，避免报错。

将 lint-staged 接入 simple-git-hooks 的 `pre-commit` 钩子，就完成了整个"提交前自动格式化"的链路。

## 4. commitlint：规范化提交信息

### 4.1. 它是什么

[commitlint](https://github.com/conventional-changelog/commitlint) 是一个对 `git commit` 信息做格式校验的工具。配合 [Conventional Commits](https://www.conventionalcommits.org/) 规范使用，可以强制团队的提交信息遵循统一格式，例如：

```log
feat: 新增用户登录功能
fix: 修复 token 过期后页面白屏问题
docs: 更新 README 安装说明
```

### 4.2. 安装

```bash
pnpm i -D commitlint
```

同时还需要安装对应的规范包，例如官方提供的 `@commitlint/config-conventional`：

```bash
pnpm i -D @commitlint/config-conventional
```

或者使用社区封装的配置包，比如 [`@ruan-cat/commitlint-config`](https://www.npmjs.com/package/@ruan-cat/commitlint-config)。

### 4.3. 配置文件

在项目根目录新建 `commitlint.config.js`：

```js
/** @type {import('@commitlint/types').UserConfig} */
export default {
	extends: ["@commitlint/config-conventional"],
};
```

### 4.4. 与 simple-git-hooks 集成

在 `simple-git-hooks.mjs` 中配置 `commit-msg` 钩子时，**必须带上 `--edit ${1}` 参数**，否则 commitlint 无法读取到提交信息文件：

```js
export default {
	"commit-msg": "npx --no-install commitlint --edit ${1}",
};
```

`${1}` 是 Git 传递给 `commit-msg` 钩子的第一个参数，即包含提交信息的临时文件路径（通常是 `.git/COMMIT_EDITMSG`）。漏掉这个参数，commitlint 就拿不到数据，校验自然失效。

### 4.5. 参考资料

- [《约定式提交规范详解.simple-git-hooks》](https://juejin.cn/post/7381372081915166739#heading-8)
- [《commitlint 整合 simple-git-hooks》](https://fabric.modyqyw.top/zh-Hans/guide/git/commitlint.html#整合-simple-git-hooks)
- [《commitlint 快速入门》](https://juejin.cn/post/7068988460899500040)

## 5. 用 AI Skill 快速初始化：init-prettier-git-hooks

上面讲的这些配置步骤，每次新建项目都要手动做一遍，其实挺繁琐的。为此，笔者专门制作了一个叫做 [`init-prettier-git-hooks`](https://github.com/ruan-cat/monorepo/blob/main/ai-plugins/common-tools/skills/init-prettier-git-hooks/SKILL.md) 的 AI Skill，可以在支持 Agent Skills 的 AI 编程工具（如 Claude Code、Cursor 等）中，**一键完成整套工程化配置的初始化**。

### 5.1. 它能做什么

这个 Skill 不是简单地把配置文件模板复制进去，而是遵循**合并策略**——先侦察项目现状，再精确补全缺失项，保留你已有的项目特化配置。

一次完整的初始化会完成以下工作：

|        操作对象         |                     具体内容                      |
| :---------------------: | :-----------------------------------------------: |
|        依赖检查         |   逐一检查 6 个必需依赖是否已安装，只安装缺失的   |
|    `.gitattributes`     |      收敛全局文本规则为 `* text=auto eol=lf`      |
|     `.editorconfig`     |      确保 `[*]` 区块存在 `end_of_line = lf`       |
|  `prettier.config.mjs`  |    写入 Prettier 配置，强制 `endOfLine: "lf"`     |
| `lint-staged.config.js` |             生成 lint-staged 配置文件             |
| `simple-git-hooks.mjs`  |                 生成钩子配置文件                  |
|     `package.json`      |          新增 `format` 和 `prepare` 脚本          |
|     Git 行尾归一化      | 执行 `git add --renormalize .` 统一已追踪文件行尾 |

### 5.2. 为什么特别处理行尾（EOL）

这是这个 Skill 相比手动配置最有价值的地方之一。

在 Windows 环境下开发时，Git 默认会把文件的行尾换行符转换成 CRLF（`\r\n`），而 Linux/macOS 使用 LF（`\n`）。如果团队成员使用不同操作系统，或者 Prettier 的 `endOfLine` 配置不统一，就会出现**幽灵修改**——明明没有改任何代码，`git status` 却显示文件有变动，diff 里全是换行符的差异。

Skill 会把以下三个环节全部收敛到 LF：

- `.gitattributes`：控制 Git 存储和检出时的行尾策略
- `.editorconfig`：控制编辑器新建文件时的行尾策略
- `prettier.config.mjs`：控制 Prettier 格式化时写入的行尾

三者同时对齐，才能从根本上解决幽灵修改问题。

### 5.3. 涵盖的 6 个必需依赖

Skill 会自动检查并安装以下依赖：

|  #  |         依赖名称          |                说明                 |
| :-: | :-----------------------: | :---------------------------------: |
|  1  |        `prettier`         |         核心代码格式化工具          |
|  2  |  `@prettier/plugin-oxc`   |  使用 oxc 引擎解析 JS/TS，速度更快  |
|  3  | `prettier-plugin-lint-md` |       Markdown 文件格式化插件       |
|  4  |       `lint-staged`       | 只对 git 暂存区文件执行 lint/format |
|  5  |    `simple-git-hooks`     |      轻量级 git hooks 管理工具      |
|  6  |       `commitlint`        |        git 提交信息规范校验         |

### 5.4. 如何使用

在支持 Agent Skills 的 AI 工具中，直接告诉 AI：

> 帮我初始化 prettier git hooks，使用 init-prettier-git-hooks 技能

AI 会自动读取 Skill 文件，按照步骤检查依赖、创建配置文件、执行行尾归一化，最后输出一份自检清单，让你确认每一项都已正确完成。

Skill 的完整文档地址：[init-prettier-git-hooks/SKILL.md](https://github.com/ruan-cat/monorepo/blob/main/ai-plugins/common-tools/skills/init-prettier-git-hooks/SKILL.md)

## 6. 总结

把三个工具串联起来，完整的 Git 提交拦截链路如下：

|          时机           |   触发钩子   |        执行工具        |         作用         |
| :---------------------: | :----------: | :--------------------: | :------------------: |
|   `git commit` 提交前   | `pre-commit` | lint-staged + Prettier | 自动格式化暂存区文件 |
| `git commit` 信息写入时 | `commit-msg` |       commitlint       |   校验提交信息格式   |

这套工具链的配置成本很低，但收益却是长期的：**代码格式不再依赖人工约定，提交历史真正有意义可读**。对于多人协作的项目来说，这是性价比极高的基础设施投入。

最后有一点需要特别留意：**每次修改 `simple-git-hooks.mjs` 之后，必须手动重新运行 `npx simple-git-hooks`**，否则本地的 `.git/hooks/` 文件不会被更新，新的配置不会生效。如果你配置了 `postinstall`，也可以通过 `pnpm install` 来触发。
