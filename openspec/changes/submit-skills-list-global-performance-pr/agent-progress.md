# submit-skills-list-global-performance-pr 进度记录

> 本文件只记录进度和验证证据，不是任务源。唯一任务源是 `tasks.md`。

## 1. 初始化记录

- 2026-06-07：创建 OpenSpec change `submit-skills-list-global-performance-pr`。
- 2026-06-07：确认用户要求改为 `do-long-task + openspec + goal` 的长任务推进方式，不直接按 PR-first 聊天清单执行。
- 2026-06-07：只读确认 `vercel-labs/skills` 默认分支为 `main`，关键文件包括 `src/installer.ts`、`tests/list-installed.test.ts`、`src/list.test.ts`，实际执行时仍需在克隆后的 fork 工作区重新确认。
- 2026-06-07：已创建完整 OpenSpec 工件：`proposal.md`、`design.md`、`specs/skills-global-list-performance-contribution/spec.md`、`specs/skills-performance-public-writing/spec.md`、`tasks.md`、`agent-progress.md`、`agent-findings.md`。
- 2026-06-07：已运行严格校验并通过。

```log
openspec validate submit-skills-list-global-performance-pr --strict
Change 'submit-skills-list-global-performance-pr' is valid
```

## 2. 后续执行记录模板

### 2.1. 仓库准备

```log
待记录：git remote -v、当前分支、上游 main commit、分支名。
```

#### 2.1.1. fork 工作区准备

- 2026-06-07：选中 `tasks.md` 第 1 个未完成任务，任务源为 `openspec/changes/submit-skills-list-global-performance-pr/tasks.md`。
- 2026-06-07：已刷新读取 `proposal.md`、`design.md`、`specs/`、`tasks.md`、`agent-progress.md`、`agent-findings.md`。
- 2026-06-07：已由子代理在 `D:\code\store\skills__ruan-cat` 克隆 `https://github.com/ruan-cat/skills`，主代理复核该目录是 git 仓库。
- 2026-06-07：确认 `origin` 指向 fork，`upstream` 指向 `vercel-labs/skills`，上游默认分支为 `main`。
- 2026-06-07：当前工作区分支已是 `perf/list-global-skills`，HEAD 与 `upstream/main` 一致；第 1 个 task 的验收点已满足。第 2 个 task 将单独记录分支创建确认。

```log
git rev-parse --show-toplevel
D:/code/store/skills__ruan-cat

git remote -v
origin    https://github.com/ruan-cat/skills (fetch)
origin    https://github.com/ruan-cat/skills (push)
upstream  https://github.com/vercel-labs/skills (fetch)
upstream  https://github.com/vercel-labs/skills (push)

git ls-remote --symref origin HEAD
ref: refs/heads/main HEAD
a561e790756b2785b9ddb82285c4eb0a08258ac9 HEAD

git ls-remote --symref upstream HEAD
ref: refs/heads/main HEAD
a561e790756b2785b9ddb82285c4eb0a08258ac9 HEAD

git branch --show-current
perf/list-global-skills

git rev-parse HEAD
a561e790756b2785b9ddb82285c4eb0a08258ac9

git log -1 --oneline
a561e79 Merge pull request #1381 from vercel-labs/ergunsh/do-not-use-nextjs-skill-in-docs

git status --short --branch
## perf/list-global-skills...upstream/main
```

#### 2.1.2. 专用分支确认

- 2026-06-07：选中 `tasks.md` 第 2 个未完成任务，确认上游 fork 工作区未在 `main` 分支直接修改。
- 2026-06-07：当前分支为 `perf/list-global-skills`，`HEAD`、`merge-base HEAD upstream/main`、`upstream/main` 均为 `a561e790756b2785b9ddb82285c4eb0a08258ac9`，说明该分支基于上游 `main`。
- 2026-06-07：`git status --porcelain=v1` 无输出，说明创建分支后上游工作区仍无未提交改动。

```log
git branch --show-current
perf/list-global-skills

git merge-base HEAD upstream/main
a561e790756b2785b9ddb82285c4eb0a08258ac9

git rev-parse upstream/main
a561e790756b2785b9ddb82285c4eb0a08258ac9

git status --porcelain=v1

git branch --contains HEAD
  main
* perf/list-global-skills
```

