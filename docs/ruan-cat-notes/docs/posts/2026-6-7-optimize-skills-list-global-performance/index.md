---
juejin: TODO 编写完内容就可以直接发文
desc: 记录一次把skills list -g从20多秒优化到2秒左右的开源PR过程，复盘WindowsJunction、多Agent目录和TDD验证。
title: "一次 skills list -g 性能优化 PR：从 20 多秒到 2 秒左右"
date: 2026-06-07
categories: ["开源贡献", "CLI", "性能优化", "AI Agent"]
tags: ["skills", "vercel-labs", "Windows Junction", "TDD", "OpenSpec"]
---

# 一次 skills list -g 性能优化 PR：从 20 多秒到 2 秒左右

> **摘要**：
>
> 这篇文章记录一次真实的开源 PR：我在本地高频使用 `skills list -g`，让 AI agent 在规划任务前获取完整的全局 skills。随着全局 skills 被同步到多个 Agent 平台，这个命令在 Windows Junction 场景下变成 20 到 25 秒，并让机器出现明显卡顿。最终我定位到 `listInstalledSkills()` 内部重复扫描和重复解析 `SKILL.md` 的问题，用单次调用缓存、每个 Agent 目录一次性索引、`--agent` filter 范围收敛，把典型耗时压到 2 秒左右，并向 `vercel-labs/skills` 提交了 issue 和 PR。

> **AI 协助编写的博客文章**：
>
> 这篇文章有参与 AI 协助的。使用了 AI 帮助梳理 OpenSpec 任务、整理验证证据、润色文章结构。

## 1. 问题现象：一个本来应该很轻的列表命令变慢了

