# 2026-05-19 长效运行单一任务的 skills 触发指南

## 1. 结论

如果你的目标是“让一个单一开发任务尽量长效运行，例如持续推进 8 小时”，首选不是单独触发某一个万能 skill，而是主动触发一条工作流：

```plain
brainstorming -> writing-plans -> using-git-worktrees -> subagent-driven-development
或 executing-plans -> verification-before-completion -> finishing-a-development-branch
```

一句话结论：

> 对长达 8 小时的单一开发任务，优先使用 `obra/superpowers` 的计划驱动执行链路；如果任务极长、研究量大、容易跨上下文压缩或中断，再叠加 `planning-with-files` 的文件持久化记忆模式。

当前本地全局 skills 中已经有 `brainstorming`、`writing-plans`、`subagent-driven-development`、`executing-plans`、`using-git-worktrees`、`verification-before-completion`、`finishing-a-development-branch` 等 superpowers 风格开发技能。`planning-with-files` 没有出现在本次 `skills list -g` 的本地全局清单中；如果你要把它作为长期任务底座，需要先安装并确认当前平台的 hooks 支持情况。

## 2. 两套体系的定位

### 2.1 obra/superpowers

`obra/superpowers` 的定位是“agentic skills framework & software development methodology”。它不是只提供一个计划文件，而是一整套工程开发方法：先澄清需求，再写设计，再写可执行计划，之后让 agent 按计划执行、测试、评审和收尾。

它最适合回答这个问题：

> 我有一个复杂开发目标，怎么让 AI 不跑偏地持续推进？

关键能力包括：

- `brainstorming`：把模糊需求变成经过用户确认的设计。
- `writing-plans`：把设计写成细粒度、可执行、可验证的实施计划。
- `subagent-driven-development`：用子代理逐任务实施，并做规格符合性评审和代码质量评审。
- `executing-plans`：在没有或不适合使用子代理时，按计划逐项执行。
- `verification-before-completion`：禁止无验证地声称完成。
- `finishing-a-development-branch`：在实现完成后处理测试、合并、PR、保留分支等收尾。

对 8 小时任务来说，它的核心价值是“把长任务拆成不会跑偏的连续小任务”，而不是单纯延长 agent 的上下文。

### 2.2 OthmanAdi/planning-with-files

`OthmanAdi/planning-with-files` 的定位是“Manus-style file-based planning”。它把长期任务状态落到项目目录里的 markdown 文件中，典型文件包括：

- `task_plan.md`：阶段、进度、决策、错误。
- `findings.md`：研究发现、外部资料、技术结论。
- `progress.md`：执行日志、测试结果、会话进展。

它最适合回答这个问题：

> 任务很长，AI 上下文会压缩或中断，怎么防止忘记目标、重复失败和丢失研究结论？

它的核心规则包括：先创建计划文件、重大决策前重读计划、每阶段后更新状态、错误必须记录、不能重复同一个失败动作。新版本还描述了 `/plan-loop`、`/plan-goal` 这类长循环入口，用于“按节奏重读计划并持续工作直到计划完成”。但 Codex 集成文档也提醒，Codex hooks 需要开启 `codex_hooks`，并且当前 Codex hooks 在 Windows 上可能不可用；因此在本项目当前 Windows PowerShell 环境里，它更适合作为“手动文件持久化方法”，不应假设 hooks 会自动生效。

## 3. 两套体系对比

|        对比项         |         obra/superpowers         |    OthmanAdi/planning-with-files     |
| :-------------------: | :------------------------------: | :----------------------------------: |
|       核心目标        |      规范化完成软件开发任务      |      让长期任务状态持久化到文件      |
|       最强能力        | 设计、计划、执行、评审、验证闭环 |    防遗忘、防重复失败、跨压缩恢复    |
| 适合 8 小时任务的部分 |   任务拆解、持续实施、评审门禁   |      长上下文保持、日志、恢复点      |
|     主动触发方式      |     触发具体 workflow skill      | 触发 plan 文件工作流或 slash command |
| 是否适合作为唯一方案  |         适合多数开发任务         |      不适合单独承担工程质量闭环      |
|    当前本地可用性     |      已在全局 skills 中可见      |    本次未在全局 skills 清单中看到    |