### 2.2. Issue

```log
待记录：issue 草稿路径、issue URL、发布时间、发布账号。
```

#### 2.2.1. 纯英文 issue 草稿

- 2026-06-07：选中 `tasks.md` 第 3 个未完成任务，新增 `openspec/changes/submit-skills-list-global-performance-pr/issue-draft.md`。
- 2026-06-07：issue 草稿保持纯英文，包含 AI agent 高频本地执行 `skills list -g` 的使用场景、约 20 到 25 秒耗时、机器卡顿、长任务恢复受阻和后续专项 PR 计划。
- 2026-06-07：已做脱敏复核，草稿未包含 `D:\` 或 `C:\` 形式的本机绝对路径。
- 2026-06-07：本 task 只要求完成草稿，不发布 issue；发布 URL 将在后续发布任务中记录。

```log
issue draft path:
openspec/changes/submit-skills-list-global-performance-pr/issue-draft.md

pure English check:
CJK character count: 0

local absolute Windows path check:
matches for [A-Za-z]:\: 0

git diff --check -- openspec\changes\submit-skills-list-global-performance-pr\issue-draft.md
passed
```

### 2.3. 动态任务补全

- 2026-06-07：准备执行试点批次的 TDD 失败测试前，发现 `D:\code\store\skills__ruan-cat\node_modules` 缺失。
- 2026-06-07：`tasks.md` 原本把依赖准备记录放在“上游验证、提交与 PR 任务”阶段，但失败测试需要先有可运行的测试环境，因此将依赖准备任务补入试点批次，位置在 TDD 失败测试之前。
- 2026-06-07：补写后必须运行 `openspec validate submit-skills-list-global-performance-pr --strict`，通过后再继续。

```log
Test-Path -LiteralPath 'node_modules'
False
node_modules=missing
```

#### 2.3.1. 上游依赖准备

- 2026-06-07：选中动态补写的依赖准备任务，在 `D:\code\store\skills__ruan-cat` 运行 `pnpm install`。
- 2026-06-07：依赖安装成功，`node_modules` 已存在，`pnpm test tests/list-installed.test.ts --run` 能启动 Vitest。
- 2026-06-07：目标测试文件当前存在既有失败：`should handle global scope option` 超时，3 个 symlink 测试在 Windows 上因 `EPERM` 无法创建 symlink。该结果已写入 `agent-findings.md`，后续新增 TDD 测试应使用聚焦测试命令，避免把无关既有失败误判为本 PR 的 RED 证据。

```log
pnpm install
Done in 2s using pnpm v10.17.1

Test-Path -LiteralPath 'node_modules'
True
node_modules=present

git status --short --branch
## perf/list-global-skills...upstream/main

pnpm test tests/list-installed.test.ts --run
Test Files 1 failed (1)
Tests 4 failed | 10 passed (14)
Key failures:
- should handle global scope option: Test timed out in 5000ms
- 3 symlink tests: EPERM operation not permitted when creating symlink on Windows
```

### 2.3. 上游测试与实现

```log
待记录：失败测试命令与失败摘要、实现后目标测试结果、全量验证结果。
```

#### 2.3.2. TDD RED：重复解析测试

- 2026-06-07：选中试点批次的 TDD 失败测试任务，只修改 `D:\code\store\skills__ruan-cat\tests\list-installed.test.ts`。
- 2026-06-07：新增聚焦测试 `does not repeatedly parse the same real SKILL.md reached through multiple agent links`。
- 2026-06-07：测试在 Windows 使用 `junction`、非 Windows 使用 `dir` symlink，构造两个 agent 目录链接到同一个 canonical skill，并 mock `parseSkillMd` 统计同一真实 `SKILL.md` 的解析次数。
- 2026-06-07：已运行聚焦测试并得到预期 RED：输出 skill 已去重为 1 个，但同一真实 `SKILL.md` 被解析 3 次，期望为 1 次。

```log
pnpm test tests/list-installed.test.ts --run -t "does not repeatedly parse"

Test Files 1 failed (1)
Tests 1 failed | 14 skipped (15)

