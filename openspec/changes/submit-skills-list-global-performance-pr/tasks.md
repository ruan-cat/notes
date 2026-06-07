# submit-skills-list-global-performance-pr 任务清单

> 本文件是后续 `do-long-task + openspec + Codex /goal` 的唯一可执行任务源。执行中发现遗漏任务时，必须先补写本文件并运行 `openspec validate submit-skills-list-global-performance-pr --strict`，再继续推进。每完成一个任务，都要同步更新 `agent-progress.md`；失败、坑点和不可重复尝试要写入 `agent-findings.md`。

## 1. 试点批次（Pilot Batch）

> 目的：先完成最小可验证闭环，确认上游仓库结构、测试入口、issue 文案和 TDD 方向可行，再推进完整 PR。
> 完成标准：fork 工作区准备完成；上游关键文件和测试命令确认完成；英文 issue 草稿完成但不发布；至少一个失败测试已写入上游工作区并能证明当前行为缺口。

- [ ] [新增] `D:\code\store\skills__ruan-cat` - 克隆 `https://github.com/ruan-cat/skills`，确认 `origin` 指向 fork，新增或确认 `upstream` 指向 `https://github.com/vercel-labs/skills`，记录 `git remote -v`、默认分支和当前 commit 到 `openspec/changes/submit-skills-list-global-performance-pr/agent-progress.md`
- [ ] [修改] `D:\code\store\skills__ruan-cat` - 从上游 `main` 新建专用分支 `perf/list-global-skills` 或同等语义分支，确认未在 `main` 分支直接修改，并把分支名记录到 `agent-progress.md`
- [ ] [新增] `openspec/changes/submit-skills-list-global-performance-pr/issue-draft.md` - 编写纯英文 issue 草稿，重点说明高频本地执行 `skills list -g` 是为了让 AI agent 获取完整全局 skills，说明约 20 到 25 秒耗时、机器卡顿、长任务恢复受阻和后续 PR 计划
- [ ] [修改] `D:\code\store\skills__ruan-cat\tests\list-installed.test.ts` - 按 TDD 新增一个失败测试，构造多 Agent 或多链接目录指向同一 canonical skill，证明当前 `listInstalledSkills()` 存在重复扫描或重复解析缺口；运行目标测试并将失败输出摘要写入 `agent-progress.md`

## 2. 上游源码修复与测试任务

> 在试点批次验证方向后推进。每个源码任务完成后都必须运行相关测试；未通过不得勾选。

- [ ] [修改] `D:\code\store\skills__ruan-cat\tests\list-installed.test.ts` - 补充 `--agent codex` filter 测试，证明指定 agent 时不会扫描无关 agent skills 目录，同时输出语义不回归
- [ ] [修改] `D:\code\store\skills__ruan-cat\tests\list-installed.test.ts` - 补充输出兼容测试，覆盖 `listInstalledSkills({ global: true })` 在多 agent、多链接目录下仍能合并同名 skill 并保留 agents 列表
- [ ] [修改] `D:\code\store\skills__ruan-cat\src\installer.ts` - 在 `listInstalledSkills()` 内部增加单次调用生命周期的 `parseSkillMdForList()` 缓存，优先用 `realpath(SKILL.md)` 作为 key，`realpath` 失败时 fallback 到原始路径，并缓存无效解析结果避免重复读取
- [ ] [修改] `D:\code\store\skills__ruan-cat\src\installer.ts` - 增加每个 agent skills 目录的一次性索引逻辑，索引包含 `dirNames` 和 `skillNames`，用 Set 查询替代嵌套循环中的重复 `access()`、fallback `readdir()` 和重复 `parseSkillMd()`
- [ ] [修改] `D:\code\store\skills__ruan-cat\src\installer.ts` - 修正 `agentFilter` gating：存在 `--agent` filter 时不补扫其它已存在 agent skills 目录，保持未指定 filter 时的既有全局发现语义
- [ ] [修改] `D:\code\store\skills__ruan-cat\src\installer.ts` - 按上游代码风格整理类型、命名和边界处理，确保普通目录、symlink、Windows Junction、dangling symlink、无效 `SKILL.md` 均保持安全行为
- [ ] [修改] `D:\code\store\skills__ruan-cat\src\list.test.ts` - 如上游 CLI 层存在可测入口，则补充 `skills list -g --json` 或 `skills list -g --agent codex` 的 CLI 兼容测试；如果实际结构不适合 CLI 测试，必须在 `agent-findings.md` 记录原因并确认 `tests/list-installed.test.ts` 已覆盖同等行为

## 3. 上游验证、提交与 PR 任务