我的判断：

> 8 小时单一开发任务，主执行链路用 `superpowers`；长记忆、防中断、防压缩用 `planning-with-files` 或本项目已有的 Memorix / 报告机制补强。

## 4. 应该主动触发哪个 skill

### 4.1 从模糊需求开始

当你只有一个大目标，比如“帮我把某个系统完整重构好”“帮我做一个大功能”“帮我解决一批长期问题”，应该先触发：

```plain
$brainstorming
```

适合提示词：

```plain
$brainstorming
这是一个可能持续 8 小时的单一开发任务。请先和我澄清目标、边界、验收标准和风险，不要直接写代码。
设计确认后，请继续使用 writing-plans 生成可长时间执行的实施计划。
```

原因：没有设计和验收标准，8 小时运行只会放大偏差。

### 4.2 已经有清晰需求，但还没有执行计划

应该触发：

```plain
$writing-plans
```

适合提示词：

```plain
$writing-plans
请把这个需求写成适合长效运行的实施计划。
要求：
1. 计划能支持一个 agent 连续执行数小时。
2. 每个任务都有明确文件、步骤、验证命令和预期结果。
3. 优先支持 subagent-driven-development 执行。
4. 每个阶段都要有可验证的完成条件。
```

原因：`writing-plans` 输出的计划是后续长效执行的轨道。没有计划，`subagent-driven-development` 或 `executing-plans` 都缺少稳定输入。

### 4.3 已经有实施计划，并且平台支持子代理

应该触发：

```plain
$subagent-driven-development
```

适合提示词：

```plain
请使用 $subagent-driven-development 执行这个计划。
这是一个长效运行的单一任务，我授权你使用子代理逐任务推进。
要求：
1. 不要在每个小任务后问我要不要继续。
2. 只有遇到真实 blocker、需求歧义或验证失败时才停下来问我。
3. 每个任务完成后做规格符合性评审和代码质量评审。
4. 每个阶段都要运行计划中指定的验证命令。
5. 最后使用 verification-before-completion 和 finishing-a-development-branch 收尾。
```

原因：在你明确授权子代理时，这个 skill 最接近“长时间自动推进”的目标。它的模式是“一个计划，多个任务，逐项实施，逐项评审”，适合长任务。

### 4.4 已经有实施计划，但不想或不能用子代理

应该触发：

```plain
$executing-plans
```

适合提示词：

```plain
请使用 $executing-plans 按计划执行。
这是一个长效运行的单一任务，请连续推进所有任务，直到计划完成或遇到 blocker。
执行时必须：
1. 先批判性阅读计划。
2. 按 checkbox 步骤逐项完成。
3. 不跳过验证。
4. 遇到不清晰、依赖缺失、测试反复失败时停止并说明。
```

原因：它适合同一会话内按计划执行，但少了子代理隔离和双评审，所以更依赖主 agent 自律。

### 4.5 任务可能跨上下文压缩、中断或多次恢复

如果安装了 `planning-with-files`，可以先触发它，再叠加 superpowers 执行链路：

```plain
$planning-with-files
```

适合提示词：

```plain
$planning-with-files
这是一个预计持续 8 小时的单一任务。请先创建并维护 task_plan.md、findings.md、progress.md。
执行期间：
1. 每个阶段完成后更新 task_plan.md 和 progress.md。
2. 每 2 次搜索、浏览或读取大量资料后，把关键发现写入 findings.md。
3. 每个错误都记录到 task_plan.md，并避免重复同一失败动作。
4. 在重大决策前重读 task_plan.md。
然后再进入 superpowers 的 writing-plans / executing-plans 或 subagent-driven-development 链路。
```

