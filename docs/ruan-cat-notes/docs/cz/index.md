# commitizen,git commit 提交格式化工具

commitizen，简称 cz，他用于管控我们 git commit 提交。

相关的配置很多，附属插件，依赖也很多。目前（2024-10-23）暂不考虑继续折腾该内容。

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

<<< ./czrc.json

并不需要在 git 所在的`项目根目录`内新建。在嵌套文件夹的情况下，在你的`主要工作目录`内新建文件即可。

:::

::: warning 不太推荐

在 package.json 内：

<<< ./package.example.json

之所以不推荐，是因为该写法毕竟要写在 package.json 内，而且是对 git 所在路径硬编码。

:::

## 使用自己封装的库完成快速配置

可以使用我自己封装的工具包 [@ruan-cat/commitlint-config](https://github.com/ruan-cat/monorepo/tree/main/configs-package/commitlint-config) 来完成项目的 commitizen 配置。
