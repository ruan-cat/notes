# 2026-06-07 提交 vercel-labs/skills 全局列表性能优化 PR 报告

## 1. 结论摘要

本次 OpenSpec 长任务已完成核心开源协作闭环：已基于 `ruan-cat/skills` fork 创建专用分支，完成 `skills list -g` 全局列表性能优化代码和测试，发布英文 issue，并向 `vercel-labs/skills` 创建英文 PR。

上游 PR 聚焦 `listInstalledSkills()` 的重复文件系统 I/O：用单次调用内的 `SKILL.md` 解析缓存、每个 Agent skills 目录的一次性索引、`Set` 查询和 `agentFilter` 扫描范围收敛，解决多 Agent、Windows Junction 场景下重复扫描和重复解析的问题。

同时，本仓库已新增一篇中文掘金文章草稿，用于对外复盘性能问题定位、TDD 验证和开源 PR 过程。

## 2. 上游协作结果

### 2.1. Issue 与 PR

|      类型      |                       链接                        |     状态      |
| :------------: | :-----------------------------------------------: | :-----------: |
|     Issue      | https://github.com/vercel-labs/skills/issues/1389 |     Open      |
|       PR       |  https://github.com/vercel-labs/skills/pull/1390  |     Open      |
|   Fork 分支    |        `ruan-cat:perf/list-global-skills`         | 已推送到 fork |
| 上游 base 分支 |             `vercel-labs/skills:main`             |    已关联     |

### 2.2. Commit 信息

|      项目       |                        内容                        |
| :-------------: | :------------------------------------------------: |
|   Commit hash   |     `566e84114094f9a65befb61ec8e1486486250ccb`     |
| Commit message  |    `perf: improve global skills list scanning`     |
|    修改文件     | `src/installer.ts`、`tests/list-installed.test.ts` |
| 是否直接改 main |                         否                         |

```log
git status --short --branch
## perf/list-global-skills...origin/perf/list-global-skills

git show --stat --oneline --name-only HEAD
566e841 perf: improve global skills list scanning
src/installer.ts
tests/list-installed.test.ts
```

## 3. 上游改动内容

### 3.1. 源码改动

`src/installer.ts` 的主要改动如下：

|         改动点          |                             说明                              |
| :---------------------: | :-----------------------------------------------------------: |
| `parseSkillMdForList()` |       在单次 `listInstalledSkills()` 调用内缓存解析结果       |
|  `realpath(SKILL.md)`   | 优先按真实路径作为缓存 key，Junction / symlink 可命中同一缓存 |
|  Agent 目录一次性索引   |    每个 agent skills 目录只 `readdir()` 和解析必要内容一次    |
|       `dirNames`        |            用目录名 `Set` 替代大量重复 `access()`             |
|      `skillNames`       |         用 frontmatter name `Set` 兜底匹配同名 skill          |
|  `agentFilter` gating   |           指定 agent 时不补扫无关 Agent skills 目录           |

### 3.2. 测试改动

`tests/list-installed.test.ts` 的主要覆盖点如下：

|              测试点               |                   验证目标                   |
| :-------------------------------: | :------------------------------------------: |
| 多 Agent 链接同一 canonical skill |    输出仍合并为一个 skill，不破坏最终语义    |
|          agents 列表保留          |    去重后仍能看到该 skill 属于多个 agent     |
|   同一真实 `SKILL.md` 解析一次    |            证明重复解析被缓存控制            |
|     `agentFilter: ['codex']`      | 指定 agent 时不返回无关 Agent 目录下的 skill |
|         Windows Junction          |  Windows 环境使用 Junction 覆盖链接目录语义  |

## 4. 验证结果

### 4.1. 已通过的本地验证

```log
pnpm test tests/list-installed.test.ts --run
Test Files 1 passed (1)
Tests 14 passed | 2 skipped (16)

pnpm run format:check
All matched files use Prettier code style!

git diff --check -- src\installer.ts tests\list-installed.test.ts
passed
```

### 4.2. 本地未通过但已记录的验证风险

以下命令在本机 Windows 环境未通过，失败点来自未触碰文件或本机构建脚本执行环境，已记录在 OpenSpec `agent-findings.md` 和 PR 文案的 local notes 中：

