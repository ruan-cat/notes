# volar vscode 针对 vue3 生态链的语言服务器插件

## volar 对 vue2.7 的类型支持不完善

我仍旧有很多项目停留在 vue2.7 版本内，需要使用合适的配置，让 volar 给予 vue2.7 项目最好的类型推断支持。

## 2.0

更新日志：

- https://github.com/vuejs/language-tools/blob/master/CHANGELOG.md#200-202432

### 准备弃用 Takeover 模式，弃用额外的 vue typescript 插件

相关 pr：

- https://github.com/vuejs/language-tools/pull/3788
- https://github.com/vuejs/language-tools/pull/3788#issuecomment-1933274154

Vue.vscode-typescript-vue-plugin 这个插件被 2.0 版本的插件说不需要安装了。

当内部 TypeScript 扩展被禁用或安装了“TypeScript Vue 插件”扩展时发出警告。

今天（2024 年 3 月 2 日）的 volar 更新，说【TypeScript Vue Plugin】已经不需要使用了。

![2024-03-02-12-53-43](https://gh-img-store.ruan-cat.com/img/2024-03-02-12-53-43.png)

Volar Takeover 已经不需要使用了，但是中文文档还没有及时更新。

![2024-03-02-12-53-55](https://gh-img-store.ruan-cat.com/img/2024-03-02-12-53-55.png)

TypeScript Vue Plugin 的文档也还没有及时同步最新的更改。

![2024-03-02-12-54-10](https://gh-img-store.ruan-cat.com/img/2024-03-02-12-54-10.png)
