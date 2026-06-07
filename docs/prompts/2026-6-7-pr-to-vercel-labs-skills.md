<!-- 已完成 https://github.com/vercel-labs/skills/pull/1390 -->

# 向 https://github.com/vercel-labs/skills 仓库 pr

你的任务是，根据 `D:\code\ruan-cat\notes\docs\reports\2026-06-07-skills-list-global-performance.md` 文档的内容，克隆我的 `https://github.com/ruan-cat/skills` 仓库，我已经 fork 目标仓库 `github.com/vercel-labs/skills` 了，然后按照 `2026-06-07-skills-list-global-performance.md` 的要求，完成 issue 稿的编写，本地 fork 仓库的修改，以及最终 pr 的发布。

1. 在 `D:\code\store` 内，新建一个 `skills__ruan-cat` 文件夹，在这个文件夹内克隆我的 fork 的 `https://github.com/ruan-cat/skills`仓库。
2. 按照 pr 的规范，在 main 分支的基础上，新建专门的分支，来完成修改。不要直接在 main 分支内做出修改，这会导致 pr 被拒绝。
3. 根据 2026-06-07-skills-list-global-performance.md ，找到存在严重性能瓶颈的代码，并按照要求，改写代码，并发布 pr。
   - 要求 pr 的提交必须包含必要的测试用例，确保 pr 后能够走通 `vercel-labs/skills` 仓库默认执行的 github workflow PR 自检流水线。确保提交后的 pr 能够跑通流水线，便于合并。
4. 先编写**纯英文**的 issue 稿，在这个 issue 稿内，我要求你重点说明我的使用场景，说明清楚我目前遇到的性能瓶颈，重点说明清楚机器卡顿，缓慢的情况。并且在 issue 稿内说明清楚接下来会给出相应的 pr，来专项解决这个 issue。
   - 在动机上面，重点说明清楚我需要在本地高频执行 `skills list -g` 命令，来让我的 AI agent 清晰的，主动的获取齐全全部的全局 skills，但是该命令 `skills list -g` 速度太慢，严重影响我的开发效率。故编写该 issue 和后续的 pr 。
5. 给目标 `vercel-labs/skills` 仓库发布 issue。
6. 然后给 vercel-labs/skills 仓库正式推送 pr。编写**纯英文**的 pr 稿，并说明清楚 pr 解决了那些性能问题。
7. 在全面完成 issue、pr 的任务后，开始编写掘金文章，用于外宣和体现出自己的技术思考能力，便于求职。
   - 用 `D:\code\ruan-cat\notes\.claude\skills\write-juejin-posts\SKILL.md` 这个技能来指导你如何编写外宣性质的掘金技术文章。
   - 模仿 `D:\code\ruan-cat\notes\docs\ruan-cat-notes\docs\posts` 文件夹内其他掘金文章的特点和行文风格，新建合适的文件夹，并编写掘金文章。
8. 最后，在 `D:\code\ruan-cat\notes\docs\reports` 内编写一个报告，说明清楚本次你完成 pr 的成果与报告。

## 01 长任务执行提示词

```markdown
/goal 执行 OpenSpec 长任务：`openspec/changes/submit-skills-list-global-performance-pr`。

目标：依据 `docs/prompts/2026-6-7-pr-to-vercel-labs-skills.md`、`docs/reports/2026-06-07-skills-list-global-performance.md` 和本 change 工件，完成向 `vercel-labs/skills` 提交 `skills list -g` 性能优化 issue、PR、中文掘金文章和最终报告。完成标准：`tasks.md` 全部勾选且有证据，英文 issue/PR 已发布，文章和报告已落地，strict validate 通过。

启动：如有 Memorix MCP，先刷新 `D:\code\ruan-cat\notes` 会话并搜索历史。读取 `do-long-task` 的 `SKILL.md`、`AGENT_LONGTASK.md`、相关 reference，再读本 change 的 `proposal.md`、`design.md`、`specs/`、`tasks.md`、`agent-progress.md`、`agent-findings.md`。

纪律：`tasks.md` 是唯一任务源；每次只做一个 task。发现缺漏先补 `tasks.md` 并 strict validate；改变用户可见行为先同步 `specs/`，改变技术路线先同步 `design.md`；未验证不得勾选完成。

按 `tasks.md` 推进：在 `D:\code\store\skills__ruan-cat` 克隆或确认 fork，设置 `upstream=https://github.com/vercel-labs/skills`，从上游 `main` 新建专用分支，严禁直接改 `main`。先发布纯英文 issue，说明我高频执行 `skills list -g` 是为让 AI agent 获取完整全局 skills；当前 Windows 多 Agent/Junction 场景约 20 到 25 秒，机器卡顿，拖慢开发和长任务恢复；后续会提交专项 PR。

上游按 TDD：先在 `tests/list-installed.test.ts` 等位置写失败测试，再改 `src/installer.ts`。修复方向：`listInstalledSkills()` 单次调用内按 `realpath(SKILL.md)` 缓存解析；每个 agent skills 目录只建一次索引，用 Set 替代重复 `access()`、`readdir()`、`parseSkillMd()`；有 `--agent` filter 时不补扫无关目录。测试覆盖多 Agent、symlink/Junction、输出兼容、扫描范围和重复解析受控，不写固定耗时断言。

每个任务后运行相关验证，把命令、摘要、结果写入 `agent-progress.md`；失败、权限问题、CI 风险写入 `agent-findings.md`。优先跑目标测试、`pnpm test`、`pnpm run type-check`、`pnpm run format:check`、`pnpm run build` 中实际存在的命令；无法执行则记录替代验证。

验证后，在 fork 工作区提交聚焦 Conventional Commit，不提交无关文件，不泄露本机隐私路径；推送专用分支并向 `vercel-labs/skills:main` 创建纯英文 PR。PR 正文包含 Problem、Root Cause、Solution、Compatibility、Tests、Before/After 和 issue 关联。发布后同步 issue URL、PR URL、commit hash、CI 状态。

PR 后回到 `D:\code\ruan-cat\notes`，按 `.claude/skills/write-juejin-posts/SKILL.md` 和既有 posts 风格写掘金文章；再写最终报告，遵守标题日期、二三级标题编号、表格居中、日志代码块用 `log`。

停止条件：全部任务完成且 strict validate 通过；或出现权限问题、破坏性风险、需求冲突、连续 3 次同类失败。若阻塞，输出 BLOCKED 报告，说明已完成内容、失败证据、阻塞原因和下一步需要用户提供什么。
```
