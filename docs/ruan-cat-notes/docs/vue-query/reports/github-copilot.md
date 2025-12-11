# github-copilot -- @tanstack/vue-query — 推荐仓库清单与学习指南

生成者: GitHub Copilot (为 ruan-cat 搜集)  
生成日期: 2025-12-11

> 说明（重要）
>
> - 我已在 GitHub 代码中检索并汇总了使用或与 @tanstack/vue-query 强相关的开源仓库，优先关注 Vite、Nuxt、Vite+Nitro、以及管理后台 / 模板类项目，目标数量控制在 9–15 个之间。
> - 搜索结果可能不完整（GitHub 代码搜索有返回限制）。如需更完整的结果或按星数/更新排序的精确元数据（stars、last commit 时间等），我可以继续为你补抓这些信息。
> - 你可以在 GitHub 上查看更多搜索结果（代码搜索）：https://github.com/search?q=%40tanstack%2Fvue-query&type=code

---

目录

- 概览与学习建议
- 仓库清单（共 10 个，按可读性与相关性整理）
- 快速上手练习（实操路线）
- 后续可选操作

---

## 概览与学习建议（短）

- 学习顺序建议：
  1. 先在最小 Vite 项目中安装并初始化 VueQueryPlugin（学习 plugin 注入、QueryClient、默认配置）。
  2. 在一个简单管理后台页面上实现一个列表（useQuery）和创建/编辑（useMutation + invalidateQueries），模拟实际 CRUD 场景。
  3. 若使用 Nuxt/SSR，学习如何在服务端预取数据（serverPrefetch/nuxt plugin）并复用 QueryClient（参考 Nuxt 专用示例）。
  4. 对接 OpenAPI 或 tRPC 时，可优先看生成器示例，学习自动生成的 query/mutation 使用模板。

---

## 推荐仓库清单（9–15 个范围内，本次收集到 10 个）

下面每个条目包含：仓库链接、简短说明、为何值得看、适合项目类型、实用查阅路径（如果有源码文件定位则给出直接文件链接）。

1. DamianOsipiuk/vue-query (历史/迁移说明)

- 仓库：https://github.com/DamianOsipiuk/vue-query
- 简短说明：早期 Vue Query 的仓库 README，说明该包已并入 TanStack/query，并给出 v1/v2 的迁移指南。
- 为何值得看：了解历史实现与迁移说明，对于迁移老代码或理解 API 差异非常有帮助。
- 适合类型：通用（学习基础 API 与迁移）
- 参考文件（README）：https://github.com/DamianOsipiuk/vue-query/blob/35927f174d85153a80242ccf7d9831d541643466/README.md

2. sunhaoxiang/pure-admin-vue（管理后台模板）

- 仓库：https://github.com/sunhaoxiang/pure-admin-vue
- 简短说明：Pure Admin 的 Vue 前端版本，README 与文档中表明使用了 @tanstack/vue-query。
- 为何值得看：完整管理后台模板，典型的列表/表单/权限/CRUD 场景，可学到查询组织、缓存失效策略、分页等常见模式。
- 适合类型：Vite 前端项目、管理后台（Admin）
- 参考（repo）：https://github.com/sunhaoxiang/pure-admin-vue

3. fungiblesxyz/generator-app（示例：Vite + VueQuery 简单初始化）

- 仓库：https://github.com/fungiblesxyz/generator-app
- 简短说明：示例应用，main.ts 中安装了 VueQueryPlugin。
- 为何值得看：最小化示例，能快速看懂如何在 Vite 项目里引入 Vue Query 插件并进行全局注册。
- 适合类型：Vite 前端项目
- 关键文件（演示 import/安装）：https://github.com/fungiblesxyz/generator-app/blob/57779f1a90e3bd8caedfc646476241a5882b63c5/src/main.ts

4. godgodwinter/psikotest-fe-admin（轻量管理后台示例）

- 仓库：https://github.com/godgodwinter/psikotest-fe-admin
- 简短说明：管理后台，main.js 中使用 VueQueryPlugin，项目包含表格、富文本等 UI 组合实例。
- 为何值得看：实战型示例，适合观察 vue-query 在分页表格、上传、富文本等场景下与组件的结合使用。
- 适合类型：Vite 前端 / 管理后台
- 关键文件（演示 import/安装）：https://github.com/godgodwinter/psikotest-fe-admin/blob/5a69350243e413e160c444c58bc2a835db60dab7/src/main.js

5. Holi0317/trpc-vue-query（tRPC + Vue Query 集成示例）

- 仓库：https://github.com/Holi0317/trpc-vue-query
- 简短说明：为 tRPC 与 @tanstack/vue-query 提供集成的示例与文档，含 Vue 与 Nuxt 的安装与 SSR 指南。
- 为何值得看：如果你的后端采用 tRPC（或想在 Nuxt 中用服务端渲染 + vue-query），本仓库提供了完整的集成/SSR/注入说明。
- 适合类型：Nuxt 全栈、Vite + Nitro 混合全栈
- 关键文档（Setup 与 Nuxt 指南）：https://github.com/Holi0317/trpc-vue-query/blob/912ffa1886ac7e47cdbf86dcdfb2f13ba2293d31/docs/guide/setup.md

6. hirotaka/openapi-typescript-vue（OpenAPI -> Vue 客户端生成 + vue-query 集成）

- 仓库：https://github.com/hirotaka/openapi-typescript-vue
- 简短说明：从 OpenAPI schema 生成类型安全的 Vue 客户端，文档中说明内置对 @tanstack/vue-query 的支持。
- 为何值得看：当需要将后端 OpenAPI 自动生成到前端并与 vue-query 配合时，这是很好的实践与参考。
- 适合类型：Vite、Nuxt（模板/生成器类），适合需要强类型 API 的项目
- 关键文档（features 指明 vue-query 支持）：https://github.com/hirotaka/openapi-typescript-vue/blob/fb8112be809dcaf12e53301a273ac9409a499900/docs/index.md

