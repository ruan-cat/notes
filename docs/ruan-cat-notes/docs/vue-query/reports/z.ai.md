# @tanstack/vue-query 学习资源与项目推荐

这份文档旨在帮助你快速学习 `@tanstack/vue-query` 的基础知识，并将其成功应用于你的项目中。内容涵盖了多种项目类型，并精选了来自 GitHub 的高质量仓库和学习资源。

## 📊 精选项目与资源一览

下表汇总了推荐的 GitHub 仓库、官方示例及教程，你可以根据自己的项目类型和兴趣点进行选择。

| 项目名称/链接                                                                                                                                                  | 项目类型       | Stars                                                                                 | 主要特点与适用场景                                                                                 |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------- | :------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------- |
| **[vue-query-nuxt](https://github.com/Hebilicious/vue-query-nuxt)**                                                                                            | Nuxt 模块      | ![Stars](https://img.shields.io/github/stars/Hebilicious/vue-query-nuxt?style=social) | 轻量级、零配置的官方 Nuxt 模块，极大简化了在 Nuxt 3 中的集成过程。                                 |
| **[nuxt-query](https://github.com/peterbud/nuxt-query)**                                                                                                       | Nuxt 模块      | ![Stars](https://img.shields.io/github/stars/peterbud/nuxt-query?style=social)        | 一个功能强大的 Nuxt 模块，为 TanStack Query 提供了完善的服务端状态管理支持。                       |
| **[TanStack Query 官方示例 - Nuxt3](https://tanstack.com/query/latest/docs/framework/vue/examples/nuxt3)**                                                     | Nuxt 3 示例    | -                                                                                     | TanStack 官方提供的 Nuxt 3 集成示例，是学习 SSR/SSG 环境下数据获取和状态管理的权威参考。           |
| **[如何在 Nuxt 3 中使用 Vue Query](https://medium.com/@imanmalekian31/how-to-use-tanstack-vue-query-with-usefetch-in-nuxt-3-9e90da3fcac1)**                    | 教程与代码示例 | -                                                                                     | 一篇非常详细的教程，包含 `useQuery` 和 `useMutation` 的完整代码示例，非常适合实践。                |
| **[TanStack Query 官方示例 - Vue Basic](https://tanstack.com/query/v5/docs/framework/vue/examples/basic)**                                                     | Vue (Vite)     | -                                                                                     | 官方基础示例，演示了最核心的 `useQuery` 用法，是初学者的最佳起点。                                 |
| **[Vue Query + TypeScript 示例](https://github.com/TanStack/query/issues/6318)**                                                                               | Vue (Vite)     | -                                                                                     | 一个 GitHub Issue 讨论了在 Vue 3 + TypeScript 环境下可能遇到的问题和解决方案，对 TS 用户很有帮助。 |
| **[使用 MSW 测试 Vue Query](https://github.com/mswjs/msw/discussions/2303)**                                                                                   | 测试           | -                                                                                     | 展示了如何结合 MSW (Mock Service Worker) 和 Vitest 来为你的 Vue Query 逻辑编写单元测试。           |
| **[基于 URL 参数获取数据](https://github.com/TanStack/query/discussions/4265)**                                                                                | Vue Router     | -                                                                                     | 官方讨论区的一个话题，展示了如何结合 Vue Router，根据路由参数（如 `:id`）来获取数据。              |
| **[Vue Query 分页与无限滚动](https://www.youtube.com/watch?v=0Njxq9UcL9s)**                                                                                    | 视频教程       | -                                                                                     | 视频教程，生动地讲解了如何使用 Vue Query 实现分页和无限滚动功能。                                  |
| **[优化 Vue 3 数据获取](https://medium.com/@petrankar/master-efficient-data-fetching-in-vue3-with-tanstack-query-flow-diagram-code-walkthrough-f59bb6875247)** | 最佳实践       | -                                                                                     | 一篇深度文章，探讨了数据获取的优化策略和模式，并配有流程图和代码讲解。                             |

---

## 🔧 各类项目集成要点

### 1. Nuxt 3 (全栈框架)

在 Nuxt 3 中使用 `@tanstack/vue-query` 的主要挑战是处理服务端渲染（SSR）的数据预取和客户端的水合。

- **推荐方式**：强烈建议使用上述的 **[vue-query-nuxt](https://github.com/Hebilicious/vue-query-nuxt)** 或 **[nuxt-query](https://github.com/peterbud/nuxt-query)** 模块。它们为你处理了所有复杂的 SSR 逻辑（如数据脱水 `dehydrate` 和水合 `hydrate`【turn0search5】），让你能像在普通 Vue 应用中一样使用 `useQuery`。
- **手动集成**：如果不使用模块，你需要参考官方示例【turn0search6】【turn0search17】，在服务端插件中预取查询，并将状态传递给客户端。这需要更深入的理解。

### 2. Vite + Vue (单页应用 - SPA)

这是最直接的集成方式，非常适合快速上手。

1.  **安装**:

```bash
npm i @tanstack/vue-query
```

2.  **配置**: 在你的应用入口文件（通常是 `src/main.ts`）中注册插件。

```typescript
// src/main.ts
import { createApp } from "vue";
import { VueQueryPlugin } from "@tanstack/vue-query";
import App from "./App.vue";

const app = createApp(App);

app.use(VueQueryPlugin); // 默认配置即可开始使用
app.mount("#app");
```

3.  **使用**: 在任何组件中使用 `useQuery`。

```vue
<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";

// 获取待办事项列表
const { data, isLoading, error } = useQuery({
	queryKey: ["todos"], // 唯一的查询键
	queryFn: () => fetch("https://api.example.com/todos").then((res) => res.json()), // 获取数据的函数
});
</script>
```

### 3. Vite + Nitro (混合全栈)

在这种架构下，你的前端（Vite）和后端（Nitro）是分离的。

- **前端部分**: 集成方式与 **Vite + Vue (SPA)** 完全相同。你只需要在你的 `queryFn` 中确保 API 地址指向你的 Nitro 后端服务即可。
- **后端部分**: Nitro 负责提供 API 端点，前端通过 `@tanstack/vue-query` 来消费这些 API。

### 4. UniApp (跨平台应用)

在 UniApp 中使用 `@tanstack/vue-query` 完全可行，关键在于**请求库的适配**。

- `@tanstack/vue-query` 本身不关心请求是如何发出的，它只管理异步状态。
- 你需要将 UniApp 的请求函数（如 `uni.request`）封装成一个返回 Promise 的 `fetcher` 函数，然后在 `queryFn` 中调用它。

**示例封装：**

```javascript
// utils/fetcher.js
export function uniRequestFetcher(url, options = {}) {
	return new Promise((resolve, reject) => {
		uni.request({
			url,
			...options,
			success: (res) => {
				if (res.statusCode >= 200 && res.statusCode < 300) {
					resolve(res.data);
				} else {
					reject(new Error(`Request failed with status code ${res.statusCode}`));
				}
			},
			fail: (err) => {
				reject(err);
			},
		});
	});
}
```

**在组件中使用：**

```vue
<script setup>
import { useQuery } from "@tanstack/vue-query";
import { uniRequestFetcher } from "@/utils/fetcher";

const { data, isLoading } = useQuery({
	queryKey: ["user", 1],
	queryFn: () => uniRequestFetcher("https://api.example.com/user/1"),
});
</script>
```

---

## 💡 学习建议与资源

1.  **理解核心概念**: 掌握 `useQuery`, `queryKey`, `queryFn` 这三个核心概念是关键【turn0search25】。
    - `queryKey`: 查询的唯一标识，用于缓存、重新获取和共享查询。
    - `queryFn`: 一个返回 Promise 的函数，用于获取数据。
    - `useQuery`: 一个 Hook，它将 `queryKey` 和 `queryFn` 连接起来，并返回 `data`, `isLoading`, `error` 等有用的状态。

2.  **善用 DevTools**: 安装并使用 [Vue DevTools 浏览器扩展](https://devtools.vuejs.org/)。`@tanstack/vue-query` 提供了官方集成，你可以在 DevTools 的 "Plugins" 或 "TanStack Query" 面板中查看所有查询的实时状态、缓存数据等，这对调试和理解其工作原理非常有帮助。

3.  **参考官方文档**: [TanStack Query Vue 官方文档](https://tanstack.com/query/latest/docs/vue/overview) 是最权威和全面的资源，务必时常查阅【turn0search1】。

4.  **实践与探索**: 从克隆一个简单的示例（如官方 Basic 示例）开始，然后尝试在你自己的项目中实现一个简单的数据获取功能。逐步探索分页、无限滚动、乐观更新等高级特性。

希望这份文档能为你提供一条清晰的学习路径。祝你编码愉快！
