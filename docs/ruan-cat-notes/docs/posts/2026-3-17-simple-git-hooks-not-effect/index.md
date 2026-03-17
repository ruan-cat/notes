---
juejin: https://juejin.cn/post/7618098747671543862
desc: simple-git-hooks在嵌套monorepo中把钩子装到假.git目录，导致lint-staged从未触发。排查思路与三步组合修复方案。
title: "simple-git-hooks 踩坑实录：钩子装对了却从没触发过，原来是 .git 目录捣的鬼"
date: 2026-03-17
categories: ["Git", "工程化", "避坑指南"]
tags: ["simple-git-hooks", "lint-staged", "commitlint", "monorepo", "git hooks"]
---

# simple-git-hooks 踩坑实录：钩子装对了却从没触发过，原来是 .git 目录捣的鬼

> **摘要**：
>
> 在一个 Git 仓库根目录与 pnpm monorepo 工作区不在同一层级的项目中，[simple-git-hooks](https://github.com/toplenboren/simple-git-hooks) 在 `postinstall` 阶段把钩子安装到了一个"假的" `.git` 目录里，导致 [lint-staged](https://github.com/lint-staged/lint-staged) 和 [commitlint](https://github.com/conventional-changelog/commitlint) 从来没有在 `git commit` 时被触发过。
> 本文记录了从发现问题到定位根因的完整排查思路，以及最终的三步组合修复方案。

> **AI 协助编写的博客文章**：
>
> 这篇文章有参与 AI 协助的。使用了 AI 润色文章。

## 1. 前言：你的 Git 钩子真的在工作吗？

很多项目会用 `simple-git-hooks` + `lint-staged` 来实现 **提交前自动格式化**，用 `commitlint` 来做 **提交信息规范校验**。配好之后你可能觉得万事大吉了——但你有没有认真观察过，每次 `git commit` 时终端里有没有出现 lint-staged 的输出？

我就没观察过。直到某天我发现，项目里的代码格式一塌糊涂，`git log` 里的提交信息也是五花八门，才意识到一个残酷的事实：**钩子配置写得好好的，但从来没有真正跑过。**

## 2. 项目背景：嵌套的目录结构

先交代一下项目的目录结构，因为这正是问题的核心：

```log
01s-2603-13eams/                  ← Git 仓库根目录（.git 在这一层）
└── eams-frontend-monorepo/       ← pnpm monorepo 工作区（package.json 在这里）
    ├── package.json
    ├── simple-git-hooks.mjs
    ├── lint-staged.config.js
    ├── apps/
    │   ├── eams-frontend/
    │   ├── eams-fronttea/
    │   └── eams-frontstu/
    └── packages/
        ├── vue-element-cui/
        └── vue-element-cui-nuxt/
```

注意到关键点了吗？**Git 仓库的根目录和 pnpm monorepo 的工作区不在同一层。** monorepo 是 Git 仓库的一个子目录。

这种结构在团队协作中不算罕见——比如一个大仓库下面放了多个子项目，其中一个子项目独立使用 pnpm workspace 管理自己的 monorepo。

## 3. 排查过程

### 3.1. 第一步：确认配置没问题

先检查所有配置文件都在。

`simple-git-hooks.mjs` 的内容：

```js
export default {
	"commit-msg": "npx --no-install commitlint --edit ${1}",
	"pre-commit": "npx lint-staged",
};
```

`lint-staged.config.js` 的内容：

```js
export default {
	"*": "prettier --experimental-cli --write",
};
```

`package.json` 中的相关配置：

```json
{
	"scripts": {
		"postinstall": "simple-git-hooks"
	},
	"devDependencies": {
		"lint-staged": "^15.5.2",
		"simple-git-hooks": "^2.13.1"
	}
}
```

一切看起来都很标准。配置文件没有拼写错误，依赖也装了，`postinstall` 也挂上了。

### 3.2. 第二步：检查钩子是否存在

```bash
ls .git/hooks/
```

在 monorepo 目录下执行后，确实看到了 `pre-commit` 和 `commit-msg` 两个钩子文件，内容也完全正确。

到这里，我一度以为"钩子装好了，应该没问题"。但 lint-staged 就是不触发。

### 3.3. 第三步：揭开真相的命令

接下来这条命令改变了一切：

```bash
git rev-parse --git-dir
```

输出：

```log
D:/code/01s/202603-13hzb/yunxiao/01s-2603-13eams/.git
```

**真正的 `.git` 目录在上一层！** 不在 monorepo 目录内。

那我刚才在 monorepo 目录看到的 `.git/hooks/` 又是什么？

```bash
ls .git/
```

输出让我大吃一惊：

```log
Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----         2026/3/9     22:55                hooks
```

**整个 `.git` 目录里只有一个 `hooks/` 子目录。** 没有 `HEAD`，没有 `config`，没有 `objects`——这根本不是一个真正的 Git 仓库。它是 `simple-git-hooks` 自行创建的一个"假 `.git`"。

## 4. 根因分析

现在整个因果链清楚了：

| 步骤 |                             发生了什么                              |
| :--: | :-----------------------------------------------------------------: |
|  1   |     `pnpm install` 触发 `postinstall`，执行 `simple-git-hooks`      |
|  2   |    `simple-git-hooks` 从当前目录（monorepo）向上查找 `.git` 目录    |
|  3   |  没找到真正的 `.git`，于是自行在 monorepo 内**创建** `.git/hooks/`  |
|  4   |           钩子被写入 `eams-frontend-monorepo/.git/hooks/`           |
|  5   | `git commit` 时，Git 查找钩子的位置是 `01s-2603-13eams/.git/hooks/` |
|  6   | 真正的 `.git/hooks/` 里只有 `.sample` 文件，**没有任何自定义钩子**  |
|  7   |              lint-staged 和 commitlint **从未被触发**               |

用一句话总结根因：**`simple-git-hooks` 安装钩子的位置和 Git 实际读取钩子的位置不是同一个地方。**

而且这个问题极其隐蔽——你在 monorepo 目录下执行 `ls .git/hooks/`，钩子文件明明就在那儿，内容也完全正确。你很难意识到这些钩子根本没人在用。

## 5. 修复方案

### 5.1. 尝试一：删除假 .git（失败）

我最初的直觉是删掉这个假 `.git` 目录：

```bash
rm -rf .git
```

然后重新运行 `npx simple-git-hooks`。

结果：**`simple-git-hooks` 又重新创建了假 `.git/hooks/` 目录。** 它的内部逻辑就是"找不到 `.git` 就自己建一个"。此路不通。

### 5.2. 最终方案：三步组合修复

#### 第一步：设置 core.hooksPath

用 Git 的 [`core.hooksPath`](https://git-scm.com/docs/git-config#Documentation/git-config.txt-corehooksPath) 配置，告诉 Git 从 monorepo 的钩子目录读取：

```bash
git config core.hooksPath eams-frontend-monorepo/.git/hooks
```

这样 Git 就不再去 `01s-2603-13eams/.git/hooks/` 找钩子了，而是去 `eams-frontend-monorepo/.git/hooks/` 找——也就是 `simple-git-hooks` 实际安装钩子的位置。

#### 第二步：更新钩子命令，加 cd 前缀

Git 执行钩子时，**CWD 会被设为仓库根目录**（即 `01s-2603-13eams/`），而不是 monorepo 目录。这意味着 `npx lint-staged` 会在仓库根执行，但 `lint-staged` 安装在 monorepo 的 `node_modules` 里，`npx` 根本找不到它。

解决办法是在钩子命令前加 `cd eams-frontend-monorepo`：

```js
export default {
	"commit-msg": 'ROOT=$(pwd) && cd eams-frontend-monorepo && npx --no-install commitlint --edit "$ROOT/$1"',
	"pre-commit": "cd eams-frontend-monorepo && npx lint-staged",
};
```

#### 第三步：处理 commit-msg 的路径问题

`commit-msg` 钩子比 `pre-commit` 多了一个麻烦：Git 会传入一个参数 `$1`，指向提交信息文件（通常是 `.git/COMMIT_EDITMSG`）。这是一个**相对于仓库根目录的路径**。

如果直接 `cd eams-frontend-monorepo` 后再用 `$1`，路径就会从 `eams-frontend-monorepo/` 出发去找 `.git/COMMIT_EDITMSG`——当然找不到。

所以需要**在 cd 之前把仓库根目录的绝对路径存下来**：

```bash
ROOT=$(pwd) && cd eams-frontend-monorepo && npx --no-install commitlint --edit "$ROOT/$1"
```

`ROOT=$(pwd)` 先记住仓库根的绝对路径，cd 之后再用 `$ROOT/$1` 拼出完整路径。

### 5.3. 验证修复

运行一个空提交测试：

```bash
git commit --allow-empty -m "test: hook trigger test"
```

终端输出：

```log
→ No staged files found.
[f1-ruancat 6c819d79] test: hook trigger test
```

看到 `→ No staged files found.` 就说明 lint-staged **终于被触发了**。commitlint 也正常校验了提交信息。

## 6. 总结与教训

### 6.1. 核心教训

**不要假设 `.git` 和 `package.json` 在同一层级。** 在嵌套目录结构的项目中，Git 仓库根和 Node.js 项目根可以完全是两个不同的目录。`simple-git-hooks`、[husky](https://github.com/typicode/husky) 等钩子管理工具都依赖 `.git` 的位置来安装钩子，一旦它们找错了位置，钩子就会"隐形失效"。

### 6.2. 排查清单

下次遇到"Git 钩子配置正确但不触发"的问题时，按这个顺序排查：

| 步骤 |                  命令                  |                目的                 |
| :--: | :------------------------------------: | :---------------------------------: |
|  1   |       `git rev-parse --git-dir`        |    确认真正的 `.git` 目录在哪里     |
|  2   |    `git rev-parse --show-toplevel`     |        确认仓库根目录在哪里         |
|  3   |      `git config core.hooksPath`       |      检查有没有自定义钩子路径       |
|  4   | `ls $(git rev-parse --git-dir)/hooks/` | 看真正的 `.git/hooks/` 里有没有钩子 |
|  5   | 对比当前目录的 `.git/hooks/` 和真正的  |       确认钩子有没有装错位置        |

### 6.3. 适用场景

如果你的项目满足以下任一条件，就要警惕这个问题：

- Git 仓库根和 pnpm/npm 项目根不在同一层
- 项目是一个大仓库的子目录
- 使用了 `git worktree`
- 使用了 `git submodule`

遇到 `simple-git-hooks` 或 `husky` 的钩子"不触发"时，不要只看钩子文件在不在——**要确认它们在的位置，是不是 Git 真正会去读的位置。**
