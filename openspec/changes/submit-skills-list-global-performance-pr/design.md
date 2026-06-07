## Context

本 change 不是单一代码补丁，而是一条完整的可恢复长任务链。用户希望后续通过 Codex `/goal` 和 `do-long-task` 执行 OpenSpec 任务，而不是直接按聊天里的 PR-first 清单推进。因此 `openspec/changes/submit-skills-list-global-performance-pr/tasks.md` 必须成为后续唯一可执行任务源。

已知性能背景来自 `docs/reports/2026-06-07-skills-list-global-performance.md`：`skills@1.5.10` 的 `skills list -g` 在本机 Windows 环境中扫描 39 个全局 scope、1305 个顶层目录项和 1241 个 Junction。原实现会在 `listInstalledSkills()` 中对多 Agent 目录反复 `access()`、`readdir()` 并重复解析相同 `SKILL.md`，导致耗时约 20 到 25 秒。本地热修后，通过 `realpath(SKILL.md)` 解析缓存、每个 agent 目录一次性索引和 `--agent` filter gating，把核心命令降到约 2.2 秒。

上游仓库只读核查显示：`vercel-labs/skills` 默认分支为 `main`，当前包版本为 `1.5.10`，关键源码大概率位于 `src/installer.ts`，现有相关测试包括 `tests/list-installed.test.ts` 和 `src/list.test.ts`。后续执行仍必须在克隆后的 fork 工作区重新确认当前文件状态，因为上游可能变化。

## Goals / Non-Goals

**Goals:**

- 用 OpenSpec 工件完整描述从仓库准备到 issue、PR、文章和最终报告的长任务。
- 后续执行时只以 `tasks.md` 作为唯一任务源，并按 `agent-progress.md` 和 `agent-findings.md` 记录进度与失败。
- 在上游源码层面修复 `skills list -g` 的重复 I/O 性能瓶颈，保持输出兼容。
- 通过测试证明扫描范围、解析次数和输出语义，而不是依赖不稳定的毫秒级断言。
- 产出纯英文 issue、纯英文 PR、中文掘金文章和中文最终报告。

**Non-Goals:**

- 不在本 change 创建或维护本机 pnpm 全局安装产物热修。
- 不把 `docs/reports/2026-06-07-skills-list-global-performance.md` 中的本机绝对路径原样大量暴露到英文 issue/PR。
- 不在本仓库提交 `vercel-labs/skills` 的源码改动；源码改动属于 `D:\code\store\skills__ruan-cat` 工作区。
- 不用固定耗时作为 CI 必须通过的断言。
- 不在未验证的情况下把 OpenSpec task 标记为完成。

## Decisions

### 1. 使用独立 fork 工作区承载上游源码改动

选择 `D:\code\store\skills__ruan-cat` 作为上游 fork 工作区，因为用户明确要求在 `D:\code\store` 下新建该目录。这样可以把 `notes` 仓库中的 OpenSpec、文章和报告，与 `vercel-labs/skills` 的源码、测试、commit 和 PR 分开，避免跨仓库污染。

替代方案是把上游仓库作为子目录放入 `notes`，但这会让 git 状态和报告产物混杂，长任务恢复时更容易误提交。

### 2. 先 issue 后 PR

选择先创建纯英文 issue，再创建 PR，因为用户明确要求先发布 issue，并在 issue 中说明后续会给出专项 PR。Issue 侧重点是使用场景、性能痛点和问题复现规模；PR 侧重点是实现、兼容性和测试。

替代方案是直接 PR，但不满足用户的 issue 先行要求。

### 3. TDD 约束优先于实现速度

后续修改 `src/installer.ts` 前必须先写失败测试。测试应该锁定行为：重复真实路径的 `SKILL.md` 不应被重复解析过多次，`--agent codex` 不应扫描无关 agent 目录，`list -g` 与 `--json` 输出语义兼容。

替代方案是先照搬本地热修再补测试，但会违反全局 `test-driven-development` 技能，也容易把本机产物细节误带入上游源码。

### 4. 缓存范围限定在单次 `listInstalledSkills()` 调用内

选择单次调用内缓存，是为了减少重复小 I/O，同时避免跨命令缓存失效、文件变更不可见或长期状态不一致。`realpath(SKILL.md)` 失败时必须 fallback 到原始路径，保证损坏 symlink、权限异常或普通目录场景不会被缓存逻辑破坏。

替代方案是全局持久缓存，但它会引入失效策略、跨平台路径一致性和用户编辑即时可见性的复杂性，不适合本次 PR。

### 5. 用 agent 目录索引替代嵌套 fallback 扫描

每个 agent skills 目录只扫描一次，生成 `dirNames` 和 `skillNames`。目录名匹配、大小写匹配、frontmatter `name` 匹配都通过 Set 查询完成。这样保留原有语义，同时把 `canonicalSkills * agentsToCheck * agentDirEntries` 的重复小 I/O 降为每个 agentBase 一次性扫描。

替代方案是只缓存 `parseSkillMd()`，但仍会保留大量 `readdir()` 与 `access()` 调用，优化幅度不稳定。

### 6. 文档产物在 PR 完成后再写

掘金文章和最终报告必须等 issue/PR URL、实际测试命令、改动文件和验证结果明确后再写。这样文章和报告能记录真实交付，而不是预测性内容。

替代方案是先写文章草稿，但容易与最终实现不一致。

## Risks / Trade-offs

- 上游源码结构变化 → 后续执行开始时先重新读取 `src/installer.ts`、`tests/list-installed.test.ts`、`src/list.test.ts` 和 package scripts，并在 `agent-progress.md` 记录确认结果。
- GitHub 权限或网络失败 → 在 `agent-findings.md` 记录失败命令、错误信息和下一步，不连续盲目重试超过 3 次。
- Windows Junction 与非 Windows symlink 行为不同 → 测试用跨平台 symlink 覆盖通用语义，Windows 专项验证可作为本地手工验证或条件测试。
- `--agent` filter gating 改变输出范围 → 必须用测试证明过滤后输出符合 CLI 预期，并在 PR 中单独说明该行为修正。
- PR CI 运行时间或环境和本机不同 → 不把毫秒数写成测试断言，只在 PR 描述中作为 real-world case 说明。
- 文案中泄露本机路径 → 英文 issue/PR 使用脱敏路径或概括描述，详细路径仅保留在本仓库中文报告中。

## Migration Plan

1. 在 `D:\code\store\skills__ruan-cat` 准备 fork 工作区，确认上游 `main` 和当前 package scripts。
2. 创建专用分支并保持上游 PR diff 聚焦于源码、测试和必要说明。
3. 发布英文 issue，记录 issue URL 到 `agent-progress.md`。
4. 按 TDD 执行测试与源码修复，完成本地验证。
5. 提交、推送分支并发布英文 PR，记录 PR URL 和 CI 状态。
6. 回到 `notes` 仓库，写中文掘金文章和中文最终报告。
7. 运行本仓库 OpenSpec strict validate，并确认 `tasks.md`、`agent-progress.md`、`agent-findings.md` 状态完整。

## Open Questions

- 上游维护者是否希望 issue 先行后 PR，还是更偏好直接 PR 关联 issue。当前按用户要求先 issue 后 PR。
- 上游测试是否允许引入针对 `fs/promises` 的 mock/spy，还是更适合通过 fixture 和计数器工具验证。后续以实际测试风格为准。
- PR 是否需要额外 benchmark 脚本。当前默认不新增 benchmark 脚本，除非上游测试结构显示已有相关模式。
