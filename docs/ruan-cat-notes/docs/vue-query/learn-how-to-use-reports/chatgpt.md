# 2025-12-16---ChatGPT 在 Vue 3 + Vite 项目中使用 @tanstack/vue-query 完整教程

下面是一份**可直接保存为 `.md` 文件使用的完整教程文档**，面向 **Vue 3 + Vite** 项目，系统讲解 `@tanstack/vue-query` 的核心用法，并重点覆盖你关心的三个问题：**useQuery 回调处理、useMutation 的使用与差异、分页查询实现**。

你可以将下方内容整体复制，保存为例如：

```text
vue-query-guide.md
```

---

## 目录

1. 技术背景与设计理念
2. 在 Vue 3 + Vite 中安装与初始化
3. useQuery 基础使用与生命周期回调
   - 成功 / 失败回调写法
   - 常见数据处理模式

4. useMutation 使用详解
   - useMutation vs useQuery
   - 典型使用场景
   - 常见误区

5. 使用 vue-query 实现分页查询
   - 基础分页
   - page 参数驱动分页
   - keepPreviousData 的正确用法

6. 最佳实践与工程化建议

---

## 1. 技术背景与设计理念

`@tanstack/vue-query` 是 **TanStack Query** 在 Vue 生态下的实现，其核心设计目标是：

- **将服务端状态（Server State）从组件中剥离**
- 自动管理：
  - 请求缓存
  - 请求状态（loading / error / success）
  - 请求去重
  - 后台重新拉取（refetch）

- 提供声明式 API，避免手写大量 `watch + loading + try/catch`

> 核心思想：**你只需要描述“我想要什么数据”，而不是“我如何管理请求过程”**

---

## 2. 在 Vue 3 + Vite 中安装与初始化

### 2.1 安装依赖

```bash
npm install @tanstack/vue-query
```

或

```bash
pnpm add @tanstack/vue-query
```

---

### 2.2 在 main.ts 中初始化 QueryClient

```ts
// main.ts
import { createApp } from "vue";
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";
import App from "./App.vue";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			refetchOnWindowFocus: false,
		},
	},
});

createApp(App).use(VueQueryPlugin, { queryClient }).mount("#app");
```

---

## 3. useQuery 基础使用与生命周期回调

### 3.1 最基础的 useQuery 示例

```ts
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";

function fetchUser() {
	return axios.get("/api/user").then((res) => res.data);
}

const { data, isLoading, isError, error } = useQuery({
	queryKey: ["user"],
	queryFn: fetchUser,
});
```

---

### 3.2 useQuery 的生命周期回调（重点）

`useQuery` 支持多个关键回调，用于**副作用处理**。

```ts
const query = useQuery({
	queryKey: ["user"],
	queryFn: fetchUser,

	onSuccess(data) {
		console.log("请求成功", data);
		// ✅ 适合做：
		// - 数据二次加工
		// - 同步到其他 store
		// - 触发日志、埋点
	},

	onError(error) {
		console.error("请求失败", error);
		// ✅ 适合做：
		// - 错误提示
		// - 错误上报
	},

	onSettled(data, error) {
		// 无论成功或失败都会执行
	},
});
```

### 3.3 回调函数中的设计原则

| 行为                          | 是否推荐  |
| ----------------------------- | --------- |
| 修改 query 返回的数据         | ❌ 不推荐 |
| 更新 Pinia / Zustand 等 store | ✅ 推荐   |
| 弹 toast / message            | ✅ 推荐   |
| 发起新的请求                  | ⚠️ 谨慎   |

> **原则**：`useQuery` 的数据应保持“纯”，副作用放在回调中

---

## 4. useMutation 使用详解

### 4.1 useMutation 的定位

**useMutation 用于“写操作”**：

- 新增
- 修改
- 删除
- 提交表单

```ts
import { useMutation } from "@tanstack/vue-query";

function createUser(data) {
	return axios.post("/api/user", data);
}

const mutation = useMutation({
	mutationFn: createUser,
});
```