如果平台支持 `/plan-loop` 和 `/plan-goal`，可以进一步使用：

```plain
/plan-goal until all phases are complete and all verification commands pass
/plan-loop 10m
```

但在当前 Windows + Codex 场景下，不要假设这些 hook 和 slash command 一定可用。更稳妥的做法是手动要求 agent 维护三份 markdown 文件。

## 5. 推荐触发链路

### 5.1 最推荐链路

适合“我要你长期完成一个开发目标，不只是调查”：

```plain
$brainstorming
确认设计
$writing-plans
确认计划
$using-git-worktrees
$subagent-driven-development
$verification-before-completion
$finishing-a-development-branch
```

你可以直接这样说：

```plain
这是一个预计可持续 8 小时推进的单一开发任务。
请使用 superpowers 工作流：
1. 先用 brainstorming 澄清目标和设计。
2. 设计确认后用 writing-plans 写可执行计划。
3. 执行前用 using-git-worktrees 建立隔离工作区。
4. 我授权你使用 subagent-driven-development 逐任务执行。
5. 中途不要反复问“是否继续”，只有 blocker、需求歧义、验证失败才停。
6. 完成前必须使用 verification-before-completion 给出验证证据。
7. 完成后使用 finishing-a-development-branch 给出收尾选项。
```

### 5.2 偏研究和资料整理的长任务

适合“我要你研究、比较、写报告、形成决策”：

```plain
$planning-with-files
$brainstorming 或 openspec-explore
写 findings.md / progress.md / docs/reports
```

如果没有安装 `planning-with-files`，可以要求使用同等文件模式：

```plain
这是一个长研究任务。请模拟 planning-with-files 的三文件模式：
1. 用 task_plan.md 记录阶段、决策和错误。
2. 用 findings.md 记录搜索结果和资料结论。
3. 用 progress.md 记录执行日志。
每 2 次搜索或浏览后写入 findings.md。
最后把结论整理到 docs/reports。
```

### 5.3 已经在 OpenSpec change 内

如果任务已经有 OpenSpec change、tasks、design、specs，优先触发项目内 OpenSpec 技能：

```plain
$openspec-apply-change
```

适合提示词：

```plain
$openspec-apply-change <change-name>
这是一个长效运行任务。请读取 change 的 contextFiles，连续执行 pending tasks。
每完成一项立即更新 tasks checkbox。
遇到设计问题时暂停并建议更新 artifacts。
```

原因：在本项目里 OpenSpec 技能已经提供“读 artifacts -> 执行 tasks -> 更新 checkbox -> 完成/暂停报告”的闭环。它适合已经规范化的需求，不适合一开始还没想清楚的需求。

## 6. fullstackrecipes Ralph Loop 调研

### 6.1 Ralph Loop 是什么

`fullstackrecipes` 提供的 Ralph Agent Loop，本质上不是一个普通的 `SKILL.md` 指令，而是一个“外部循环执行器 + Claude Code Ralph 插件 + 用户故事队列 + 进度日志”的组合。

它的核心工作方式是：

1. 用 `docs/user-stories/` 存放可验证的用户故事 JSON。
2. 每个故事用 `passes: false` / `passes: true` 表示是否已经通过。
3. 每轮 agent 读取 `scripts/ralph/log.md` 和用户故事。
4. 选择一个仍然未通过的故事。
5. 按 TDD 实现、运行 typecheck/build/test/browser automation。
6. 通过后把对应故事改成 `passes: true`。
7. 追加日志并提交。
8. 由 Ralph Loop 继续启动下一轮，直到输出完成承诺或达到最大迭代次数。

