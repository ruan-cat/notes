# 自建组件库

我想在自己的测试项目内，把全部的 vue 组件，拆分出来，做成 monorepo 下面的一个子包。积累经验后，应用到之前经手的旧项目内。

## 参考资料

- [掘金 【从 0 到 1 搭建 Vue 组件库框架】0. 系列导论](https://juejin.cn/post/7254341178258505788)

## 进度

## 暂停一下，去做别的事情辅助复习上述的学习进度

- [x] 自己定义路径别名并制作简单的组件。
- [x] 用基于 vite.config.ts 的方式实现快速打包一个简单的包，优化之前 rollup 开发的依赖包。
- [ ] 在本文档项目内，将 50d50p 的组件分离开来，做一个自己的组件库。
  - [ ] 去额外考虑组件的 install 方法，考虑组件的注册情况。
  - [ ] 暂时不考虑拆分成独立的 demo 演示项目。混在组件库内。
  - [ ] 考虑 md 文档模块化导入的技术。

## learn-openx-ui

暂停。不跟着了。留作参考资料。整个体系非常复杂。

## 掘金 全肝鸽鸽

- https://juejin.cn/post/7288597387798904866

目前跟这个这个简单的教程做。卡在类型生成上面。

## GlobalComponents

现在的思路确定了，为了让 volar 可以有效地识别组件库的类型，需要我们为组件库生成对应的全局组件类型。

- unplugin-vue-components
- vite-plugin-autogeneration-import-file
- vite-plugin-dts

现在需要想办法实现简单的生成。试着用 `vite-plugin-autogeneration-import-file` 在组件库端完成类型文件生成，避免在应用端手动配置 vite 生成类型。太繁琐了。

## tsdown 是否是封装组件库的新选择？

尝试用 tsdown 实现简单的 vue 组件库封装。
