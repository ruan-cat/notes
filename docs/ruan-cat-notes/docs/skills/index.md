# skills,大语言模型的技能

skills 技能，已经成为大语言模型通用的渐进式揭露的上下文工程方案。已经和 MCP 一样成为一个专门通用规范。

## 常用的 skills 工具与下载站点

- vercel 公司维护的 skills 下载站点： https://skills.sh/
- 自己封装的 skills： https://skills.sh/ruan-cat/monorepo
- https://skillsmp.com/
- https://claude-plugins.dev/skills
- 比较杂项泛用非开发领域的 skills： https://clawdhub.com/

## claude code skill

来自 Anthropic 公司维护的 skills 文档：

- 编写语法与格式： https://code.claude.com/docs/zh-CN/skills
- 最佳实践： https://platform.claude.com/docs/zh-CN/agents-and-tools/agent-skills/best-practices
- 规范文档： https://agentskills.io/home

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

### skills 包实现精准安装 agent 客户端的参数

以下分类用于说明**个人使用频率**，不影响 `npx skills` 的安装目标：批量安装时仍可将技能同步到所列全部客户端；若你只想装到其中一部分，可删减对应的 `-a` 参数。

| 频率 | 产品                | `skills` CLI 的 `--agent` / `-a` 名称                  |
| ---- | ------------------- | ------------------------------------------------------ |
| 常用 | Claude Code         | `claude-code`                                          |
| 常用 | OpenAI Codex（CLI） | `codex`                                                |
| 常用 | Cursor              | `cursor`                                               |
| 低频 | Antigravity         | `antigravity`                                          |
| 低频 | Trae                | `trae`（国内版客户端若单独区分，官方还提供 `trae-cn`） |
| 低频 | Qoder               | `qoder`                                                |

对应的参数如下：

```bash
-a claude-code -a codex -a cursor -a antigravity -a trae -a qoder
```

### 通用的 skills

- 查询 skills： https://skills.sh/vercel-labs/skills/find-skills

  > ```bash
  > skills add https://github.com/vercel-labs/skills --skill find-skills
  > ```

- superpowers： https://github.com/obra/superpowers

  > ```bash
  > skills add obra/superpowers --all -g -y
  > ```

- 技能制作： https://skills.sh/anthropics/skills/skill-creator

  > ```bash
  > skills add https://github.com/anthropics/skills --skill skill-creator
  > ```

- git 提交：
  - GitHub： https://github.com/ruan-cat/monorepo/blob/main/.claude-plugin/README.md#git-提交助手-git-commit

    > ```bash
    > skills add https://github.com/ruan-cat/monorepo/tree/main/claude-code-marketplace/common-tools/skills/git-commit
    > ```

  - skills.sh： https://skills.sh/ruan-cat/monorepo/git-commit

    > ```bash
    > skills add https://github.com/ruan-cat/monorepo --skill git-commit
    > ```

### 前端设计常用的技能

```bash
skills add anthropics/skills -g -y -s frontend-design
skills add vercel-labs/agent-skills -g -y -s web-design-guidelines
skills add carmahhawwari/ui-design-brain -g -y
```

### ui-ux-pro-max-skill

`nextlevelbuilder/ui-ux-pro-max-skill` 的前端设计技能，经过 AI 询问，过于庞大，暂时不考虑全局安装。考虑看情况局部安装并使用。

```bash
skills add nextlevelbuilder/ui-ux-pro-max-skill -y
```
