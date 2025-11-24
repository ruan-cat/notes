# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 代码/编码格式要求

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

## 报告编写规范

在大多数情况下，你的更改是**不需要**编写任何说明报告的。但是每当你需要编写报告时，请你首先遵循以下要求：

- 报告地址： 默认在 `docs/reports` 文件夹内编写报告。
- 报告文件格式： `*.md` 通常是 markdown 文件格式。
- 报告文件名称命名要求：
  1. 前缀以日期命名。包括年月日。日期格式 `YYYY-MM-DD` 。
  2. 用小写英文加短横杠的方式命名。
- 报告语言： 默认用简体中文。

## 项目概览

这是一个使用 pnpm workspaces 和 Turbo 进行构建编排的 monorepo 文档项目，管理多个基于 VitePress 的文档站点。项目包含个人笔记、RPGMV 开发文档和团队文档。

## 架构概述

- **包管理器**: pnpm (要求版本 10.15.0)
- **构建系统**: Turbo 用于跨工作空间的任务编排
- **文档引擎**: VitePress 用于所有文档站点
- **开发语言**: TypeScript，目标为 ESNext
- **Node 版本**: >= 22.14.0

### 工作空间结构

- `docs/ruan-cat-notes/` - 个人笔记文档 (@ruan-cat-docs/notes)
- `docs/rpgmv-dev-notes/` - RPGMV 开发文档 (@ruan-cat-docs/rpgmv-dev-notes)
- `docs/docs-01-star/` - 01-star 团队文档 (@ruan-cat-docs/docs-01-star)

## 常用命令

### 构建命令

```bash
# 构建所有文档站点
pnpm build

# 构建特定文档站点
pnpm run build:docs:note        # 构建笔记文档
pnpm run build:docs:01star       # 构建 01star 文档
```

### 开发命令

```bash
# 在开发模式下运行单个站点
cd docs/ruan-cat-notes && pnpm docs:dev
cd docs/rpgmv-dev-notes && pnpm docs:dev
cd docs/docs-01-star && pnpm docs:dev
```

### 测试

```bash
# 运行测试，带 UI 界面和监听模式
pnpm test
```

### 格式化和代码检查

```bash
# 使用 Prettier 格式化所有文件
pnpm format
```

### 依赖管理

```bash
# 使用 taze 更新依赖
pnpm run up-taze

# 更新 VitePress 相关包
pnpm update-package
```

### 部署

```bash
# 部署所有站点
pnpm deploy

# 部署到 Vercel
pnpm run deploy-on-vercel
```

### 清理命令

```bash
# 清理构建缓存
pnpm run clear:cache

# 清理依赖（小心使用）
pnpm run clear:deps
```

### Git 分支管理

```bash
# dev 分支变基到 main 分支并推送
pnpm run git:dev-2-main

# dev 分支变基到 vc 分支并推送
pnpm run git:dev-2-vc
```

## 配置详情

### TypeScript 配置

- 使用复合项目设置，包含路径映射
- 支持 Markdown 文件中的 Vue 组件
- 同时支持 DOM 和 Node 环境
- 使用 `@/*` 和 `utils/*` 路径别名
- 包含 CLAUDE.md 文件以支持类型检查

### 代码质量

- **Prettier**: 使用 Tab 缩进，120 字符行宽，包含 MD 文件检查
- **Commitlint**: 使用 @ruan-cat/commitlint-config 配置
- **Git Hooks**: 通过 package.json preinstall 脚本自动化

### 构建流程

- Turbo 管理跨工作空间的并行构建
- VitePress 构建输出到 `.vitepress/dist/` 目录
- 启用构建缓存优化
- 笔记文档构建使用大内存分配 (8GB)

### 测试配置

- Vitest 配置为输出 HTML 报告格式
- 测试端口设置为 4000

## 核心依赖

### 文档生成

- VitePress 1.6.4+ 用于站点生成
- @ruan-cat/vitepress-preset-config 共享配置
- vitepress-demo-plugin 交互式示例

### Vue 生态系统

- Vue 3.5.20+ 使用组合式 API
- Element Plus 2.11.1+ UI 组件库
- VueUse 13.8.0+ 实用工具集
- Pinia 3.0.3+ 状态管理

### 工具库

- lodash-es 工具函数库
- dayjs 日期处理
- axios HTTP 请求
- @ruan-cat/utils 自定义工具集

### 开发工具

- @ruan-cat/taze-config 依赖更新配置
- @ruan-cat/vercel-deploy-tool 部署工具
- @ruan-cat/generate-code-workspace 工作空间生成
