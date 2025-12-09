---
juejin: https://juejin.cn/post/7547425901317242918
desc: 在使用 actions/setup-node 工作流安装 pnpm 缓存时，遇到找不到 pnpm-lock.yaml 的故障。在该工作流前运行一次 pnpm install 安装依赖即可。
---

# 使用 github workflow 的 `actions/setup-node` 工作流，安装 pnpm 失败的 bug

> **摘要**：
>
> 在使用 actions/setup-node 工作流安装 pnpm 缓存时，遇到找不到 pnpm-lock.yaml 的故障。在该工作流前运行一次 pnpm install 安装依赖即可。

在 github workflow 中，我们经常用 [`actions/setup-node`](https://github.com/actions/setup-node) 和 [`pnpm/action-setup`](https://github.com/pnpm/action-setup) 这两个工作流，来完成流水线安装 `node` 环境，并准备包管理器的需求。

我的工作流写法如下：

<!--
	这里为了掘金发文，没有使用vitepress的导入代码片段写法，故代码片段会存在更新不及时的情况。
	完整的代码片段 code\021\setup-node-and-pnpm.yaml
-->

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: 检出分支
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: 安装pnpm
        uses: pnpm/action-setup@v4
        with:
          run_install: true

      - name: 安装node
        uses: actions/setup-node@v4
        with:
          node-version: 22.14.0
          cache: "pnpm"
```

这段写法产生了以下故障，这里只截取一小部分：

<!--
	这里为了掘金发文，没有使用vitepress的导入代码片段写法，故代码片段会存在更新不及时的情况。
	完整的代码片段 code\021\error.log
-->

```log
/home/runner/setup-pnpm/node_modules/.bin/pnpm store path --silent
/home/runner/setup-pnpm/node_modules/.bin/store/v10
Error: Dependencies lock file is not found in /home/runner/work/*** . Supported file patterns: pnpm-lock.yaml
```

## 问题起因

因为 `actions/setup-node` 工作流会默认检索项目内已经存在的包依赖锁文件，所以在查询包锁文件时，找不到就报错了。

如图所示：

![2025-09-08-17-40-53](https://gh-img-store.ruan-cat.com/img/2025-09-08-17-40-53.png)

具体缘由见以下文档所述：

- https://github.com/actions/setup-node#checking-in-lockfiles
- https://github.com/actions/setup-node/blob/main/docs/advanced-usage.md#working-with-lockfiles

按照官网文档，我应该提交 `pnpm-lock.yaml` 锁文件。

## 个人开发习惯导致必须另辟蹊径

由于我的开发习惯，是不上传任何包锁文件的。我不喜欢上传巨大的，频繁变更的，自动生成的文件到 git 仓库，所以在工作流场景下，自然是无法提供任何包锁文件的。

类似的情况还有在 `vercel` 流水线部署项目时，`vercel` 会根据是否存在包锁文件来决定包管理器的版本号。比如我的项目在根目录内不提供任何 `pnpm-lock.yaml` ，`vercel` 就使用了低版本的 `pnpm6`，而不是我在 `packageManager` 内配置的最新版 `pnpm`。不提供 `pnpm-lock.yaml` 锁文件确实容易给流水线环境带来误导。

但是我的场景下，肯定不能提交锁文件。在使用 taze 实现高强度依赖升级的情况下，依赖锁文件会频繁更新，其提交到仓库的意义不大。

## 临时性解决方案

在设置 pnpm 缓存前，先安装依赖，生成 `pnpm-lock.yaml` ，避免 `actions/setup-node` 出现识别故障。

更新后的工作流文件如下：

<!--
	这里为了掘金发文，没有使用vitepress的导入代码片段写法，故代码片段会存在更新不及时的情况。
	完整的代码片段 code\021\setup-node-and-pnpm-with-lockfile.yaml
-->

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: 检出分支
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: 安装pnpm
        uses: pnpm/action-setup@v4
        with:
          run_install: true

      - name: 安装依赖（尝试生成lockfile）
        run: pnpm install --frozen-lockfile

      - name: 安装node
        uses: actions/setup-node@v4
        with:
          node-version: 22.14.0
          cache: "pnpm"
```
