# 2025-12-16---github copilot 在 Vue 3 + Vite 中使用 @tanstack/vue-query（详细教程）

本文档面向想在 Vue 3 + Vite 项目中引入并使用 @tanstack/vue-query（TanStack Query 的 Vue 绑定）的同学，内容覆盖：安装与基础设置、useQuery 的回调/后续处理、useMutation 的使用与注意点、以及常见分页实现（分页/无限滚动）。代码示例以 Composition API 为主，示例同时给出 JavaScript / TypeScript 风格提示。

---

## 目录

- 前置：安装与全局初始化
- useQuery：基础用法与回调（onSuccess / onError / onSettled 等）
- useMutation：用法、与 useQuery 的关键差异、常见误区与乐观更新
- 分页示例
  - 页码分页（page-based）
  - 无限/游标分页（infiniteQuery）
- 常见实践建议和性能调优
- 参考链接与小结

---

## 前置：安装与全局初始化

推荐安装库（在项目根执行）：

- @tanstack/vue-query（核心）
- axios（示例的 HTTP 客户端，可替换为 fetch 或其他）

示例：

```bash
npm install @tanstack/vue-query axios
# 可选：devtools（若有对应 package 或使用浏览器扩展）
# npm install @tanstack/vue-query-devtools
```

在 `main.ts` / `main.js` 中创建并提供 `QueryClient`：

```ts
// main.ts
import { createApp } from "vue";
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";
import App from "./App.vue";

const app = createApp(App);

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// 根据需要调整默认配置
			staleTime: 1000 * 60, // 1 minute
			retry: 1,
			refetchOnWindowFocus: false,
		},
	},
});

app.use(VueQueryPlugin, { queryClient });
app.mount("#app");
```

说明：

- QueryClient 管理缓存、重试、全局选项。
- VueQueryPlugin 提供全局上下文，组件内可使用 `useQuery`/`useMutation`/`useQueryClient` 等。

---

## useQuery：基础用法与回调

useQuery 是用于“读取”/缓存异步数据的主要接口。返回的是响应式对象：`data`、`error`、`isLoading`、`isFetching`、`refetch` 等。

典型示例（TypeScript 风格）：

```ts
<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useQuery } from '@tanstack/vue-query'

const userId = ref(1)

const fetchUser = async ({ queryKey }) => {
  // queryKey 会是 ['user', userId]
  const [, id] = queryKey
  const { data } = await axios.get(`/api/users/${id}`)
  return data
}

const { data: user, isLoading, error, refetch } = useQuery(
  // queryKey（可以是 reactive 的）
  () => ['user', userId.value],
  fetchUser,
  {
    enabled: true, // 可基于条件启用
    staleTime: 1000 * 30,
    cacheTime: 1000 * 60 * 5,
    onSuccess(data) {
      // 成功回调：仅在 query 成功时触发
      console.log('请求成功，数据：', data)
      // 可在此处对返回数据做额外处理（非缓存操作）
    },
    onError(err) {
      console.error('请求失败：', err)
    },
    onSettled(data, error) {
      // 无论成功或失败都会调用（类似 finally）
      console.log('请求结束（成功或失败）')
    },
  }
)
</script>

<template>
  <div v-if="isLoading">加载中...</div>
  <div v-else-if="error">出错：{{ error.message }}</div>
  <div v-else>
    <pre>{{ user }}</pre>
    <button @click="refetch">强制刷新</button>
  </div>
</template>
```

关键点说明：

- queryKey：建议使用数组形式，包含资源标识与参数（用于缓存区分）。
- queryFn：可以访问传入的 `queryKey` 或外部 refs。
- onSuccess/onError/onSettled：都是在 query lifecycle 中调用的钩子，适合做副作用（例如本地状态转换、分析埋点、弹窗提示、写缓存等）。
- enabled：如果某些查询依赖于条件（如需要先有 token），请使用 enabled 控制，而不要把 `useQuery` 包在条件语句内（Vue 组合式 API 中直接条件渲染 useQuery 会导致 Hook 规则混乱）。

