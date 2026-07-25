---
name: vitepress-client-component-usage
description: 在 D:\code\ruan-cat\notes 的 docs/ruan-cat-notes/docs 中创建、导入、渲染或修复 VitePress Markdown 内客户端 Vue 组件时使用。覆盖 <demo vue="./Xxx.vue" />、<ClientOnly>、vp-raw、Element Plus 样式隔离、主题色映射和浏览器端验证。
---

# VitePress 客户端组件使用规范

## 1. 适用场景

### 1.1. 触发条件

- 在 `docs/ruan-cat-notes/docs/` 的 Markdown 页面中创建或接入 Vue 组件。
- 需要把交互式工具、表格、上传、下载、预览等浏览器端能力嵌入 VitePress 页面。
- 需要修复 Element Plus 组件在 VitePress Markdown 页面内的样式错位、主题色不一致或客户端渲染问题。

### 1.2. 不适用场景

- 纯静态 Markdown 内容修改。
- Node 脚本、测试工具或构建插件开发。
- 不在 VitePress 文档站内渲染的 Vue 应用页面。

## 2. 组件落点

### 2.1. 同目录组件

- 页面专用组件优先放在使用它的 Markdown 文件旁边。
- 示例：`docs/ruan-cat-notes/docs/sundry/ai/sub2api/index.md` 使用 `./Sub2ApiJsonRewriter.vue`。
- 只被一个页面消费的组件不要上升到全局组件目录，避免扩大维护面。

### 2.2. 共享组件

- 两个以上页面明确复用时，再放入当前文档站已有的共享组件目录。
- 共享前先检查调用场景是否一致，避免为了复用制造配置分支。

## 3. Markdown 使用模式

### 3.1. demo 模式

用于展示 Vue 示例组件，适合代码演示和组件效果预览。

```vue
<template>
	<demo vue="./Xxx.vue" />
</template>
```

### 3.2. ClientOnly 模式

用于依赖浏览器 API、Element Plus 交互、文件上传下载、剪贴板、窗口对象或本地存储的组件。

```vue
<script setup>
import Xxx from "./Xxx.vue";
</script>

<template>
	<ClientOnly>
		<div class="vp-raw">
			<Xxx />
		</div>
	</ClientOnly>
</template>
```

### 3.3. 选择规则

- 示例展示优先用 `<demo vue="./Xxx.vue" />`。
- 真实工具、表单、表格和浏览器端工作流优先用 `<ClientOnly>`。
- 使用 Element Plus 时必须包裹 `vp-raw`，并在组件内继续做样式隔离。

## 4. Element Plus 组件约束

### 4.1. 显式导入

- 在 SFC 内显式导入使用到的 Element Plus 组件，便于类型检查和后续维护。
- 图标优先使用 `@element-plus/icons-vue` 或项目已有图标库。

### 4.2. 浏览器端能力

- 上传文件使用浏览器 `File` API，例如 `file.text()`。
- 下载文件使用 `Blob`、`URL.createObjectURL` 和 `HTMLAnchorElement.download`。
- 客户端组件不得引入 `fs`、`path`、`process`、`fileURLToPath` 等 Node 专用能力。

## 5. 样式隔离

### 5.1. 主题色映射

在组件根元素映射 Element Plus 主色到 VitePress 品牌色。

```scss
.my-client-component {
	--el-color-primary: var(--vp-c-brand-1);
	--el-color-primary-light-3: var(--vp-c-brand-2);
	--el-color-primary-light-5: var(--vp-c-brand-3);
	--el-color-primary-light-9: var(--vp-c-brand-soft);
}
```

### 5.2. VitePress 样式重置

VitePress Markdown 的 `.vp-doc` 会影响原生 `table`、`ul`、`li`、`button`、`label` 等元素。组件内需要用 scoped `:deep()` 做局部重置。

```scss
.my-client-component {
	:deep(button) {
		margin: 0;
	}

	:deep(label) {
		margin: 0;
		color: var(--el-text-color-regular);
	}

	:deep(ul),
	:deep(li) {
		padding-left: 0;
		margin: 0;
		list-style: none;
	}

	:deep(table) {
		display: table;
		margin: 0;
		border-collapse: separate;
	}
}
```

## 6. 验证清单

### 6.1. 文件检查

- Markdown 顶部显式 import 组件。
- 组件渲染位置符合页面章节语义。
- `<ClientOnly>` 内含 `.vp-raw` 包裹层。
- 组件内没有 Node 专用 API。

### 6.2. 命令检查

```bash
rg -n "node:|from \"fs\"|from 'fs'|from \"path\"|from 'path'|process\\." docs/ruan-cat-notes/docs/path/to/ClientComponent.vue
```

```bash
git diff --check
```

### 6.3. 浏览器检查

- 页面能渲染组件。
- Element Plus 表单、上传、表格和按钮布局没有被 Markdown 样式破坏。
- 核心交互能在真实浏览器内完成。
- 如使用下载能力，下载产物可解析且字段符合预期。

## 7. 反模式

### 7.1. 渲染反模式

- 在依赖浏览器 API 的组件上省略 `<ClientOnly>`。
- 只写 `<ClientOnly>`，但不加 `.vp-raw`。
- 在 Markdown 中使用隐式全局组件，导致来源不可追踪。

### 7.2. 样式反模式

- 只依赖 `.vp-raw`，不处理 Element Plus 内部 `table`、`ul`、`li` 等节点。
- 在页面级别写全局覆盖，污染其他文档页面。
- 使用超过 8px 的大圆角卡片包裹工具，导致文档页视觉不一致。

### 7.3. 能力反模式

- 在生产 SFC 中导入 `fs`、`path` 或读取本机绝对路径。
- 把本地文件上传做成服务器 `action` 流程。
- 不跑浏览器检查就声称交互可用。
