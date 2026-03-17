# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 本项目的技能表

- `openspec-apply-change`
  - 路径：`.claude/skills/openspec-apply-change/SKILL.md`
  - 用途：从 OpenSpec change 实施任务
  - 触发时机：当用户想要开始实施、继续实施或处理 OpenSpec change 任务时使用
  - 参考作用：实施阶段的参考
  - 约束：只负责实施，不负责规范制定

- `openspec-archive-change`
  - 路径：`.claude/skills/openspec-archive-change/SKILL.md`
  - 用途：归档已完成的 change
  - 触发时机：当用户想要完成并归档 change 时使用
  - 参考作用：归档阶段的参考
  - 约束：只负责归档，不负责实施

- `openspec-bulk-archive-change`
  - 路径：`.claude/skills/openspec-bulk-archive-change/SKILL.md`
  - 用途：批量归档多个已完成 change
  - 触发时机：当用户想要批量归档多个 change 时使用
  - 参考作用：批量归档的参考
  - 约束：只负责归档，不负责实施

- `openspec-continue-change`
  - 路径：`.claude/skills/openspec-continue-change/SKILL.md`
  - 用途：继续 working on a change，创建下一个 artifact
  - 触发时机：当用户想要继续 change 工作流程时使用
  - 参考作用：继续工作的参考
  - 约束：只负责继续工作，不负责归档

- `openspec-explore`
  - 路径：`.claude/skills/openspec-explore/SKILL.md`
  - 用途：进入探索模式 - 思考伙伴，调查问题，澄清需求
  - 触发时机：当用户想要思考问题、调查问题或澄清需求时使用
  - 参考作用：探索阶段的参考
  - 约束：只负责探索，不负责实施

- `openspec-ff-change`
  - 路径：`.claude/skills/openspec-ff-change/SKILL.md`
  - 用途：快速创建所有需要的 artifact
  - 触发时机：当用户想要快速创建所有 artifact 时使用
  - 参考作用：快速创建的参考
  - 约束：只负责创建，不负责验证

- `openspec-new-change`
  - 路径：`.claude/skills/openspec-new-change/SKILL.md`
  - 用途：创建新的 OpenSpec change
  - 触发时机：当用户想要开始新功能、修复或修改时使用
  - 参考作用：新建 change 的参考
  - 约束：只负责创建，不负责实施

- `openspec-onboard`
  - 路径：`.claude/skills/openspec-onboard/SKILL.md`
  - 用途：OpenSpec 入职指导 - 完整的 workflow 演练
  - 触发时机：当用户想要完整了解 OpenSpec workflow 时使用
  - 参考作用：入职培训的参考
  - 约束：只负责培训，不负责实施

- `openspec-sync-specs`
  - 路径：`.claude/skills/openspec-sync-specs/SKILL.md`
  - 用途：同步 delta specs 到主 specs
  - 触发时机：当用户想要更新主 specs 时使用
  - 参考作用：同步的参考
  - 约束：只负责同步，不负责归档

- `openspec-verify-change`
  - 路径：`.claude/skills/openspec-verify-change/SKILL.md`
  - 用途：验证实现是否匹配 change artifacts
  - 触发时机：当用户想要验证实现是否完整、正确和一致时使用
  - 参考作用：验证的参考
  - 约束：只负责验证，不负责归档

- `record-bug-fix-memory`
  - 路径：`.claude/skills/fix-bug/record-bug-fix-memory/SKILL.md`
  - 用途：当用户要求在 bug 已经定位并修复后，记录排错经验、事故结论、AI 记忆更新、复盘摘要或本地 MCP 记忆时使用
  - 触发时机：当用户要求"记录经验教训""补充 AI 记忆""写事故记录""同步本地 MCP 记忆"时，必须使用
  - 参考作用：经验沉淀的参考
  - 约束：这个技能只负责记忆沉淀和经验总结，不承担具体修复职责

## 1. 主动问询实施细节

在我与你沟通并要求你具体实施更改时，难免会遇到很多模糊不清的事情。

请你**深度思考**这些`遗漏点`，`缺漏点`，和`冲突相悖点`，**并主动的向我问询这些你不清楚的实施细节**。请主动使用 claude code 内置的 `AskUserQuestion` 工具，将你不清楚的内容设计成一些列问题，并询问我，向我索要细节，或着与我协作沟通。

