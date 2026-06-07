# submit-skills-list-global-performance-pr 发现与风险记录

> 本文件记录重要发现、失败路径、坑点和不可重复尝试，不是任务源。发现任务遗漏时必须回写 `tasks.md`。

## 1. 已知事实

- 本机性能报告显示，`skills list -g` 慢的主要原因是多 Agent 全局目录和 Windows Junction 造成重复小 I/O。
- 真实规模包括 60 个全局 skills、39 个 scope、1305 个顶层目录项、1241 个 Junction。
- 本地热修方案包括 `realpath(SKILL.md)` 解析缓存、每个 agentBase 一次性索引、Set 查询和 `--agent` filter gating。
- 上游源码不能直接使用本机 pnpm 全局安装产物中的 `dist/cli.mjs` 热修。
- 英文 issue 和英文 PR 必须纯英文；中文掘金文章和中文最终报告必须符合本仓库 Markdown 规范。

## 2. 风险与处理策略

|                    风险                    |                                       处理策略                                        |
| :----------------------------------------: | :-----------------------------------------------------------------------------------: |
|              上游源码结构变化              | 正式执行开始时重新读取 fork 工作区内的 `src/installer.ts`、测试文件和 package scripts |
|         `realpath` 在异常路径失败          |          保留 fallback 到原始路径，并用测试覆盖 dangling symlink 或无效路径           |
| Windows Junction 与 POSIX symlink 行为不同 |      非 Windows 用 symlink 测通用语义，Windows 环境增加 Junction 手工或条件验证       |
|          固定耗时断言导致 CI 抖动          |                测试断言扫描范围、解析次数和输出语义，不断言具体毫秒数                 |
|          GitHub 写权限或网络失败           |              记录失败命令和错误信息；同类失败连续 3 次后暂停请求用户介入              |
|          英文文案泄露本机隐私路径          |                   使用脱敏路径或概括描述，必要路径仅保留在中文报告                    |
|            PR 仍需维护者 review            |                 PR 已创建且 Socket Security 检查通过，后续等待 review                 |

## 3. 收尾汇总

- 2026-06-07：Issue 已发布为 `https://github.com/vercel-labs/skills/issues/1389`。
- 2026-06-07：PR 已发布为 `https://github.com/vercel-labs/skills/pull/1390`，当前仍需维护者 review。
- 2026-06-07：上游 commit 为 `566e84114094f9a65befb61ec8e1486486250ccb`。
- 2026-06-07：上游聚焦测试 `pnpm test tests/list-installed.test.ts --run` 和 `pnpm run format:check` 通过。
- 2026-06-07：本地 `pnpm run type-check`、`pnpm run build` 未标记为通过，风险已保留。
- 2026-06-07：掘金文章和最终报告已落地，格式检查通过。

## 4. 失败尝试记录

```log
2026-06-07 dependency smoke test:
Command:
pnpm test tests/list-installed.test.ts --run

Result:
Vitest started successfully after pnpm install, but the existing target file failed before new TDD changes.

Observed failures:
- should handle global scope option: timed out in 5000ms. This is consistent with the known slow global list path on this Windows machine.
- should find skill when the skill directory is a symlink: EPERM creating symlink.
- should ignore dangling symlinks without a reachable SKILL.md: EPERM creating symlink.
- should ignore symlinks that point to a regular file: EPERM creating symlink.

Handling:
Do not use this broad test command as the RED proof for the new performance test. Use a focused `-t` command for the newly added test, then later address or document unrelated Windows symlink/global-scope failures during broader verification.

2026-06-07 local verification risk:
Commands:
pnpm run type-check
pnpm run build

Results:
- `pnpm run type-check` fails in untouched files `src/git.ts` and `src/skills.ts`.
- `pnpm run build` fails on local Node v22.14.0 because `node scripts/generate-licenses.ts` cannot execute a `.ts` file directly.
- Running `node --experimental-strip-types scripts/generate-licenses.ts` reaches `license-checker`, but fails in local npm/npx cache while installing/loading `license-checker` (`Cannot find module 'read-installed'`).

Handling:
Do not mark full verification as passed. The focused performance tests and format check pass. Before final PR reporting, either verify CI behavior on GitHub or explicitly document this local build/type-check risk and decide whether a separate build-script fix belongs in scope.

2026-06-07 CLI test decision:
`src/list.test.ts` uses `runCli()` black-box CLI integration. It does not provide a straightforward way to mock `detectInstalledAgents()`, home/global skills directories, or agent global directories for a deterministic `skills list -g --json` / `--agent codex` fixture.

Equivalent behavior is covered in `tests/list-installed.test.ts`:
- repeated real `SKILL.md` parse count is controlled
- linked directories still merge into one skill
- agents list is preserved
- `agentFilter: ['codex']` does not return unrelated agent directory skills

Therefore, no `src/list.test.ts` change was made for this task.
```
