## Why

当前本机长期任务会高频执行 `skills list -g`，用于让 AI agent 在开始工作前获取完整的全局 skills 列表。根据 `docs/reports/2026-06-07-skills-list-global-performance.md` 的实测数据，`skills@1.5.10` 在 Windows 多 Agent、Junction 大量存在的场景下会把一次全局列表命令放大到约 20 到 25 秒，表现为机器卡顿、等待时间长、长任务恢复节奏被明显拖慢。

本 change 的目标是用 OpenSpec 长任务方式组织一次完整开源贡献：向 `vercel-labs/skills` 提交英文 issue 和英文 PR，修复 `skills list -g` 的重复文件系统 I/O 性能瓶颈，并在完成后沉淀中文掘金文章和中文成果报告。

## What Changes

- 在 `D:\code\store\skills__ruan-cat` 克隆 `https://github.com/ruan-cat/skills`，并基于上游 `vercel-labs/skills` 的 `main` 分支创建专用性能优化分支。
- 编写并发布纯英文 issue，说明本地高频执行 `skills list -g` 的 AI agent 使用场景、20 到 25 秒耗时、机器卡顿和后续 PR 计划。
- 在上游源码层面修复 `listInstalledSkills()` 的重复 I/O 问题，不提交本机 pnpm 全局安装产物热修。
- 采用 TDD：先补充失败测试，覆盖多 Agent、多 symlink 或 Windows Junction、`--agent` filter、输出兼容性和重复解析次数受控，再实现修复。
- 编写并发布纯英文 PR，说明 root cause、solution、compatibility、tests 和 before/after 性能数据。
- 在 `docs/ruan-cat-notes/docs/posts/` 下新增符合 `write-juejin-posts` 规范的中文掘金文章草稿。
- 在 `docs/reports/` 下新增中文最终报告，记录 issue/PR 链接、代码改动、验证结果、风险和后续状态。
- 按 `do-long-task` 纪律维护 `agent-progress.md` 与 `agent-findings.md`，后续执行只以 `tasks.md` 作为唯一任务源。

## Capabilities

### New Capabilities

- `skills-global-list-performance-contribution`: 描述并约束一次面向 `vercel-labs/skills` 的 `skills list -g` 性能优化开源贡献流程，包括 issue、源码修复、测试、PR 和验证。
- `skills-performance-public-writing`: 描述并约束本次性能优化完成后的中文外宣文章与最终报告产物。

### Modified Capabilities

- 无。本仓库当前没有可复用的主规范目录，且本 change 是新增一次长任务工件链，不修改既有 OpenSpec 能力。

## Impact

- 外部仓库：`D:\code\store\skills__ruan-cat` 中的 `vercel-labs/skills` fork 工作区。
- 预期上游源码文件：`src/installer.ts`，用于实现 `listInstalledSkills()` 内部的单次调用缓存、agent 目录索引和 `--agent` filter gating。
- 预期上游测试文件：`tests/list-installed.test.ts`、必要时 `src/list.test.ts`，用于覆盖输出兼容性、扫描范围和重复解析控制。
- GitHub 远程动作：向 `vercel-labs/skills` 发布 issue、推送 fork 分支、创建 PR。
- 本仓库文档产物：`docs/ruan-cat-notes/docs/posts/<date>-<slug>/index.md` 与 `docs/reports/<date>-<slug>.md`。
- 长任务状态文件：`openspec/changes/submit-skills-list-global-performance-pr/agent-progress.md` 与 `openspec/changes/submit-skills-list-global-performance-pr/agent-findings.md`。
