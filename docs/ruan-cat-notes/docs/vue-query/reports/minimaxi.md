---
AIGC:
  ContentProducer: Minimax Agent AI
  ContentPropagator: Minimax Agent AI
  Label: AIGC
  ProduceID: 5ad3e6a6a06010b3ea00333a389cafee
  PropagateID: 5ad3e6a6a06010b3ea00333a389cafee
  ReservedCode1: 3045022100866bed95fc7693686dc711c47d4f7f73f4271318eb383f90de3600fc95457b6802203e5d564bd2e3fed75454df92931b83a73b4cbb2dea69c31afccb586ccdef9508
  ReservedCode2: 30440220604dc0044bd3fdfb7726a71981854004fc38a53781f30d01457721d8412299f102203bb6dc4f09c5ec859e96140ba0cc1ef510d7637dde145d74b1eef1d18dca5986
---

# minimaxi -- @tanstack/vue-query GitHub 仓库推荐指南

> 基于 Vue Query 的高质量开源项目仓库精选，涵盖 Vite、Nuxt、Nitro、UniApp 等多种项目类型

## 🎯 项目概述

TanStack Query（前身为 Vue Query）是一个强大的服务端状态管理库，为 Vue.js 应用程序提供数据获取、缓存、同步和更新功能。本指南精选了 12 个高质量的 GitHub 仓库，涵盖您提到的所有项目类型，帮助您快速学习和应用 `@tanstack/vue-query`。

## 🚀 Vite + Vue3 项目类型

### 1. Vue3 全家桶模板 (zliyou/vue3_template)

**GitHub 地址：** https://github.com/zliyou/vue3_template

**项目特点：**

- Vue3 + Vite + TypeScript + Pinia 完整技术栈
- Axios 配合 @Tanstack/vue-query 进行接口处理
- 集成 Sass 和 TailwindCSS
- 开箱即用的配置，适合快速项目启动

**技术栈：**

```yaml
前端框架: Vue 3
构建工具: Vite
状态管理: Pinia
类型系统: TypeScript
样式预处理: Sass
CSS 框架: TailwindCSS 3.x
数据管理: @tanstack/vue-query
HTTP 客户端: Axios
```

**学习价值：** ⭐⭐⭐⭐⭐

- 适合初学者快速上手 Vue3 + TanStack Query
- 提供了完整的项目架构参考
- 展示了与现代 Vue 生态系统的集成

### 2. Vue Query 演示应用 (randymxd07/TanStack_Vue_Query)

**GitHub 地址：** https://github.com/randymxd07/TanStack_Vue_Query

**项目特点：**

- Vue Query 核心功能演示
- RESTful API 集成示例
- 简洁的项目结构，便于理解核心概念

**学习价值：** ⭐⭐⭐⭐

- 专注于展示 Vue Query 的基本用法
- 适合理解 query key、query function 等核心概念
- 提供了实际的数据获取示例

### 3. Vue3 + Vite 基础模板 (chinyishan/vue-query)

**GitHub 地址：** https://github.com/chinyishan/vue-query

**项目特点：**

- 基础的 Vue 3 + Vite + Vue Query 模板
- 使用 Vue 3 `<script setup>` SFCs
- 简洁的项目结构，适合学习基础用法

**学习价值：** ⭐⭐⭐⭐

- 适合从零开始学习 Vue Query
- 项目结构清晰，便于理解配置过程
- 展示了最新的 Vue 3 开发模式

### 4. Vue Query 基础模板 (stevecyj/tanstack-query)

**GitHub 地址：** https://github.com/stevecyj/tanstack-query

**项目特点：**

- Vue 3 + Vite + TanStack Query 基础模板
- 专注于展示基本的数据获取功能
- 轻量级项目，易于理解和修改

**学习价值：** ⭐⭐⭐

- 适合快速验证 Vue Query 功能
- 代码简洁，学习曲线平缓
- 提供了最基础的集成示例

## 🏗️ Nuxt 全栈项目类型

### 5. Nuxt 3 + Vue Query 示例 (lucas-santosP/example-nuxt-vue-query)

**GitHub 地址：** https://github.com/lucas-santosP/example-nuxt-vue-query

**项目特点：**

- Nuxt 3 最小启动器 + Vue Query 集成
- 展示了服务端渲染 (SSR) 场景下的数据获取
- 提供了 Nuxt 3 的最佳实践示例

