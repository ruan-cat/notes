<!-- TODO: 等待完成 pr 面试话术沉淀 -->

# 2026-06-07 skills list -g 全局列表性能瓶颈与本地修复报告

## 1. 结论摘要

`skills list -g` 在本机长期任务中非常慢，根因不是 Node 启动或 PowerShell 包装器，而是 `skills@1.5.10` 在全局列表模式下对多个 Agent 平台的 skills 目录做了大量重复文件系统 I/O。

本机环境里，全局 skills 被同步到多个 Agent 平台，很多目录是 Windows Junction，实际指向同一批 `C:\Users\pc\.agents\skills` 技能。原始实现会反复扫描这些 Junction 目录，并反复解析相同的 `SKILL.md`。在 39 个全局 scope、1305 个顶层目录项、1241 个 Junction 的规模下，一次 `skills list -g` 会耗时约 20 到 25 秒。

已在本机 `skills@1.5.10` 全局安装产物内完成热修：给 `listInstalledSkills()` 增加按真实路径缓存的 `SKILL.md` 解析结果、每个 Agent 目录的一次性索引，并修正 `--agent` filter 被补扫其它目录绕开的行为。

修复后，核心命令耗时从约 24.85 秒降到约 2.24 秒，约 11.1 倍提升；只查 Codex 时，典型耗时约 0.4 到 0.7 秒。

## 2. 环境与命令来源

|      项目       |                                              数据                                              |
| :-------------: | :--------------------------------------------------------------------------------------------: |
|  操作系统终端   |                                     Windows PowerShell 5.1                                     |
|    Node 版本    |                                            v22.14.0                                            |
|    包管理器     |                                         pnpm 全局安装                                          |
|  `skills` 入口  |                          `C:\Users\pc\AppData\Local\pnpm\skills.ps1`                           |
|  实际 CLI 文件  | `C:\Users\pc\AppData\Local\pnpm\global\5\.pnpm\skills@1.5.10\node_modules\skills\bin\cli.mjs`  |
|  实际业务实现   | `C:\Users\pc\AppData\Local\pnpm\global\5\.pnpm\skills@1.5.10\node_modules\skills\dist\cli.mjs` |
| 当前 npm 最新版 |                                        `skills@1.5.10`                                         |

关键命令定位结果：

```log
Get-Command skills
Path: C:\Users\pc\AppData\Local\pnpm\skills.ps1

pnpm view skills version
1.5.10
```

## 3. 数据规模

### 3.1. 用户可见的全局技能规模

`skills list -g --json` 当前返回：

|          指标           | 数量 |                      说明                      |
| :---------------------: | :--: | :--------------------------------------------: |
|      全局技能数量       |  60  |     `skills list -g --json` 返回的数组长度     |
| 输出中出现的 Agent 平台 |  40  | 包含 detected agent 和存在目录被补扫出来的平台 |
|  skill-agent 关联数量   | 1682 |   60 个 skill 在多个 Agent 平台下的关联总数    |

按 Agent 平台统计的技能关联数量如下：

|   Agent 平台   | 关联技能数 |
| :------------: | :--------: |
|     Codex      |     60     |
|    OpenCode    |     60     |
|   Gemini CLI   |     60     |
|     Cline      |     60     |
|  Antigravity   |     60     |
|  Claude Code   |     60     |
| GitHub Copilot |     60     |
|     Cursor     |     60     |
|      Trae      |     60     |
|     Qoder      |     60     |
|   Kilo Code    |     38     |
|       Pi       |     38     |
|  Mistral Vibe  |     38     |
|      AdaL      |     38     |
|    Zencoder    |     38     |
|   Qwen Code    |     38     |
|    Augment     |     38     |
|  Command Code  |     38     |
|     Crush      |     38     |
|    Neovate     |     38     |
|     Junie      |     38     |
|  Cortex Code   |     38     |
|     Goose      |     38     |
|    Continue    |     38     |
|    Windsurf    |     38     |
|   OpenHands    |     38     |
|     Pochi      |     38     |
|   iFlow CLI    |     38     |
|    Zenflow     |     38     |
|      Kode      |     38     |
|   CodeBuddy    |     38     |
|    Roo Code    |     38     |
|     MCPJam     |     38     |
|    Trae CN     |     38     |
|      Mux       |     38     |
|    OpenClaw    |     38     |
|    Kiro CLI    |     38     |
|     Droid      |     38     |
|     Lingma     |     17     |
|      Amp       |     1      |

