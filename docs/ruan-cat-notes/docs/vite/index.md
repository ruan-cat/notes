# vite,本地开发环境、打包工具

## 打包错误

- https://juejin.cn/post/7091544102021857288

路由动态模块导入写法需要写成函数

- https://learnku.com/vuejs/t/67885

## vite 使用 node api

```bash
Error: Module "fs" has been externalized for browser compatibility. Cannot access "fs.readdirSync" in client code.  See http://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.
    at Object.get (__vite-browser-external:fs:3:11)
    at traverseDirectory (surveyItemFieldLabelConfStore.ts:28:19)
    at surveyItemFieldLabelConfStore.ts:53:1
```

针对 vite 的边际问题

- https://cn.vitejs.dev/guide/troubleshooting.html#others

一个可能的方案

- https://juejin.cn/post/7145383283038093319

但是自己没空。等以后遇到 vite 开发 node 的东西时，再考虑该配置。

## ReferenceError: \_\_dirname is not defined in ES module scope

- https://github.com/rollup/plugins/pull/1415

## Uncaught TypeError: Function has non-object prototype 'undefined' in instanceof check

- https://github.com/vitejs/vite/discussions/14490

## TypeError: Cannot destructure property 'promises' of 'empty' as it is null

## issue 5370

- https://github.com/vitejs/vite/issues/5370#issuecomment-2667977757

这个情况相当困扰我。在 monorepo 内，vite.config.ts 无法直接导入 ts 文件。这导致我们无法直接使用 ts 来分发配置。

确切来说，是 vite.config.ts 无法读取符号链接。

### tsup 打包

自己学 tsup，把要共享共用的代码，做成 js，供给给 vite.config.ts 使用。

### 写冗余的 ts

每个项目都写同样的代码，引用相对路径的 ts 文件，而不是符号链接对应的 ts。

### --configLoader

近期的解决方案：

- https://github.com/vitejs/vite/issues/5370#issuecomment-2667977757
- https://vite.dev/config/#configuring-vite

我还是倾向于等待 vite 更新，兴许到了后期版本可以完整地解决该问题。

### 已处理

vite 在 6 版本的时候，提供配置参数了。可以解决该问题。

- https://vite.dev/config/#configuring-vite