在回调里写入缓存（setQueryData）：

```ts
import { useQueryClient } from "@tanstack/vue-query";

const queryClient = useQueryClient();

useQuery(["item", id], fetchItem, {
	onSuccess(data) {
		// 想修改关联缓存可以用 setQueryData
		queryClient.setQueryData(["lastFetchedItem"], data);
	},
});
```

如果你希望在组件中对数据做一次“格式化”或“映射”，推荐：

- 在 fetcher 中返回最终需要的 shape（服务端适配层）；
- 或在组件里使用 computed 基于 `data` 做派生处理，保持缓存数据原样。

---

## useMutation：用法、与 useQuery 的差别、误区、乐观更新

useMutation 用来做会改变服务器状态的操作（POST/PUT/DELETE 等）。与 useQuery 的区别：

- useQuery：读操作（缓存、自动重试、轮询、依赖）。
- useMutation：写操作（手动触发，支持乐观更新、事务回滚、错误处理、与 queryClient 的缓存交互）。

基本用法：

```ts
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axios from "axios";

const queryClient = useQueryClient();

const createTodo = async (newTodo) => {
	const { data } = await axios.post("/api/todos", newTodo);
	return data;
};

const { mutate, mutateAsync, isLoading, error } = useMutation(createTodo, {
	onMutate: async (newTodo) => {
		// 在 mutation 执行之前做乐观更新
		await queryClient.cancelQueries(["todos"]);
		const previous = queryClient.getQueryData(["todos"]);

		// 立即更新缓存（乐观）
		queryClient.setQueryData(["todos"], (old) => [...(old || []), newTodo]);

		return { previous }; // 会作为 context 传给 onError/onSettled
	},
	onError: (err, newTodo, context) => {
		// 如果失败，回滚
		if (context?.previous) {
			queryClient.setQueryData(["todos"], context.previous);
		}
		// 可以放置错误提示逻辑
	},
	onSettled: () => {
		// 无论成功失败，重新获取最新 todos
		queryClient.invalidateQueries(["todos"]);
	},
});
```

用 `mutate(newTodo)` 触发（回调方式），或 `await mutateAsync(newTodo)`（返回 Promise，配合 async/await 使用更方便）。

关键差异与误区：

- useQuery 自动触发或根据依赖触发并维护缓存，useMutation 需要手动触发。
- 不要把写操作当作 “简单的 fetch” — 需要考虑缓存一致性（invalidate、setQueryData）。
- 误区 1：直接修改后端数据后不更新缓存，导致 UI 与服务器不同步。要么 invalidate 要么 setQueryData。
- 误区 2：在 onMutate 中没有实现回滚策略。若进行乐观更新，应在 onError 中使用 context 回滚。
- 误区 3：滥用 retry，会对写操作产生副作用（例如重复创建资源）。对 mutation，一般设置 retry: 0 或更谨慎的重试策略。
- mutation 的 onSuccess/onError/onSettled 接受不同参数（onSuccess(data, variables, context)）。

示例：使用 mutateAsync 捕获错误

```ts
try {
	const result = await mutateAsync(newTodo);
	// 成功后可以立刻处理返回结果
} catch (err) {
	// 处理错误
}
```

---

## 分页（分页查询）实现

常见需求：分页查询（传统 page-based）与无限滚动（infinite/cursor-based）。下面示例演示两种常见实现。

### 1) 页码分页（page-based）

特点：明确定义 page、pageSize，方便跳页。

组件示例：

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import axios from "axios";
import { useQuery } from "@tanstack/vue-query";

const page = ref(1);
const pageSize = 10;

const fetchPage = async ({ queryKey }) => {
	const [, page] = queryKey;
	const { data } = await axios.get("/api/items", {
		params: { page, limit: pageSize },
	});
	// 约定服务器返回 { items: [], total: number }
	return data;
};

const queryKey = computed(() => ["items", page.value]);

const { data, isFetching, isPreviousData } = useQuery(queryKey, fetchPage, {
	keepPreviousData: true, // 当切换 page 时保留上页的数据，减少白屏
	staleTime: 1000 * 30,
});

