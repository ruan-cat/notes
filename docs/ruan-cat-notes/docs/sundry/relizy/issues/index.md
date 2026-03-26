# 给 relizy 的一系列 issue

针对路径 POSIX 标准的修改，在 `v1.2.2-beta.0` 版本内，可以得知 `POSIX` 路径故障已经修复了，我通过在 2 个独立的 monorepo 项目内安装 v1.2.2-beta.0 来分别验证了，都能够实现发版。

但是我在这个测试的过程中，仍旧遇到了好多问题：

1. GNU 工具缺失，和 baseline tag 缺失导致的故障：为此我专门让 AI 写了一个很脏的兼容性脚本来处理，我打算晚点写一个 issue 来完整说明这个情况。 https://github.com/ruan-cat/monorepo/blob/dev/packages/utils/src/node-esm/scripts/relizy-runner/index.ts

2. git 根目录与当前运行目录不一致导致的故障： AI 专门给我写了几个 patch 补丁文件，解决我的 git 根目录和存放代码目录不一致的情况。我这个情况很特殊，我的代码文件夹目录，和真正存放 .git 的根目录是不一样的，中间还差了一层，所以发包故障。

3. 生成的基于 tags 的对比 url 链接，不能满足我的 git 远程托管平台，需要实现自定义： 生成的这样的链接 `https://codeup.aliyun.com/zero-one-star/zero-awei/zero-one-eams2603/compare/hello-world@0.1.0...hello-world@0.1.1` ，对于 `hello-world@0.1.0...hello-world@0.1.1` 格式的链接来说，在 github 上是成立的，正确的。可是在我当前使用的特殊的 git 托管平台内，有效的路径是：`https://codeup.aliyun.com/zero-one-star/zero-awei/zero-one-eams2603/compare?from=hello-world@0.1.0&to=hello-world@0.1.1&tab=tags` 。我需要实现配置链接，才能完成我的特殊需求。

简单总结一下为什么我的场景会引发如此严重的水土不服：

1. 中国开发者大多数都在使用 window 系统，很少使用 mac 或 linux 系统作为开发的主力操作系统。所以会遇到 POSIX 路径问题和 GNU 工具缺失的问题。
2. 中国小的外包软件开发公司，有独特的代码存储规范。会将 Java 后端代码和前端代码都存储在同一个 git 仓库内，这导致我的前端 monorepo 代码的目录和 git 目录是对不齐的，中间差了一层，所以发包故障，需要额外的，临时的 patch 补丁文件。
3. 我们用的是中国阿里巴巴公司提供的 git 托管平台，其 git tags 对比链接的格式和 github 不一样，所以即使完成了发版，我也不能在平台内看到清晰的对比。

relizy 包可能需要做出很多更改，适应各种诡异的使用场景。

---

## 新增复盘入口

1. [PR #58 实战复盘与经验教训](./pr58-retrospective-and-lessons/)
   - 总结了 GNU 工具缺失、baseline tag 缺失、coverage 处理策略、真实本地发版验证、以及为什么 nested git root 必须拆到下一个 PR。

> ![2026-03-27-00-20-23](https://gh-img-store.ruan-cat.com/img/2026-03-27-00-20-23.png)

---
