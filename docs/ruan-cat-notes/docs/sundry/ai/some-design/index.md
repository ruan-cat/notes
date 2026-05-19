# 一些设计

长效运行任务的设计。

这是一个关于如何让 codex 实现长效运行一系列任务的设计。

一套长任务执行架构，让 Codex 能够稳定推进一个复杂开发任务，并在上下文压缩、中断、测试失败或会话恢复后继续工作。

## 长任务执行落地时的核心原则

- 不依赖聊天上下文记忆。
- 所有重要目标、计划、进度、发现、失败尝试都必须写入文件。
- 不创建多套任务系统。
- 不靠猜测继续任务，必须先读取文件状态。
- 不在每个小步骤后询问用户是否继续，除非遇到真正阻塞。

## 长任务执行时的规则

1. tasks.md 是唯一任务清单。
2. 每次开始前先读取 OpenSpec 文件和本文件。
3. 每次只处理一个小任务或一个明确 checkpoint。不要跳过未完成任务。
4. 不要把未验证的任务标记为完成。
5. 修改代码后必须运行相关测试。
6. 如果测试失败，先分析原因，再修复。
7. 连续失败时必须记录失败路径，避免重复尝试。
8. 重要发现写入 agent-findings.md。
9. 阶段进度写入 agent-progress.md。
10. 不要每一步都问用户是否继续。
11. 只有遇到权限问题、破坏性操作风险、需求冲突、产品决策问题、连续 3 次同类失败时，才暂停并请求用户介入。

## 长任务运行时的规则

本节定义长任务运行时纪律，用于补充 OpenSpec、Codex `/goal`、Superpowers 和 Ralph-style workflow 之间的调度关系。

### 1. Fresh Context Discipline 上下文刷新纪律

本规范默认使用 Codex `/goal` 单会话执行，因此通过“文件状态刷新”模拟 fresh context。

Codex 必须在以下时机重新读取文件状态：

- 启动 `/goal` 时；
- 每开始一个新的 OpenSpec task 时；
- 每完成一个 checkpoint 时；
- 上下文压缩后；
- 会话中断恢复后；
- 连续失败 2 次以上时；
- 准备标记任务完成前。

必须读取：

- `AGENT_LONGTASK.md`，如果存在；
- 当前 skill 的 `SKILL.md`；
- `proposal.md`；
- `design.md`；
- `specs/`；
- `tasks.md`；
- `agent-progress.md`；
- `agent-findings.md`。

刷新后必须在 `agent-progress.md` 写入当前状态确认。

---

### 2. Task List Discipline 任务列表纪律

唯一主任务源是：

`openspec/changes/<change-name>/tasks.md`

不得创建或遵循第二套主任务源。

禁止把以下内容作为主任务源：

- `task_plan.md`
- `.agent/tasks.json`
- Ralph task list
- Superpowers implementation plan
- 聊天中的临时 checklist

每个 task 应尽量包含：

- task id；
- 目标；
- 修改范围；
- 验收标准；
- 验证命令；
- 依赖关系；
- 状态。

Codex 每次只能处理一个 task 或一个明确 checkpoint。

---

### 3. Verification Discipline 验证纪律

任务必须验证后才能完成。

验证分为四层：

1. task-level verification；
2. change-level verification；
3. `/opsx:verify <change-name>`；
4. regression check。

如果验证命令不存在，必须记录为“不可用”，不得伪造通过。

如果无法自动验证，必须写明替代验证方式和剩余风险。

---

### 4. Completion Marking Discipline 完成标记纪律

只有满足以下条件，才能把 task 标记为 `[x]`：

- 代码已实现；
- task 验收标准满足；
- 相关验证命令通过；
- 验证结果写入 `agent-progress.md`；
- 重要风险写入 `agent-findings.md`；
- 没有未解决的 CRITICAL 问题。

不得因为“代码已经写完”就标记完成。

---

### 5. Failure Memory Discipline 失败记忆纪律

失败必须成为长期记忆。

以下情况必须写入 `agent-findings.md`：