我会与你共同补充细化实现细节。我们会先迭代出一轮完整完善的实施清单，然后再由你亲自落实实施下去。

## 2. 编写测试用例规范

1. 请你使用 vitest 的 `import { test, describe } from "vitest";` 来编写。我希望测试用例格式为 describe 和 test。
2. 测试用例的文件格式为 `*.test.ts` 。
3. 测试用例的目录一般情况下为 `**/tests/` ，`**/src/tests/` 格式。
4. 在对应 monorepo 的 tests 目录内，编写测试用例。如果你无法独立识别清楚到底在那个具体的 monorepo 子包内编写测试用例，请直接咨询我应该在那个目录下编写测试用例。

## 3. 沟通协作要求

### 3.1. `计划模式`

在`计划模式`下，请你按照以下方式与我协作：

1. 你不需要考虑任何向后兼容的设计，允许你做出破坏性的写法。请先设计一个合适的方案，和我沟通后再修改实施。
2. 如果有疑惑，请询问我。
3. 完成任务后，请告知我你做了那些破坏性变更。

请注意，在绝大多数情况下，我不会要求你以这种 `计划模式` 来和我协作。

## 简单任务的高效执行原则

当用户交代的任务范围明确清晰时，必须**直接行动**，禁止进行不必要的大范围侦察。

### 1. 判断任务规模，选择正确的行动姿态

| 任务信号                         | 正确行动               |
| :------------------------------- | :--------------------- |
| 用户通过 `@文件` 明确了操作范围  | 直接读该文件，立即动手 |
| 用户说"帮我改这个"、"写个日志"   | 行动优先，缺什么补什么 |
| 用户涉及多包架构改动、新功能设计 | 先侦察，再行动         |

**核心原则**：用户提供的上下文（@文件引用、对话内容、当前打开文件）就是最直接的线索，优先使用，不要用命令重新发现已知信息。

### 2. 禁止行为清单

以下行为在**简单任务**（单文件改动、写 changeset、写提交信息等）中是被禁止的：

- 禁止连续执行超过 3 次 `git log` 来"了解全貌"
- 禁止在明确知道目标文件的情况下，仍去扫描整个项目目录
- 禁止把"读遍所有相关文档"当作行动前置条件
- 禁止在用户已给出 @文件 的情况下，用命令重新搜索文件位置

### 3. 对用户纠偏提示立即响应

当用户发出以下信号时，必须**立即停止对当前路径的死磕**，回归最小行动路径：

- "太复杂了"
- "不要反复查询"
- "直接做就行"
- "按要求做即可"

正确反应：停止当前侦察行为 → 明确当前已知信息 → 直接执行最核心的操作步骤。

### 4. 简单任务的标准执行路径

以"为某文件修改编写更新日志"为例，正确路径只有 3 步：

1. 读目标文件，理解改了什么
2. 执行 `pnpm dlx @changesets/cli add --empty`，重命名文件，写入内容
3. 提交

不需要查 git log，不需要扫描全部 tags，不需要对比所有包的版本号。

## 终端操作注意事项（防卡住）

在 Windows PowerShell 环境下执行终端命令时，必须遵循以下规则，避免命令卡住浪费时间：

### 1. 避免超长单行命令

命令行参数过多（超过 200 字符）时，PowerShell 可能会挂起无响应。

- **拆分命令**：每次传入 2~3 个文件路径，不要一次传入 5 个以上。
- **使用通配符**：优先用 `git add scripts/.../src/*.ts` 替代逐个列举文件路径。

### 2. 优先使用 `pnpm run` 而非 `npx`

`npx` 在 Windows 上被终止时，会触发 `Terminate batch job (Y/N)?` 交互提示导致卡住。

- **优先使用** `pnpm run build` 替代 `npx tsdown`。
- **优先使用** `pnpm run test` 替代 `npx vitest run`。

### 3. 及时止损，不要反复轮询

当命令可能卡住时：

1. 第 1 次状态检查等待 10~15 秒。
2. 如果无输出且仍在运行 → **立即终止**，用新命令重试。
3. **不要超过 2 次**状态检查仍无进展还继续等待。

### 4. 合理的等待超时设置