```log
pnpm run type-check
src/git.ts(102,10): error TS2769
src/skills.ts(84,39): error TS2339
src/skills.ts(94,7): error TS2322

pnpm run build
TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for scripts/generate-licenses.ts
```

### 4.3. PR 检查状态

截至本报告编写时，PR 上可见的 Socket Security 检查已经通过；PR 仍需要维护者 review。

|                检查项                |      状态       |
| :----------------------------------: | :-------------: |
|   Socket Security: Project Report    |      pass       |
| Socket Security: Pull Request Alerts |      pass       |
|             Merge state              |     BLOCKED     |
|           Review decision            | REVIEW_REQUIRED |

```log
gh pr checks 1390 --repo vercel-labs/skills
Socket Security: Project Report       pass
Socket Security: Pull Request Alerts  pass
```

## 5. 性能收益与兼容性

### 5.1. 性能收益

本次 PR 的动机来自本机性能报告中的真实数据：

|              命令              |     修复前     |       修复后       |        说明         |
| :----------------------------: | :------------: | :----------------: | :-----------------: |
|        `skills list -g`        | 约 20 到 25 秒 |     约 2.2 秒      |    约 11 倍提升     |
| `skills list -g --agent codex` |    约 3 秒     | 典型 0.4 到 0.7 秒 | filter 收敛收益明显 |

关键规模数据：

|       指标        | 数量 |
| :---------------: | :--: |
|    全局 skills    |  60  |
|    全局 scopes    |  39  |
| 顶层目录 entries  | 1305 |
| Windows Junctions | 1241 |

### 5.2. 兼容性边界

本次缓存只存在于单次 `listInstalledSkills()` 调用内部，不跨 CLI 运行保存状态，因此不会引入持久 stale cache。输出结构保持不变：skill 仍按 scope/name 合并，`agents` 列表仍保留多个 Agent 关联。

## 6. 本仓库文档成果

### 6.1. 掘金文章

|   项目   |                                            内容                                            |
| :------: | :----------------------------------------------------------------------------------------: |
| 文件路径 | `docs/ruan-cat-notes/docs/posts/2026-6-7-optimize-skills-list-global-performance/index.md` |
|   标题   |                  `一次 skills list -g 性能优化 PR：从 20 多秒到 2 秒左右`                  |
|   状态   |               已完成草稿，frontmatter 标记为 `TODO 编写完内容就可以直接发文`               |

文章已按“问题现象 → 定位过程 → 数据规模 → 源码瓶颈 → 优化方案 → 测试验证 → 开源 PR 复盘”组织，并保留关键数据。

### 6.2. OpenSpec 工件

OpenSpec change 路径：

```log
openspec/changes/submit-skills-list-global-performance-pr
```

已持续更新：

|        文件         |             用途             |
| :-----------------: | :--------------------------: |
|     `tasks.md`      |       长任务唯一任务源       |
| `agent-progress.md` | 执行证据、命令结果和链接记录 |
| `agent-findings.md` |   风险、失败尝试和处理策略   |
|  `issue-draft.md`   |  英文 issue 草稿与发布链接   |
|    `pr-draft.md`    |    英文 PR 草稿与发布链接    |

## 7. 剩余风险与后续动作

### 7.1. 剩余风险

|               风险               |                       当前处理                       |
| :------------------------------: | :--------------------------------------------------: |
|       PR 需要维护者 review       |              已创建 PR，等待维护者反馈               |
| 本地 build/type-check 未全量通过 | 已如实记录，不伪造通过；后续以 GitHub PR checks 为准 |
|    上游可能要求调整测试或文案    |           后续按 review feedback 继续补丁            |

### 7.2. 后续动作

1. 关注 PR #1390 的 GitHub checks 和 review feedback。
2. 若维护者要求调整，继续在 `perf/list-global-skills` 分支提交增量 commit。
3. PR 合并后，可更新掘金文章的 `juejin` 字段并对外发布。
4. 如果 CI 后续暴露 build 脚本问题，需要判断是否单独提交独立 PR 修复。
