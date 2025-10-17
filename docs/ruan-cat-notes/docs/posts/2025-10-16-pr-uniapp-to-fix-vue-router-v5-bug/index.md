---
juejin: TODO 合并完pr后就发文章
desc: 因vue-router在未来v5版本内不提供dist/vue-router.esm-bundler.js导出文件，故向uniapp提交pr以便提前应对破坏性变更
---

# 记一次向 uniapp 提交 pr 的过程

## 问题起因

`vue-router@4.6.0` 版本使用了 tsup 重构了构建行为，导致产物丢失了 `dist/vue-router.esm-bundler.js` 文件，进而导致 uniapp 项目的 `@dcloudio/vite-plugin-uni` 依赖出现故障。

相关 issue 和更改如下：

- vue-router 作者在相关 issue 的回复： https://github.com/vuejs/router/issues/2569#issuecomment-3405172967
- vue-router 作者的废弃警告： https://github.com/vuejs/router/commit/9b22edcff3acd9782dd86257b2744c1ae35a455e

## 为什么选择现在就提前修复故障？

## 定位问题

## fork 并克隆项目到本地

## 按照提交规范写 git commit

## 听取审核意见，编写

## 分析依赖链，设计合适的本地构建命令

## 创建全新的模板项目

## 本地模板项目
