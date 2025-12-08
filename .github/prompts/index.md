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

## 06 寻找 claude code 仓库

请帮我寻找 claude code 内能够直接使用本地 gemini cli 和 codex 的库。我希望在 claude code 内直接使用 gemini cli 或 codex 提供的模型。

---

就是 [`zen-mcp-server`](https://github.com/BeehiveInnovations/zen-mcp-server)

这个方案不可行。因为 zen-mcp-server 要求配置供应商的 key，我目前无法提供其他供应商的 key。

## 07 寻找最流行的 claude code skill 仓库

请帮我找 15 个最流行的 claude code skill github 仓库，便于我学习了解有哪些好用的 skill 可以使用。

- 可以查找 claude code plugin 插件商城。
- 可以查找流行的跨项目，跨模型的常用提示词。

### 01 阅读并收集整理出一份完整完全的 github 仓库 url 地址信息文档

1. 完整阅读以下 url：
   - https://github.com/copilot/c/f536c27a-bdc2-4f24-8789-015ecc1c4416
   - https://chatgpt.com/c/692763bb-cea4-8323-be44-f102ed45a017
   - https://gemini.google.com/app/5b3892f9fc81360e
2. 将上述内容，整理成一份完整全面的报告，包含全部的 github 仓库，确保不会遗漏。

## 08 寻找 vue2 老项目迁移用的知识

我想找一下关于 vue-cli（webpack + vue2） 项目迁移成 vite + vue3 项目的子代理、提示词、或 claude code skill。请帮我找相关的 github 仓库，至少 10 个。

## 09 让 claude code 学会调用 gemini 来收集上下文

claude code 要学会用 gemini 的无头模式写法，开启多款并行的探索代理（Explore agents），来完成上下文收集。

claude code 的 claude 主模型作为主代理，用于新建，并向并行子代理布置探索任务，收集信息，并从 gemini 驱动的探索子代理内，收集回上下文信息。便于 claude 模型做行为决策。

---

<!-- TODO:  -->

我来帮你规划这个大规模的重构任务。首先，我需要深入了解当前代码库的结构和相关包的实现方式。

让我启动多个探索代理来并行收集信息：

```log
  Running 3 Explore agents… (ctrl+o to expand)
   ├─ 探索 vercel-deploy-tool 当前结构 · 7 tool uses · 32.1k tokens
   │  ⎿  Read: packages\vercel-deploy-tool\tsconfig.json
   ├─ 探索 CLI 实现参考包 · 11 tool uses · 26.7k tokens
   │  ⎿  Read: configs-package\taze-config\src\cli.ts
   └─ 探索 tsup 和 c12 配置 · 13 tool uses · 37.5k tokens
      ⎿  Search: packages/vercel-deploy-tool/tsup.config.ts
```

## 010 <!-- TODO: --> 调研 OpenSpec 的使用方式

需要专门学习学会如何使用该工具提供的一系列命令。

1. 请阅读以下仓库和文档教程，学习了解核心工具 `OpenSpec-Chinese` 和 `OpenSpec` 的使用。
   - https://github.com/hex-novaflow-ai/OpenSpec-Chinese
   - https://github.com/Fission-AI/OpenSpec
   - https://www.aivi.fyi/llms/introduce-OpenSpec
2. 为我出示一份报告，教会我如何在一个全新的项目内初始化 OpenSpec ？
3. 如何在现有的 OpenSpec 配置内，继续新增、迭代规格文件？
4. `OpenSpec-Chinese` 有固定的文档规则，请问新增时的固定规则是什么？

### 01

1. 请问如何创建新的 `OpenSpec-Chinese` 模板，比如我要编写一套很复杂，很详细的规格文件，我应该怎么新建模板？并写入我的需求？
2. 整个完整的规格新建与处理的生命周期流程，请帮我总结，并用 mermaid 流程图绘制。

### 02

1. 把你总结的产出，输出到文件 `docs\reports\2025-12-08-openspec-quickstart.md` 内。
2. 请你用 pnpm dlx 的方式，初始化一个 OpenSpec 流程。用中文的工具来初始化。
3. 我需要你在仓库里补一份可复用的自定义模板示例（放 openspec/templates/），并给出一份示例 spec.md 骨架。

### 03

1. `AGENTS.md` 文件是 OpenSpec 专用的文件么？还是说是大多数 AI 工具都能够共同识别的，作为业界共识的文件？
