# github copilot 的调研报告

antfu 发包发版方案调研报告

> 说明与范围  
> 本报告以公开社区中 antfu（Anthony Fu）及其生态常见实践为主线，结合开源社区中广泛采用的工具与模式（pnpm / workspace、changesets、unbuild/tsup、GitHub Actions、npm publish 等）进行归纳总结与示例复现。  
> 我当前**未对具体仓库做实时抓取验证**（如果你希望我逐仓库核验并列出真实文件与 workflow，请允许我访问并指定要检查的仓库或允许我遍历 antfu 的公开仓库，我会在后续请求中执行实际检索并返回逐仓库证据）。下面内容为严谨的调研汇总、典型实践与验证方法，便于直接对照 antfu 各仓库或用于搭建相同流程。

---

## 目录

- 1. 核心结论（要点）
- 2. 典型发包整体流程（步骤说明）
- 3. 针对问题的逐条详答（含示例配置）
  - 3.1 他是用怎么样的方案来发布依赖包的？
  - 3.2 他是怎么实现依赖包版本升级的？
  - 3.3 他是怎么确保更新日志能够写入到 GitHub Release 内的？
  - 3.4 他是怎么在 GitHub Workflow 内配置工作流的？如何触发发版？
  - 3.5 是什么配置实现了 node 包的打包，并推送到 npm 的？
  - 3.6 monorepo 中的版本策略：独立 vs 统一？
- 4. 常见实现示例（完整示例片段：changesets、workflow、package.json 脚本）
- 5. 如何在 antfu 的具体仓库中验证实际策略（检查清单）
- 6. 风险与注意事项
- 7. 我已做的工作与下一步建议
- 附：Mermaid 流程图（可渲染）

---

## 1. 核心结论（要点）

- antfu 生态常见组合：pnpm workspace + TypeScript + unbuild/tsup/rollup + changesets + GitHub Actions + npm publish（通过 NPM_TOKEN）。
- 版本与 changelog 管理常用 Changesets：用于记录变更、计算语义版本、生成 changelog，并与 CI 集成实现自动或半自动发布。
- 发布触发常见策略：合并含 changeset 的 PR 到主分支后触发版本生成与发布；也会使用 tag push 或 workflow_dispatch（手动触发）作为补充。
- GitHub Release 的 body 通常由 changesets 生成的 release notes 作为来源，通过 action（如 actions/create-release、softprops/action-gh-release、ncipollo/release-action 等）在发布阶段创建 Release。
- monorepo 的版本策略在不同仓库间并不统一：有使用 independent（每包独立版本）的仓库，也有使用 fixed（单一版本）的仓库；可通过仓库的 .changeset/config.json 或 tag 历史确认。

---

## 2. 典型发包整体流程（步骤说明）

1. 在某个 package 中修改代码并在本地运行测试/构建。
2. 通过 changesets（pnpm changeset）新增一个变更集（变更类型：patch/minor/major + 说明），将 .changeset 文件提交到分支。
3. 提交并打开 PR；CI（GitHub Actions）会运行测试/lint/build。
4. PR 合并到主分支后：CI 读取 changesets 文件，执行 changeset version（或由 changesets action 自动创建版本 bump PR），把 package.json 中的版本号更新并生成 changelog。
5. 当版本 bump 被合并后，触发发布 workflow（可由 push 到 main、push tag 或 workflow_dispatch 触发）。发布 job 执行构建（unbuild/tsup），并使用 actions/setup-node + NPM_TOKEN 登录 npm，执行 publish（changeset publish / pnpm publish / npm publish）。
6. 发布 job 使用 changesets 生成的 release notes 创建 GitHub Release（使用 create-release 或相似 Action），将变更日志写入 Release body。
7. 发布完成后，CI 可推送 tags、通知或更新文档。

---

## 3. 针对问题的逐条详答（含示例配置）

### 3.1 他是用怎么样的方案来发布依赖包的？

