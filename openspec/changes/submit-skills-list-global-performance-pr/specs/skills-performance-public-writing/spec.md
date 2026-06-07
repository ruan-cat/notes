## ADDED Requirements

### Requirement: 掘金文章必须沉淀排障与开源贡献经验

系统 MUST 在上游 issue 和 PR 完成后，在 `docs/ruan-cat-notes/docs/posts/` 下新增中文掘金文章草稿，体现真实问题、定位过程、算法优化和开源贡献复盘。

#### Scenario: 文章位置和元数据符合技能规范

- **WHEN** 执行者创建掘金文章
- **THEN** 文件 MUST 位于 `docs/ruan-cat-notes/docs/posts/YYYY-M-D-english-kebab/index.md`
- **AND** YAML frontmatter MUST 包含 `juejin: TODO 编写完内容就可以直接发文`
- **AND** `desc` MUST 不超过 100 个字符并尽量减少空格

#### Scenario: 文章结构覆盖完整技术思考

- **WHEN** 掘金文章正文完成
- **THEN** 正文 MUST 使用简体中文和第一人称叙事
- **AND** 正文 MUST 按“问题现象 → 定位过程 → 数据规模 → 源码瓶颈 → 优化方案 → 测试验证 → 开源 PR 复盘”组织
- **AND** 正文 MUST 保留 60 skills、39 scopes、1305 entries、1241 junctions、约 11 倍提升等关键数据
- **AND** 正文 MUST 包含 AI 协助编写说明块

### Requirement: 最终报告必须记录完整交付证据

系统 MUST 在 `docs/reports/` 下新增中文最终报告，记录本次 OpenSpec 长任务的执行结果、issue/PR 链接、代码修改、测试验证、文章位置、风险和后续事项。

#### Scenario: 报告文件格式符合项目规范

- **WHEN** 执行者创建最终报告
- **THEN** 文件名 MUST 使用 `YYYY-MM-DD-lowercase-kebab-case.md`
- **AND** 一级标题 MUST 以 `YYYY-MM-DD` 日期开头
- **AND** 二级和三级标题 MUST 带数字序号
- **AND** Markdown 表格 MUST 使用居中对齐
- **AND** 日志信息代码块 MUST 使用 `log`

#### Scenario: 报告内容可恢复上下文

- **WHEN** 后续 AI 或用户阅读最终报告
- **THEN** 报告 MUST 能说明做了什么、为什么做、改了哪些文件、跑了哪些验证命令、哪些验证通过或失败
- **AND** 报告 MUST 记录 issue URL、PR URL、PR CI 状态或无法获取 CI 的原因
- **AND** 报告 MUST 明确剩余风险和后续处理建议
