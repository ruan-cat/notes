# 2026-06-07 VitePress 文档站内 Element Plus 组件的样式冲突

## 1. 问题现象

在 VitePress markdown 页面中使用 Element Plus 的 ElTable、ElPagination、ElPopover 组件时，出现表格多出空行、分页栏按钮错位、弹框背景透明、文字变蓝、间距异常、主题色不一致等多种样式污染问题。

## 2. 实际根因

VitePress 的 `.vp-doc` 全局样式会给原生 HTML 元素（`table`、`tr`、`th`、`td`、`ul`、`li`、`button`、`label`、`div`）设置 `display: block`、`margin`、`padding-left`、`border`、`background`、`color` 等属性。这些全局样式与 Element Plus 组件内部渲染的同名原生元素产生冲突。

## 3. 关键误导点

最初尝试用 VitePress 的 `vp-raw` class 包裹组件来隔离样式，但 `vp-raw` 在使用 `@ruan-cat/vitepress-preset-config` 自定义主题时并未完全生效，仍需手动 CSS 重置。

关键线索来自浏览器 DevTools：`.vp-doc table { display: block; margin: 20px 0 }` 和 `.vp-doc ul { padding-left: 1.25rem; margin: 16px 0 }` 直接作用于 ElTable 内部的 `<table>` 和 ElPagination 的 `<ul class="el-pager">`。

## 4. 有效修复

采用分层隔离策略：

1. 在 `index.md` 中用 `<ClientOnly>` + `<div class="vp-raw">` 包裹组件。
2. 在 scoped style 中用 `:deep()` 重置 `table`、`ul`、`li`、`button` 的 VitePress 样式。
3. 对 ElPopover 使用 `popper-class` 自定义类名 + 非 scoped style 全局选择器，因为弹框默认 teleport 到 `<body>`，脱离 scoped 作用域。
4. 在组件根元素通过 CSS 变量将 Element Plus 的 `--el-color-primary-*` 映射为 VitePress 的 `--vp-c-brand-*`，统一主题色。

## 5. 验证方式

VitePress dev server 热更新后，在浏览器中切换亮色和暗色主题，确认表格无空行、分页正常、弹框有背景且层级正确、所有组件颜色跟随 VitePress 品牌色。

## 6. 后续约束

1. 在 VitePress markdown 中使用任何 Element Plus 组件时，必须用 `<ClientOnly>` + `<div class="vp-raw">` 包裹，并在组件 scoped style 中添加 `:deep(table) { display: table; margin: 0; border-collapse: separate; }` 重置。
2. 分页组件额外需要重置 `:deep(.el-pagination) { ul { padding-left: 0; margin: 0; } }`。
3. ElPopover 等 teleported 弹出层不能用 `:deep()` 选中，必须通过 `popper-class` + 非 scoped style 来定制样式。
4. 需要在组件根元素上添加 `--el-color-primary: var(--vp-c-brand-1)` 等 CSS 变量映射来同步主题色。
5. 不要轻易使用 `teleported=false`，会导致层级和定位问题，应优先使用默认 teleport + `popper-class`。