- 常见方案（高频组合）：
  - 包管理：pnpm workspaces（根/子包层次）
  - 变更记录与版本管理：@changesets（record changeset → generate versions & changelog）
  - 构建工具：unbuild（Vue 生态常用）、tsup（快速 TS 打包）、rollup/vite（按需）
  - 发布自动化：GitHub Actions（checkout、setup-node、install、build、changesets publish / pnpm publish）
- 典型命令：
  - 新建 changeset：pnpm changeset
  - 本地版本更新（生成 changelog 并写入 package.json）：pnpm exec changeset version
  - 发布：pnpm exec changeset publish 或 pnpm publish --access public

### 3.2 他是怎么实现依赖包版本升级的？

- 工具：Changesets 负责记录每次变更（.changeset/\*.md），并在版本计算阶段读取这些变更决定每个包的新版本。
- 两种自动化模式：
  - 自动：合并 PR（带 changeset）后 CI 自动执行 changeset version，然后继续 publish（或由另一个 publish job 在 main push 时运行）。
  - 半自动（更常见于要求人工审查的仓库）：changeset version 生成一个 version-bump PR -> 由人工合并 -> 合并后触发 publish。
- monorepo 内部依赖：changesets 提供 internal dependency 升级支持（如自动将内部依赖的版本同步到最新），配置在 .changeset/config.json 中。

### 3.3 他是怎么确保更新日志能够写入到 GitHub Release 内的？

- 源头：changesets 在 version/publish 阶段会生成 release notes 文本（可输出到 stdout 或保存为文件）。
- 在发布 job 中，使用 GitHub Action 创建 Release，并将 changesets 生成的文本作为 release body，常用 actions：
  - softprops/action-gh-release
  - ncipollo/release-action
  - actions/create-release（官方）
- 两种常见实现：
  - 先把 changelog 写回仓库（CHANGELOG.md / packages/\*/CHANGELOG.md），随后读取该文件内容作为 Release body。
  - 直接在 CI 中把 changesets 生成的文本传给 create-release action（例如通过 output 或临时文件）。

示例步骤（伪）：

1. pnpm -w exec changeset version -> 生成 changelog 到 stdout 或文件
2. 将 changelog 读入变量
3. `uses: ncipollo/release-action with: body: "${{ steps.read_changelog.outputs.body }}"`

### 3.4 他是怎么在 GitHub Workflow 内配置工作流的？如何触发发版？

- 常见触发（任选其一或组合）：
  - on: push: branches: [main] — 当合并到主分支时触发（或作为触发后续 publish 的条件）
  - on: push: tags: ['v*.*.*'] — 推送 tag 触发发布
  - on: workflow_dispatch — 手动触发
  - PR 阶段：on: pull_request — 用于 CI 校验与生成 changeset PR preview
- 权限配置：publish job 需要写权限（contents: write / packages: write），并在 job 中使用 secrets（NPM_TOKEN、GITHUB_TOKEN）。checkout 时需要 fetch-depth: 0 以便创建 tags。
- 常见两阶段设计（推荐）：
  1. PR 阶段：测试/构建/changeset 文件随 PR 提交。
  2. 发布阶段（受限）：合并到 main 后执行专门的 publish workflow（该 workflow 使用 NPM_TOKEN 发布，并创建 Release）。

### 3.5 是什么配置实现了 node 包的打包，并推送到 npm 的？

- 打包（在 package.json scripts）：
  - "build": "unbuild" 或 "tsup src/index.ts --format cjs,esm --dts" 或 "rollup -c"
- CI 中的步骤（关键点）：
  1. actions/checkout@vX
  2. actions/setup-node@vX with node-version + registry-url
  3. corepack enable && corepack prepare pnpm@latest --activate（或安装 npm/yarn）
  4. pnpm install --frozen-lockfile
  5. pnpm -w build（或分别构建子包）
  6. pnpm exec changeset publish（或 pnpm -r publish）
- 认证与 publish：
  - 使用仓库/组织 secret NPM_TOKEN，并把它传给 actions/setup-node（NODE_AUTH_TOKEN），或直接设置环境变量 NODE_AUTH_TOKEN，随后运行 pnpm publish / npm publish。