|         命令类型         | 建议等待时长 |
| :----------------------: | :----------: |
| `git add / status / log` |   5~10 秒    |
|       `git commit`       |    10 秒     |
| `pnpm run build / test`  |    30 秒     |
|      `pnpm install`      |    60 秒     |

## 4. 获取技术栈对应的上下文

在处理特定技术栈相关的问题时，你应该主动获取对应的上下文文档和最佳实践。

### 4.1. claude code skill

- 编写语法与格式： https://code.claude.com/docs/zh-CN/skills
- 最佳实践： https://platform.claude.com/docs/zh-CN/agents-and-tools/agent-skills/best-practices
- 规范文档： https://agentskills.io/home

## 5. 代码/编码格式要求

### 1. markdown 文档的 table 编写格式

每当你在 markdown 文档内编写表格时，表格的格式一定是**居中对齐**的，必须满足**居中对齐**的格式要求。

### 2. markdown 文档的 vue 组件代码片段编写格式

错误写法：

1. 代码块语言用 vue，且不带有 `<template>` 标签来包裹。

```vue
<wd-popup v-model="showModal">
  <wd-cell-group>
    <!-- 内容 -->
  </wd-cell-group>
</wd-popup>
```

2. 代码块语言用 html。

```html
<wd-popup v-model="showModal">
	<wd-cell-group>
		<!-- 内容 -->
	</wd-cell-group>
</wd-popup>
```

正确写法：代码块语言用 vue ，且带有 `<template>` 标签来包裹。

```vue
<template>
	<wd-popup v-model="showModal">
		<wd-cell-group>
			<!-- 内容 -->
		</wd-cell-group>
	</wd-popup>
</template>
```

### 3. javascript / typescript 的代码注释写法

代码注释写法应该写成 jsdoc 格式。而不是单纯的双斜杠注释。比如：

不合适的双斜线注释写法如下：

```ts
// 模拟成功响应
export function successResponse<T>(data: T, message: string = "操作成功") {
	return {
		success: true,
		code: ResultEnum.Success,
		message,
		data,
		timestamp: Date.now(),
	};
}
```

合适的，满足期望的 jsdoc 注释写法如下：

```ts
/** 模拟成功响应 */
export function successResponse<T>(data: T, message: string = "操作成功") {
	return {
		success: true,
		code: ResultEnum.Success,
		message,
		data,
		timestamp: Date.now(),
	};
}
```

### 4. markdown 的多级标题要主动提供序号

对于每一份 markdown 文件的`二级标题`和`三级标题`，你都应该要：

1. 主动添加**数字**序号，便于我阅读文档。
2. 主动**维护正确的数字序号顺序**。如果你处理的 markdown 文档，其手动添加的序号顺序不对，请你及时的更新序号顺序。

## 6. 报告编写规范

在大多数情况下，你的更改是**不需要**编写任何说明报告的。但是每当你需要编写报告时，请你首先遵循以下要求：

- 报告地址： 默认在 `docs/reports` 文件夹内编写报告。
- 报告文件格式： `*.md` 通常是 markdown 文件格式。
- 报告文件名称命名要求：
  1. 前缀以日期命名。包括年月日。日期格式 `YYYY-MM-DD` 。
  2. 用小写英文加短横杠的方式命名。
- 报告的一级标题： 必须是日期`YYYY-MM-DD`+报告名的格式。
  - 好的例子： `2025-12-09 修复 @ruan-cat/commitlint-config 包的 negation pattern 处理错误` 。前缀包含有 `YYYY-MM-DD` 日期。
  - 糟糕的例子： `构建与 fdir/Vite 事件复盘报告` 。前缀缺少 `YYYY-MM-DD` 日期。
- 报告日志信息的代码块语言： 一律用 `log` 作为日志信息的代码块语言。如下例子：

  ````markdown
  日志如下：

  ```log
  日志信息……
  ```
  ````

- 报告语言： 默认用简体中文。

## 7. 项目概览

这是一个使用 pnpm workspaces 和 Turbo 进行构建编排的 monorepo 文档项目，管理多个基于 VitePress 的文档站点。项目包含个人笔记、RPGMV 开发文档和团队文档。

## 8. 架构概述