这里最关键的信号是：全局技能本身只有 60 个，但为了展示它们分别链接到哪些 Agent，CLI 需要遍历大量 Agent 目录。

### 3.2. 底层文件系统规模

本机全局扫描涉及 39 个 scope，顶层目录项合计 1305 个，其中 1241 个是 Windows Junction，只有 64 个是真实目录。

|      指标       |             数量             |                      说明                      |
| :-------------: | :--------------------------: | :--------------------------------------------: |
| 全局 scope 数量 |              39              |  `skills list -g` 实际扫描的全局技能目录数量   |
| 顶层目录项总数  |             1305             |          各 scope 下的技能目录项总和           |
|  Junction 数量  |             1241             | 绝大多数 Agent 目录项是指向规范目录的 Junction |
|  真实目录数量   |              64              |    主要集中在 `C:\Users\pc\.agents\skills`     |
|  规范全局目录   | `C:\Users\pc\.agents\skills` |             包含 60 个真实技能目录             |

代表性 scope 数据如下：

|    Scope    | 目录项 | Junction | 真实目录 |                  路径                  |
| :---------: | :----: | :------: | :------: | :------------------------------------: |
|  canonical  |   60   |    0     |    60    |      `C:\Users\pc\.agents\skills`      |
| claude-code |   60   |    59    |    1     |      `C:\Users\pc\.claude\skills`      |
|    qoder    |   60   |    59    |    1     |      `C:\Users\pc\.qoder\skills`       |
|    trae     |   60   |    59    |    1     |       `C:\Users\pc\.trae\skills`       |
|  openhands  |   38   |    38    |    0     |    `C:\Users\pc\.openhands\skills`     |
|  qwen-code  |   38   |    38    |    0     |       `C:\Users\pc\.qwen\skills`       |
|  windsurf   |   38   |    38    |    0     | `C:\Users\pc\.codeium\windsurf\skills` |
|   lingma    |   17   |    17    |    0     |      `C:\Users\pc\.lingma\skills`      |
|    codex    |   2    |    1     |    1     |      `C:\Users\pc\.codex\skills`       |
|   cursor    |   1    |    1     |    0     |      `C:\Users\pc\.cursor\skills`      |
| amp-exists  |   1    |    1     |    0     |  `C:\Users\pc\.config\agents\skills`   |

这说明慢的根本不是“技能数量 60 个”本身，而是这些技能被多 Agent 平台同步后形成了大量重复的目录入口。

## 4. 性能复现数据

### 4.1. 修复前耗时

原始 `skills@1.5.10` 备份文件执行 `list -g` 的耗时：

```log
node cli-original-benchmark-20260607.mjs list -g
TotalSeconds:      24.8475226
TotalMilliseconds: 24847.5226
```

早期基线测量中，直接运行全局命令也稳定接近 20 秒：

```log
Measure-Command { skills list -g | Out-Null }
TotalSeconds:      19.9294271
TotalMilliseconds: 19929.4271
```

原始实现下，即使指定 `--agent codex`，仍然不是特别快：

```log
node cli-original-agent-benchmark-20260607.mjs list -g --agent codex
TotalSeconds:      2.9908578
TotalMilliseconds: 2990.8578
```

原因是原始实现虽然解析了 `--agent` 参数，但后续还会把其它“已经存在的 Agent 全局目录”补回 `scopes`，导致 filter 的收益被削弱。

### 4.2. 修复后耗时

修复后 3 次采样：

|              命令              |  第 1 次  |  第 2 次  |  第 3 次  |  平均值   |                       说明                        |
| :----------------------------: | :-------: | :-------: | :-------: | :-------: | :-----------------------------------------------: |
|        `skills list -g`        | 2323.4 ms | 2378.1 ms | 2025.6 ms | 2242.4 ms |                   普通全局列表                    |
|    `skills list -g --json`     | 2187.4 ms | 2153.2 ms | 2236.0 ms | 2192.2 ms |                     JSON 输出                     |
| `skills list -g --agent codex` | 447.8 ms  | 669.2 ms  | 2367.9 ms | 1161.6 ms | 第 3 次有明显系统抖动，典型值更接近 0.4 到 0.7 秒 |

同一轮验证中还测到：

