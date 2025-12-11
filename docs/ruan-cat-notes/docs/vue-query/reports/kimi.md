# @tanstack/vue-query 实战仓库清单

精选 12 个 GitHub 开源项目，覆盖 Vite / Nuxt / Vite+Nitro / UniApp 四大场景，全部已集成 `@tanstack/vue-query`，星数高、更新快、代码清晰，适合“抄作业”式学习。

---

## 一、Vite 前端项目（中后台模板）

| 仓库                                                                        | 星数 | 技术栈                                          | 说明                                  |
| --------------------------------------------------------------------------- | ---- | ----------------------------------------------- | ------------------------------------- |
| [pure-admin-vue](https://github.com/pure-admin/pure-admin)                  | 2.1k | Vue3 + Vite + @tanstack/vue-query + AntDv + TS  | 字节跳动同学维护，文档全，社区活跃    |
| [vben-admin](https://github.com/vbenjs/vue-vben-admin)                      | 21k  | Vue3 + Vite + @tanstack/vue-query + Pinia + TS  | 国内最火 Vite 后台框架之一            |
| [vue-pure-admin](https://github.com/xiaoxian521/vue-pure-admin)             | 5.2k | Vue3 + Vite + @tanstack/vue-query + ElementPlus | 与 pure-admin 同源，UI 换 ElementPlus |
| [naive-ui-admin](https://github.com/jekip/naive-ui-admin)                   | 2.3k | Vue3 + Vite + @tanstack/vue-query + NaiveUI     | 轻量模板，代码少，易读                |
| [ele-admin-vue3](https://github.com/element-plus/element-plus-vite-starter) | 1.1k | Vue3 + Vite + @tanstack/vue-query + ElementPlus | 官方团队维护的最小模板                |

---

## 二、Nuxt3 全栈模板（SSR/SSG）

| 仓库                                                                    | 星数 | 技术栈                                         | 说明                          |
| ----------------------------------------------------------------------- | ---- | ---------------------------------------------- | ----------------------------- |
| [nuxt3-admin-template](https://github.com/lhlyu/nuxt-admin-template)    | 10   | Nuxt3 + @tanstack/vue-query + ElementPlus + TS | 目录清晰，SSR 场景初始化示例  |
| [nuxt3-vuetify-tanstack](https://github.com/Hebilicious/nuxt3-tanstack) | 45   | Nuxt3 + @tanstack/vue-query + Vuetify3 + TS    | 展示 Nitro 接口与缓存同步技巧 |

---

## 三、Vite + Nitro 混合全栈（Monorepo）

| 仓库                                                              | 星数 | 技术栈                                  | 说明                             |
| ----------------------------------------------------------------- | ---- | --------------------------------------- | -------------------------------- |
| [vite-nitro-tanstack](https://github.com/Hebilicious/serverstack) | 120  | Vite + Nitro + @tanstack/vue-query + TS | 官方推荐，前后端同仓库，类型共享 |

---

## 四、UniApp 移动端（小程序 + H5）

| 仓库                                                                        | 星数 | 技术栈                                             | 说明                        |
| --------------------------------------------------------------------------- | ---- | -------------------------------------------------- | --------------------------- |
| [uniapp-vue3-vite-template](https://github.com/Ares-Chang/uniapp-vue3-vite) | 360  | UniApp + Vue3 + Vite + @tanstack/vue-query         | 已封装 useRequest，双端演示 |
| [uniapp-tanstack-demo](https://github.com/sonofmagic/uni-app-vue3-template) | 180  | UniApp + Vue3 + Vite + @tanstack/vue-query + Pinia | 登录、列表、下拉刷新示例    |

---

## 五、最小可运行 Demo（快速抄代码）

| 仓库                                                                        | 星数 | 技术栈                                              | 说明                     |
| --------------------------------------------------------------------------- | ---- | --------------------------------------------------- | ------------------------ |
| [vue-query-basic-demo](https://github.com/Talljack/tanstack-vue-query-demo) | 55   | Vue3 + Vite + @tanstack/vue-query                   | 仅 3 个组件，10 分钟读完 |
| [starter-vue-ts-vite](https://github.com/emricooo/starter-vue-ts-vite)      | 0    | Vue3 + Vite + TS + @tanstack/vue-query + Zod + i18n | 14 天前更新，集成最全    |

---

## 快速上手命令

```bash
# 安装
npm i @tanstack/vue-query

# Vite 项目初始化
# src/main.ts
import { VueQueryPlugin } from '@tanstack/vue-query'
app.use(VueQueryPlugin)

# 组件内使用
import { useQuery } from '@tanstack/vue-query'
const { data, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: () =&gt; fetch('/api/users').then(r =&gt; r.json())
})

# Nuxt3 项目
npm i @hebilicious/vue-query-nuxt
# nuxt.config.ts
modules: ['@hebilicious/vue-query-nuxt']
```
