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

### 2.2. Issue

```log
待记录：issue 草稿路径、issue URL、发布时间、发布账号。
```

### 2.3. 上游测试与实现

```log
待记录：失败测试命令与失败摘要、实现后目标测试结果、全量验证结果。
```

### 2.4. PR

```log
待记录：commit hash、push 分支、PR URL、PR 编号、CI 状态。
```

### 2.5. 本仓库文档

```log
待记录：掘金文章路径、最终报告路径、格式复核结果。
```

### 2.6. OpenSpec 验证

```log
待记录：openspec validate submit-skills-list-global-performance-pr --strict 的最终输出。
```