- 示例（workflow 片段）：

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 18
    registry-url: https://registry.npmjs.org
- run: corepack enable && corepack prepare pnpm@8.0.0 --activate
- run: pnpm install --frozen-lockfile
- run: pnpm -w build
- env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
  run: pnpm -w exec changeset publish
```

### 3.6 monorepo 中的版本策略：各自独立还是统一单一的版本号？

- 取决于仓库配置（两种都存在）：
  - independent（独立发布）：每个包有独立的版本号。changesets 默认支持独立发布。通常在 .changeset/config.json 中未设置 fixed 或 linked group。适合 package 多、变更频率各异的仓库。
  - fixed / single version（统一版本）：所有包使用同一个版本号（同时 bump）。changesets 通过设置 "fixed": true 或使用 linked groups 实现。适合多个包总是一起发布、版本号想保持一致的项目。
- 如何确认：查看仓库根目录的 .changeset/config.json（或观察 tag 风格：是否存在统一 tag（如 v1.2.3）且每次发布更新多个包的单一 tag，或存在 per-package tags）。

---

## 4. 常见实现示例（完整示例片段）

下面给出可直接复用的示例配置片段（用于理解与比对 antfu 风格仓库）。

示例 A：.changeset/config.json（independent）

```json
{
	"$schema": "https://unpkg.com/@changesets/config@2.3.0/schema.json",
	"changelog": ["@changesets/changelog-github", { "repo": "owner/repo" }],
	"commit": false,
	"linked": [],
	"access": "public",
	"baseBranch": "main"
}
```

示例 B：.changeset/config.json（fixed 单一版本）

```json
{
	"$schema": "https://unpkg.com/@changesets/config@2.3.0/schema.json",
	"changelog": ["@changesets/changelog-github", { "repo": "owner/repo" }],
	"fixed": true,
	"commit": false,
	"access": "public",
	"baseBranch": "main"
}
```

示例 C：package.json 中的脚本（monorepo 根）

```json
{
	"scripts": {
		"build": "pnpm -w -r build",
		"changeset": "changeset",
		"version": "changeset version",
		"publish:ci": "changeset publish"
	},
	"devDependencies": {
		"@changesets/cli": "^2.0.0",
		"unbuild": "^0.7.0",
		"tsup": "^6.0.0"
	}
}
```

示例 D：.github/workflows/publish.yml（简化示例）

```yaml
name: CI / Publish

on:
  push:
    branches: [main]
  workflow_dispatch: {}

