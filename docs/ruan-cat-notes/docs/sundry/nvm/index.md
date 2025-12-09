# node 包管理器

- https://github.com/nvm-sh/nvm/blob/master/README.md

这是一个管理 node 版本的工具。

## 不再使用该工具

这个工具在切换 node 环境时，必须要打命令行。不方便。

新的工具提供了可视化的操作界面，更加友好清晰，易于管控。

[点此学习新的工具。](../../nvm-desktop/index.md)

### 从 nvm-windows 到 nvm-desktop

我们直接关闭掉 nvm-windows 即可，不再要求他管控 node 环境，也不强求自己去删除这些 node 环境了。

执行以下命令关闭掉 nvm 的管控。接下来全局的 node 就都有别的工具把控了。

```bash
nvm off
```

## 看清楚文档

- https://github.com/nvm-sh/nvm/blob/master/README.md#about
- https://github.com/coreybutler/nvm-windows

nvm-sh 不是用于 window 系统的，nvm-windows 才是。所以很多功能都没有。

## 下载最新版的指定 node 版本

下载最新版的 node14 ，特指为 lts 版本的。

```bash
nvm install 14 lts
```

注意，该功能来自于 nvm 1.11.8 版本。请注意版本。

## 切换到 nvm 管控的最新 node 环境

- https://github.com/coreybutler/nvm-windows/releases/tag/1.1.10
- https://github.com/coreybutler/nvm-windows/pull/709

比如，直接使用以下命令切换到 nvm 管控的最新 node14 环境。

```bash
nvm use 14
```

## 配置镜像

- https://blog.csdn.net/qq_41409353/article/details/109553940

```text
node_mirror: https://npm.taobao.org/mirrors/node/
npm_mirror: https://npm.taobao.org/mirrors/npm/
```

### 配置镜像

- https://juejin.cn/post/7095318124433506341

```bash
nvm npm_mirror https://npmmirror.com/mirrors/npm/
```

```bash
nvm node_mirror https://npmmirror.com/mirrors/node/
```

## 当前困境

维护多个不同 node 版本的项目时，切换 node 版本很麻烦。

比如维护基于 node-sass 的项目，需要 node14 环境；维护 vite4 项目时，需要 node16 环境；而在维护 vite5 项目时，又需要 node18 环境。反复切换项目时，不能自动自适应 node 版本。每次都需要手动切换版本，很难受。
