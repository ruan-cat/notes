# skills,大语言模型的技能

skills 技能，已经成为大语言模型通用的渐进式揭露的上下文工程方案。已经和 MCP 一样成为一个专门通用规范。

## claude code skill

来自 Anthropic 公司维护的 skills 文档：

- 编写语法与格式： https://code.claude.com/docs/zh-CN/skills
- 最佳实践： https://platform.claude.com/docs/zh-CN/agents-and-tools/agent-skills/best-practices
- 规范文档： https://agentskills.io/home

## 常用的 skills 工具与下载站点

- vercel 公司维护的 skills 下载站点： https://skills.sh/
- https://skillsmp.com/
- https://claude-plugins.dev/skills
- 比较杂项泛用非开发领域的 skills： https://clawdhub.com/

## skills 拓展工具

- 基于 npx 的通用技能下载工具
  - https://github.com/vercel-labs/skills
  - https://github.com/rohitg00/skillkit
  - https://github.com/pi0/skillman
  - https://github.com/harlan-zw/skilld
  - https://github.com/antfu/skills-npm
- claude code 插件的注册表和技能查询工具： https://github.com/Kamalnrf/claude-plugins
- 基于写入`AGENTS.md`的 skills 安装插件： https://github.com/numman-ali/openskills
- 技能下载工具： https://github.com/Peiiii/skild

## <!-- 杂项思考 --> 在 node 包内分发 skills 技能

尚未系统化的，专业化的提案。

::: details

现在推出了一款规范，在 node 包内直接导入识别技能。以后对外分发一系列 node 包时，可以对外直接分发给 AI 识别的 skills 技能文档。便于 AI 正确使用本 node 包。比自己制作一个专用的 MCP 来暴露上下文，效果好多了。

不过这个毕竟是最近出来的一个方案，还不至于被主流的 agentskills 规范所接纳。

如果该规范正式被接纳，那么以后就应该要增加一个提交类型，叫做 skills，一个 node 包平时维护的东西除了文档，还包括专项的 skills 文档了。

- 仓库： https://github.com/onmax/npm-agentskills
- 倡议： https://github.com/agentskills/agentskills/issues/81

- https://github.com/antfu/skills-npm
- https://github.com/agentskills/agentskills/issues/81
- https://github.com/onmax/npm-agentskills

:::

## 个人全局安装的 skills

由于目前的 skills 安装没有一个专门的清单表，无法实现规模化控制，无法统一设置全部的 AI 客户端，故这里把必要的 skills 依赖列举出来：

- 驱动 gemini cli： https://skills.sh/softaworks/agent-toolkit/gemini
  > `skills add https://github.com/softaworks/agent-toolkit --skill gemini`
- 查询 skills： https://skills.sh/vercel-labs/skills/find-skills
  > `skills add https://github.com/vercel-labs/skills --skill find-skills`
- 技能制作： https://skills.sh/anthropics/skills/skill-creator
  > `skills add https://github.com/anthropics/skills --skill skill-creator`
- git 提交：
  - https://github.com/ruan-cat/monorepo/blob/main/.claude-plugin/README.md#git-提交助手-git-commit
    > `skills add https://github.com/ruan-cat/monorepo/tree/main/claude-code-marketplace/common-tools/skills/git-commit`
  - https://skills.sh/ruan-cat/monorepo/git-commit
    > `skills add https://github.com/ruan-cat/monorepo --skill git-commit`
