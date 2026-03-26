# bug: Windows 下首次 independent 发版仍依赖 GNU 工具与手工 baseline tag

## 摘要

> 说明：发布者并非英文母语者。此问题稿由 AI 辅助整理、翻译与生成，但其中的代码阅读、事故分析与下游复现结论都已实际核对。

在 **Windows** 上，对一个**全新的 monorepo** 直接执行 `relizy release` / `relizy bump`（尤其是 `independent` 模式）时，当前 `relizy` 仍然没有提供完整的“首次发版”闭环：

1. 内部仍依赖 `grep` / `head` / `sed` 这类 GNU 命令，PowerShell / cmd 下经常默认不可用。
2. 对“没有 baseline tag 的首次发版”只有**部分**内部处理，仍需要下游仓库额外包装兼容层，或者手工补打 baseline tag，才能把流程跑通。

也就是说，当前首发路径在实践中仍依赖外部 wrapper 去补环境、补前置校验，而不是由 `relizy` 核心自身完整处理。

这个问题与已修复的 Windows 路径分隔符问题（issue #52 / PR #53）**不是同一个问题**；与“Git 根目录不等于 relizy 工作目录”的问题也**不同**。

---

## 环境

| 项       | 值                                                |
| -------- | ------------------------------------------------- |
| OS       | Windows 10 / 11 (`win32`)                         |
| Shell    | PowerShell / cmd                                  |
| relizy   | 当前 `develop` 分支可见问题                       |
| Node     | `>=20`                                            |
| 典型场景 | `monorepo.versionMode = "independent"` 的首次发版 |

---

## 当前现象

下游项目为了在 Windows 上完成首次发版，不得不额外提供一个兼容层脚本，在调用 `relizy` 前做三件事：

1. 给 PATH 补齐 Git for Windows 自带的 `usr/bin`，确保 `grep` / `head` / `sed` 可执行。
2. 在 `release` / `bump` 前扫描工作区包，检查每个包是否已经存在 `pkg@x.y.z` 形式的 baseline tag。
3. 缺少 baseline tag 时，直接中止并打印手工补 tag 的命令。

这说明当前 `relizy` 核心本身，仍然没有对“Windows + 首次 independent 发版”提供真正开箱即用的支持。

### 当前下游的临时兼容方案：`relizy-runner`

为了绕开这些不兼容点，下游目前使用了一个**手写的兼容脚本**：

- 实现代码：
  `https://github.com/ruan-cat/monorepo/blob/dev/packages/utils/src/node-esm/scripts/relizy-runner/index.ts`
- 设计说明：
  `https://utils.ruan-cat.com/node-esm/scripts/relizy-runner.md`

这个脚本的定位不是替代 `relizy`，而是在调用 `relizy` 之前补一层“环境兼容 + 首发前置校验”。按当前实现，它主要做三件事：

1. **Windows GNU 工具补齐**
   - 在 Windows 下自动尝试定位 Git for Windows 的 `usr/bin`
   - 把 `grep` / `head` / `sed` 补到 PATH
   - 这样 `relizy` 当前仍存在的 shell 管道路径才有机会执行成功

2. **independent 基线 tag 预检**
   - 在 `release` / `bump` 前扫描 `pnpm-workspace.yaml` 里的工作区包
   - 检查每个包是否已有 `pkg@version` 形式的 tag
   - 如果缺失，则直接终止并打印补打 tag 的命令

3. **为 `release` / `bump` 默认追加 `--yes`**
   - 避免 `relizy` 在 CI 或非 TTY 终端里卡在交互确认
   - 这属于流程便利性处理，不涉及版本计算逻辑

需要特别说明的是，这个 `relizy-runner` **并不会修改 `relizy` 自身的发版算法**。它只是一个下游兼容层：

- 它**负责**补环境、做基线预检、补 `--yes`
- 它**不负责**修复 `relizy` 内部对 tag、commit range、首次发版 baseline 的核心建模问题

