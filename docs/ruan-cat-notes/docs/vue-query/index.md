# @tanstack/vue-query,vue 响应式请求库

- 仓库： https://github.com/TanStack/query
- 文档： [`@tanstack/vue-query`](https://tanstack.com/query/latest/docs/framework/vue/overview)

---

# 调研学习 `@tanstack/vue-query` 在 vue 项目内的使用细节

请你全面的调研这个仓库，告诉我这个仓库是怎么定义接口请求文件的？怎么在 vue 组件内使用 `@tanstack/vue-query` 这个请求库的？在目录 `reports` 内编写一份极其详细详尽的 markdown 文档，供我阅读学习。

## 调研范围

1. 该项目是如何在 vue 项目内注册并初始化 `@tanstack/vue-query` 的？
2. 在 vue 组件内，是如何使用 `@tanstack/vue-query` 的？
3. 该项目有什么专门封装的函数或工具来二次封装 `@tanstack/vue-query` 的工具么？
4. 该项目是怎么实现请求后完成回调并修改数据的？
5. 该项目怎么实现缓存更新的？
6. 该项目的 `@tanstack/vue-query` 是主动执行接口请求？还是基于响应式变量实现的接口请求？

## markdown 文档的一级标题格式要求为

日期 `@tanstack/vue-query` 使用调研（`仓库名__用户名`）

例子如下：

```txt
# 2025-12-11 `@tanstack/vue-query` 使用调研（uniapp-template__yang1206）
```

## markdown 文档的代码片段格式要求

首先是要满足 markdown 的代码片段语法。

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
