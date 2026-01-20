# unplugin-vue-router 动态路由插件

## 用插件试着实现导入

- https://github.com/posva/unplugin-vue-router
- https://router.vuejs.org/zh/guide/advanced/typed-routes.html

## 学习进度设计

- 广泛地阅读文档，了解概念，明确边界范围
  - vue-router
  - unplugin-vue-router
  - nuxt
- 通过改造一个简单的商城 C 端项目，实现写死路由的动态化改造。
- 阅读其他的中后台项目，看看别人怎么使用动态路由+权限控制的。

## vue-router 在 V5 版本内的一些列破坏性变更

这些破坏性变更要求我们重构整个 unplugin-vue-router 的导入方式。

- https://github.com/vuejs/router/releases/tag/v5.0.0-beta.0
