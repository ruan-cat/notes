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

## 3. 失败尝试记录

```log
暂无。后续执行中如有失败命令、权限问题、CI 失败或不可重复尝试，记录在这里。
```