7. Shaddix/react-query-swagger（Swagger/OpenAPI 客户端生成器，包含 Vue 转换片段）

- 仓库：https://github.com/Shaddix/react-query-swagger
- 简短说明：原本面向 react-query 的生成器，仓库中包含将生成逻辑替换为 @tanstack/vue-query 的代码片段/替换规则。
- 为何值得看：了解如何改造已有 React Query 代码生成器为 Vue Query，适合需要自动化生成 query/mutation 的团队。
- 适合类型：Vite / Nuxt（生成器用于构建客户端 API 层）
- 关键文件（示例：生成器中 Vue 替换片段）：https://github.com/Shaddix/react-query-swagger/blob/4a544e9a523a316f9a7fc2a98f7be89dc9afb10f/src/cli.js

8. xcpcio/xcpcio（大型 monorepo，前端使用了 @tanstack/vue-query）

- 仓库：https://github.com/xcpcio/xcpcio
- 简短说明：大型项目 monorepo，前端部分使用 Vue 3 + Vite，并在文档/stack 中列出使用 Vue Query。
- 为何值得看：学习在大型、多包项目中如何组织 Query 层、共享类型、以及缓存策略。
- 适合类型：Vite 前端 / 大型项目架构（可借鉴于全栈场景）
- 关键文档（技术栈说明包含 vue-query）：https://github.com/xcpcio/xcpcio/blob/1482622e9398621555fc507c91a470fac2872a57/CLAUDE.md

9. vueuse/vue-demi（兼容层，README 引用 @tanstack/vue-query）

- 仓库：https://github.com/vueuse/vue-demi
- 简短说明：用于兼容 Vue 2/3 的工具库，其 README 中列出了 @tanstack/vue-query（TanStack Query for Vue）作为生态依赖。
- 为何值得看：如果你要构建库/组件并兼容多 Vue 版本，了解 vue-demi 与 query 的整合非常重要。
- 适合类型：库/组件开发者；对兼容性需求高的项目
- 关键文件（README 中引用）：https://github.com/vueuse/vue-demi/blob/52e5e4fda8ddbe005f39e1fdcfec7ab07b3c7051/README.md

10. frasza/docker-ci-failing（Nuxt / 全局类型注入示例）

- 仓库：https://github.com/frasza/docker-ci-failing
- 简短说明：仓库中包含 shims.d.ts 的例子，展示如何在 Nuxt/全局环境将 $queryClient（QueryClient）注入到 NuxtApp 与 Vue Component 中的类型声明。
- 为何值得看：在 Nuxt 全栈项目中，需要将 QueryClient 的类型声明注入到全局（#app / vue 模块扩展），该仓库给出示例。
- 适合类型：Nuxt 全栈项目
- 关键文件（types 注入示例）：https://github.com/frasza/docker-ci-failing/blob/a959107133da199694365543fa991c7d68d4852f/shims.d.ts

---

## 每个仓库的快速查阅建议（如何快速获取重点代码）

- 查看项目根 README.md、docs 和 examples 目录，快速了解作者如何建议安装与配置。
- 查找 main.ts / main.js / plugin / nuxt.plugin.js 等文件，查看 QueryClient 或 VueQueryPlugin 的注入位置（上述仓库中给出了一些直接文件链接）。
- 在组件中搜索 useQuery / useMutation / useInfiniteQuery / QueryClient（或查询 key 的命名规则），观察 query keys 的定义与 cache invalidation 的策略。
- 对于 SSR（Nuxt）场景，重点查找 server prefetch 或 nuxt plugin 的实现，学习如何在服务端 prefetch 并在客户端 hydrate。

---

## 快速上手练习（推荐 4 步实操）

1. 新建一个最小 Vite + Vue 3 项目（npm init vite@latest 或 pnpm create vite）
2. 安装并在 main.ts 中引入 VueQueryPlugin：
   - npm install @tanstack/vue-query
   - 在 main.ts 中：
     ```ts
     import { VueQueryPlugin } from "@tanstack/vue-query";
     app.use(VueQueryPlugin);
     ```
3. 实现一个数据列表页面（useQuery）和创建/编辑表单（useMutation）：
   - 列表：展示 loading / error / data，支持分页（或 infinite）
   - 表单：在 mutation 成功后调用 queryClient.invalidateQueries('your-list-key')
4. 如果使用 Nuxt，请参照 trpc-vue-query 或 shims.d.ts 示例，创建 Nuxt plugin 注入 QueryClient，并确保 SSR 预取（server side prefetch）与客户端 hydration 正常工作。

---

## 后续可选动作（我可以为你执行）

- 为上面每个仓库抓取并附上最新的星数 (stars) 与最近一次 commit 时间，并按“stars + 最近更新”排序返回清单。
- 扩充清单：特别检索 UniApp 中是否有项目采用 @tanstack/vue-query（注意：UniApp 社区通常较少直接用该包，可能需要适配层）。
- 针对某个仓库制作一份 “如何在 1 小时内上手” 的步骤，包含最小复现代码片段与关键文件定位。

---

再次提醒：当前代码搜索可能未覆盖 GitHub 上全部相关仓库；你可以让我要“按星数与更新时间排序并补充元数据”，我会继续抓取并返回一个可排序、带星数和最近提交时间的细化清单。

下载说明：上面的内容即为完整的 Markdown 文档内容。你可以直接保存本文件为 `tanstack-vue-query-repos.md` 以便离线查看或下载使用。
