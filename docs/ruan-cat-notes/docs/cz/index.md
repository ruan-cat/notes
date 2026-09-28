# commitizen,git commit 提交格式化工具

commitizen，简称 cz，他用于管控我们 git commit 提交。

相关的配置很多，附属插件，依赖也很多。2026-09-28 更新：全局 `cz` 命令在 pnpm 12 下出现集体故障，根因与 `.czrc` 的写法直接相关，排障过程见 [bug-with-pnpm12](./bug-with-pnpm12.md)，本文的配置写法已同步修正。

## 最低限度的快速初始化 cz

我手上已经有很多项目了，需要实现最低限度的初始化。

1. 全局安装 commitizen

为提高效率，需要高效率的使用 `cz` 来快速在命令行内写 commit，全局包才提供这样的功能。故我会全局安装该依赖。

```bash
pnpm i -g commitizen
```

2. 安装依赖

```bash
pnpm i -D commitizen cz-git
```

3. 配置 commitizen 使用的规则

配置规则有两种方式：

::: tip 推荐方案

在主要的工作目录内新建 `.czrc` 文件：

```json
{
	"path": "node_modules/cz-git"
}
```

注意 `path` 要写 `node_modules/cz-git` 这种**相对路径**，而不是裸模块名 `"cz-git"`。commitizen 会先定位 git 仓库根，再从仓库根解析这个相对路径，命中**项目本地**安装的 cz-git；裸模块名则会让 commitizen 从它自身的安装位置（全局环境）查找，在 pnpm 12 的全局隔离布局下必然失败，详见 [bug-with-pnpm12](./bug-with-pnpm12.md)。

`.czrc` 放在哪个工作目录都可以，在嵌套文件夹的情况下，在你的`主要工作目录`内新建文件即可。但如果该目录不是 git 仓库根（例如 monorepo 子包），相对路径要以 git 仓库根为基准书写。

:::

::: warning 备选方案

在 package.json 内：

```json
{
	"config": {
		"commitizen": {
			"path": "node_modules/cz-git"
		}
	}
}
```

该写法与 `.czrc` 完全等价，commitizen 对 `path` 的解析规则相同（同样从 git 仓库根解析相对路径），是官方支持的合法方式。区别只在配置载体：写进 package.json 便于集中管理，但会让 package.json 逐步臃肿；`.czrc` 更轻量独立。按项目习惯二选一即可。

:::

## 使用自己封装的库完成快速配置

可以使用我自己封装的工具包 [@ruan-cat/commitlint-config](https://github.com/ruan-cat/monorepo/tree/main/configs-package/commitlint-config) 来完成项目的 commitizen 配置。