**技术栈：**

```yaml
全栈框架: Nuxt 3
前端框架: Vue 3
数据管理: @tanstack/vue-query
SSR: 支持服务端渲染
```

**学习价值：** ⭐⭐⭐⭐⭐

- 适合学习 Nuxt 3 + Vue Query 的集成
- 展示了 SSR 环境下的特殊处理
- 提供了完整的 Nuxt 3 项目结构参考

### 6. Nuxt Query 模块 (peterbud/nuxt-query)

**GitHub 地址：** https://github.com/peterbud/nuxt-query

**项目特点：**

- 强大的 Nuxt 模块，集成 TanStack Query
- 提供智能缓存和后台更新
- 集成 Nuxt DevTools，支持查询状态检查
- 类型安全的实现

**技术栈：**

```yaml
全栈框架: Nuxt 3
数据管理: @tanstack/vue-query
开发工具: Nuxt DevTools 集成
特性: 智能缓存、后台更新、类型安全
```

**学习价值：** ⭐⭐⭐⭐⭐

- 适合生产环境的 Nuxt 3 项目
- 提供了完整的类型安全支持
- 展示了与 Nuxt 生态的深度集成

### 7. Vue Query Nuxt 模块 (Hebilicious/vue-query-nuxt)

**GitHub 地址：** https://github.com/Hebilicious/vue-query-nuxt

**项目特点：**

- 官方 Nuxt 模块，零配置开箱即用
- 极轻量级，专注于核心功能
- 支持 Nuxt 3 和 Nuxt 2

**技术栈：**

```yaml
全栈框架: Nuxt 2/3
数据管理: @tanstack/vue-query
配置: 零配置
特性: 开箱即用、极轻量
```

**学习价值：** ⭐⭐⭐⭐

- 适合快速集成 Vue Query 到现有 Nuxt 项目
- 配置简单，学习成本低
- 提供了模块化的集成方式

### 8. Nuxt Server Components 示例 (manuelgeek/nuxt-tanstack-query)

**GitHub 地址：** https://github.com/manuelgeek/nuxt-tanstack-query

**项目特点：**

- 演示 Nuxt server side components + TanStack Query
- 展示了服务端组件的数据获取模式
- 提供了混合渲染的示例

**学习价值：** ⭐⭐⭐⭐

- 适合学习 Nuxt 3 的高级特性
- 展示了服务端组件的使用场景
- 提供了混合渲染的实践经验

### 9. 类型安全 Nuxt 模块 (ozum/nuxt-vue-query)

**GitHub 地址：** https://github.com/ozum/nuxt-vue-query

**项目特点：**

- 添加类型安全的 TanStack Vue Query
- 提供额外的 composables: useApiGet, useApiPost 等
- 简化 Nuxt API 访问

**技术栈：**

```yaml
全栈框架: Nuxt 3
类型系统: TypeScript
数据管理: @tanstack/vue-query
API 客户端: 增强的 composables
```

**学习价值：** ⭐⭐⭐⭐

- 适合 TypeScript 重度用户
- 提供了完整的类型安全保障
- 简化了 API 调用方式

## ⚡ Vite + Nitro 混合项目

### 10. Vite + Vue + Nitro 示例 (brandonroberts/vite-nitro-vue)

**GitHub 地址：** https://github.com/brandonroberts/vite-nitro-vue

**项目特点：**

- Vite + Vue + Nitro 的全栈应用示例
- 展示了 Nitro 服务器功能
- 现代全栈开发模式

**技术栈：**

```yaml
前端: Vue 3
构建工具: Vite
服务器: Nitro
特性: 全栈开发、服务器路由
```

**学习价值：** ⭐⭐⭐⭐

- 适合学习现代全栈开发
- 展示了 Nitro 的强大功能
- 提供了 Vite + Nitro 的最佳实践

## 📱 UniApp 移动端项目

### 11. Vue Query 在 UniApp 中的实践

**参考文档：** https://zhuanlan.zhihu.com/p/718660392

**项目特点：**

- 专门针对 UniApp 平台的 Vue Query 使用指南
- 提供了兼容性适配方案
- 移动端优化的数据获取策略

**技术栈：**

```yaml
跨平台框架: UniApp
前端框架: Vue 3
数据管理: @tanstack/vue-query
平台: 微信小程序、H5、App
```