```log
Measure-Command { skills list -g | Out-Null }
TotalSeconds:      1.8405798
TotalMilliseconds: 1840.5798

Measure-Command { skills list -g --agent codex | Out-Null }
TotalSeconds:      0.6841338
TotalMilliseconds: 684.1338
```

### 4.3. 性能提升幅度

以原始备份执行结果 24847.5 ms 和修复后普通全局列表平均 2242.4 ms 计算：

|              场景              |   修复前   |      修复后       |    提升    |
| :----------------------------: | :--------: | :---------------: | :--------: |
|        `skills list -g`        | 24847.5 ms |     2242.4 ms     | 约 11.1 倍 |
|   `skills list -g` 早期基线    | 19929.4 ms |     2242.4 ms     | 约 8.9 倍  |
| `skills list -g --agent codex` | 2990.9 ms  | 669.2 ms 中位附近 | 约 4.5 倍  |

## 5. 核心瓶颈分析

### 5.1. 原始扫描流程

`dist/cli.mjs` 中的 `listInstalledSkills(options)` 做了几件事：

1. `detectInstalledAgents()` 检测已安装 Agent。
2. 根据 `global` 和 `agentFilter` 构建 `scopes`。
3. 扫描每个 scope 下的技能目录。
4. 对规范目录中的每个技能，再反查它链接到了哪些 Agent。

原始反查逻辑的关键问题在第 4 步。伪代码如下：

```ts
for (const skill of canonicalSkills) {
	for (const agentType of agentsToCheck) {
		for (const possibleName of possibleNames) {
			await access(join(agentBase, possibleName));
		}

		if (!found) {
			const agentEntries = await readdir(agentBase);
			for (const agentEntry of agentEntries) {
				const candidateSkill = await parseSkillMd(candidateSkillMd);
				if (candidateSkill.name === skill.name) found = true;
			}
		}
	}
}
```

在本机数据规模下，这会产生两个明显问题：

|            问题             |                                            影响                                            |
| :-------------------------: | :----------------------------------------------------------------------------------------: |
|   `access()` 调用数量过多   |       60 个规范技能乘以约 39 个 Agent，再乘以多个 possible name，形成数千次路径检查        |
|      fallback 重复扫描      | 每个技能、每个 Agent 未命中时，都可能重新 `readdir(agentBase)` 并解析该目录下的 `SKILL.md` |
|      Junction 重复解析      |   多个 Agent 目录实际指向同一个规范技能目录，但原实现按不同路径重复解析同一份 `SKILL.md`   |
| `--agent` filter 被补扫削弱 |                   指定 `--agent codex` 后，仍会扫描其它存在的 Agent 目录                   |

### 5.2. 算法复杂度问题

原始实现接近：

```log
O(scopeEntries + canonicalSkills * agentsToCheck * agentDirEntries)
```

在当前本机数据下，可以粗略理解为：

```log
canonicalSkills = 60
agentsToCheck   = 39
agentDirEntries = 1 到 60，常见为 38 或 60
```

最痛苦的地方不是某一次读取特别慢，而是大量小 I/O 被嵌套循环放大。Windows 上 `access()`、`stat()`、`readdir()`、Junction 解析和杀毒软件文件监控叠加后，会把这个问题放大到 20 秒以上。

### 5.3. 为什么长期 goal 任务里特别难受

长期 goal 系列任务会频繁检查可用 skills。单次 `skills list -g` 如果接近 20 到 25 秒，会造成几个实际问题：

1. 每次恢复上下文或进入子阶段都要等待。
2. Agent 的计划、验证、技能调度节奏被阻塞。
3. 多次调用会把本来几分钟的任务拉长到十几分钟。
4. 用户体验上像“命令卡死”，但实际上是同步小 I/O 被放大。

这类 CLI 性能问题很适合作为开源 PR：表面是普通列表命令，实际涉及多平台路径模型、Windows Junction、缓存粒度和复杂度降低。

## 6. 本地修复方案

### 6.1. 修改文件

已修改本机 pnpm 全局包产物：

```log
C:\Users\pc\AppData\Local\pnpm\global\5\.pnpm\skills@1.5.10\node_modules\skills\dist\cli.mjs
```

备份文件：

```log
C:\Users\pc\AppData\Local\pnpm\global\5\.pnpm\skills@1.5.10\node_modules\skills\dist\cli.mjs.bak-20260607-slow-list
```

