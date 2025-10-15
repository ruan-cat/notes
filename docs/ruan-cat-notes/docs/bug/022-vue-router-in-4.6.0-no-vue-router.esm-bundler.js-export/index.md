---
juejin: TODO 处理完了issue就发文章
desc: 因vue-router在4.6.0版本使用了tsup重构打包行为，使得dist文件夹缺少文件，进而导致uniapp的H5打包失败
---

# 记一次因 vue-router 升级而导致的 uniapp 故障

## 在云端复现故障

问题起因，在 [github workflow 流水线](https://github.com/nwt-q/001-Smart-Community/actions/runs/18517921823/job/52772087484)打包的项目出现莫名其妙的故障，称找不到 `vue-router.esm-bundler.js` 文件。

如下图所示，缺少 `vue-router/dist/vue-router.esm-bundler.js` 导致的错误。

![2025-10-15-13-37-22](https://gh-img-store.ruan-cat.com/img/2025-10-15-13-37-22.png)

```log
[commonjs--resolver] Cannot find module '/home/runner/work/001-Smart-Community/001-Smart-Community/node_modules/vue-router/dist/vue-router.esm-bundler.js'
```

## 在本地复现故障

我的 uniapp 项目是基于 unibest 模板开发的，重新安装依赖后，在本地也能稳定复现出该故障：

![2025-10-15-13-38-32](https://gh-img-store.ruan-cat.com/img/2025-10-15-13-38-32.png)

```log
[plugin:vite:import-analysis] Cannot find module 'vue-router\dist\vue-router.esm-bundler.js'
```

可以确定是 `@dcloudio/uni-h5@3.0.0-4070520250711001` 依赖出现了问题，但是这个依赖我之前用了很久了，都没有问题，为什么就今天（2025-10-15）出问题了呢？

## 定位问题

### 明确依赖链

运行命令来查询依赖信息：

```bash
pnpm v @dcloudio/uni-h5@3.0.0-4070520250711001
```

首先我全局查询依赖 `@dcloudio/uni-h5@3.0.0-4070520250711001` ，确定该依赖使用了 `vue-router@4.3.0` ，并且锁定主版本，允许安装次级版本。

但是在我刚刚重新安装的依赖内，是安装了 `vue-router@4.6.0` 版本。做出猜测： **会不会是 `vue-router@4.6.0` 版本导致了故障呢？**

![2025-10-15-14-00-40](https://gh-img-store.ruan-cat.com/img/2025-10-15-14-00-40.png)

### 确定依赖发布时间

继续运行命令查询依赖信息：

```bash
pnpm v vue-router
```

如下图所示，`vue-router@4.6.0` 版本是最近 20 小时发布的，所以就验证了为什么之前没出错，而今天却莫名其妙的出错了。所以可以锁定就是 `vue-router@4.6.0` 出现的故障。

![2025-10-15-14-05-26](https://gh-img-store.ruan-cat.com/img/2025-10-15-14-05-26.png)

### 阅读 `vue-router@4.6.0` 版本的更新日志

阅读此[更新日志](https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#460-2025-10-14)，得知 vue-router 在 4.6.0 版本做了重构，而且有可能会出现类型错误和文件未导出的问题。

![2025-10-15-14-13-38](https://gh-img-store.ruan-cat.com/img/2025-10-15-14-13-38.png)

仔细阅读本地安装的依赖，确实发现没有我所期望的文件：

![2025-10-15-14-14-14](https://gh-img-store.ruan-cat.com/img/2025-10-15-14-14-14.png)

所以破案了，是 `vue-router@4.6.0` 用了 tsup 做代码重构，所以导致构建产物名称变化，进而导致缺少文件的错误。

## 修复故障

预期会在 `vue-router@4.6.1` 内得到修复。

## 作为破坏性变更，准备向未来迁移

经过沟通得知，`vue-router/dist/vue-router.esm-bundler.js` 已经属于弃用的配置了，未来就不会提供了。

- 未来不提供 `vue-router.esm-bundler.js` 的导出方式了： https://github.com/vuejs/router/issues/2569#issuecomment-3405172967
- `build: add deprecated vue-router.esm-bundler export`： https://github.com/vuejs/router/commit/9b22edcff3acd9782dd86257b2744c1ae35a455e

## 已发布相关的报障 issue

- https://github.com/vuejs/router/issues/2569

<!--
	TODO: 同步性的在 uniapp 内做出警告，告诉 uniapp 官方，不要继续使用 dist/vue-router.esm-bundler.js 的写法了

	去uni-app仓库提一个PR，把这行代码删了，然后把前因后果在PR里说明白就行
	https://github.com/dcloudio/uni-app/blob/next/packages/vite-plugin-uni/src/configResolved/plugins/resolveId.ts

	然后就可以在简历里面写个“联合vue、uni-app官方解决依赖丢失问题”
	通过此事件，一方面让vue官方不要一股脑直接删除某打包文件，而是先用一个废弃警告来提醒；一方面帮助uni-app解决依赖丢失问题
-->

<!--
	考虑写一个 pr 修改这部分的源码调用
	可以考虑在模板库内提交东西 https://github.com/dcloudio/uni-preset-vue/tree/vite
 -->
