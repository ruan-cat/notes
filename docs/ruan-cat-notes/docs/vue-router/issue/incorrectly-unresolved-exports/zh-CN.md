# 缺失 `vue-router.esm-bundler.js` 的导出

> 报告者并不是以英文为母语的用户，以下内容均使用翻译软件翻译：

在 `vue-router@4.6.0` 中，出现了因缺少 `vue-router.esm-bundler.js` 的文件导出，而导致其他下游依赖的故障。

阅读该 [github workflow 流水线](https://github.com/nwt-q/001-Smart-Community/actions/runs/18517921823/job/52772087484)的报错，可以得知 `vue-router@4.6.0` 因为缺少了 `vue-router.esm-bundler.js` 导出而导致其他下游依赖出现故障。在这里，是依赖 `@dcloudio/uni-h5@3.0.0-4070520250711001` 出现的故障。

以下内容均为各种报错截图，可以酌情跳过不看。

## 在 github workflow 运行时出现的报错

缺少 `vue-router/dist/vue-router.esm-bundler.js` 导致的错误。

![2025-10-15-13-37-22](https://gh-img-store.ruan-cat.com/img/2025-10-15-13-37-22.png)

## 本地运行基于 unibest 模板出现的故障

报错 `Cannot find module 'vue-router\dist\vue-router.esm-bundler.js'` 。

![2025-10-15-13-38-32](https://gh-img-store.ruan-cat.com/img/2025-10-15-13-38-32.png)