也正因为如此，下游现在能“跑起来”，并不代表 `relizy` 核心已经把这些问题真正解决了。这个 issue 的目标，就是把目前只能由 `relizy-runner` 手工兜底的那部分能力，尽可能回收到 `relizy` 自身。

---

## 根因

### 1. 核心代码里仍有 GNU 管道依赖

当前源码中仍可见多处 shell 管道：

#### `src/core/tags.ts`

```ts
git tag --sort=-creatordate | grep -E '...' | head -n 1
git tag --sort=-creatordate | head -n 1
git tag --sort=-creatordate | grep -E '^pkg@' | head -n ${limit}
git tag --sort=-creatordate | grep -E '...' | sed -n '1p'
```

#### `src/core/repo.ts`

```ts
git log --reverse --format="%H" -- "${relativePath}" | head -1
```

这些命令在 Linux / macOS / Git Bash 中通常可用，但在 Windows 的 PowerShell / cmd 环境里并不可靠。结果是：

- tag 发现失败；
- 新包首次发版时，为了避免 ENOBUFS 而做的 `getFirstPackageCommitHash()` 路径，也会因为 `head` 不可用而失败；
- 用户只能在外部 wrapper 里补 PATH，或者安装额外 GNU 工具。

这说明 Windows 兼容性仍停留在“下游补环境”，而不是 `relizy` 核心自身的纯 Node 实现。

### 2. “无 baseline tag 的首发路径”只做到了部分内部建模

当前代码已经有一部分明显朝“无需手工 baseline tag”在演进：

- `src/core/tags.ts` 引入了 `NEW_PACKAGE_MARKER`
- `src/core/repo.ts` 在 `from === NEW_PACKAGE_MARKER` 时，会尝试回退到“该包第一次出现的提交”
- 文档也把首发 changelog 展示为 `v0.0.0...vX.Y.Z`

但这条路径仍然不完整：

1. `NEW_PACKAGE_MARKER` 主要解决的是“不要从整个仓库第一提交开始做 diff，避免 ENOBUFS”，并没有把“无 baseline tag 的首发”提升为统一的核心语义。
2. `src/core/changelog.ts` 仍然主要围绕“真实 tag”或 `getFirstCommit()` 回退来组织显示逻辑，没有把无 baseline tag 作为一个贯通 bump / changelog / compare / provider release 的正式状态来处理。
3. `src/core/tags.ts` 在 unified / selective 路径里，仍然存在 `getLastRepoTag(...) || getFirstCommit(config.cwd)` 这样的回退。

基于当前源码的推断：

> **推断（来自源码阅读）**：如果把仓库的“第一条提交本身”直接当作 `from`，左边界提交有可能不会被视为本次差异的一部分；而独立新包路径已经特意使用了 `firstPackageCommit^` 去避免这个问题。这说明“首发无 tag”应当被当作一个正式的 baseline 解析问题统一建模，而不应该在不同路径里混用“真实 tag / 第一提交 / 特殊 marker”三套语义。

换句话说，现在的实现已经有“想支持首发”的部件，但还没有形成端到端闭环，因此下游仍不得不用 wrapper 的 baseline 预检来挡住问题。

---

## 期望行为

`relizy` 应该把以下场景视为**原生支持**：

1. 在 Windows 下，即使用户只安装了 Node 和 Git for Windows，也能直接执行 `relizy release` / `relizy bump`，不需要额外依赖 `grep` / `head` / `sed`。
2. 在 `independent` 模式下，如果某个包还没有历史 tag，`relizy` 也应当能把它视为“首次发版”，而不是要求用户先手工补 baseline tag。
3. 首次发版时，版本计算、提交范围解析、changelog 标题、compare 区间、provider release 文案，都应基于同一套“bootstrap baseline”语义，而不是把这件事留给下游 wrapper。

---