> 本阶段涉及 GitHub 远程动作。发布 issue、推送分支、创建 PR 前必须确认文案纯英文、diff 聚焦且没有泄露不必要的本机隐私路径。

- [ ] [修改] `openspec/changes/submit-skills-list-global-performance-pr/agent-progress.md` - 记录 `D:\code\store\skills__ruan-cat` 中 `pnpm install` 或依赖准备命令的执行结果；如果依赖已存在或安装失败，记录准确原因和替代验证方式
- [ ] [修改] `openspec/changes/submit-skills-list-global-performance-pr/agent-progress.md` - 记录目标测试命令执行结果，优先使用 `pnpm test tests/list-installed.test.ts` 或上游实际支持的等价命令，并摘录关键通过或失败信息
- [ ] [修改] `openspec/changes/submit-skills-list-global-performance-pr/agent-progress.md` - 记录全量验证命令结果，至少包括上游 `pnpm test`、`pnpm run type-check`、`pnpm run format:check`、`pnpm run build` 中实际可运行的命令；无法运行的命令必须写明原因
- [ ] [新增] `openspec/changes/submit-skills-list-global-performance-pr/pr-draft.md` - 编写纯英文 PR 草稿，包含 Problem、Root Cause、Solution、Compatibility、Tests、Before/After 数据和 issue 关联说明
- [ ] [修改] `openspec/changes/submit-skills-list-global-performance-pr/issue-draft.md` - 发布 issue 前做纯英文和脱敏复核，确认包含使用场景、机器卡顿、20 到 25 秒耗时、后续 PR 承诺；发布后把 issue URL 追加到文件末尾
- [ ] [修改] `D:\code\store\skills__ruan-cat` - 使用 Conventional Commit 风格提交上游源码和测试改动，提交前检查 `git diff` 只包含预期文件；提交哈希写入 `agent-progress.md`
- [ ] [修改] `D:\code\store\skills__ruan-cat` - 推送专用分支到 `ruan-cat/skills` fork，并创建指向 `vercel-labs/skills:main` 的 PR；创建后把 PR URL、PR 编号和初始 CI 状态写入 `agent-progress.md`
- [ ] [修改] `openspec/changes/submit-skills-list-global-performance-pr/pr-draft.md` - PR 发布后同步最终 PR URL、实际标题和最终正文摘要，确认正文仍为纯英文

## 4. 本仓库外宣文章与最终报告任务

> 必须在 issue 和 PR URL 明确、上游实际改动和验证结果明确后执行，避免文章与报告写成预测性内容。

- [ ] [新增] `docs\ruan-cat-notes\docs\posts\2026-6-7-optimize-skills-list-global-performance\index.md` - 使用 `.claude/skills/write-juejin-posts/SKILL.md` 规范编写中文掘金文章草稿，frontmatter 包含 `juejin: TODO 编写完内容就可以直接发文` 和不超过 100 字的 `desc`
- [ ] [修改] `docs\ruan-cat-notes\docs\posts\2026-6-7-optimize-skills-list-global-performance\index.md` - 完善正文结构，按“问题现象 → 定位过程 → 数据规模 → 源码瓶颈 → 优化方案 → 测试验证 → 开源 PR 复盘”组织，保留 60 skills、39 scopes、1305 entries、1241 junctions、约 11 倍提升等关键数据
- [ ] [新增] `docs\reports\2026-06-07-submit-skills-list-global-performance-pr.md` - 编写中文最终报告，记录 OpenSpec change、issue URL、PR URL、上游改动文件、测试命令、验证结果、CI 状态、掘金文章位置和剩余风险
- [ ] [修改] `docs\reports\2026-06-07-submit-skills-list-global-performance-pr.md` - 按项目规范复核报告格式：一级标题带日期，二级和三级标题编号，Markdown 表格居中对齐，日志代码块语言使用 `log`

## 5. OpenSpec 长任务收尾任务

- [ ] [修改] `openspec/changes/submit-skills-list-global-performance-pr/agent-progress.md` - 汇总全部任务进度，确认每个已勾选任务都有对应验证、链接或证据
- [ ] [修改] `openspec/changes/submit-skills-list-global-performance-pr/agent-findings.md` - 汇总重要发现、失败尝试、权限问题、CI 风险、上游反馈和不可重复尝试
- [ ] [修改] `openspec/changes/submit-skills-list-global-performance-pr/tasks.md` - 在所有验收证据齐全后逐项勾选已完成任务；若发现遗漏，先补写任务并运行 strict validate，不得只在聊天中补充
- [ ] [修改] `openspec/changes/submit-skills-list-global-performance-pr` - 运行 `openspec validate submit-skills-list-global-performance-pr --strict`，把结果写入 `agent-progress.md`；未通过时先修复工件再声明完成