---

### 4.2 触发 mutation

```ts
mutation.mutate(
	{ name: "Tom", age: 18 },
	{
		onSuccess(data) {
			console.log("创建成功", data);
		},
		onError(error) {
			console.error("创建失败", error);
		},
	},
);
```

或使用 async 形式：

```ts
await mutation.mutateAsync({ name: "Tom" });
```

---

### 4.3 useQuery vs useMutation 核心差异

| 对比项            | useQuery | useMutation   |
| ----------------- | -------- | ------------- |
| 是否自动执行      | ✅ 是    | ❌ 否         |
| 是否缓存          | ✅ 是    | ❌ 默认不缓存 |
| 适合场景          | 读取数据 | 写入 / 修改   |
| 是否依赖 queryKey | ✅ 必须  | ❌ 不需要     |

---

### 4.4 useMutation 的常见误区

#### ❌ 误区 1：用 useMutation 获取列表数据

```ts
// 错误示例
useMutation({
	mutationFn: fetchList,
});
```

> **原因**：列表数据是“可缓存的读取操作”，应使用 useQuery

---

#### ❌ 误区 2：mutation 成功后不更新 query

```ts
onSuccess() {
  // 什么都不做
}
```

✅ 正确做法：**手动让相关 query 失效**

```ts
import { useQueryClient } from '@tanstack/vue-query'

const queryClient = useQueryClient()

onSuccess() {
  queryClient.invalidateQueries({ queryKey: ['user-list'] })
}
```

---

## 5. 使用 vue-query 实现分页查询（重点）

### 5.1 基础分页模型

```ts
function fetchUsers(page: number) {
	return axios.get("/api/users", { params: { page } }).then((res) => res.data);
}
```

---

### 5.2 使用 page 作为 queryKey 的一部分

```ts
import { ref } from "vue";

const page = ref(1);

const query = useQuery({
	queryKey: ["users", page],
	queryFn: () => fetchUsers(page.value),
	keepPreviousData: true,
});
```

### 5.3 keepPreviousData 的作用

- 翻页时保留上一页数据
- 避免列表闪烁
- 提升用户体验

```ts
query.isFetching; // true（正在拉新页）
query.isLoading; // false（已有数据）
```

---

### 5.4 翻页操作示例

```vue
<button @click="page--" :disabled="page === 1">上一页</button>
<button @click="page++">下一页</button>

<ul>
  <li v-for="user in query.data?.list" :key="user.id">
    {{ user.name }}
  </li>
</ul>
```

---

## 6. 最佳实践与工程化建议

### 6.1 queryKey 设计规范

```ts
// 推荐
["users", { page, pageSize }][("user", userId)][
	// 不推荐
	"getUserData"
];
```

---

### 6.2 不要在 queryFn 中访问组件状态

```ts
// ❌ 不推荐
queryFn: () => fetchUsers(page.value)

// ✅ 推荐
queryKey: ['users', page],
queryFn: ({ queryKey }) => {
  const [, page] = queryKey
  return fetchUsers(page)
}
```

---

### 6.3 何时使用 vue-query，何时不用？

| 场景     | 是否推荐 |
| -------- | -------- |
| 后端数据 | ✅       |
| 表单状态 | ❌       |
| UI 状态  | ❌       |
| 缓存列表 | ✅       |

---

## 总结

- **useQuery**：声明式读取、缓存、自动更新
- **useMutation**：执行写操作，手动控制
- **分页查询的关键**：`queryKey + keepPreviousData`
- **副作用统一写在回调中**

---

如果你愿意，**我可以继续为你补充**：

- 与 Axios / Fetch 的最佳封装方式
- 与 Pinia 的职责边界划分
- 无限滚动（Infinite Query）完整实现
- 实际业务级目录结构示例

**请告诉我你下一步最想深入的方向。**