## 建议的修复方案

### 方案核心

把“Windows 无 GNU 工具”和“首次无 baseline tag”都收敛进 `relizy` 核心，做成同一条可测试、可维护的首发路径。

### 具体建议

#### 1. 用纯 Node 替换 shell 管道

建议把 tag / 首次提交发现都改成“单次 git 命令 + Node 内存过滤”：

- 用 `git tag --sort=-creatordate` 一次拿到 tag 列表；
- 在 JavaScript / TypeScript 中完成 stable / package tag 的过滤与截断；
- `getFirstPackageCommitHash()` 改为单次 `git log --reverse --format="%H" -- <path>`，再在 Node 里取第一行；
- 不再依赖 `grep` / `head` / `sed`。

这样可以把 Windows 兼容性从“依赖外部 PATH 补丁”收回到核心库本身。

#### 2. 把“无 baseline tag”做成正式的 baseline 解析层

建议不要再把“首次无 tag”理解成下游需要手工补一个真实 tag，而是由 `relizy` 内部统一解析为一种正式状态，例如：

- repo 级无 tag baseline
- package 级无 tag baseline

这个 baseline 解析层可以返回两类信息：

- **计算用边界**：真正用于取 commit range 的 git revision，例如“首个相关提交的父提交”
- **展示用边界**：用于 changelog / compare / release 文案的虚拟起点，例如 `v0.0.0` 或 `pkg@0.0.0`

也就是说：

- **计算**不应依赖一个必须事先存在的真实 git tag；
- **展示**仍然可以保留当前文档里已经存在的 `v0.0.0...vX.Y.Z` / `pkg@0.0.0...pkg@X.Y.Z` 形式。

#### 3. 让这套 baseline 语义贯通整个流程

建议至少统一覆盖这些模块：

- `src/core/tags.ts`
- `src/core/repo.ts`
- `src/core/changelog.ts`
- 与 compare / provider release 相关的生成逻辑

目标是：

- bump 阶段能正确找到首发的 commit 范围；
- changelog 阶段能正确生成 `0.0.0 -> 新版本` 的展示；
- provider release / compare link 不再假设“既然要首发，就必须已经有真实 baseline tag”。

#### 4. 增加回归测试

建议新增基于 Vitest 的回归测试，至少覆盖：

- Windows 下 tag 解析与首次包提交发现不依赖 GNU 工具；
- independent 模式中“无 package tag 的首次发版”；
- unified / selective 模式中“无 repo tag 的首次发版”；
- changelog 首发展示仍然是 `v0.0.0...vX.Y.Z` 或 `pkg@0.0.0...pkg@X.Y.Z`；
- 不影响已有 tag 的正常升级路径。

---

## 为什么这比“继续让下游手工打 baseline tag”更合理？

因为 `relizy` 文档已经把“first release”描述成正常能力，而不是一个需要用户自己做 bootstrap 的半手工流程。既然核心库已经有 `NEW_PACKAGE_MARKER` 和 `v0.0.0` 这类设计痕迹，那么更自然的方向是把它补完整，而不是继续把首发问题外包给每个下游项目去写 wrapper。

---

## 额外说明

- 这不是 issue #52 所修复的 Windows 路径分隔符问题；那一类问题已经由路径标准化处理解决。
- 这也不是“nested git root / `gitRoot` 不一致”问题；那是另一条独立故障线。
- 当前下游兼容层只是临时兜底，目标应当是让 `relizy` 自身把首发与 Windows 环境兼容做好。

---

## 参考

- issue #52: Windows path separator mismatch causes "No packages to bump" in independent monorepo mode
- PR #53: normalize path separators to POSIX before commit body matching
- 当前源码中的相关位置：
  - `src/core/tags.ts`
  - `src/core/repo.ts`
  - `src/core/changelog.ts`
  - `docs/src/guide/getting-started.md`
  - `docs/src/guide/changelog.md`
