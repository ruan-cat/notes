# @tanstack/vue-query,vue 响应式请求库

- 仓库： https://github.com/TanStack/query
- 文档： [`@tanstack/vue-query`](https://tanstack.com/query/latest/docs/framework/vue/overview)

---

# 调研学习 @tanstack/vue-query 在 vue 项目内的使用细节

请你全面的调研这个仓库，告诉我这个仓库是怎么定义接口请求文件的？怎么在 vue 组件内使用 `@tanstack/vue-query` 这个请求库的？在目录 `reports` 内编写一份极其详细详尽的 markdown 文档，供我阅读学习。

## markdown 文档的一级标题格式要求为

日期 `@tanstack/vue-query` 使用调研（`仓库名__用户名`）

例子如下：

```txt
# 2025-12-11 `@tanstack/vue-query` 使用调研（uniapp-template__yang1206）
```

## markdown 文档的代码片段格式要求

### 1. markdown 文档的 table 编写格式

每当你在 markdown 文档内编写表格时，表格的格式一定是**居中对齐**的，必须满足**居中对齐**的格式要求。

### 2. javascript / typescript 的代码注释写法

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

### 3. markdown 的多级标题要主动提供序号

对于每一份 markdown 文件的`二级标题`和`三级标题`，你都应该要：

1. 主动添加**数字**序号，便于我阅读文档。
2. 主动**维护正确的数字序号顺序**。如果你处理的 markdown 文档，其手动添加的序号顺序不对，请你及时的更新序号顺序。

## 思考模式要求

1. 请你以 ultrathink 的思考模式，认真阅读项目文件，并思考我给你的要求。
2. 在思考上，请你大胆的多使用 token 做深度的，全面的，细致的推理思考。
3. 这是一个复杂的多步骤任务，请你认真的动态编排。执行每一个步骤时，都务必要主动使用尽可能多的 token 做充分详实完善完整的思考，允许你多花费时间做阅读，对比，思考。