- 测试失败；
- 构建失败；
- 类型检查失败；
- lint 失败；
- 连续修复失败；
- 方案被证明不可行；
- 需求或设计冲突；
- 需要用户决策；
- 存在破坏性风险。

连续失败规则：

- 第 1 次失败：分析并修复；
- 第 2 次同类失败：记录失败并换方案；
- 第 3 次同类失败：停止当前 task，输出 BLOCKED 报告。

不得无记录地重复尝试同一路径。

---

### 6. File and Git Persistence Discipline 文件与 git 持久化纪律

文件持久化是强制要求。

以下文件必须持续维护：

- `tasks.md`
- `agent-progress.md`
- `agent-findings.md`

以下事件后必须更新文件：

- 开始任务；
- 完成 task；
- 完成 checkpoint；
- 验证失败；
- 发现重要事实；
- 改变方案；
- 暂停前；
- BLOCKED 前；
- 完成 change 前。

如果项目使用 git 且用户允许本地 commit，则每个稳定 checkpoint 后创建本地 commit。

提交前必须执行：

```bash
git status
git diff
```

## Task Lifecycle 单一任务生命周期说明

每个 task 必须经历以下状态：

1. Pending  
   任务在 `tasks.md` 中未勾选。

2. Selected  
   Codex 选择当前 task，并在 `agent-progress.md` 写明选择原因。

3. Understood  
   Codex 已读取相关 proposal/design/specs，并确认验收标准。

4. Implementing  
   正在修改代码。必要时使用 Superpowers 方法。

5. Verifying  
   正在运行 task-level 和 change-level 验证。

6. Failed  
   验证失败，失败原因写入 `agent-findings.md`。

7. Completed  
   验证通过，`tasks.md` 勾选为 `[x]`，`agent-progress.md` 记录证据。

## 各个工具之间的职责说明

- openspec
  > 任务规格与任务源头： 定义做什么、验收什么、进度在哪里
- codex /goal 命令
  > 单会话执行器： 在一个会话里持续推进直到完成条件
- superpower
  > 工程方法： TDD、subagent、review、debug、finish
- Ralph skills
  > 长任务纪律： 任务小步推进、日志、验证、可恢复
- Ralph runner
  > 长任务执行器。但是目前暂不使用。

## 需要使用的其他辅助 skills 的职责划分

- superpower
  - brainstorming
  - executing-plans
  - subagent-driven-development
  - test-driven-development
  - systematic-debugging

## 文件职责划分

- 唯一主任务源： `openspec/changes/<change-name>/tasks.md`
- 唯一目标来源： openspec 目录的 proposal.md + specs/ + design.md
- 唯一执行状态： agent-progress.md
- 唯一经验/失败记录： agent-findings.md

## 长任务轻量日志文件与状态文件

除了 OpenSpec 默认文件外，这个长任务规范还使用两个自定义的，轻量的日志文件和状态文件。

```txt
openspec/changes/<change-name>/agent-progress.md
openspec/changes/<change-name>/agent-findings.md
```

分别是 `agent-progress.md` 和 `agent-findings.md`

### agent-progress.md

用于记录执行进度：

- 当前正在处理的 task；
- 已完成的 task；
- 本轮修改了哪些文件；
- 运行了哪些验证命令；
- 测试结果；
- 当前 checkpoint；
- 下一步建议。

### agent-findings.md

用于记录长期发现：

- 代码结构发现；
- 关键设计决策；
- 坑点；
- 失败尝试；
- 已排除的方案；
- 不能重复走的错误路径；
- 需要用户决策的问题。

## 多任务源头风险

我的长任务设计需要使用的工具，各自都有自己的任务源头。为了避免出现混用，乱找具体的任务源头的情况。做出一下设计：

首先各个工具的任务源头情况如下：

- OpenSpec 有 tasks.md。
- PageAI Ralph 有 .agent/tasks.json 和 .agent/tasks/TASK-{ID}.json。
- Superpowers 有 implementation plan。
- Codex /goal 自己也会形成 checkpoint。

