## ADDED Requirements

### Requirement: 上游仓库准备必须隔离在专用工作区和分支

系统 MUST 在 `D:\code\store\skills__ruan-cat` 中准备 `https://github.com/ruan-cat/skills` fork 工作区，并基于 `vercel-labs/skills` 的 `main` 分支创建专用性能优化分支，禁止直接在 `main` 分支上修改。

#### Scenario: 创建专用工作区

- **WHEN** 后续 goal 开始执行本 change 的仓库准备任务
- **THEN** 工作区 MUST 位于 `D:\code\store\skills__ruan-cat`
- **AND** 本仓库 `D:\code\ruan-cat\notes` MUST 只保存 OpenSpec、文章和报告产物，不混入上游源码修改

#### Scenario: 基于上游 main 创建分支

- **WHEN** fork 工作区已经克隆完成并可访问 `vercel-labs/skills`
- **THEN** 执行者 MUST 从上游 `main` 创建专用分支
- **AND** 执行者 MUST 记录当前分支名、上游 commit 和 fork remote 状态

### Requirement: 英文 issue 必须先说明真实使用场景和性能痛点

系统 MUST 在 `vercel-labs/skills` 创建纯英文 issue，说明用户高频本地执行 `skills list -g` 是为了让 AI agent 获取完整全局 skills，并说明命令缓慢导致机器卡顿、长任务恢复等待和开发效率下降。

#### Scenario: Issue 文案包含动机和承诺

- **WHEN** 执行者准备发布 issue
- **THEN** issue 正文 MUST 使用纯英文
- **AND** issue MUST 说明 60 个全局 skills、39 个 scope、1305 个顶层目录项、1241 个 Windows Junction、约 20 到 25 秒耗时等真实规模数据
- **AND** issue MUST 说明后续会提交专项 PR 解决该问题

### Requirement: 性能修复必须在上游源码层面完成

系统 MUST 在 `vercel-labs/skills` 源码中修复 `skills list -g` 的重复文件系统 I/O 问题，禁止把本机 `skills@1.5.10` 全局安装产物中的热修文件作为 PR 内容提交。

#### Scenario: 实现单次调用内缓存和索引

- **WHEN** 执行者修改上游源码
- **THEN** `listInstalledSkills()` 相关实现 MUST 在单次调用内缓存 `SKILL.md` 解析结果
- **AND** 缓存 key SHOULD 优先使用 `realpath(SKILL.md)`，在 `realpath` 失败时 MUST 保留安全 fallback
- **AND** 每个 agent skills 目录 MUST 最多建立一次 `dirNames` 与 `skillNames` 索引

#### Scenario: 保持输出语义兼容

- **WHEN** `skills list -g` 或 `skills list -g --json` 执行完成
- **THEN** 输出 MUST 保持原有技能合并语义
- **AND** agents 列表 MUST 不因缓存或索引优化而丢失
- **AND** JSON 输出结构 MUST 不新增破坏性字段

#### Scenario: 尊重 agent filter

- **WHEN** 用户执行 `skills list -g --agent codex`
- **THEN** 实现 MUST 不补扫与 Codex 无关的其它 agent skills 目录
- **AND** 输出 MUST 仍然只体现 filter 允许范围内的 agent 归属

### Requirement: 测试必须证明行为与扫描范围而不是锁死耗时

系统 MUST 采用 Vitest 测试覆盖性能修复的关键行为，并使用扫描次数、解析次数、输出语义和 filter 范围作为验收依据，不得把固定毫秒数作为 CI 断言。

#### Scenario: 多链接目录复现重复 I/O

- **WHEN** 测试构造多个 agent skills 目录指向同一 canonical skill
- **THEN** 测试 MUST 证明同一真实 `SKILL.md` 不会被重复解析过多次
- **AND** 测试 SHOULD 在非 Windows 环境使用 symlink 覆盖等价路径
- **AND** 测试 SHOULD 在 Windows 环境使用 Junction 或兼容方式覆盖真实问题

#### Scenario: Filter 不扫描无关目录

- **WHEN** 测试调用 `listInstalledSkills({ global: true, agentFilter: ['codex'] })`
- **THEN** 测试 MUST 证明无关 agent 目录不会被扫描
- **AND** 测试 MUST 证明有效输出没有因 filter gating 发生回归

### Requirement: PR 必须清楚说明 root cause、solution 和验证结果

系统 MUST 向 `vercel-labs/skills` 创建纯英文 PR，描述重复小 I/O、Windows Junction、复杂度降低、兼容性策略和测试结果。

#### Scenario: PR 文案可供维护者审查

- **WHEN** 执行者创建 PR
- **THEN** PR 标题和正文 MUST 使用纯英文
- **AND** PR MUST 包含 Problem、Root Cause、Solution、Compatibility、Tests、Before/After 数据
- **AND** PR MUST 不泄露不必要的本机绝对隐私路径
