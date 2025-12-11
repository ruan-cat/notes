# gemini -- TanStack Vue Query 学习与实战资源指南

这份文档精选了 12 个优质的 Github 仓库，涵盖了从官方示例、Nuxt 模块、Vite 脚手架到 Uniapp 适配器的全方位资源。旨在帮助你快速掌握 `@tanstack/vue-query` 并应用到各类前端及全栈项目中。

## 目录

1. [核心与官方资源 (Core)](#1-核心与官方资源-core)
2. [Nuxt 全栈集成 (Nuxt Integration)](#2-nuxt-全栈集成-nuxt-integration)
3. [Vite 前端模版 (Vite Starters)](#3-vite-前端模版-vite-starters)
4. [Uniapp 移动端适配 (Mobile/Uniapp)](#4-uniapp-移动端适配-mobileuniapp)
5. [生态工具与最佳实践 (Ecosystem & Tools)](#5-生态工具与最佳实践-ecosystem--tools)

---

## 1. 核心与官方资源 (Core)

这是学习的基础，包含源码和最权威的 Examples。

### [TanStack/query](https://github.com/TanStack/query)

- **类型**: 官方单体仓库 (Monorepo)
- **Stars**: 40k+
- **适用场景**: 所有类型
- **简介**: 这是 Vue Query 的老家。虽然它是多框架库，但你必须关注其中的 `examples/vue` 目录。
- **学习重点**:
  - 查看 `examples/vue` 文件夹，里面有 `simple`, `basic`, `suspense` 等基础用法的标准代码。
  - 这是理解 Query Key、Mutation 和 Caching 机制最准确的来源。

### [DamianOsipiuk/vue-query-example](https://github.com/DamianOsipiuk/vue-query-example)

- **类型**: 演示项目
- **Stars**: 500+
- **适用场景**: Vite + Vue 3
- **简介**: 由 Vue Query 的核心维护者创建的演示项目。
- **学习重点**:
  - 展示了比官方文档更完整的 CRUD 操作。
  - 包含 TypeScript 的配置和最佳实践。
  - 非常适合作为“入门第一课”的代码参考。

---

## 2. Nuxt 全栈集成 (Nuxt Integration)

针对你的 Nuxt 全栈或 Vite + Nitro 混合项目，推荐使用模块化方案，而非手动封装。

### [hebilicious/vue-query-nuxt](https://github.com/hebilicious/vue-query-nuxt)

- **类型**: Nuxt Module
- **Stars**: 300+ (快速增长中)
- **适用场景**: Nuxt 3 全栈 / SSR
- **简介**: 目前社区推荐的 Nuxt 3 零配置模块。它解决了 SSR 数据脱水/注水（Dehydration/Hydration）的复杂问题。
- **学习重点**:
  - **零配置**: 自动注入 `VueQueryPlugin`。
  - **SSR 支持**: 完美处理服务端获取数据并同步到客户端缓存，防止页面闪烁。
  - **自动导入**: 自动 `auto-import` useQuery 等组合式函数。

### [burggraf/vulcan](https://github.com/burggraf/vulcan)

- **类型**: Nuxt 3 Starter
- **Stars**: 150+
- **适用场景**: Nuxt 3 SaaS / 全栈
- **简介**: 一个功能完备的 Nuxt 3 启动模版，集成了 Vue Query, TailwindCSS, 和 Supabase。
- **学习重点**:
  - 观察作者如何在真实业务逻辑（如 Auth、UserProfile）中组合使用 Vue Query。
  - 学习如何处理 API 层的类型定义。

---

## 3. Vite 前端模版 (Vite Starters)

适用于纯前端 SPA 项目或 Admin 管理后台的基础建设。

### [Tien-Thinh-Nguyen/vue3-vite-ts-tanstack-query](https://github.com/Tien-Thinh-Nguyen/vue3-vite-ts-tanstack-query)

- **类型**: Vite Starter
- **Stars**: 50+
- **适用场景**: Vite 前端项目
- **简介**: 一个干净的、专门针对 "Vite + TS + TanStack Query" 的启动模版。
- **学习重点**:
  - 没有过度的封装，适合用来学习如何手动配置 `QueryClient`。
  - 展示了如何封装基础的 `useApi` hooks。

### [antfu/vitesse](https://github.com/antfu/vitesse)

- **类型**: 通用模版 (需手动集成)
- **Stars**: 16k+
- **适用场景**: 高级前端项目 / Admin 基础
- **简介**: 大神 Antfu 的作品。虽然它默认使用 `useFetch`，但它是目前最流行的 Vue 3 架构基准。
- **应用建议**:
  - **不要直接用数据请求部分**，而是学习其**目录结构**和**插件管理**。
  - 下载后，安装 `@tanstack/vue-query`，并在 `modules/` 目录下创建一个 `vue-query.ts` 插件来替换默认的 fetch 逻辑。这是构建高质量 Admin 的最佳起点。

### [vbenjs/vue-vben-admin](https://github.com/vbenjs/vue-vben-admin)

- **类型**: Admin 管理后台
- **Stars**: 23k+
- **适用场景**: 复杂中后台
- **简介**: 顶级的 Vue Admin 框架。**注意**：Vben 默认封装了自己的 Hooks，但其 V5 版本（Next）开始向更标准的生态靠拢。
- **学习重点**:
  - 即使不直接用它的 Fetcher，参考它的**状态管理**和**Mock 数据**处理方式。
  - 对于大型 Admin 项目，建议参考 Vben 的架构，然后将数据层替换为 Vue Query。

---

## 4. Uniapp 移动端适配 (Mobile/Uniapp)

Uniapp 不支持标准的 `window.fetch`，因此必须使用适配器。

### [dindoyun/adapter-uniapp](https://github.com/dindoyun/adapter-uniapp)

- **类型**: Adapter (适配器)
- **Stars**: 小众精选
- **适用场景**: Uniapp 移动端
- **简介**: 专门解决 TanStack Query 在 Uniapp 环境下报错的问题。
- **关键点**:
  - TanStack Query 默认依赖浏览器的 API，在 Uniapp (特别是小程序端) 会失效。
  - 这个库提供了兼容层，让你在 Uniapp 里也能写 `useQuery`。

### [lukemorales/query-key-factory](https://github.com/lukemorales/query-key-factory)

- **类型**: 工具库
- **Stars**: 1.5k+
- **适用场景**: 所有项目 (特别是 Uniapp/Admin 这种 API 繁多的项目)
- **简介**: 管理 Query Keys 的神器。
- **推荐理由**:
  - 在 Uniapp 或 Admin 项目中，API 接口非常多，手动写字符串 Key (`['users', id]`) 容易出错且难以维护。
  - 这个库帮你标准化 Key 的生成，极大提升代码可维护性。

---

## 5. 生态工具与最佳实践 (Ecosystem & Tools)

让你的代码更健壮、类型更安全。

### [ecyrbe/zodios](https://github.com/ecyrbe/zodios)

- **类型**: API Client 工具
- **Stars**: 3k+
- **适用场景**: 全栈 / TypeScript 重度用户
- **简介**: 结合了 `Zod` (验证) 和 `Axios` 的库，并且**官方提供了 Vue Query 的集成插件**。
- **学习重点**:
  - 如果你想要**极致的类型安全**（API 返回的数据类型自动推导），这是必学的。
  - 它能让你在写 `useQuery` 时，自动获得后端接口的类型提示，无需手动定义 Interface。

### [unplugin-vue-query](https://github.com/wobsoriano/unplugin-vue-query)

- **类型**: 构建插件
- **Stars**: 100+
- **适用场景**: Vite / Nuxt
- **简介**: 这是一个构建工具插件，用于通过特定文件命名约定（如 `.query.ts`）自动生成 Vue Query hooks。
- **应用**: 适合喜欢“约定大于配置”的高级玩家，可以减少大量样板代码。

### [mathew-ia/vue-query-playground](https://github.com/mathew-ia/vue-query-playground)

- **类型**: 学习演练场
- **Stars**: 50+
- **适用场景**: 纯学习 / 测试
- **简介**: 一个交互式的 Playground。
- **用途**: 当你遇到奇怪的缓存行为（如 `staleTime` 不生效、`refetch` 逻辑混乱）时，不要在复杂的项目里调试，直接在这个干净的环境里复现和测试。

---

## 学习与集成路径建议

1.  **入门阶段**: 下载 **DamianOsipiuk/vue-query-example**，跑通基本的 CRUD。
2.  **Web 项目**: 使用 **hebilicious/vue-query-nuxt** (Nuxt) 或在 **Tien-Thinh-Nguyen** (Vite) 的基础上开发。
3.  **Admin 实战**: 克隆 **antfu/vitesse**，删除其自带的数据请求逻辑，安装 `@tanstack/vue-query`，配合 **lukemorales/query-key-factory** 进行 API 管理。
4.  **移动端**: 在 Uniapp 项目中引入 **dindoyun/adapter-uniapp**，确保小程序环境下的网络请求兼容。