**关键决策**： 只保留一个 openspec 的任务源头： `openspec/changes/<change-name>/tasks.md` 。我们只使用 openspec 的 tasks.md 作为唯一的任务源头。不要同时创建另一套 task_plan.md、tasks.json、Ralph task list 或独立 implementation plan 作为主任务源。

## openspec 的定位与使用细则

OpenSpec 负责 change 的规格、设计、任务拆分、验收验证和归档。是长任务的一系列任务的文件记忆来源。

1. 如果 agent-progress.md 或 agent-findings.md 不存在，先创建。
2. 每次恢复任务时，先读取 agent-progress.md 最近 checkpoint，再读取 tasks.md。

## superpower 的定位与使用细则

Superpowers 不负责决定做哪个大任务。Superpowers 只负责指导每个小阶段如何高质量完成，例如：

- 使用 TDD；
- 使用系统化调试；
- 使用子代理处理局部任务；
- 做代码审查；
- 收尾分支；
- 运行测试、lint、typecheck；
- 避免盲目修改和重复失败。

当 Codex 正在执行 tasks.md 中某个小任务时，可以使用 Superpowers 的相关技能来完成该小任务。

## codex /goal 的定位与使用细则

定位为`单会话长任务执行引擎`，Codex /goal 负责在当前会话中持续推进 OpenSpec 的任务。启动 /goal 时，应要求 Codex：

1. 先读取本文件；
2. 再读取当前 OpenSpec change 的 proposal.md、design.md、specs/、tasks.md；
3. 持续执行 tasks.md 中未完成的任务；
4. 每完成一个任务，就把对应 checkbox 改为 [x]；
5. 每完成一个阶段，就更新进度日志；
6. 直到所有任务完成、验证通过，或遇到真正阻塞才停止。

## 长任务执行习惯

使用的是 `PageAI-Pro/ralph-loop` ，这是长任务执行的纪律与规范。主要纪律包括：

- 只用 OpenSpec tasks.md 作为唯一任务源
- 不使用 Ralph tasks.json
- 不让 Superpowers 决定大任务
- Codex /goal 负责持续执行

- 一次只处理一个明确任务；
- 实现前先确认验收条件；
- 实现后必须验证；
- 验证通过后才能标记完成；
- 失败尝试必须记录；
- 重要发现必须记录；
- 中断恢复时先读文件，不凭记忆继续；
- 不做无关重构；
- 不擅自扩大任务范围。

## 执行 codex goal 命令的模板

```markdown
/goal 执行 OpenSpec change：`openspec/changes/<change-name>/tasks.md`。

目标：
持续完成 tasks.md 中所有未完成任务，直到：

1. 所有 checkbox 都变成 [x]；
2. `/opsx:verify <change-name>` 没有 CRITICAL；
3. 项目的测试、lint、typecheck 全部通过；
4. agent-progress.md 有最终总结；
5. agent-findings.md 记录重要发现、失败尝试和遗留风险。
6. 关键验收场景都有测试或明确验证记录。

执行规则：

- 先读取 proposal.md、design.md、specs/、tasks.md；
- 以 tasks.md 为唯一主任务源；
- 不要创建另一套任务列表；
- 每次只处理一个小 task 或一个明确 checkpoint；
- 每完成一个 task，更新 tasks.md；
- 每完成一个 checkpoint，更新 agent-progress.md；
- 重要发现写入 agent-findings.md；
- 遇到实现问题时使用 Superpowers 的 systematic-debugging；
- 实现每个小阶段时使用 Superpowers 的 test-driven-development、subagent-driven-development、requesting-code-review；
- 不要每一步询问是否继续；
- 只有遇到`权限问题`、`需求冲突`、`破坏性操作风险`、`产品决策问题`、连续 3 次同类失败，或需要产品决策时才暂停。

停止条件：

- 全部完成；
- 无法继续且输出 BLOCKED 报告；
- 运行达到 8 小时；
- 上下文不足且无法通过文件恢复。
```
