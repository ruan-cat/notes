# metaso 的调研报告

Antfu（前端开发者）发布依赖包的完整调研报告

---

## 目录

- [metaso 的调研报告](#metaso-的调研报告)
  - [目录](#目录)
  - [整体发布方案概述](#整体发布方案概述)
  - [版本升级实现细节](#版本升级实现细节)
  - [更新日志写入 GitHub Release 的机制](#更新日志写入-github-release-的机制)
  - [GitHub Workflow 配置与触发方式](#github-workflow-配置与触发方式)
  - [Node 包打包与 npm 推送配置](#node-包打包与-npm-推送配置)
  - [Monorepo 中的版本管理策略](#monorepo-中的版本管理策略)
  - [完整发包流程 Mermaid 图](#完整发包流程-mermaid-图)

---

## 整体发布方案概述

- **核心脚本**：`nr release`（`nr` 为 `ni`/`pnpm` 的统一脚本入口）。
- **主要工具**：
  - **`bumpp`** – 自动完成 **版本号 bump、Git tag 创建、提交、推送**。
  - **`changesets`** 或 **`semantic-release`** – 根据 **Conventional Commits** 生成 **CHANGELOG**。
- **发布模式**
  1. **本地手动发布**：`prepublishOnly` 脚本执行 `nr build`，随后手动 `npm publish`。
  2. **CI 自动发布**：在 CI 中通过 **Git tag**（形如 `vX.Y.Z`）触发 GitHub Actions，完成构建 → 生成 Release → 推送至 npm。

---

## 版本升级实现细节

| 步骤                         | 说明                                                          | 关键工具      |
| ---------------------------- | ------------------------------------------------------------- | ------------- |
| 1️⃣ 触发 `nr release`         | 开发者在本地运行 `nr release`，进入交互式版本选择。           | `nr`、`bumpp` |
| 2️⃣ 选择版本类型              | `major / minor / patch`（依据提交类型）                       | `bumpp`       |
| 3️⃣ 自动生成 Git tag          | 生成形如 `v1.2.3` 的 tag 并提交到仓库。                       | `bumpp`       |
| 4️⃣ 递归/过滤升级（Monorepo） | `bumpp -r` 对所有子包递归 bump；`--filter <pkg>` 只针对单包。 | `bumpp`       |
| 5️⃣ 本地构建 & 测试           | `nr test && nr build` 确保新版本可用。                        | `nr`          |
| 6️⃣ 推送 tag                  | `git push --follow-tags` 将 tag 推送至远端。                  | Git           |

- **独立发布**：通过 `--filter` 只对目标子包 bump，生成对应的 tag（如 `pkg-a@1.0.0`）。
- **统一版本**：在根目录执行 `bumpp`，所有子包共享同一 tag。

---

## 更新日志写入 GitHub Release 的机制

1. **提交信息规范**：项目强制使用 **Conventional Commits**（`feat:`、`fix:`、`chore:` 等）。
2. **CHANGELOG 生成**
   - **`changesets/action`**（在 `.changeset` 目录下维护）或 **`semantic-release`** 自动解析提交，生成 **`CHANGELOG.md`**。
3. **GitHub Release 创建**
   - 在 CI 中，`create-release` 步骤读取生成的 changelog（通过 `steps.changelog.outputs.notes`），将其填入 Release 的 `body`。
   - 这样 **GitHub Release 页面** 与 **项目根目录的 CHANGELOG** 内容保持同步。

---

## GitHub Workflow 配置与触发方式

文件路径：`.github/workflows/release.yml`

```yaml
name: Release

on:
  push:
    tags:
      - "v*" # 仅在以 v 开头的 tag 推送时触发

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write # 允许创建 Release
      packages: write # 允许发布 npm 包

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: https://registry.npmjs.org

      - name: Install dependencies
        run: pnpm i --frozen-lockfile

      - name: Run tests
        run: nr test

      - name: Build package
        run: nr build

      - name: Generate changelog
        id: changelog
        uses: changesets/action@v1
        with:
          publish: false # 只生成 changelog，不发布

      - name: Create GitHub Release
        uses: actions/create-release@v1
        with:
          tag_name: ${{ github.ref_name }}
          release_name: ${{ github.ref_name }}
          body: ${{ steps.changelog.outputs.notes }}

      - name: Publish to npm
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: npm publish --access public
```

- **触发条件**：`push` 事件且 **tag 名称匹配 `v*`**（由 `bumpp` 自动创建）。
- **关键步骤**：
  - `changesets/action` 生成 changelog。
  - `actions/create-release` 将 changelog 写入 GitHub Release。
  - `npm publish` 将构建产物推送至 npm。

---

## Node 包打包与 npm 推送配置

| 配置位置                          | 内容                                                       | 说明                                                                    |
| --------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------- |
| `package.json`（根或子包）        | `json "scripts": { "prepublishOnly": "nr build" }`         |
| 在 `npm publish` 前自动执行构建。 |
| CI 步骤                           | `run: npm publish --access public`                         | 使用 `NODE_AUTH_TOKEN`（存于 GitHub Secrets `NPM_TOKEN`）完成身份验证。 |
| 打包工具                          | **`unbuild`**、**`vite`**、**`rollup`** 等（依据具体项目） | 通过 `nr build` 调用对应打包脚本，产出 `dist/` 目录。                   |
| 依赖管理                          | **`pnpm`**（或 `ni`）                                      | 统一锁文件 `pnpm-lock.yaml`，保证 CI 与本地环境一致。                   |

---

## Monorepo 中的版本管理策略

- **独立版本**（多数 Antfu 的 monorepo 采用）
  - 每个子包拥有独立的 `package.json` 与版本号。
  - `bumpp -r` 会遍历所有子包，分别为每个子包生成 **独立的 Git tag**（如 `pkg-a@1.2.0`、`pkg-b@0.9.5`）。
  - 适用于 **插件/工具链**（如 `vite-plugin-*`、`unocss`）的独立发布需求。

- **统一版本**（少数整体工具链）
  - 只在根目录执行 `bumpp`，所有子包共享同一 tag（如 `v2.3.0`），发布时一次性 `npm publish` 所有子包。

> **结论**：Antfu 的大多数 monorepo 项目采用 **独立版本** 策略，以便每个工具/插件可以独立迭代、发布。

---

## 完整发包流程 Mermaid 图

```mermaid
flowchart TD
    A[本地代码提交] --> B{需要发布?}
    B -- 是 --> C[nr release]
    C --> D[bumpp 交互选择版本]
    D --> E[生成 Git tag vX.Y.Z]
    E --> F[prepublishOnly: nr build]
    F --> G[本地 npm publish（可选）]
    G --> H[git push --follow-tags]
    H --> I[GitHub Actions 触发 release.yml]
    I --> J[checkout & setup Node]
    J --> K[install dependencies (pnpm)]
    K --> L[run tests (nr test)]
    L --> M[build package (nr build)]
    M --> N[generate changelog (changesets/semantic‑release)]
    N --> O[create-release@v1 → GitHub Release]
    O --> P[publish to npm (npm publish)]
    P --> Q[发布完成，Release 与 npm 同步]
```

---

**以上即为 Antfu 在前端生态中常用的发包、版本管理与 CI/CD 流程的完整调研报告。**
