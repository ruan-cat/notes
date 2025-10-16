<!-- 已经pr https://github.com/dcloudio/uni-app/pull/5824 -->
<!-- 重新克隆本地项目 不要浅克隆 需要历史git blame信息的
	git clone --depth=5000 https://github.com/ruan-cat/uni-app.git uni-app__ruan-cat
 -->

# 更改 vue-router 的导入写法，以便适应 vue-router 在未来 v5 版本内，更改文件导出格式所带来的破坏性变更

## 问题背景：为什么要更改？

### vue-router 明确在未来的 v5 版本内不会提供 `dist/vue-router.esm-bundler.js` 导出文件

- 作者在相关 issue 的回复： https://github.com/vuejs/router/issues/2569#issuecomment-3405172967
- 作者的废弃警告： https://github.com/vuejs/router/commit/9b22edcff3acd9782dd86257b2744c1ae35a455e

## 为什么选择在 vue-router v5 版本还没有发版的时候就提前适配？

在特定的 `vue-router@4.6.0` 版本内，就会出现构建故障。

- 流水线失败的案例： https://github.com/nwt-q/001-Smart-Community/actions/runs/18517921823/job/52772087484
- 最小复现案例： https://stackblitz.com/~/github.com/ruan-cat/bug-in-vue-router-4.6.0-with-uniapp?file=package.json

## 不更改会带来什么问题？

### uniapp H5 项目在 `vue-router@4.6.0` 版本下是失败的

- 可复现案例，切换到 `4.6.0` 分支： https://github.com/ruan-cat/bug-in-vue-router-4.6.0-with-uniapp/tree/4.6.0

如下图所示，在依赖关系指定为 `vue-router@4.6.0` 时，是**失败**的。

![2025-10-16-18-28-56](https://gh-img-store.ruan-cat.com/img/2025-10-16-18-28-56.png)

![2025-10-16-18-30-02](https://gh-img-store.ruan-cat.com/img/2025-10-16-18-30-02.png)

### uniapp H5 项目在 `vue-router@4.5.1` 版本下是成功的

- 可复现案例，切换到 `4.5.1` 分支： https://stackblitz.com/~/github.com/ruan-cat/bug-in-vue-router-4.6.0-with-uniapp?file=package.json

如下图所示，在依赖关系指定为 `vue-router@4.5.1` 时，是**成功**的。

![2025-10-16-17-57-29](https://gh-img-store.ruan-cat.com/img/2025-10-16-17-57-29.png)

### uniapp H5 项目在 `vue-router@4.6.3` 版本下是成功的

- 可复现案例，切换到 `4.6.3` 分支： https://github.com/ruan-cat/bug-in-vue-router-4.6.0-with-uniapp/tree/4.6.3

如下图所示，在依赖关系指定为 `vue-router@4.6.3` 时，是**成功**的。

![2025-10-16-18-48-32](https://gh-img-store.ruan-cat.com/img/2025-10-16-18-48-32.png)

![2025-10-16-18-48-43](https://gh-img-store.ruan-cat.com/img/2025-10-16-18-48-43.png)

## 有什么故障先例？

- [`fix(vite-plugin-uni): 修复 pinia v3 版本 访问 dist 报错的bug`](https://github.com/dcloudio/uni-app/pull/5430)

## 模仿 pinia v3 版本的更改先例，提前更改 vue-router v5 版本的导入写法

- 成熟先例： https://github.com/dcloudio/uni-app/commit/3b71fdda2206339629de1985be629804f3535d77

### 预期被修改的文件

- https://github.com/dcloudio/uni-app/blame/next/packages/vite-plugin-uni/src/configResolved/plugins/resolveId.ts

<!-- fix(vite-plugin-uni): 提前适配 vue-router 在未来 v5 版本修改 dist 文件导出的破坏性变更 -->

<!-- pr注意事项 https://github.com/ruan-cat/uni-app/blob/next/.github/CONTRIBUTING.md -->