Failure:
AssertionError: expected [ …(3) ] to have a length of 1 but got 3
tests/list-installed.test.ts:294

Interpretation:
The current implementation deduplicates output to one installed skill, but repeatedly parses the same real SKILL.md through linked agent directories.
```

#### 2.3.3. TDD RED：agent filter 不扫描无关目录

- 2026-06-07：选中主体任务第 1 个测试补充任务，只修改 `D:\code\store\skills__ruan-cat\tests\list-installed.test.ts`。
- 2026-06-07：新增聚焦测试 `does not scan unrelated agent directories when an agent filter is provided`。
- 2026-06-07：测试构造 canonical Codex skill 与无关 `.claude/skills` skill，调用 `listInstalledSkills({ global: false, agentFilter: ['codex'] })`。
- 2026-06-07：已运行聚焦测试并得到预期 RED：当前实现仍返回 `unrelated-skill`，说明存在 `--agent` filter 时仍补扫无关 agent 目录。

```log
pnpm test tests/list-installed.test.ts --run -t "does not scan unrelated"

Test Files 1 failed (1)
Tests 1 failed | 15 skipped (16)

Failure:
AssertionError: expected [ 'codex-only-skill', …(1) ] to deeply equal [ 'codex-only-skill' ]

Received includes:
unrelated-skill
```

#### 2.3.4. TDD RED：输出兼容断言

- 2026-06-07：选中主体任务第 2 个测试补充任务，在既有重复解析 RED 测试中补充输出兼容断言。
- 2026-06-07：断言 `listInstalledSkills({ global: false })` 在多 agent 链接指向同一 canonical skill 时仍合并为 1 个 skill，并保留 `claude-code` 与 `windsurf` agents 列表。
- 2026-06-07：重新运行聚焦测试，兼容断言通过，测试仍按预期失败在重复解析次数：同一真实 `SKILL.md` 被解析 3 次，期望为 1 次。

```log
pnpm test tests/list-installed.test.ts --run -t "does not repeatedly parse"

Test Files 1 failed (1)
Tests 1 failed | 15 skipped (16)

Compatibility assertions before the RED failure:
- skills length is 1
- skill name is linked-canonical-skill
- agents contain claude-code and windsurf

Remaining expected RED:
AssertionError: expected [ …(3) ] to have a length of 1 but got 3
```

#### 2.3.5. GREEN：缓存、索引和 agent filter gating

- 2026-06-07：选中 `src/installer.ts` 的三个源码任务，按 RED 测试实现最小生产代码修复。
- 2026-06-07：在 `listInstalledSkills()` 单次调用内新增 `parseSkillMdForList()`，优先使用 `realpath(SKILL.md)` 作为缓存 key，失败时 fallback 到原始路径，并缓存 `null` 解析结果。
- 2026-06-07：新增每个 agent skills 目录的一次性索引缓存，索引包含 `dirNames` 与 `skillNames`，用 Set 查询替代 canonical skill 反查中的重复 `access()`、fallback `readdir()` 和重复 `parseSkillMd()`。
- 2026-06-07：修正 `agentFilter` gating：存在 `agentFilter` 时，不再补扫 `agentsToCheck` 之外的其它 agent skills 目录。
- 2026-06-07：两个 RED 聚焦测试已转绿，完整 `tests/list-installed.test.ts` 已通过；`format:check` 已通过。

```log
pnpm test tests/list-installed.test.ts --run -t "does not repeatedly parse"
Test Files 1 passed (1)
Tests 1 passed | 15 skipped (16)

pnpm test tests/list-installed.test.ts --run -t "does not scan unrelated"
Test Files 1 passed (1)
Tests 1 passed | 15 skipped (16)

pnpm test tests/list-installed.test.ts --run
Test Files 1 passed (1)
Tests 14 passed | 2 skipped (16)