我最近在大量使用 AI agent 做长任务。长任务的一个特点是：agent 需要在规划、恢复、分派子任务之前，先知道当前全局有哪些 skills 可用。这里的 `skills` 指的是 [vercel-labs/skills](https://github.com/vercel-labs/skills) 这个 CLI 所管理的 Agent 技能。

所以 `skills list -g` 对我来说不是偶尔跑一下的命令，而是一个**高频基础设施命令**。它的作用很明确：让 agent 主动拿到完整的全局 skills 列表，避免在复杂任务中漏用关键技能。

但在我的本地环境里，这个命令变得非常慢：

```log
skills list -g
约 20 到 25 秒
```

这个慢不是“等一下就好”的慢，而是会打断开发节奏的慢。每次恢复任务、重新规划、检查 skills，都像被迫卡住一次。机器也会出现明显的卡顿感，尤其是在多个终端或多个 agent 会话并行工作时，这种阻塞会被放大。

更麻烦的是，`skills list -g --agent codex` 这种看起来应该只查 Codex 的命令，也没有足够快。这说明问题不只是“全局目录太多”，还可能存在 filter 没有真正收敛扫描范围的问题。

## 2. 定位过程：先把“慢”变成可解释的数据

### 2.1. 先排除命令包装器问题

遇到 CLI 变慢，我通常不会直接猜源码。第一步是确认慢在哪里：

```log
skills list -g
node cli-original-benchmark-20260607.mjs list -g
skills list -g --agent codex
```

最终能确认：主要瓶颈不在 PowerShell 包装器，也不是 Node 启动本身，而是在 `skills` 包的全局列表逻辑里。

### 2.2. 再统计真实文件系统规模

这次最关键的发现是：全局 skills 本身并不算多，但它们被同步到了很多 Agent 平台目录里。

当时的数据大致如下：

|        指标        |    数量     |              含义              |
| :----------------: | :---------: | :----------------------------: |
|    全局 skills     |     60      |   用户最终真正关心的技能数量   |
| 全局 skill scopes  |     39      |     参与扫描的全局目录范围     |
|  顶层目录 entries  |    1305     |    所有 scope 下目录项总和     |
| Windows Junctions  |    1241     | 多数目录实际指向同一批技能目录 |
| 修复前普通全局列表 | 20 到 25 秒 |       高频调用时非常痛苦       |

这组数据说明，慢的不是“60 个 skills 太多”，而是这些 skills 通过多 Agent 目录、Junction、链接目录形成了大量重复入口。

## 3. 数据规模：60 个 skills 为什么能拖到 20 多秒？

### 3.1. 多 Agent 目录会放大扫描成本

现代 AI 开发环境里，一个开发者可能同时装了 Codex、Claude Code、Gemini CLI、Cursor、Windsurf、Qwen Code、OpenHands 等多个工具。为了让不同工具都能使用同一套技能，很多 skills 会被同步或链接到多个 Agent 目录。

这本身是合理的：统一维护一份 canonical skills，再通过不同目录暴露给不同工具。

但如果 CLI 在列表时没有识别“这些目录实际指向同一个 `SKILL.md`”，就会发生重复工作：

```log
同一个真实 SKILL.md
  -> 被 .claude/skills 看到一次
  -> 被 .windsurf/skills 看到一次
  -> 被 .codex/skills 看到一次
  -> 被更多 agent skills 目录继续看到
```

最终用户只需要一个去重后的 skill，但 CLI 在输出之前已经做了很多重复 I/O。

### 3.2. Windows Junction 让问题更明显

Windows 下目录链接经常表现为 Junction。Junction 对统一管理目录很方便，但对扫描型 CLI 来说，如果没有按真实路径去重，就会把“同一个真实目录”当成很多个不同入口。

这类问题在 Linux/macOS 的 symlink 场景也可能出现，只是 Windows 上小文件 I/O、路径解析和安全软件扫描更容易把体感延迟放大。

## 4. 源码瓶颈：去重发生得太晚

### 4.1. 原始逻辑的问题

问题集中在 `listInstalledSkills()` 的全局列表路径。它最终会把输出按 skill name 和 scope 去重，但去重发生在比较靠后的阶段。

也就是说，最终输出看起来没有重复，但在输出之前已经发生了重复扫描：

```typescript
for (const skill of canonicalSkills) {
	for (const agentType of agentsToCheck) {
		for (const possibleName of possibleNames) {
			await access(agentSkillDir);
		}

		if (!found) {
			const entries = await readdir(agentBase);
			for (const entry of entries) {
				await parseSkillMd(candidateSkillMd);
			}
		}
	}
}
```

这里有三个明显问题：

|           问题           |                 影响                 |
| :----------------------: | :----------------------------------: |
| 重复 `access()` 路径检查 | 规范技能数、Agent 数、候选名称数相乘 |
|     重复 `readdir()`     | 每个 skill 都可能重新扫描同一个目录  |
|  重复 `parseSkillMd()`   |  同一个真实 `SKILL.md` 会被反复解析  |

这不是某个单点函数很慢，而是**嵌套循环把大量小 I/O 放大了**。

### 4.2. `--agent` filter 的收益被削弱

另一个问题是：当传入 `--agent codex` 时，用户直觉上会认为只扫描 Codex 目录。

但原实现还会补扫其它已经存在的 Agent skills 目录。结果就是，filter 虽然存在，但扫描范围没有真正收敛到指定 agent。

这会让 `skills list -g --agent codex` 的性能收益明显小于预期，也让 agent 在只需要自身 skills 时仍然承担无关目录成本。

## 5. 优化方案：把重复 I/O 变成一次索引和 Set 查询

### 5.1. 单次调用内缓存 `SKILL.md` 解析结果

第一个优化是给 `listInstalledSkills()` 增加一个只在本次调用内生效的解析缓存。

缓存 key 优先使用 `realpath(SKILL.md)`：

```typescript
const parsedSkillCache = new Map<string, Skill | null>();
```

这么做的好处是：多个 Junction 或 symlink 指向同一个真实 `SKILL.md` 时，可以命中同一份缓存。缓存生命周期只在单次 `listInstalledSkills()` 调用内，不会跨 CLI 运行保留状态，因此不会引入长期 stale cache。

### 5.2. 每个 Agent skills 目录只建一次索引

第二个优化是把“每个 skill 都去扫描 agent 目录”改为“每个 agent 目录先建一次索引”。

索引里保留两类信息：

|   索引字段   |              用途              |
| :----------: | :----------------------------: |
|  `dirNames`  |   通过目录名快速判断是否存在   |
| `skillNames` | 通过 frontmatter name 兜底匹配 |

这样后续判断某个 skill 是否属于某个 agent 时，就不需要反复 `access()`、`readdir()`、`parseSkillMd()`，而是变成 Set 查询。

### 5.3. 尊重 `agentFilter`

第三个优化是收紧扫描范围：

```log
有 agentFilter：
只扫描指定 agent 相关目录

无 agentFilter：
保留既有全局发现语义
```

这个改动看起来小，但对高频 agent 场景很重要。因为 agent 经常只关心自己的 skills，`--agent codex` 就应该尽量避免扫描 `.claude/skills`、`.windsurf/skills` 等无关目录。

## 6. 测试验证：先写失败测试，再改实现

### 6.1. TDD 的关键测试

这次 PR 我没有只靠本地耗时截图，而是先用 [Vitest](https://vitest.dev/) 补测试证明行为缺口。

核心测试覆盖了几件事：

|         测试点         |                 目标                 |
| :--------------------: | :----------------------------------: |
| 多 Agent 链接同一技能  |       输出仍然合并为一个 skill       |
|    agents 列表保留     |  去重后不丢失 skill 属于哪些 agent   |
| 真实路径解析只发生一次 |    同一个 `SKILL.md` 不被重复解析    |
| `agentFilter` 收敛范围 | 指定 Codex 时不返回无关 agent 的技能 |
| Windows Junction 覆盖  | Windows 下使用 Junction 模拟链接目录 |

本地聚焦验证结果：

```log
pnpm test tests/list-installed.test.ts --run
Test Files 1 passed (1)
Tests 14 passed | 2 skipped (16)

pnpm run format:check
All matched files use Prettier code style!
```

### 6.2. 为什么不写固定耗时断言？

性能优化很容易想写“必须小于多少毫秒”的测试，但这类断言在 CI 里通常不稳定。

这次我选择验证**结构性性能约束**：

```log
同一个真实 SKILL.md 在多链接目录场景下只解析一次
指定 agent filter 后不扫描无关 agent 目录
```

这种测试不依赖机器性能，也能证明算法复杂度确实下降。

## 7. 开源 PR 复盘：把本地痛点变成可合并的变更

### 7.1. Issue 先讲清楚使用场景

我先在 GitHub 上给 `vercel-labs/skills` 提了 issue：

- issue: https://github.com/vercel-labs/skills/issues/1389

issue 的重点不是“我觉得慢”，而是讲清楚使用场景：

1. 我需要高频执行 `skills list -g`。
2. 这个命令用于让 AI agent 获取完整全局 skills。
3. 当前 20 到 25 秒的耗时会影响长任务恢复和开发效率。
4. 我会提交专项 PR 解决重复扫描问题。

对开源维护者来说，这比单纯抛一个性能数字更容易判断优先级。

### 7.2. PR 聚焦两个文件

PR 地址：

- PR: https://github.com/vercel-labs/skills/pull/1390

这次 PR 只改了两个上游文件：

|              文件              |               作用               |
| :----------------------------: | :------------------------------: |
|       `src/installer.ts`       | 实现缓存、目录索引和 filter 收敛 |
| `tests/list-installed.test.ts` |  补充重复解析和 filter 行为测试  |

提交信息也保持简单：

```log
perf: improve global skills list scanning
```

### 7.3. 优化效果

本地热修验证里，普通全局列表从约 24.85 秒降到约 2.24 秒，约 11.1 倍提升。

典型结果如下：

|              命令              |     优化前     |       优化后       |
| :----------------------------: | :------------: | :----------------: |
|        `skills list -g`        | 约 20 到 25 秒 |     约 2.2 秒      |
| `skills list -g --agent codex` |    约 3 秒     | 典型 0.4 到 0.7 秒 |

这里最值得记录的不是“加了缓存所以快了”，而是：**缓存必须放在正确的边界内**。

如果做全局持久缓存，可能会引入 stale state；如果只在单次调用内缓存，就能解决重复解析问题，同时不改变 CLI 的外部状态模型。

## 8. 总结：性能优化要从真实工作流里长出来

这次 PR 对我最大的启发是：很多有价值的开源贡献，不一定来自宏大的 feature，而来自真实工作流里反复出现的小痛点。

`skills list -g` 本身只是一个列表命令。但当它位于 AI agent 的长任务恢复、技能发现、任务规划链路上时，20 多秒的延迟就会变成真实生产力损耗。

最终的修复思路并不复杂：

1. 用数据确认慢在哪里。
2. 找到重复 I/O 被嵌套循环放大的地方。
3. 把重复扫描改成一次索引。
4. 用 TDD 验证结构性约束，而不是写脆弱的耗时断言。
5. 把本地热修沉淀成 issue 和 PR。

这也是我认为比较适合展示在简历或面试里的工程经历：它同时覆盖了真实使用场景、性能分析、跨平台文件系统、测试设计、开源协作和 AI agent 工作流。
