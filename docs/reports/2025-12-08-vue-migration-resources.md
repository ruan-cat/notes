# Vue CLI（Vue2/Webpack）迁移 Vite + Vue3 资源速览

## 1 报告概览

- 目标：汇总可用于编写子代理/提示词/Claude Code skill 的 GitHub 资源，聚焦 Vue CLI（Vue2+Webpack）迁移至 Vite + Vue3。
- 范围：包含迁移 codemod、Vue2 适配 Vite 插件及 Vue3+Vite 参考骨架，共 10 个仓库。

## 2 关键参考仓库

1. [vuejs/vue-codemod](https://github.com/vuejs/vue-codemod)：官方迁移 codemod，覆盖 Vue2→Vue3 核心 API 替换。
2. [underfin/vite-plugin-vue2](https://github.com/underfin/vite-plugin-vue2)：在 Vite 中运行 Vue2 的关键插件，便于“先换构建”后再升 Vue3。
3. [underfin/vite-plugin-vue2-starter](https://github.com/underfin/vite-plugin-vue2-starter)：Vue2+Vite 最小示例，可对照迁移 webpack 配置。
4. [wobsoriano/vite-vue2](https://github.com/wobsoriano/vite-vue2)：Vue2+Vite 脚手架，含基础路由与 HMR 配置。
5. [vitejs/awesome-vite](https://github.com/vitejs/awesome-vite)：Vite 生态精选列表，含 webpack→Vite 文章与示例。
6. [AykutSarac/awesome-vue3](https://github.com/AykutSarac/awesome-vue3)：Vue3 资源汇总，含升级/迁移相关示例与文章。
7. [element-plus/element-plus-vite-starter](https://github.com/element-plus/element-plus-vite-starter)：Vue3+Vite 最小 UI 示例，可作为迁移后目录/依赖参考。
8. [pengzhanbo/vite-vue3-starter](https://github.com/pengzhanbo/vite-vue3-starter)：工程化较全的 Vue3+Vite 脚手架（TS、Pinia、Router）。
9. [vbenjs/vue-vben-admin](https://github.com/vbenjs/vue-vben-admin)：大型 Vue3+Vite 后台模板，含权限、多环境与打包优化。
10. [xiaoxian521/vue-pure-admin](https://github.com/xiaoxian521/vue-pure-admin)：另一套 Vue3+Vite 后台示例，包含多主题与性能优化实践。

## 3 使用建议

- Codemod 优先：基于 `vuejs/vue-codemod` 生成“逐步替换”提示词，先改 API 再清理边缘用法。
- 先换构建：用 `vite-plugin-vue2` 把 Vue2 项目跑在 Vite 上，记录 webpack → Vite 配置差异，写成检查清单。
- 目标骨架对照：选 `element-plus-vite-starter` 或 `pengzhanbo/vite-vue3-starter` 作为迁移后的目录/依赖基线，自动生成 diff 计划。
- 复杂场景参考：管理后台可对照 `vue-vben-admin`、`vue-pure-admin` 的权限、多环境、构建优化配置。
- 资料补全：从 `awesome-vite` / `awesome-vue3` 中补 SSR、PWA、测试、TS 配置等场景链接，充实提示词知识库。

## 4 后续可补充

- 补充 CLI→Vite 的自动化脚本示例（如 package.json scripts、CI 缓存策略）。
- 收集迁移中常见第三方库替代方案（如 UI 组件、构建插件）。
- 根据实际迁移项目的坑点，迭代子代理/提示词测试用例与回归清单。