Fullstack Recipes 的 `ralph-setup` recipe 给出的脚本实现非常明确：`scripts/ralph/runner.ts` 使用 Bun 启动 Claude Code CLI，并调用 Claude 插件命令 `/ralph-loop:ralph-loop`，还传入 `--completion-promise "FINISHED"` 和 `--max-iterations`。这意味着它的开箱实现强绑定 Claude Code CLI 和 Claude 的 Ralph Loop 插件。

### 6.2 Ralph Loop 和 Anthropic 长任务 harness 的关系

Ralph Loop 与 Anthropic 的长任务 harness 思路高度一致。Anthropic 的长任务文章指出，长任务的核心问题不是“单个上下文窗口不够大”，而是多个离散会话之间缺少可靠交接。它推荐的关键机制包括：

- 初始化阶段创建功能清单。
- 后续 coding agent 每次只推进一个功能。
- 用 progress 文件和 git history 让下一轮 agent 快速理解当前状态。
- 只有经过验证后，才把功能标记为通过。
- 每轮结束时让工作区保持干净、可继续。

Ralph Loop 可以理解为这套 harness 思路在 Claude Code 插件生态里的产品化版本：它用 `passes` 队列防止“提前宣布完成”，用日志和 git 提交防止“下一轮不知道上一轮做了什么”，用 completion promise 和 max iterations 控制循环结束。

### 6.3 是否倾向于在 Claude Code 内使用

结论：是，Ralph Loop 明显倾向于 Claude Code。

原因如下：

- Claude 插件页显示 Ralph Loop 是 Anthropic Verified，并且安装目标是 Claude Code。
- 插件说明里明确使用 `/ralph-loop "your prompt here" --max-iterations 10 --completion-promise "DONE"` 这种 Claude Code slash command。
- Fullstack Recipes 的 runner 直接调用 `claude --permission-mode bypassPermissions --verbose`。
- Fullstack Recipes 的 runner 拼接的是 `/ralph-loop:ralph-loop` 命令，而不是一个通用 agent CLI 参数。
- Ralph 插件依赖 stop hook / session exit interception 这类 Claude Code 插件能力；普通 `SKILL.md` 本身没有这种宿主级循环能力。

所以，如果你问“原版 fullstackrecipes Ralph Loop 最适合在哪里用”，答案是：

```plain
Claude Code > Cursor / Codex
```

### 6.4 是否适合直接在 Codex 使用

结论：不适合“原样直接使用”，但适合“移植其模式”。

在 Codex 中，`SKILL.md` 可以表达 Ralph 的工作方法，例如“读取用户故事、选择一个未通过项、实现、验证、更新 passes、写日志”。但 skill 只是上下文和流程指令，不能天然做到以下事情：

- 拦截当前会话结束。
- 自动重新喂入同一个 prompt。
- 跨多轮 CLI 进程维护 max iterations。
- 解析 completion promise 后决定是否停止。
- 像 Claude Code Ralph 插件那样在宿主层面自动循环。

Codex CLI 本身支持读写文件、执行命令和更自动化的 approval/sandbox 模式；OpenAI 的 Codex CLI 文档也把 Full Auto 定位为适合较长任务，例如修复构建或原型开发。但这不等价于 Claude Code 的 `/ralph-loop` 插件。要在 Codex 里获得 Ralph 式循环，需要额外实现一个外部 runner，例如：

```plain
for iteration in 1..N:
  run codex with a fixed Ralph prompt
  inspect stdout for FINISHED
  if FINISHED: stop
  otherwise continue
```

也就是说：

```plain
Codex + Ralph 思路 = 可行
Codex + fullstackrecipes 原版 Ralph runner = 不开箱可用
Codex + 只有一个 Ralph skill = 不能保证 8 小时自动循环
```

另外，Codex 的官方帮助文档提到 Windows 支持是实验性的，可能需要 WSL。Fullstack Recipes 的 runner 又使用 `sh -c` 和 Bun，这对本项目当前 Windows PowerShell 环境不是最稳的默认组合。