**学习价值：** ⭐⭐⭐⭐

- 适合移动端开发场景
- 提供了移动端特有的优化策略
- 解决了跨平台兼容性问题

## 🔗 GraphQL 集成项目

### 12. Vue3 + GraphQL + TanStack Query (robertodraGit/vue-gql-tanstack-codegen)

**GitHub 地址：** https://github.com/robertodraGit/vue-gql-tanstack-codegen

**项目特点：**

- Vue 3 + TypeScript + Vite + GraphQL + TanStack Query
- 集成 CodeGen 进行类型生成
- 现代化的 GraphQL 客户端架构

**技术栈：**

```yaml
前端框架: Vue 3
构建工具: Vite
类型系统: TypeScript
查询语言: GraphQL
数据管理: TanStack Query
工具: CodeGen 类型生成
```

**学习价值：** ⭐⭐⭐⭐⭐

- 适合学习 GraphQL + Vue Query 的集成
- 提供了完整的类型生成流程
- 展示了现代化的 API 架构

### 13. TanStack Query Vue3 深度实现 (petrankar/tanstack-query-vue3)

**GitHub 地址：** https://github.com/petrankar/tanstack-query-vue3

**项目特点：**

- TanStack Query 在 Vue3 中的结构化分层实现
- 包含图表、代码和实时演示
- 深度解析实现原理

**学习价值：** ⭐⭐⭐⭐⭐

- 适合深入理解 Vue Query 原理
- 提供了架构设计的最佳实践
- 包含了可视化学习资料

## 📚 学习建议

### 🎯 学习路径建议

1. **入门阶段** (适合完全初学者)
   - 从 `randymxd07/TanStack_Vue_Query` 开始
   - 理解基本的 query key 和 query function 概念
   - 学习基础的缓存机制

2. **实践阶段** (有 Vue 基础)
   - 使用 `zliyou/vue3_template` 创建项目
   - 集成到现有项目中
   - 学习与 Pinia、Axios 的配合使用

3. **进阶阶段** (需要全栈能力)
   - 学习 `lucas-santosP/example-nuxt-vue-query`
   - 掌握 SSR 环境下的特殊处理
   - 了解服务端组件的数据获取

4. **专家阶段** (生产环境应用)
   - 使用 `peterbud/nuxt-query` 构建生产项目
   - 掌握类型安全和开发工具集成
   - 优化性能和用户体验

### 🛠️ 最佳实践要点

1. **Query Key 设计**
   - 使用数组形式：['users', { page: 1, limit: 10 }]
   - 保持 key 的唯一性和描述性

2. **缓存策略**
   - 设置合理的 staleTime 和 cacheTime
   - 利用后台更新机制提升用户体验

3. **错误处理**
   - 统一处理网络错误和业务错误
   - 提供友好的错误提示

4. **类型安全**
   - 使用 TypeScript 定义 Query 和 Mutation 类型
   - 利用 Nuxt 模块的类型支持

5. **性能优化**
   - 合理使用 queryClient 的配置
   - 避免不必要的重复请求

### 🔧 环境配置要点

**Vite 项目配置：**

```typescript
// main.ts
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5分钟
			cacheTime: 1000 * 60 * 10, // 10分钟
		},
	},
});

app.use(VueQueryPlugin, { queryClient });
```

**Nuxt 3 项目配置：**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
	modules: ["@hebilicious/vue-query-nuxt"],
	vueQuery: {
		queryClientOptions: {
			defaultOptions: {
				queries: {
					staleTime: 1000 * 60 * 5,
				},
			},
		},
	},
});
```

## 📈 总结

以上 13 个项目涵盖了您提到的所有项目类型，从基础的 Vite + Vue3 项目到复杂的 Nuxt 全栈应用，再到移动端的 UniApp 实践。每个项目都有其特定的学习价值和适用场景。

建议您根据自己的技术栈和项目需求，选择合适的仓库进行学习和实践。从简单的示例开始，逐步掌握更复杂的集成场景，最终能够在生产环境中熟练使用 @tanstack/vue-query。

---

**文档更新时间：** 2025-12-11  
**作者：** MiniMax Agent  
**版本：** v1.0

> 💡 **提示：** 建议在学习实践过程中关注官方文档和社区动态，TanStack Query 持续更新迭代，保持学习的连贯性。