- **包管理器**: pnpm (要求版本 10.15.0)
- **构建系统**: Turbo 用于跨工作空间的任务编排
- **文档引擎**: VitePress 用于所有文档站点
- **开发语言**: TypeScript，目标为 ESNext
- **Node 版本**: >= 22.14.0

### 8.1. 工作空间结构

- `docs/ruan-cat-notes/` - 个人笔记文档 (@ruan-cat-docs/notes)
- `docs/rpgmv-dev-notes/` - RPGMV 开发文档 (@ruan-cat-docs/rpgmv-dev-notes)
- `docs/docs-01-star/` - 01-star 团队文档 (@ruan-cat-docs/docs-01-star)

## 9. 常用命令

### 9.1. 构建命令

```bash
# 构建所有文档站点
pnpm run build:docs

# CI 构建命令
pnpm run ci

# 构建特定文档站点
pnpm run build:docs:note        # 构建笔记文档
pnpm run build:docs:01star       # 构建 01star 文档
pnpm run build:docs:my-pr        # 构建 my-pull-requests 文档
```

### 9.2. 开发命令

```bash
# 在开发模式下运行单个站点
cd docs/ruan-cat-notes && pnpm docs:dev
cd docs/rpgmv-dev-notes && pnpm docs:dev
cd docs/docs-01-star && pnpm docs:dev
```

### 9.3. 测试

```bash
# 运行测试，带 UI 界面和监听模式
pnpm test
```

### 9.4. 格式化和代码检查

```bash
# 使用 Prettier 格式化所有文件
pnpm format

# 运行 todoctor 检查
pnpm todoctor
```

### 9.5. 依赖管理

```bash
# 使用 taze 更新依赖
pnpm run up-taze
```

### 9.6. 部署

```bash
# 部署所有站点
pnpm deploy

# 部署到 Vercel
pnpm run deploy:vercel
```

### 9.7. 清理命令

```bash
# 清理构建缓存
pnpm run clear:cache

# 清理依赖（小心使用）
pnpm run clear:deps
```

### 9.8. Git 分支管理

```bash
# dev 分支变基到 main 分支并推送
pnpm run git:dev-2-main

# main 分支变基到 dev 分支
pnpm run git:main-2-dev

# dev 分支变基到 vc 分支并推送
pnpm run git:dev-2-vc

# vc 分支变基到 dev 分支
pnpm run git:vc-2-dev

# 获取远程分支并清理
pnpm run git:fetch

# 推送并跟随标签
pnpm run git:push
```

## 10. 配置详情

### 10.1. TypeScript 配置

- 使用复合项目设置，包含路径映射
- 支持 Markdown 文件中的 Vue 组件
- 同时支持 DOM 和 Node 环境
- 使用 `@/*` 和 `utils/*` 路径别名
- 包含 CLAUDE.md 文件以支持类型检查

### 10.2. 代码质量

- **Prettier**: 使用 Tab 缩进，120 字符行宽，包含 MD 文件检查
- **Commitlint**: 使用 @ruan-cat/commitlint-config 配置
- **Git Hooks**: 通过 package.json preinstall 脚本自动化

### 10.3. 构建流程

- Turbo 管理跨工作空间的并行构建
- VitePress 构建输出到 `.vitepress/dist/` 目录
- 启用构建缓存优化
- 笔记文档构建使用大内存分配 (8GB)

### 10.4. 测试配置

- Vitest 配置为输出 HTML 报告格式
- 测试端口设置为 4000

## 11. 核心依赖

### 11.1. 文档生成

- VitePress 1.6.4+ 用于站点生成
- @ruan-cat/vitepress-preset-config 共享配置
- vitepress-demo-plugin 交互式示例

### 11.2. Vue 生态系统

- Vue 3.5.20+ 使用组合式 API
- Element Plus 2.11.1+ UI 组件库
- VueUse 13.8.0+ 实用工具集
- Pinia 3.0.3+ 状态管理

### 11.3. 工具库

- lodash-es 工具函数库
- dayjs 日期处理
- axios HTTP 请求
- @ruan-cat/utils 自定义工具集

### 11.4. 开发工具

- @ruan-cat/taze-config 依赖更新配置
- @ruan-cat/vercel-deploy-tool 部署工具
- @ruan-cat/generate-code-workspace 工作空间生成