### 6.5 是否适合在 Cursor 使用

结论：Cursor 比 Codex 更容易做“外部 CLI runner 移植”，但原版 Ralph Loop 仍然不是 Cursor 原生方案。

原因如下：

- Cursor CLI 支持 agent 命令行和非交互/print 模式，适合脚本化调用。
- Cursor Background Agents 可以自动运行命令和迭代测试，适合长任务。
- Fullstack Recipes 的 `agent-setup` recipe 明确提到可以把 skills 安装到 Cursor 和 Codex，也提供了 `fullstackrecipes` MCP server。

但是，Ralph Loop 的关键能力不是“能读一个 skill”，而是“宿主能自动重新启动 agent 会话并判断 completion promise”。Cursor 可以通过自定义 runner 实现这个模式，但它不是 Fullstack Recipes `ralph-setup` 里现成的 `/ralph-loop` 插件。

适配 Cursor 时，更合理的做法是：

1. 保留 `docs/user-stories/*.json`。
2. 保留 `scripts/ralph/log.md`。
3. 用 Cursor CLI 或 Background Agent 每轮执行一个固定 prompt。
4. 外部脚本解析输出中是否有 `FINISHED`。
5. 如果没有完成，就继续下一轮。

### 6.6 能否以 skills 形式通用于 Cursor、Codex、Claude Code

结论要拆开看：

|      层级      | 是否能通用 skill 化 |                                      说明                                      |
| :------------: | :-----------------: | :----------------------------------------------------------------------------: |
|  Ralph 方法论  |        可以         | 写成 `SKILL.md`，要求每轮只处理一个 `passes: false` 故事、验证、改状态、写日志 |
|  用户故事格式  |        可以         |           `docs/user-stories/*.json` 与 `passes` 字段不依赖具体平台            |
|    进度日志    |        可以         |            `scripts/ralph/log.md`、git commit、progress 文件都通用             |
|    自动循环    | 不能只靠 skill 通用 |    需要 Claude 插件、Cursor CLI runner、Codex CLI runner 或其他外部 harness    |
| 8 小时无人值守 |  不建议只靠 skill   |          需要权限、sandbox、测试稳定性、超时控制、失败上限和恢复策略           |

因此，最准确的判断是：

> Ralph Loop 的“工作协议”适合做成通用 skill；Ralph Loop 的“自动长循环能力”不适合只用 skill 表达，必须依赖各平台的 CLI、插件、hook 或外部 runner。

### 6.7 能否实现单一任务 8 小时长效运行

在 Claude Code 中：可以更接近这个目标。

前提是：

- 安装 Ralph Loop 插件。
- 安装 Claude Code CLI。
- 配置好 `docs/user-stories/`。
- 有稳定的 typecheck/build/test/browser automation。
- 设置合理的 `--max-iterations`。
- completion promise 明确，例如 `FINISHED`。
- 允许 agent 自动执行命令，且权限模式经过你确认。

在 Codex 和 Cursor 中：可以实现，但需要额外 runner；不能只靠 skills。

如果你只把 Ralph 写成一个 skill，它通常只能保证“当前这一轮按 Ralph 方法做事”，不能保证“8 小时自动继续”。要达到 8 小时，需要增加：

- 外部循环脚本。
- 每轮最大耗时。
- 总迭代次数。
- 输出解析。
- 失败次数上限。
- 日志文件和 git 提交。
- 测试命令。
- 中断恢复机制。

### 6.8 和 superpowers / planning-with-files 的关系

Ralph Loop、Superpowers、planning-with-files 三者不是互斥关系。

|        体系         |             最擅长的部分             |             不擅长的部分              |
| :-----------------: | :----------------------------------: | :-----------------------------------: |
|     Ralph Loop      | 自动循环、用户故事队列、每轮一个功能 | 需求澄清、设计评审、跨平台通用 runner |
|     Superpowers     |  设计、计划、TDD、子代理评审、收尾   |         原生自动重启当前会话          |
| planning-with-files |  长上下文持久化、防遗忘、防重复失败  |           工程执行质量门禁            |