const total = computed(() => data?.total ?? 0);
const items = computed(() => data?.items ?? []);

function nextPage() {
	if (page.value * pageSize < total.value) page.value++;
}
function prevPage() {
	if (page.value > 1) page.value--;
}
</script>

<template>
	<div>
		<ul>
			<li v-for="item in items" :key="item.id">{{ item.title }}</li>
		</ul>

		<div>
			<button @click="prevPage" :disabled="page === 1">上一页</button>
			<button @click="nextPage" :disabled="page * 10 >= total">下一页</button>
			<span v-if="isFetching">加载中...</span>
		</div>
	</div>
</template>
```

要点：

- 使用 `keepPreviousData: true` 可以在切页时保留上一页并展示 isPreviousData = true，这能减少闪烁和 UX 的不适感。
- 使用 `queryKey` 把页码包含进去，确保不同页的数据被不同 key 缓存。

### 2) 无限滚动 / 游标分页（useInfiniteQuery）

当后端返回 cursors（如 nextCursor）或分页 token 时，用 `useInfiniteQuery` 更方便。

示例：

```ts
import { useInfiniteQuery } from "@tanstack/vue-query";
import axios from "axios";

const fetchPage = async ({ pageParam = null }) => {
	const { data } = await axios.get("/api/items", {
		params: { cursor: pageParam, limit: 20 },
	});
	// 假设返回 { items: [], nextCursor: '...' }
	return data;
};

const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(["infinite-items"], fetchPage, {
	getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
});

// 在模板中需要把 data.pages 展平：
const allItems = computed(() => data?.pages?.flatMap((p) => p.items) ?? []);
```

要点：

- `getNextPageParam` 负责从最后一页的响应中提取下次调用的 pageParam（cursor）。
- `fetchNextPage` 触发加载下一页，`hasNextPage` 表示是否还有下一页。
- 在 UI 端可结合 IntersectionObserver（监听滚动到列表底部）自动调用 fetchNextPage 实现无限滚动。

示例：简单的 IntersectionObserver 触发加载下一页

```ts
import { onMounted, ref } from "vue";

