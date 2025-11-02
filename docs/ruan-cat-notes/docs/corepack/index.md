# corepack,管理包管理工具的工具

corepack 在 node14、node16 的最后两个版本内提供，是一个管控设置包管理器的默认官方工具。

目前仅管控 pnpm 和 yarn。

## 切换 node 版本后要及时开启 corepack

要及时地在全局运行以下命令：

```bash
corepack enable
```

开启 corepack 后会提供全局命令，具体效果见以下 gif 示意图。

::: details 以 node20.15.0 为例

![corepack-enable-with-node-20.15.0](https://gh-img-store.ruan-cat.com/img/2024-08-26-15-56-47.gif)

:::

::: details 以 node22.4.1 为例

![corepack-enable-with-node-22.4.1](https://gh-img-store.ruan-cat.com/img/2024-08-26-15-57-02.gif)

:::

这个故障和目前正在使用的 node 版本切换工具 nvmd（nvm-desktop）无关。单纯的 corepack 问题。

## 安装失败

比如这段全局安装的命令：

```bash
corepack install pnpm@9.15.0 -g
```

报错如下：

::: details

<<< ./corepack-install-global-error-log.txt#snipaste{txt twoslash}

:::

截图如下：

::: details

![2024-12-29-18-04-11](https://gh-img-store.ruan-cat.com/img/2024-12-29-18-04-11.png)

:::

### 问题定性

这属于典型的网络代理问题。由于我为了解决其他工具的网络问题，配置了很多环境变量，因此本问题我更加倾向于全局设置镜像源。设置 corepack 的镜像源为淘宝源，而不是官方镜像源。

### 解决过程

先去其他的目录内，运行命令 `pnpm v pnpm@9.15.0` ，以便查询相关信息。相关信息如下：

::: details

<<< ./pnpm_v_pnpm@9.15.0_log.txt#snipaste{txt twoslash}

:::

目前 pnpm 是在淘宝镜像下查询的，注意到关键信息 tarball ，在淘宝源的有效 url 为

- https://registry.npmmirror.com/pnpm/-/pnpm-9.15.0.tgz

可以考虑让 corepack 更改镜像源为淘宝源，下载该 tarball 即可完成安装。

### 阅读文档

- https://github.com/nodejs/corepack#environment-variables

官方文档明确说明了可以配置 COREPACK_NPM_REGISTRY 环境变量。

### 全局配置

在本机全局的 .npmrc 内设置镜像源。

```bash
# 设置全局 corepack 的镜像源，处理corepack安装pnpm失败的故障
# https://github.com/nodejs/corepack#environment-variables
# https://github.com/nodejs/corepack/issues/67
# https://github.com/nodejs/corepack/issues/572
COREPACK_NPM_REGISTRY=https://registry.npmmirror.com/
```

至此已解决问题。

## 安装与升级 pnpm

安装失败的问题由来已久。升级和安装都经常遇到诡异的问题。

1. corepack 的 key 值校验问题，在今年 1 月 27 号的时候就有相关 [issue](https://github.com/nodejs/corepack/issues/612) 了。

2. 当天 1 月 27 号，[`corepack0.31.0`](https://github.com/nodejs/corepack/pull/614) 已经解决这个问题。

3. 现在的 node 版本没有提供合适的 corepack 版本，如下:

::: details corepack 版本过低

![2025-02-27-22-26-08](https://gh-img-store.ruan-cat.com/img/2025-02-27-22-26-08.png)

:::

4. node20 版本下，要使用 `corepack0.31.0`，还要等到[今年 3 月 13 号](https://github.com/nodejs/corepack/issues/627#issuecomment-2685693365)。

目前按照以下方案来安装 pnpm：

### 准备全局的 npmrc 配置

::: details 全局 .npmrc 配置

```bash
# 设置全局 corepack 的镜像源，处理corepack安装pnpm失败的故障
# https://github.com/nodejs/corepack#environment-variables
# https://github.com/nodejs/corepack/issues/67
# https://github.com/nodejs/corepack/issues/572
COREPACK_NPM_REGISTRY=https://registry.npmmirror.com/

# 让corepack不检查包管理器key值的完整性
# https://github.com/pnpm/pnpm/issues/9029#issuecomment-2629817478
COREPACK_INTEGRITY_KEYS=0
```

:::

### 具体的项目内依次运行以下命令

运行以下命令：

- https://github.com/pnpm/pnpm/issues/9029#issuecomment-2630882497

```bash
corepack enable
# 这里的pnpm包版本号根据项目具体情况填写
corepack prepare pnpm@9.15.0 --activate
```

### 测试在 `corepack0.31.0` 内安装最新版的 pnpm

实测以下命令是正常可用的；

```bash
corepack install -g pnpm@latest
```

::: details

![2025-02-27-22-56-01](https://gh-img-store.ruan-cat.com/img/2025-02-27-22-56-01.png)

:::

## 利用 corepack 实现 node 项目控制指定版本的 pnpm 包管理器

为了统一项目开发人员使用相同的包管理器，我这里使用 preinstall 钩子来管控包管理器。

基于上述的 [corepack 的 key 值校验问题](https://github.com/nodejs/corepack/pull/614)，这里根据不同的情况使用不同的命令，以下是我的最佳实践：

### corepack 没到 0.31.0 版本

在 corepack 没到 0.31.0 版本时，用以下命令：

::: details

<<< ./corepack-preinstall-1.json

:::

### corepack 满足 0.31.0 版本

在 corepack 满足所需的版本时，使用以下命令：

::: details

<<< ./corepack-preinstall-2.json

:::

## 在 node25 内移除 corepack

- https://github.com/nodejs/corepack/issues/612
- https://socket.dev/blog/node-js-tsc-votes-to-stop-distributing-corepack

这些文章说明，未来 node 将不会携带 corepack，以后应该自己想办法安装 corepack。