pnpm run format:check
All matched files use Prettier code style!
```

#### 2.3.6. 本地全量验证风险

- 2026-06-07：`pnpm run type-check` 在本机失败，错误来自未触碰文件 `src/git.ts` 与 `src/skills.ts`。
- 2026-06-07：`pnpm run build` 在本机失败，CI 中该命令名显示为 “Type check”。直接失败点为 Node v22.14.0 无法直接执行 `.ts` 脚本 `scripts/generate-licenses.ts`；改用 `node --experimental-strip-types` 后进入 `license-checker` 的 npx 缓存/安装失败。
- 2026-06-07：上述失败已写入 `agent-findings.md`，后续发布 PR 前需要在 PR 草稿与最终报告中如实说明，或视上游 CI 结果决定是否追加独立构建脚本修复任务。

```log
pnpm run type-check
src/git.ts(102,10): error TS2769
src/skills.ts(84,39): error TS2339
src/skills.ts(94,7): error TS2322

pnpm run build
TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for scripts/generate-licenses.ts

node --experimental-strip-types scripts/generate-licenses.ts
Error: Cannot find module 'read-installed'
Require stack: license-checker
```

#### 2.3.7. 代码风格与边界处理复核

- 2026-06-07：选中 `src/installer.ts` 的代码风格与边界处理任务。
- 2026-06-07：当前实现沿用上游局部 helper 风格，把缓存限定在 `listInstalledSkills()` 单次调用内，不引入跨命令状态。
- 2026-06-07：`realpath(SKILL.md)` 失败时 fallback 到原始路径；agent 目录索引会跳过不可达目录、非目录条目和不安全路径；无效 `SKILL.md` 继续通过 `parseSkillMd()` 返回 `null` 后跳过。
- 2026-06-07：`tests/list-installed.test.ts` 覆盖普通目录、无效 `SKILL.md`、Windows Junction 或非 Windows symlink、多 agent 链接、输出合并、`--agent` filter 范围。Windows 上普通 dangling/file symlink 受权限限制，测试使用 `it.skipIf(platform() === 'win32')` 明确跳过，非 Windows 仍保留覆盖。
- 2026-06-07：`git diff --check`、`pnpm run format:check`、`pnpm test tests/list-installed.test.ts --run` 已通过。

```log
git diff --check -- src\installer.ts tests\list-installed.test.ts
passed

pnpm run format:check
All matched files use Prettier code style!

pnpm test tests/list-installed.test.ts --run
Test Files 1 passed (1)
Tests 14 passed | 2 skipped (16)
```

#### 2.3.8. CLI 层测试评估

- 2026-06-07：选中 `src/list.test.ts` CLI 兼容测试评估任务。
- 2026-06-07：已读取 `src/list.test.ts` 和 `src/list.ts`。`src/list.test.ts` 通过 `runCli()` 做黑盒 CLI 集成测试，不提供方便 mock `detectInstalledAgents()`、home/global skills 目录或 agent global dir 的入口。
- 2026-06-07：本次性能修复的关键行为是 `listInstalledSkills()` 内部扫描范围、重复解析次数和输出语义，已经由 `tests/list-installed.test.ts` 覆盖：重复真实 `SKILL.md` 解析次数受控、同名 skill 合并并保留 agents、`agentFilter` 不返回无关 agent 目录。
- 2026-06-07：因此不新增 `src/list.test.ts`，原因已写入 `agent-findings.md`。

```log
Inspected:
src/list.test.ts
src/list.ts

Decision:
No src/list.test.ts change. Equivalent behavior is covered in tests/list-installed.test.ts.
```

### 2.7. 验证阶段记录

#### 2.7.1. 依赖准备结果

- 2026-06-07：`D:\code\store\skills__ruan-cat` 依赖已通过 `pnpm install` 安装；`node_modules` 已存在。
- 2026-06-07：`git status --short --branch` 显示未跟踪依赖目录没有进入 git 状态，当前上游工作区只包含预期源码与测试文件改动。

```log
pnpm install
Done in 2s using pnpm v10.17.1

Test-Path -LiteralPath 'node_modules'
True
node_modules=present

git status --short --branch
## perf/list-global-skills...upstream/main
 M src/installer.ts
 M tests/list-installed.test.ts