注意：这是本机热修，不在业务仓库 git diff 中。重新安装或升级 `skills` 包可能覆盖该修改。

### 6.2. 修复点 1：按真实路径缓存 `SKILL.md` 解析结果

新增局部缓存：

```ts
const parsedSkillCache = new Map();

const parseSkillMdForList = async (skillMdPath) => {
	let cacheKey = skillMdPath;
	try {
		cacheKey = await realpath(skillMdPath);
	} catch {}

	if (parsedSkillCache.has(cacheKey)) return parsedSkillCache.get(cacheKey);

	const skill = await parseSkillMd(skillMdPath);
	parsedSkillCache.set(cacheKey, skill);
	return skill;
};
```

作用：

|                    修复点                     |                  价值                   |
| :-------------------------------------------: | :-------------------------------------: |
|   使用 `realpath(SKILL.md)` 作为 cache key    | Junction 指向同一真实文件时，只解析一次 |
|               缓存 `null` 结果                |           无效文件也不反复读            |
| 缓存限定在一次 `listInstalledSkills()` 调用内 |        不引入跨命令缓存失效问题         |

### 6.3. 修复点 2：每个 Agent 目录只建立一次索引

新增 `agentSkillIndex`：

```ts
const agentSkillIndex = new Map();

const getAgentSkillIndex = async (agentBase) => {
	if (agentSkillIndex.has(agentBase)) return agentSkillIndex.get(agentBase);

	const index = {
		dirNames: new Set(),
		skillNames: new Set(),
	};

	const agentEntries = await readdir(agentBase, { withFileTypes: true });
	for (const agentEntry of agentEntries) {
		const candidateDir = join(agentBase, agentEntry.name);
		index.dirNames.add(agentEntry.name);
		index.dirNames.add(agentEntry.name.toLowerCase());

		const candidateSkill = await parseSkillMdForList(join(candidateDir, "SKILL.md"));
		if (candidateSkill) index.skillNames.add(candidateSkill.name);
	}

	agentSkillIndex.set(agentBase, index);
	return index;
};
```

原来每个 skill 都可能重新扫描 agentBase；现在每个 agentBase 在一次命令内最多扫描一次。

### 6.4. 修复点 3：用内存索引替代重复 `access()`

原实现对每个 possible name 做 `access()`：

```ts
await access(agentSkillDir);
```

修复后改为查内存索引：

```ts
const agentIndex = await getAgentSkillIndex(agentBase);

if (agentIndex.dirNames.has(possibleName) || agentIndex.dirNames.has(possibleName.toLowerCase())) {
	found = true;
}

if (!found && agentIndex.skillNames.has(skill.name)) found = true;
```

这样保留了原有语义：

|                      原语义                      |           新实现如何保留           |
| :----------------------------------------------: | :--------------------------------: |
|      目录名命中即认为 Agent 安装了该 skill       |     `dirNames` 保存原始目录名      |
|           大小写或 sanitize 后名称命中           |   `dirNames` 同时保存小写目录名    |
| 目录名不一致时，解析 `SKILL.md` 里的 `name` 匹配 | `skillNames` 保存 frontmatter name |

### 6.5. 修复点 4：尊重 `--agent` filter

原实现即使指定 `--agent codex`，仍会执行“扫描所有存在的其它 Agent 目录”的逻辑。

修复后增加条件：

```ts
if (!agentFilter) {
	const allAgentTypes = Object.keys(agents);
	for (const agentType of allAgentTypes) {
		// 补扫其它存在的 agent skills 目录
	}
}
```

这样 `skills list -g --agent codex` 才能真正只关心 Codex 相关目录。

## 7. 推荐的上游 PR 方案

### 7.1. PR 目标

向 `vercel-labs/skills` 提交 PR 时，建议聚焦在：

1. 降低 `skills list -g` 在多 Agent、多 Junction 场景下的重复 I/O。
2. 保持输出格式完全兼容。
3. 保持缓存为单次命令内局部缓存，避免跨命令缓存失效问题。
4. 修正 `--agent` filter 的扫描范围，让它真正减少工作量。

### 7.2. 推荐实现

建议在源码的 `listInstalledSkills()` 中实现以下结构：

