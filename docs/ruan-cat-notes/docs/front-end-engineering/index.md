# 前端工程化

`前端工程化`包含了很多内容。

<!-- TODO: 逐步完善笔记 并掘金发文 -->

## 参考资料

TODO: 认为这个仓库值得学习。看看人家是怎么实现配置的。

- https://github.com/dishait/tov-template

## 整体导论

TODO: `前端工程化`肯定有别人整理好的总结、入门概论等。需要去收集并阅读一遍。

- https://blog.csdn.net/qq_42611074/article/details/129085588

## 前言

前端工程化，涉及到了很多包的配置。推荐你按照文章脉络，一步一步安装依赖，渐进式的理解每一个包的用途，以及注意事项。

<!-- TODO: 生成一个 mermaid 流程图 -->

## simple-git-hooks ，基于 git hooks 的钩子库

用来创建 git 钩子的。我们用 git 钩子来做各种事情，比如在 commit 信息钩子，提交前钩子内做事情。

- 仓库： https://github.com/toplenboren/simple-git-hooks

常见的用法是这样的：

- 在 `commit钩子` 内对提交信息做校验。
- 在 `提交前钩子` 内做代码格式化。

### 安装

```bash
pnpm i -D simple-git-hooks
```

### 配置钩子命令

我们通常在这些钩子内，配置各种各样的 lint 或 format 用途命令。

按照官方文档的[`Additional configuration options`](https://github.com/toplenboren/simple-git-hooks/blob/master/README.md#additional-configuration-options)所述，根据可以被识别的文件类型，这里推荐编写独立的配置文件 `simple-git-hooks.mjs` 。

举例如下：

<<< ./code/simple-git-hooks.mjs

这里就不赘述可以配置的钩子选项，和 git hooks 的概念了，详情可以看以下文章。

- [`《用simple-git-hooks防止同事提交垃圾代码》`](https://juejin.cn/post/7455229927191805992)

#### 定义文件的后缀名必须是 `.mjs` 而不是 `.js`

如果定义了 `simple-git-hooks.js` 文件，那么后续在运行 `npx simple-git-hooks` 命令时，会直接出错。导致生成失败。

### 配置命令行

常见用法是，在 package.json 的 `postinstall` 钩子内，主动运行该命令，生成 git hooks 文件。

```json
{
	"scripts": {
		"postinstall": "pnpm run init-git-hooks",
		"init-git-hooks": "simple-git-hooks"
	}
}
```

在我们安装完依赖后，就会主动运行 `postinstall` 钩子，生成存放在本地 `.git` 文件夹的 git hooks 文件。

用文件输出命令检查生成内容。

```bash
ls .git/hooks
```

生成效果如图所示，是可以看到生成了名为 `pre-commit` 和 `pre-push` 的文件的。

![2025-09-14-01-23-01](https://gh-img-store.ruan-cat.com/img/2025-09-14-01-23-01.png)

#### github workflow 流水线运行正常

在 github workflow 内，该配置确实能够正常的生成文件，不会引发错误，可以放心使用。

#### 对外发包的 package.json 不要配置 `postinstall` 钩子

请阅读以下官方文档，这里不做赘述。

如果你的项目不考虑发包，那么可以跳过此部分，无需考虑。

- [`Note for npm package developers`](https://github.com/toplenboren/simple-git-hooks/blob/master/README.md#note-for-npm-package-developers)

### 其他 git 钩子

最出名的是 `husky` 。但本文不对此做过多说明，请自行学习。

- 仓库： https://github.com/typicode/husky
- 官网： https://typicode.github.io/husky/zh/

## lint-staged ，在 git 暂存区内执行任务的库

lint-staged ，是一个借助 glob 语法匹配 git 暂存区文件并执行命令的库。

- 仓库： https://github.com/lint-staged/lint-staged

我们不可能在每次提交前，都对整个项目做 lint 和 format。其时间成本太大了。如果我们高频率的提交代码，那么每次提交的时候都会卡住自己。

常见的用法是把 `lint-staged` 配置到 `pre-commit` 钩子内，在提交前对暂存区的文件做处理。

### 安装

```bash
pnpm i -D lint-staged
```

### 配置格式化规则文件

按照[官方文档](https://github.com/lint-staged/lint-staged/blob/main/README.md#configuration)对配置文件的格式说明，这里推荐大家在项目根目录下面新建 `lint-staged.config.js` 文件。推荐大家新建含有 typescript 类型的配置文件。

举例如下：

<<< ./code/lint-staged.config.js

## commitlint ，对 git commit 信息做格式检查的库

常见的用法是把 `commitlint` 配置到 `commit-msg` 钩子内，对提交信息做 lint 校验检查。

- 仓库： https://github.com/conventional-changelog/commitlint
- 官网： https://commitlint.js.org/

### 安装

```bash
pnpm i -D commitlint
```

### 配置文件

内容太多了。这里篇幅有限。

<!-- TODO: 提供链接说明 -->

### 与 simple-git-hooks 配置

关键配置：

```bash
commitlint --edit ${1}
```

和 simple-git-hooks 配置时，一定要提供 `--edit ${1}` 的参数，否则无法获取数据。

### 参考资料

- https://juejin.cn/post/7068988460899500040
- [`《约定式提交规范详解.simple-git-hooks》`](https://juejin.cn/post/7381372081915166739#heading-8)
- [`整合 simple-git-hooks？`](https://fabric.modyqyw.top/zh-Hans/guide/git/commitlint.html#整合-simple-git-hooks)