const sentinel = ref(null);
onMounted(() => {
	const io = new IntersectionObserver((entries) => {
		if (entries[0].isIntersecting && hasNextPage.value && !isFetchingNextPage.value) {
			fetchNextPage();
		}
	});
	if (sentinel.value) io.observe(sentinel.value);
});
```

---

## 常见实践建议和性能/一致性技巧

- 缓存键（queryKey）：
  - 推荐使用数组：`['resource', id, {filter, sort}]`，便于序列化与区分。
  - 避免把不可序列化的大对象（函数、DOM 节点）放入 key。
- enabled vs 条件渲染：
  - 不要在条件语句中调用 useQuery；在需要时通过 `enabled: computed` 控制激活。
- staleTime 与 refetch 策略：
  - 对只读或不常变更的数据可以设置较长 staleTime，减少请求。
  - 对于实时性强的数据设置短 staleTime，但考虑节省流量。
- fetcher（queryFn）建议：
  - 将请求逻辑抽离为函数，方便复用、测试。
  - 若使用 axios，返回 `data` 部分（不要返回整个 response，除非需要）。
- 数据更新与缓存操作：
  - 对写操作推荐流程：useMutation -> onMutate（乐观更新） -> onError（回滚） -> onSettled（invalidate）。
  - 使用 `queryClient.invalidateQueries(key)` 来确保其他依赖该数据的 queries 重新获取最新数据。
  - 使用 `queryClient.setQueryData(key, updater)` 可局部更新缓存（高性能）。
- 处理并发请求 / 并发状态：
  - 通过 queryKey 的变化来保证每个参数的请求独立缓存。
  - 如果想并行获取多个独立的 queries，使用多个 useQuery；也可以用 `Promise.all` 与 `queryClient.fetchQuery` 在外部组合。
- mutation 的 retry：
  - 一般不要对破坏性操作无限重试（例如创建资源），因为会导致副作用重复。默认可以设置 retry: 0。
- SSR（服务端渲染）：
  - TanStack Query 支持 SSR，但需要在服务端做 prefetch 并在客户端 hydrate。若需要我可以专门写 SSR 示例。

---

## 常见问题与排错

- “为什么 useQuery 没有触发？”：
  - 检查 `enabled` 参数、queryKey 是否为稳定序列化值；
  - 检查 QueryClient 是否正确提供（app.use(VueQueryPlugin...)）。
- “缓存不更新 / UI 未刷新”：
  - 在写操作后确保调用 `invalidateQueries` 或 `setQueryData`；
  - 若使用乐观更新，确保在 onError 中回滚。
- “重复发多个相同请求”：
  - Query 默认会智能去重：相同 queryKey 的并发请求会合并。若你看到重复请求，检查 queryKey 是否不同或参数是否在每次都变化（例如函数/对象被重建）。
- “如何调试？”：
  - 使用 TanStack Query Devtools（若存在 Vue 版本）或浏览器 DevTools，查看 cache、queries 状态。

---

## 参考策略：一个完整的“todos”示例（整合 useQuery + useMutation + 分页）

（仅展示核心片段，便于理解整体流程）

- 获取 todos（分页）：

```ts
// fetchTodos.ts
export const fetchTodos = async ({ queryKey }) => {
	const [, { page, limit }] = queryKey;
	const { data } = await axios.get("/api/todos", { params: { page, limit } });
	return data;
};
```

- 列表组件：

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { fetchTodos } from "./fetchTodos";
import axios from "axios";

const page = ref(1);
const limit = 10;
const queryClient = useQueryClient();

const { data, isFetching } = useQuery(() => ["todos", { page: page.value, limit }], fetchTodos, {
	keepPreviousData: true,
});

const { mutate: createTodo } = useMutation((newTodo) => axios.post("/api/todos", newTodo), {
	onMutate: async (newTodo) => {
		await queryClient.cancelQueries(["todos"]);
		const previous = queryClient.getQueryData(["todos", { page: page.value, limit }]);
		queryClient.setQueryData(["todos", { page: page.value, limit }], (old) => ({
			...old,
			items: [...(old?.items ?? []), newTodo],
		}));
		return { previous };
	},
	onError: (err, newTodo, context) => {
		if (context?.previous) {
			queryClient.setQueryData(["todos", { page: page.value, limit }], context.previous);
		}
	},
	onSettled: () => {
		queryClient.invalidateQueries(["todos"]);
	},
});
</script>

<template>
	<div>
		<ul>
			<li v-for="t in data?.items ?? []" :key="t.id">{{ t.title }}</li>
		</ul>
		<button @click="page--" :disabled="page === 1">上一页</button>
		<button @click="page++">下一页</button>

		<button @click="createTodo({ id: Math.random(), title: 'new' })">创建 Todo</button>
	</div>
</template>
```

---

## 小结（快速回顾）

- 安装并在 main 中通过 QueryClient 提供 VueQueryPlugin。
- useQuery：用于读取，使用 queryKey 做缓存区分，使用 onSuccess/onError/onSettled 做副作用。使用 enabled 控制何时生效。
- useMutation：用于写操作，需手动触发。通常结合 onMutate/onError/onSettled 做乐观更新 / 回滚 / 缓存失效。
- 分页：页码分页使用 queryKey 包含 page，并使用 keepPreviousData；无限滚动使用 useInfiniteQuery 并实现 getNextPageParam。
- 常见误区：忘记缓存更新、在 mutation 上无限重试、queryKey 不稳定导致重复请求。

---

如果你愿意，我可以：

- 根据你的后端 API（示例请求格式）为你写一个完整的 demo（包含 Vite + Vue 3 项目结构与关键文件）。
- 或者把上面某个部分（比如“乐观更新 + 回滚”的完整可运行 demo）写成可复制粘贴的组件/文件。

需要哪个我再帮你生成完整代码？例如：完整的 `main.ts`、`App.vue`、`Todos.vue`、`api.ts` 等文件。欢迎告诉我你偏好 JS 还是 TS。
