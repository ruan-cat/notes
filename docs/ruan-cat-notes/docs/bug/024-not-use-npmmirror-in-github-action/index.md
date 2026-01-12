---
juejin: https://juejin.cn/post/7594309641867165734
desc: 淘宝镜像源版本滞后会导致 GitHub Action 构建失败，应强制使用官方 npm 源。
---

# 不要在 github action 内使用 npm 的淘宝镜像源

> **摘要**：
>
> 淘宝镜像源（npmmirror）的包版本同步存在滞后，在 GitHub Action 工作流中使用可能导致构建失败。当依赖链中某个包需要刚发布的新版本时，淘宝镜像源可能尚未同步，从而触发 `ERR_PNPM_NO_MATCHING_VERSION` 错误。解决方案是在 GitHub Action 中强制使用官方 npm 镜像源：通过设置 `NPM_CONFIG_REGISTRY` 环境变量，并在 pnpm 安装命令中显式指定 `--registry https://registry.npmjs.org`。

注意看这个极端的情况，在特定时间内，分别运行以下命令：

```bash
pnpm v @typescript-eslint/scope-manager version --registry https://registry.npmmirror.com/
pnpm v @typescript-eslint/scope-manager version --registry https://registry.npmjs.org/
```

不同镜像源的版本号完全对不上，最新版本的依赖对不上。淘宝镜像的依赖包版本，必定是落后于官方镜像版本的。

![2026-01-13-01-49-29](https://gh-img-store.ruan-cat.com/img/2026-01-13-01-49-29.png)

某些对依赖版本很严格的包，在 github action 工作流内，会因为在淘宝镜像找不到最新版本包，而导致构建错误，比如以下情况：

```log
  ERR_PNPM_NO_MATCHING_VERSION  No matching version found for @typescript-eslint/scope-manager@8.53.0 while fetching it from https://registry.npmmirror.com/

  This error happened while installing the dependencies of @unocss/eslint-plugin@66.5.12
   at @typescript-eslint/utils@8.53.0

  The latest release of @typescript-eslint/scope-manager is "8.52.0".

  Other releases are:
    * canary: 8.52.1-alpha.13
    * rc-v: 6.0.0-alpha.58
    * rc-v4: 4.0.0-alpha.16
    * rc-v5: 5.0.0-alpha.42
    * rc-v6: 7.0.0-alpha.0
    * rc-v8: 8.0.0-alpha.62

  If you need the full list of all 3762 published versions run "$ pnpm view @typescript-eslint/scope-manager versions".
```

这段日志的意思就是说，在 `https://registry.npmmirror.com/` 淘宝源内，找不到 `8.53.0` 版本的 `@typescript-eslint/scope-manager` 包，只能找到 `8.52.0` 版本的包。而 `@unocss/eslint-plugin@66.5.12` 又需要最新版本的 `@typescript-eslint/scope-manager` 包。

这个包对于我现在的时间来说，是刚刚发布的新包。淘宝源还来不及做出同步。

![2026-01-13-01-55-13](https://gh-img-store.ruan-cat.com/img/2026-01-13-01-55-13.png)

所以在 github action 内，真的不应该用淘宝镜像源，应该直接用官方镜像源，直接用最新的包版本。

## 修改出错的 github action 工作流

1. 整个任务直接指定环境变量： `NPM_CONFIG_REGISTRY`。
2. 由于使用的 `pnpm/action-setup` 工作流和 pnpm+monorepo 的架构，所以在`递归安装子包依赖`和`安装全局依赖`的时候，需要分别写两段独立的参数。

如图所示，安装依赖的时候有两段独立的命令，所以需要分别设置镜像源。

![2026-01-13-02-12-33](https://gh-img-store.ruan-cat.com/img/2026-01-13-02-12-33.png)

最终修改后的工作流如下：

```yaml
name: CI
jobs:
  tester:
    runs-on: ubuntu-latest
    env:
      # 强制使用官方 npm 镜像源，避免淘宝镜像源版本滞后导致构建失败
      # 必须在 job 级别设置，确保从 pnpm/action-setup 和 setup-node 阶段就开始使用官方源
      NPM_CONFIG_REGISTRY: https://registry.npmjs.org/
    steps:
      - name: 检出分支
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: 安装pnpm
        uses: pnpm/action-setup@v4
        with:
          run_install: |
            - recursive: true
              args: [--registry, https://registry.npmjs.org]
            - args: [--registry, https://registry.npmjs.org, --global, "tsx", "turbo"]

      - name: 安装node
        uses: actions/setup-node@v4
        with:
          node-version: 22.14.0
          cache: pnpm
```
