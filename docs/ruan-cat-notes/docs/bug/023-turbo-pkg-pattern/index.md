---
juejin: "TODO"
desc: TODO
---

<!-- TODO: 编写完善的包匹配错误的文章 -->

# turbo 根包没有安装子包依赖，导致根包命令运行时匹配缺漏

> **摘要**：
>
> TODO: 编写摘要

我的项目用了 pnpm + monorepo + turbo 的方案，来实现一揽子 node 包的构建与发布。可是我之前的包都能在流水线内构建，为什么最近新开发的一个子包就不能及时构建呢？怎么会漏东西呢？为什么 turbo 偏偏就漏掉我新增加的 `@ruan-cat/claude-notifier` 子包呢？

## 问题截图

如图，`@ruan-cat/claude-notifier` 不仅仅没有完成自身的构建，也没有完成文档构建。

![2025-10-28-01-53-01](https://gh-img-store.ruan-cat.com/img/2025-10-28-01-53-01.png)

## 解决方案

问 AI 才知道，我在 monorepo 根包内运行 turbo 构建命令，就相当于匹配根包所依赖工作区内的全部子包。因为我根包内没有安装，没有去依赖 `@ruan-cat/claude-notifier` 这个新的子包，所以无法被匹配到。

![2025-10-28-01-53-33](https://gh-img-store.ruan-cat.com/img/2025-10-28-01-53-33.png)

## 问题解决

听 AI 的话，去 monorepo 根包内安装项目内的子包依赖。虽然会让根包膨胀，但也无所谓，因为根包又不发布到镜像源，别人也不看。

后续工作流就能正常运行了，期望的子包如期运行了文档构建命令。

![2025-10-28-01-54-34](https://gh-img-store.ruan-cat.com/img/2025-10-28-01-54-34.png)