最佳组合不是三选一，而是：

```plain
Superpowers 负责设计和执行质量
Ralph Loop 负责循环推进未通过的用户故事
planning-with-files / Memorix 负责长期记忆和恢复
```

### 6.9 我对 Ralph Loop 的采用建议

如果你使用 Claude Code，并且任务是全栈 Web App、用户故事清晰、测试命令稳定，Ralph Loop 值得优先尝试。

如果你使用 Codex 或 Cursor，我不建议直接说“使用 Ralph Loop skill 连续跑 8 小时”。更稳的说法是：

```plain
请采用 Ralph Loop 的工作协议：
1. 把任务拆成 docs/user-stories/*.json，每个行为一个 entry，包含 description、steps、passes。
2. 每轮只选择一个 passes=false 的最高优先级故事。
3. 实现前写/更新测试。
4. 运行 typecheck/build/test/browser automation。
5. 只有验证通过才改成 passes=true。
6. 每轮追加 scripts/ralph/log.md 并提交。
7. 如果平台不支持 /ralph-loop，请不要假装已经自动循环；改用 superpowers 的 subagent-driven-development 或 executing-plans 连续执行。
```

如果目标是“今天就在当前 Codex 会话内长效推进 8 小时”，我的建议仍然是：

```plain
$brainstorming -> $writing-plans -> $subagent-driven-development
```

如果你明确要移植 Ralph，则应额外写一个 Codex/Cursor 专用 runner，而不是只写一个 skill。

## 7. 一句话决策表

|              你的状态               |             主动触发              |            原因             |
| :---------------------------------: | :-------------------------------: | :-------------------------: |
|            只有模糊目标             |         `$brainstorming`          |      先防止 8 小时跑偏      |
|           有设计但没计划            |         `$writing-plans`          |      生成长效执行轨道       |
|         有计划且允许子代理          |  `$subagent-driven-development`   |    最适合长时间连续推进     |
|        有计划但不使用子代理         |        `$executing-plans`         |       按计划顺序执行        |
| 使用 Claude Code 且已有用户故事队列 |           `/ralph-loop`           |      最接近自动长循环       |
|  使用 Codex/Cursor 且想借鉴 Ralph   |   Ralph 工作协议 + 外部 runner    | 仅靠 skill 不能自动重启会话 |
|          要隔离当前工作区           |      `$using-git-worktrees`       |      防止污染当前分支       |
|          要防止忘记上下文           |      `$planning-with-files`       |    用文件持久化任务状态     |
|       OpenSpec change 已存在        |     `$openspec-apply-change`      |   跟随项目规范执行 tasks    |
|            准备声称完成             | `$verification-before-completion` |      必须先给验证证据       |
|          完成后要合并或 PR          | `$finishing-a-development-branch` |         结构化收尾          |

## 8. 8 小时任务的关键约束

### 8.1 不要把“单一任务”理解成“单一步骤”

一个 8 小时任务必须拆成阶段，否则 agent 会在中途丢失方向。更准确的表达是：

```plain
这是一个单一目标下的多阶段长任务。
```

推荐阶段划分：

1. 目标澄清和验收标准。
2. 现状侦察和风险识别。
3. 设计或方案确认。
4. 实施计划。
5. 分阶段执行。
6. 阶段验证。
7. 总体验证和收尾。

### 8.2 不要只说“持续运行 8 小时”

更有效的说法是：

```plain
请持续推进直到计划完成、验证通过，或遇到真实 blocker。
不要因为完成一个子步骤就停下来问是否继续。
每完成一个阶段都更新计划状态和验证结果。
```

时间长度本身不是可靠约束；完成条件、验证条件和停机条件才是可靠约束。

### 8.3 必须提前定义停机条件