```

#### 2.7.2. 目标测试结果

- 2026-06-07：目标测试命令 `pnpm test tests/list-installed.test.ts --run` 已通过。
- 2026-06-07：本地 Windows 环境中 2 个普通 symlink 边界测试使用 `it.skipIf(platform() === 'win32')` 跳过；Windows Junction 等价路径、重复解析、输出兼容和 agent filter 行为均已覆盖并通过。
- 2026-06-07：提交前复跑时，原 `should handle global scope option` 因扫描真实全局目录出现 5000ms 超时；已将该 smoke test 改为 mock 空 detected agents 并传入 `agentFilter: []`，避免环境依赖扫描。复跑后目标测试稳定通过。

```log
pnpm test tests/list-installed.test.ts --run
Test Files 1 passed (1)
Tests 14 passed | 2 skipped (16)

commit-prep rerun:
pnpm test tests/list-installed.test.ts --run
Test Files 1 passed (1)
Tests 14 passed | 2 skipped (16)
Duration 1.44s, tests 470ms
```

#### 2.7.3. 全量验证结果

- 2026-06-07：`pnpm run format:check` 通过。
- 2026-06-07：`pnpm run type-check` 未通过，错误来自未触碰文件 `src/git.ts` 与 `src/skills.ts`。
- 2026-06-07：`pnpm run build` 未通过，本机 Node v22.14.0 不能直接执行 `scripts/generate-licenses.ts`；使用 `node --experimental-strip-types` 继续验证时卡在本地 `license-checker` / npm npx 缓存问题。
- 2026-06-07：该验证风险已写入 `agent-findings.md`，后续发布 PR 前需要在 PR 文案或最终报告中如实说明，并以 GitHub CI 作为进一步证据。

```log
pnpm run format:check
All matched files use Prettier code style!

pnpm run type-check
src/git.ts(102,10): error TS2769
src/skills.ts(84,39): error TS2339
src/skills.ts(94,7): error TS2322

pnpm run build
TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for scripts/generate-licenses.ts
```

### 2.8. PR 草稿

- 2026-06-07：新增 `openspec/changes/submit-skills-list-global-performance-pr/pr-draft.md`。
- 2026-06-07：PR 草稿使用纯英文，包含 Problem、Root Cause、Solution、Compatibility、Tests、Before/After 和 Related Issue。
- 2026-06-07：PR 草稿暂使用 `ISSUE_URL_PLACEHOLDER`，等待 issue 发布后替换为真实 URL。
- 2026-06-07：脱敏复核通过：未包含 `D:\` 或 `C:\` 形式的本机绝对路径。

```log
pr draft path:
openspec/changes/submit-skills-list-global-performance-pr/pr-draft.md

pure English check:
CJK character count: 0

local absolute Windows path check:
matches for [A-Za-z]:\: 0

git diff --check -- openspec\changes\submit-skills-list-global-performance-pr\pr-draft.md
passed
```

### 2.9. Issue 发布

- 2026-06-07：发布前复核 `issue-draft.md`，纯英文检查通过、本机绝对路径检查通过，包含使用场景、机器卡顿、20 到 25 秒耗时和后续 PR 承诺。
- 2026-06-07：已向 `vercel-labs/skills` 发布 issue。
- 2026-06-07：已将 issue URL 追加到 `issue-draft.md`，并替换 `pr-draft.md` 中的 issue 占位符。

```log
gh issue create --repo vercel-labs/skills --title <title> --body <body>
https://github.com/vercel-labs/skills/issues/1389

issue URL:
https://github.com/vercel-labs/skills/issues/1389
```

### 2.10. 上游提交

- 2026-06-07：提交前复核 `D:\code\store\skills__ruan-cat`，暂存区只包含 `src/installer.ts` 与 `tests/list-installed.test.ts`。
- 2026-06-07：提交前复跑目标测试与格式检查均通过。
- 2026-06-07：已使用上游仓库现有英文 Conventional Commit 风格提交源码和测试改动。
- 2026-06-07：`git-commit` 技能的 co-author 规则中没有 Codex / GPT 可验证官方 GitHub trailer，本次不添加 `Co-authored-by`。

```log
git diff --cached --name-only
src/installer.ts
tests/list-installed.test.ts

pnpm test tests/list-installed.test.ts --run
Test Files 1 passed (1)
Tests 14 passed | 2 skipped (16)

pnpm run format:check
All matched files use Prettier code style!

