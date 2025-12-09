# volar 插件在每次 vscode 工作区内的固定配置

::: warning 已过时

volar 插件现在不需要我们关闭掉 vscode 的 typescript 语言功能了。

:::

- https://cn.vuejs.org/guide/typescript/overview.html#volar-takeover-mode

在 vscode 的插件拓展内，搜索 `@builtin typescript`，在工作区内把插件 `JavaScript 和 TypeScript 的语言功能`关掉。仅需要实现工作区内禁用插件即可。

`vscode.typescript-language-features`

## bug v4.1.2

版本 v4.1.2

出现莫名其妙的组件库丢失类型、

![2023-04-21-18-10-03](https://gh-img-store.ruan-cat.com/img/2023-04-21-18-10-03.png)

`tsconfig.json`的注释出现错误

![2023-04-21-18-11-20](https://gh-img-store.ruan-cat.com/img/2023-04-21-18-11-20.png)

推测是该插件 vue.vscode-typescript-vue-plugin 导致的 bug。

![2023-04-21-18-10-18](https://gh-img-store.ruan-cat.com/img/2023-04-21-18-10-18.png)