建议在提示词里明确：

```plain
只有以下情况才停止：
1. 所有计划任务完成并验证通过。
2. 遇到缺失凭据、缺失依赖、权限限制等真实 blocker。
3. 需求存在多种合理解释，继续执行会导致返工。
4. 同一验证失败已经按不同方法尝试 3 次。
```

这能避免 agent 在普通阶段完成后提前结束，也能避免它在错误路径上硬耗时间。

### 8.4 必须要求验证证据

长效执行最容易出问题的地方是“看起来做了很多，但没有可验证结果”。因此应要求：

```plain
完成任何阶段前，必须运行计划中指定的验证命令。
最终回复必须列出实际运行过的验证命令、退出码或关键输出。
没有新鲜验证证据，不允许声称完成。
```

## 9. 我的建议

### 9.1 你以后最该主动触发的 skill

如果只能选一个入口，不要直接选 `subagent-driven-development`，而是先选：

```plain
$brainstorming
```

因为 8 小时任务最大风险不是“执行不够久”，而是“从一开始方向就不够清楚”。`brainstorming` 会强制先澄清设计，再进入计划和执行。

如果你已经有明确计划，并且就是要 agent 连续干活，那么最该主动触发：

```plain
$subagent-driven-development
```

但提示词里要明确“我授权使用子代理”。在当前 Codex 环境中，子代理工具受平台规则限制，只有你明确要求代理并行/委派/子代理工作时，才适合启用。

### 9.2 planning-with-files 的正确位置

`planning-with-files` 不应该替代 `superpowers` 的开发闭环。它更像是“长任务黑匣子”和“上下文硬盘”：

- 任务可能持续很多小时，用它。
- 任务需要大量搜索和资料归档，用它。
- 任务可能跨会话、跨压缩恢复，用它。
- 任务只是普通工程执行，不一定要先用它。

在本项目当前环境里，如果尚未安装它，建议先用已有的 superpowers skills 和 Memorix；如果你经常做 4 小时以上任务，再考虑安装 `planning-with-files` 并检查 Codex hooks 支持。

### 9.3 Ralph Loop 的正确位置

Ralph Loop 不应该替代 `brainstorming` 和 `writing-plans`。它适合放在“已经有可验证用户故事队列”的阶段。

正确位置是：

```plain
需求澄清 -> 设计/计划 -> 生成用户故事 JSON -> Ralph Loop 循环执行
```

不推荐的位置是：

```plain
模糊需求 -> 直接 Ralph Loop 8 小时
```

因为 Ralph Loop 会强化执行，但不会自动保证需求拆分合理、验收标准完整、架构方案正确。它解决的是“如何一轮接一轮推进”，不是“应该推进什么”。

## 10. 可复制的最终推荐提示词

### 10.1 需求还没完全清楚时

```plain
$brainstorming
我有一个预计可以持续推进 8 小时的单一开发任务。
请先澄清目标、边界、验收标准、风险和停机条件，不要直接实施。
设计确认后，请进入 writing-plans，生成适合 subagent-driven-development 的长效执行计划。
```

### 10.2 计划已经写好时

```plain
请使用 $subagent-driven-development 执行计划文件：<plan-path>。
我授权你使用子代理逐任务推进。
这是一个单一目标下的长效任务，请连续执行直到：
1. 所有任务完成并验证通过；
2. 遇到真实 blocker；
3. 需求歧义会导致返工；
4. 同一问题已经按不同方法尝试 3 次仍失败。
每个任务完成后进行规格符合性评审和代码质量评审。
最终必须使用 verification-before-completion，列出实际运行的验证命令和结果。
```

### 10.3 任务很长且担心上下文丢失时

