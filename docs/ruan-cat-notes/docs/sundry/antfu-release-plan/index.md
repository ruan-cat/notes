# 调研 antfu 仓库的发包发版方案

我眼馋这个发版方案很久了，打算学一下，不要再拖延不学习了。

## 对 antfu 发包流程的理解

我没有看到 antfu 的包有 changeset 变更集和 changelog 变更日志的东西。可以肯定的是，存在两套 monorepo 依赖包版本号发版方案的。

1. 基于 changeset 变更集的方案。
2. antfu 系列方案。

大致了解的 antfu 发版方案如下：

- 版本号升级： [bumpp](https://github.com/antfu-collective/bumpp)
- 依赖构建： unbuild （或者是其他工具）
- github release 发版： [changelogithub](https://github.com/antfu/changelogithub)
- 依赖升级： [taze](https://github.com/antfu-collective/taze)

## antfu 发版风格的仓库和参考资料？

<!-- TODO: -->

## 对 antfu 发版风格的理解

最核心的是两个工具：

- 版本号升级： [bumpp](https://github.com/antfu-collective/bumpp)
- github release 发版： [changelogithub](https://github.com/antfu/changelogithub)

步骤如下：

1. 手动运行 bumpp 命令。
   - 生成 git tag 标签。
   - 更新 package.json 的版本号。
   - 自动 push 提交到远程仓库。
2. 在 github workflow 内根据 `v*` 的 git tag 标签来触发生成 github release 更新日志。

### 没有本地的 CHANGELOG.md 文件

注意，这套发版风格是不会生成本地的 `CHANGELOG.md` 更新日志的。对 github 有强依赖。

### 面对 monorepo 项目无法实现多 tag 标签发布

changelogithub 是基于 changelogen 制作的，这两款工具都不能在 monorepo 仓库内实现多包多标签的发版。一次只能推送一个 git tag，对一个包做版本号变更，生成整个 github 仓库的版本号差异对比 url 链接。

该方案和 changeset 方案是不同的。changeset 方案是允许我们发布多个独立 node 包的版本号的。

## tsdown 的 vue 模板默认使用 antfu 发版风格