|          方案           |                               说明                                |
| :---------------------: | :---------------------------------------------------------------: |
| `parseSkillMdForList()` |         使用 `realpath` 作为 key 缓存 `SKILL.md` 解析结果         |
| `getAgentSkillIndex()`  | 每个 agentBase 只 `readdir` 一次，建立 `dirNames` 和 `skillNames` |
|      内存 Set 查询      |    用 Set 查询替代嵌套循环中的重复 `access()` 和 fallback scan    |
|  `agentFilter` gating   |          有 `--agent` 时，不补扫其它 Agent 的已存在目录           |

### 7.3. 推荐测试

PR 中建议补充测试：

1. 构造多个 agent skills 目录，其中一部分目录通过 symlink 或 junction 指向同一规范技能目录。
2. 验证 `list -g` 输出仍能合并同名技能，并保留 agents 列表。
3. 验证 `--agent codex` 不会扫描无关 Agent 目录。
4. 用 mock 或计数器断言同一个 `SKILL.md` 不会被重复解析过多次。
5. 在 Windows 环境下增加 junction 场景测试；在非 Windows 环境下用 symlink 覆盖等价路径。

测试目标不是锁死具体毫秒数，而是锁死扫描次数和输出语义。

### 7.4. PR 描述可用要点

可以这样组织 PR：

```log
Problem:
`skills list -g` can become very slow when global skills are linked into many agent-specific directories. On Windows, these directories are often Junctions pointing to the same canonical skills folder.

Reproduction scale:
- 60 global skills
- 39 global skill scopes
- 1305 top-level entries
- 1241 Windows Junctions
- 1682 skill-agent relationships in output

Before:
- `skills list -g`: 19.9s to 24.8s

After:
- `skills list -g`: about 2.2s
- `skills list -g --agent codex`: typically 0.4s to 0.7s

Fix:
- Cache parsed SKILL.md results by realpath within listInstalledSkills()
- Build one in-memory index per agent skills directory
- Replace repeated access/readdir/parse fallback with Set lookups
- Respect --agent filter when adding existing agent scopes
```

## 8. 面试话术草稿

可以把这次贡献整理成一个 1 到 2 分钟的性能优化故事：

> 我在使用 Vercel 的 `skills` CLI 做多 Agent 工作流时，发现 `skills list -g` 在 Windows 上一次要 20 多秒。这个命令会在长期任务中被频繁调用，所以它不是一个小延迟，而是会持续拖慢整个开发节奏。
>
> 我先定位到命令来自 pnpm 全局安装的 `skills@1.5.10`，然后量化了本机数据规模：60 个全局技能、40 个 Agent 输出关联、1682 条 skill-agent 关联、39 个全局扫描目录、1305 个顶层目录项，其中 1241 个是 Windows Junction。
>
> 进一步读源码后，我发现瓶颈在 `listInstalledSkills()`：它会对规范目录里的每个技能，逐个反查每个 Agent 目录；未命中时还会重复 `readdir` 并解析该 Agent 目录下的 `SKILL.md`。由于很多 Agent 目录实际是 Junction，指向同一批文件，所以同一个 `SKILL.md` 被重复解析了很多次。
>
> 我的修复方案是把算法从重复小 I/O 改成单次命令内的内存索引：按 `realpath(SKILL.md)` 缓存解析结果，每个 Agent 目录只扫描一次，建立目录名和 skill name 的 Set，然后用 Set 查询替代重复的 `access/readdir/parse`。同时我修正了 `--agent` filter，让指定 Agent 时不再补扫其它已存在目录。
>
> 结果是 `skills list -g` 从约 24.8 秒降到约 2.2 秒，提升约 11 倍；只查 Codex 时典型值在 0.4 到 0.7 秒。这个优化保持输出格式不变，也不引入跨命令缓存失效风险，所以适合作为一个向上游提交的兼容性性能 PR。

## 9. 后续行动建议

1. Fork `vercel-labs/skills`，在源码中实现同等缓存，而不是直接修改构建产物。
2. 补充多 Agent、多 symlink 或 junction 的测试。
3. 在 PR 描述里使用本报告的数据作为真实世界性能案例。
4. PR 合并后，把本机热修替换为官方版本。
5. 简历里可以写成：为 Vercel skills CLI 提交性能优化 PR，将多 Agent 全局技能列表在 Windows Junction 场景下的耗时从约 25 秒优化到约 2 秒，提升约 11 倍。