```plain
请先采用 planning-with-files 的文件持久化模式。
在项目根目录维护：
1. task_plan.md：阶段、状态、决策、错误。
2. findings.md：研究发现、资料来源、技术结论。
3. progress.md：执行日志、验证结果、文件变更。
执行期间每 2 次搜索、浏览或大量读取后更新 findings.md。
每个阶段完成后更新 task_plan.md 和 progress.md。
重大决策前重读 task_plan.md。
然后按 superpowers 的 writing-plans / subagent-driven-development 链路执行。
```

### 10.4 使用 Claude Code Ralph Loop 时

```plain
请使用 Ralph Loop 推进这个任务。
前提：
1. docs/user-stories/ 已经包含用户故事 JSON。
2. 每个故事都有 description、steps、passes。
3. 每轮只处理一个 passes=false 的故事。
4. 只有 typecheck/build/test/browser automation 全部通过，才能把 passes 改为 true。
5. 每轮都追加 scripts/ralph/log.md，并提交 git commit。
6. 输出 FINISHED 时才表示所有故事完成。
```

如果在 Claude Code CLI 中运行，Ralph Loop 形式应类似：

```bash
claude --permission-mode bypassPermissions --verbose '/ralph-loop "按 docs/user-stories 逐项实现并验证" --completion-promise "FINISHED" --max-iterations 50'
```

### 10.5 在 Codex / Cursor 中借鉴 Ralph 时

```plain
请采用 Ralph Loop 的工作协议，但不要假设当前平台存在 /ralph-loop 插件。
如果没有外部 runner，就在当前会话中按以下规则连续执行：
1. 读取 docs/user-stories/ 和 scripts/ralph/log.md。
2. 选择一个 passes=false 的最高优先级故事。
3. 写/更新测试并实现。
4. 运行验证命令。
5. 通过后改 passes=true，追加日志，提交。
6. 继续下一个故事，直到全部 passes=true 或遇到 blocker。
7. 如果你无法自动重启会话，请明确说明，而不是声称已经进入 Ralph 自动循环。
```

## 11. 参考资料

- [obra/superpowers](https://github.com/obra/superpowers)：agentic skills framework 与软件开发方法论。
- [OthmanAdi/planning-with-files](https://github.com/OthmanAdi/planning-with-files)：Manus-style persistent markdown planning。
- [planning-with-files SKILL.md](https://raw.githubusercontent.com/OthmanAdi/planning-with-files/master/skills/planning-with-files/SKILL.md)：三文件模式、2-Action Rule、错误记录和 `/plan-loop` / `/plan-goal` 说明。
- [planning-with-files Codex setup](https://raw.githubusercontent.com/OthmanAdi/planning-with-files/master/docs/codex.md)：Codex hooks 安装、限制和 Windows 注意事项。
- [planning-with-files workflow](https://raw.githubusercontent.com/OthmanAdi/planning-with-files/master/docs/workflow.md)：文件和 hooks 的工作流关系。
- [Fullstack Recipes](https://fullstackrecipes.com/)：提供 fullstackrecipes MCP server、skills 安装和 shadcn registry recipes。
- [Fullstack Recipes Ralph Agent Loop](https://fullstackrecipes.com/api/recipes/ralph-setup)：Ralph runner、prompt、log 文件和用户故事循环说明。
- [Fullstack Recipes Agent Setup](https://fullstackrecipes.com/api/recipes/agent-setup)：说明可把 fullstackrecipes skills 安装到 Cursor、Codex 等 agent。
- [Claude Ralph Loop Plugin](https://claude.com/plugins/ralph-loop)：Claude Code 插件页，说明 `/ralph-loop`、completion promise 和 max iterations。
- [Anthropic Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)：长任务 harness、feature list、progress file、git history、每轮单功能推进的背景文章。
- [Cursor CLI docs](https://docs.cursor.com/en/cli/using)：Cursor CLI agent、非交互模式与命令审批说明。
- [OpenAI Codex CLI Help](https://help.openai.com/en/articles/11096431)：Codex CLI approval modes、Full Auto 和平台支持说明。
