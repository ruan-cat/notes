# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
pnpm build

# 构建特定文档站点
pnpm run build:docs:note        # 构建笔记文档
pnpm run build:docs:01star       # 构建 01star 文档
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
```

### 9.5. 依赖管理

```bash
# 使用 taze 更新依赖
pnpm run up-taze

# 更新 VitePress 相关包
pnpm update-package
```

### 9.6. 部署

```bash
# 部署所有站点
pnpm deploy

# 部署到 Vercel
pnpm run deploy-on-vercel
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

# dev 分支变基到 vc 分支并推送
pnpm run git:dev-2-vc
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