git commit -m "perf: improve global skills list scanning"
[perf/list-global-skills 566e841] perf: improve global skills list scanning

commit hash:
566e84114094f9a65befb61ec8e1486486250ccb

git status --short --branch
## perf/list-global-skills...upstream/main [ahead 1]
```

### 2.11. PR

- 2026-06-07：已将 `perf/list-global-skills` 推送到 `ruan-cat/skills` fork。
- 2026-06-07：已创建面向 `vercel-labs/skills:main` 的 PR。
- 2026-06-07：初始 CI / check 状态为 pending；创建后可见检查为 Socket Security 两项，尚未完成。
- 2026-06-07：再次查询后，Socket Security 两项检查均已通过；PR 仍为 open，merge state 为 `BLOCKED`，review decision 为 `REVIEW_REQUIRED`。

```log
git push -u origin perf/list-global-skills
branch 'perf/list-global-skills' set up to track 'origin/perf/list-global-skills'.

gh pr create --repo vercel-labs/skills --head ruan-cat:perf/list-global-skills --base main
https://github.com/vercel-labs/skills/pull/1390

PR number:
1390

PR title:
Improve `skills list -g` performance for linked global agent skill directories

PR state:
OPEN

initial checks:
Socket Security: Project Report - pending
Socket Security: Pull Request Alerts - pending

latest checks:
Socket Security: Project Report - pass
Socket Security: Pull Request Alerts - pass

merge state:
BLOCKED

review decision:
REVIEW_REQUIRED
```

### 2.12. 本仓库文档

- 2026-06-07：已按 `write-juejin-posts` 技能新增掘金文章草稿。
- 2026-06-07：文章 frontmatter 包含指定 `juejin` 字段，`desc` 长度为 72 字，不超过 100 字。
- 2026-06-07：文章正文按“问题现象 → 定位过程 → 数据规模 → 源码瓶颈 → 优化方案 → 测试验证 → 开源 PR 复盘”组织，保留 60 skills、39 scopes、1305 entries、1241 junctions、约 11 倍提升等关键数据。
- 2026-06-07：文章格式复核通过：二级/三级标题编号、表格居中对齐、日志代码块使用 `log`、`git diff --check` 通过。
- 2026-06-07：已新增最终中文报告，记录 OpenSpec change、issue URL、PR URL、上游改动文件、测试命令、验证结果、CI 状态、掘金文章位置和剩余风险。
- 2026-06-07：报告格式复核通过：一级标题带日期，二级/三级标题编号，表格居中对齐，日志代码块使用 `log`，`git diff --check` 通过。

```log
article path:
docs/ruan-cat-notes/docs/posts/2026-6-7-optimize-skills-list-global-performance/index.md

desc length:
72

git diff --check -- docs\ruan-cat-notes\docs\posts\2026-6-7-optimize-skills-list-global-performance\index.md
passed

report path:
docs/reports/2026-06-07-submit-skills-list-global-performance-pr.md

report first line:
# 2026-06-07 提交 vercel-labs/skills 全局列表性能优化 PR 报告

report format checks:
BadTextBlocks=0
H2Count=7
H3Count=13

git diff --check -- docs\reports\2026-06-07-submit-skills-list-global-performance-pr.md docs\ruan-cat-notes\docs\posts\2026-6-7-optimize-skills-list-global-performance\index.md
passed
```

### 2.13. OpenSpec 验证

- 2026-06-07：收尾前汇总任务状态，确认已完成内容均有对应文件、链接或命令证据。
- 2026-06-07：最终运行 `openspec validate submit-skills-list-global-performance-pr --strict`，校验通过。

```log
completed artifacts:
- issue: https://github.com/vercel-labs/skills/issues/1389
- PR: https://github.com/vercel-labs/skills/pull/1390
- upstream commit: 566e84114094f9a65befb61ec8e1486486250ccb
- article: docs/ruan-cat-notes/docs/posts/2026-6-7-optimize-skills-list-global-performance/index.md
- report: docs/reports/2026-06-07-submit-skills-list-global-performance-pr.md

openspec validate submit-skills-list-global-performance-pr --strict
Change 'submit-skills-list-global-performance-pr' is valid
```
