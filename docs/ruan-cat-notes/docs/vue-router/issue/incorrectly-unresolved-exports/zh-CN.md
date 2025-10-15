<!-- https://github.com/vuejs/router/issues/2569 -->

# 缺失 `vue-router.esm-bundler.js` 的导出

> 报告者并不是以英文为母语的用户，以下内容均使用翻译软件翻译：

在 `vue-router@4.6.0` 中，出现了因缺少 `vue-router.esm-bundler.js` 的文件导出，而导致其他下游依赖的故障。

阅读该 [github workflow 流水线](https://github.com/nwt-q/001-Smart-Community/actions/runs/18517921823/job/52772087484)的报错，可以得知 `vue-router@4.6.0` 因为缺少了 `vue-router.esm-bundler.js` 导出而导致其他下游依赖出现故障。在这里，是依赖 `@dcloudio/uni-h5@3.0.0-4070520250711001` 出现的故障。

以下内容均为各种报错截图，可以酌情跳过不看。

## 在 stackblitz 上的最小复现案例出现的报错

<!-- https://stackblitz.com/~/github.com/ruan-cat/bug-in-vue-router-4.6.0-with-uniapp?file=package.json -->

![2025-10-15-15-14-44](https://gh-img-store.ruan-cat.com/img/2025-10-15-15-14-44.png)

![2025-10-15-15-15-18](https://gh-img-store.ruan-cat.com/img/2025-10-15-15-15-18.png)

## 在 github workflow 运行时出现的报错

缺少 `vue-router/dist/vue-router.esm-bundler.js` 导致的错误。

![2025-10-15-13-37-22](https://gh-img-store.ruan-cat.com/img/2025-10-15-13-37-22.png)

## 本地运行基于 unibest 模板出现的故障

报错 `Cannot find module 'vue-router\dist\vue-router.esm-bundler.js'` 。

![2025-10-15-13-38-32](https://gh-img-store.ruan-cat.com/img/2025-10-15-13-38-32.png)

## 回复

### 为什么我提供的最小复现案例仍旧有其他数个依赖？

为了说明 vue-router@4.6.0 本身的问题是如何影响其他依赖的，这里已提供在 uniapp 框架语境下的最小使用例子了。

根据昨天的[更新日志](https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#460-2025-10-14)，vue-router 在 4.6.0 版本内使用了 tsup 来打包项目。这可能会导致缺少文件导出的情况。

本案例提供了最少的依赖，以便说明 vue-router@4.6.0 影响了其他的下游依赖。**没有向后兼容**。