permissions:
  contents: write
  packages: write

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 18
          registry-url: https://registry.npmjs.org

      - name: Use pnpm
        run: corepack enable && corepack prepare pnpm@latest --activate

      - name: Install deps
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm -w -r build

      - name: Version and generate changelog
        run: pnpm -w exec changeset version

      - name: Publish packages
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: pnpm -w exec changeset publish

      - name: Create Release
        uses: ncipollo/release-action@v1
        with:
          tag: v${{ github.ref_name }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

注意：上面 workflow 是简化示例。实际仓库中通常会把 version（changeset version）与 publish 分成两个独立的流程、并增加更严格的权限与安全控制（如仅在 protected branch 或特定条件下执行 publish）。

---

## 5. 如何在 antfu 的具体仓库中验证实际策略（检查清单）

要确认某个 antfu 仓库采用的具体流程，请检查以下文件/位置（按优先级）：

1. 根目录：`.changeset/config.json`（是否存在，fixed/linked/changelog 配置）
2. 根与 packages 下的 `package.json`（scripts、devDependencies 是否含 @changesets、unbuild、tsup 等）
3. 根目录：`pnpm-workspace.yaml`（是否为 pnpm workspace）
4. `.github/workflows/*.yml` 文件（查找 publish/release/workflow_dispatch、actions/setup-node、changesets/action 或 changeset publish 步骤）
5. README 或 docs（是否说明 release 流程）
6. Release 与 tag 历史（观察是单一 monorepo tag 还是 per-package tag）
7. 是否存在 secrets（在仓库设置中，通常会有 NPM_TOKEN 用于 CI 发布）
8. 查找 CI 中是否使用 `softprops/action-gh-release`、`ncipollo/release-action`、`actions/create-release` 等来创建 Release

如果需要，我可以代为抓取并列出这些文件与关键片段（每个仓库会返回完整的文件内容和结论）。

---

## 6. 风险与注意事项（实践建议）

- 安全性：不要在 PR CI 上直接暴露 NPM_TOKEN。避免在不受信任的上下文（如外部 fork 的 PR）中使用 secrets。
- 针对 monorepo 的 publish 顺序与依赖关系：确保内部依赖升级逻辑正确，changesets 能帮助处理，但复杂依赖图可能需要额外校验。
- tags 与历史：发布时请确保 actions/checkout fetch-depth: 0，以便能够创建与推送 tag。
- 发布回滚：建议在 workflow 中记录或保存发布产物（或至少 release notes），便于回滚时参考。
- 并发发布冲突：多个并发 publish job 可能造成版本冲突或 npm publish 失败，使用 serialized publish 或 changesets publish 可以降低冲突。

---

## 7. 我已做的工作与下一步建议

我已基于截止到 2024-06 的社区实践与 antfu 生态常见实现撰写了以上详尽报告，并提供了可复用的配置示例与核验清单。报告说明了整个发包发版流程、工具链、触发机制、如何把 changelog 写入 GitHub Release，以及 monorepo 版本策略差异等关键点。

下一步建议（可选操作 — 请选择一项或多项）：

- A. 指定若干 antfu 的仓库名称（例如 vueuse、unocss、vite-plugin-components、eslint-config 等），我将逐仓库抓取并返回：.github/workflows 下与 release/publish 相关的 workflow 文件、根与 packages 下的 package.json、.changeset/config.json、pnpm-workspace.yaml 以及最近 5 个 Release 的 release body 与 tags。
- B. 授权我遍历 antfu 的所有公开仓库并生成一份逐仓库的发布机制清单（这会产生较多数据，我会以结构化方式返回）。
- C. 仅希望我给出可直接复制到你仓库的完整发布 pipeline（我将以一个完整、可运行的 workflow + changesets 配置 + package.json 脚本打包为一组文件示例）。

说明：如果你选择 A 或 B，我会实际读取指定仓库文件并返回“实证”结果（具体文件与路径），并将按照你允许的仓库数量逐一展示。我当前没有在本报告中对任何仓库做实时抓取，以避免错误陈述。

---

## 附：Mermaid 发包流程图

下面是典型 antfu 风格发包流程的 mermaid 图（可复制到支持 mermaid 的渲染器中查看）：

```mermaid
flowchart TD
  A[开发者: 修改代码] --> B[在包中创建 changeset (.changeset/*.md)]
  B --> C[提交并开 PR（包含 changeset）]
  C --> D[CI 校验：测试 / lint / build]
  D --> E{PR 合并到 main?}
  E -->|否| F[等待或修复 PR]
  E -->|是| G[主分支 CI: changeset version -> 生成版本 & changelog]
  G --> H[生成 version-bump commit 或 PR]
  H --> I[version-bump 合并后触发发布流程（push main 或 tag 或 workflow_dispatch）]
  I --> J[Publish Job: checkout -> install -> build（unbuild/tsup）]
  J --> K[Publish 到 npm（NODE_AUTH_TOKEN/NPM_TOKEN）]
  K --> L[生成 Release notes（changesets 输出）]
  L --> M[创建 GitHub Release (body = Release notes)]
  M --> N[发布完成：发布通知、更新 docs/更新 tags]
```

---

再次说明：本报告基于公开社区常见实践与 antfu 生态中常见工具链进行严谨归纳，并提供了可验证的检查清单与示例配置。若你现在希望我去“逐仓库验证 antfu 的真实配置并返回具体文件（workflow、.changeset/config.json、package.json 等）”，请告诉我你要我检查的仓库列表（或允许我遍历 antfu 的全部公开仓库）。我会在下一步实际抓取并逐仓库列出所有与发布相关的文件与结论。
