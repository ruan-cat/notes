# 使用 commitlint 和 cz-git 来约束 git commit 提交信息的格式

## 快速初始化 git 配置

运行命令批量初始化配置文件。

```bash
pnpm dlx @ruan-cat/commitlint-config init
```

## 已配置好 cz-git

我们项目已经配置好了 git commit 提交的模板工具了。如果你需要更改配置，请更改 `commitlint.config.cjs` 配置即可。

如果你需要在自己的项目内实现，可以阅读以下文章：

- https://notes.ruan-cat.com/cz/

## 如何使用？

目前有两种手段，在控制台内输入命令，或者是运行

### 以控制台命令提交 <Badge type='tip' text='推荐' />

1. 首先你需要确保你已经全局安装 commitizen 了。

```bash
pnpm i -g commitizen
```

2. 然后在项目根目录运行 cz 命令即可。

其效果如下动图所示：

::: details 输入 cz 命令

![2025-02-27-14-58-10](https://gh-img-store.ruan-cat.com/01s-docs/10wms/2025-02-27-14-58-10.gif)

:::

### 运行特定命令

你直接运行项目内已经封装好的命令 `git:commit` 即可。不需要全局安装 commitizen 包。

## 目前是如何配置的？

阮喵喵专门封装了一个库 [`@ruan-cat/commitlint-config`](https://npm.im/@ruan-cat/commitlint-config) ，用来框定项目的 git 提交规范。
