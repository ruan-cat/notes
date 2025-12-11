# chatgpt -- @tanstack/vue-query 学习与模板仓库精选（11 个）

本文件汇总了适用于 Vite、Nuxt、Nitro、UniApp 以及 Admin 后台场景的高质量
GitHub 仓库，便于快速学习并在项目中落地使用。

---

## 1. TanStack / query（官方仓库 + Vue 官方示例）

**仓库地址**：https://github.com/TanStack/query\
**说明**：\
TanStack Query 官方代码，同时包含 Vue 版本示例（包括
Basic、SSR、Prefetch、Nuxt 3 示例等），是掌握 @tanstack/vue-query
的核心资料。\
**适用项目类型**：Vite、Nuxt、Nitro。

---

## 2. Hebilicious / vue-query-nuxt

**仓库地址**：https://github.com/Hebilicious/vue-query-nuxt\
**说明**：\
最主流的 Nuxt 模块，将 @tanstack/vue-query 无缝整合到 Nuxt 中，提供
Auto-import、SSR Prefetch、状态序列化、Devtools 等集成功能。\
**适用项目类型**：Nuxt 全栈项目。

---

## 3. yang1206 / uniapp-template

**仓库地址**：https://github.com/yang1206/uniapp-template\
**说明**：\
UniApp + Vite 的高质量模板，其中包含对 @tanstack/vue-query
的可选集成，用于移动端项目开发（App、小程序）。\
**适用项目类型**：UniApp 移动端、Vite。

---

## 4. DamianOsipiuk / vue-query（旧版库，含迁移说明）

**仓库地址**：https://github.com/DamianOsipiuk/vue-query\
**说明**：\
旧版 vue-query 包历史仓库，已迁移到 TanStack，但 README
中包含大量迁移指南，对维护旧项目或升级到最新版本有参考价值。

---

## 5. Colonel-Sandvich / trpc-vue-query

**仓库地址**：https://github.com/Colonel-Sandvich/trpc-vue-query\
**说明**：\
将 tRPC 与 @tanstack/vue-query 整合的工具库，对全栈、类型安全 API
项目非常有参考意义。\
**适用项目类型**：Vite、Nuxt、Nitro Fullstack。

---

## 6. falcondev-oss / trpc-vue-query

**仓库地址**：https://github.com/falcondev-oss/trpc-vue-query\
**说明**：\
另一套 tRPC + Vue Query 方案，提供更完整的类型安全 Composables。\
适用于构建强类型的全栈应用。

---

## 7. oslabs-beta / Vueable-query（Vue Query Devtools）

**仓库地址**：https://github.com/oslabs-beta/Vueable-query\
**说明**：\
Vue Query 的 Chrome Devtools，可可视化查看 Query
状态、缓存、请求生命周期，有助于在 Admin 或复杂项目中调试数据管理。\
**适用项目类型**：所有（强烈推荐）。

---

## 8. randymxd07 / TanStack_Vue_Query

**仓库地址**：https://github.com/randymxd07/TanStack_Vue_Query\
**说明**：\
一个非常简洁的 Vite + Vue Query 入门示例，适合作为初学与快速实验用。

---

## 9. TanStack 官方在线示例（StackBlitz / Codesandbox）

**地址**：\

- https://stackblitz.com/@tanstack\
- https://tanstack.com/query/latest/docs/vue/examples

**说明**：\
官方维护的一系列在线可运行示例，包括 Basic、Nuxt、Infinite
Query、SSR、Mutation 等。是最快的学习方式。

---

## 10. nuxt-ui-templates（Dashboard、SaaS、Admin 模板）

**仓库地址**：https://github.com/nuxt-ui-templates\
**说明**：\
官方与社区维护的 Nuxt 模板库（Dashboard、SaaS、Docs）。\
你可以非常容易地在这些模板中加入
@tanstack/vue-query，用于搭建管理后台或全栈项目。

---

## 11. OSLabs 工具链相关仓库（Point-of-Vue / QueryIQ）

**仓库地址（合集）**：https://github.com/orgs/oslabs-beta/repositories\
**说明**：\
包含许多前端 Devtools / Query 工具，可作为 Vue Query
学习与调试的辅助资料。

---

# 项目类型适配建议

## Vite 前端项目

- 使用官方 Basic 示例结构创建 `QueryClient` 与 `VueQueryPlugin`。
- 引入 `VueQueryDevtools` 辅助调试。

## Nuxt 全栈项目

- 强烈推荐使用 `vue-query-nuxt` 模块，做到零配置 SSR Prefetch。
- 可与 Nuxt Server API（Nitro）结合做数据缓存。

## Vite + Nitro 混合全栈

- 参考官方 Nitro + Vue Query 示例。
- 将 Query Prefetch 放入服务端路由即可复用。

## UniApp 移动端

- 参考 `uniapp-template` 的项目结构。
- 在 uni-app 平台使用 Vue Query 不影响跨端能力（缓存层为纯 JS）。

---

# 学习路线建议

1.  先跑官方例子（Basic / Nuxt）。\
2.  根据你当前项目选择对应整合方式（Vite / Nuxt / UniApp）。\
3.  在业务中建立 composable 查询模块（如 useUserQuery /
    useOrderQuery）。\
4.  使用 Devtools 调试 Query 生命周期和缓存命中情况。\
5.  在 Admin 后台中建立统一的 API + 缓存失效策略。

---

# 完整仓库清单（快速入口）

1.  https://github.com/TanStack/query\
2.  https://github.com/Hebilicious/vue-query-nuxt\
3.  https://github.com/yang1206/uniapp-template\
4.  https://github.com/DamianOsipiuk/vue-query\
5.  https://github.com/Colonel-Sandvich/trpc-vue-query\
6.  https://github.com/falcondev-oss/trpc-vue-query\
7.  https://github.com/oslabs-beta/Vueable-query\
8.  https://github.com/randymxd07/TanStack_Vue_Query\
9.  https://tanstack.com/query/latest/docs/vue/examples\
10. https://github.com/nuxt-ui-templates\
11. https://github.com/orgs/oslabs-beta/repositories

---

如果需要，我可以为你生成对应项目类型的 Starter
模板（含目录结构与示例代码）。
