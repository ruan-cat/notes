# 本文档项目通用的杂项提示词

## 01 <!-- 有专门的页面说明如何使用了 --> 调研 antfu 仓库的发包发版方案

github 用户 antfu 是前端开发领域重要的开发者。请你帮我调研他发布的依赖包，维护的 github 项目，帮我研究一下以下几个问题：

1. 他是用怎么样的方案来发布依赖包的？
2. 他是怎么实现依赖包版本升级的？
3. 他是怎么确保更新日志能够写入到 github release 内的？
4. 他是怎么在 github workflow 内配置 github 工作流的？是怎么触发发版的？
5. 是什么配置实现了 node 包的打包，并推送到 npm 的？
6. 他的依赖包在 monorepo 架构的仓库内，版本号是各自独立发布的？还是统一单一的版本号？

请你用以下格式给出报告：

1. 为我编写一个完整全面的报告，说明清楚 antfu 的发包流程。
2. 用 mermaid 图绘制 antfu 的发包流程。
3. 请用严谨的 markdown 格式来编写报告，务必增加清晰的标题项。

## 02 帮我找关于 markdown 维护顶部 yaml 头部信息的 node 库

我需要对 md 文件顶部的 yaml 信息做统一的管理，包括常见的增删改查。请你帮我推荐几个相关的 node 库。

## 03 阅读报告并编写一个迁移子代理

我需要你帮我阅读文件，并编写一个便于我复用的 claude code agent 子代理文件。

请阅读：

- docs\ruan-cat-notes\docs\sundry\antfu-release-plan\index.md
- docs\ruan-cat-notes\docs\sundry\antfu-release-plan\github-copilot.md
- docs\ruan-cat-notes\docs\sundry\antfu-release-plan\gemini.md

请你认真思考上述的报告结论，在 .claude\agents 目录内，新建一个子代理，便于我未来重复执行该子代理，实现项目改造，实现发包所必要的基础配置。

### 01 仅仅使用唯一的发包方案

请你帮我修改 `.claude\agents\setup-release-workflow.md` 文件，重新设计初始化发包方案的子代理配置。

- 版本升级： Bumpp
- 项目构建： tsup
- 日志生成： changelogithub

## 04 对本项目使用 `setup-release-workflow` 子代理

<!--
 TODO:
 1 先迭代一轮 setup-release-workflow 子代理
 2 再开始重新设置本项目
-->

<!-- TODO: -->

## 05 调研 conventional-changelog

阅读该 github 仓库：

- https://github.com/conventional-changelog/conventional-changelog

这是一个复杂的 monorepo，我想入门学习使用 conventional-changelog 系列的 node 包，实现本地更新日志的生成。

但是我搞不清楚 `conventional-changelog-cli` 这款包，请问这款 `conventional-changelog-cli` 还应该要继续使用吗？

请部分地阅读该更新日志：

- https://github.com/pengzhanbo/vuepress-theme-plume/blob/main/CHANGELOG.md

请问这种更新日志是用 conventional-changelog 的哪款依赖包生成的？用什么方式来生成的？生成流程是如何的？

我也想在任意一个 node 项目内初始化这一套日志生成手段，也想生成这种带有 github diff 差异对比的链接。

请生成一个文档，教我如何生成。
