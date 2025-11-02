# uniapp,基于 vue 的跨端 app 开发框架

我知道是 shit，但也要赤石。

## 了解在 vue3 场景下如何使用 uniapp

现在是 25 年 4 月，需要看看社区内有没有成熟的框架。

- unibest 框架文档：https://unibest.tech/base/2-start
- wot-design-uni 组件库： https://wot-ui.cn/guide/quick-use.html

## 挑选合适的学习模板

准备选定一个合适的项目模板。未来遇到 uniapp 的具体业务项目模板时，以选定的基础模板作为基架，用 AI 工具逐步迁移生成项目。

- https://github.com/uni-helper/vitesse-uni-app
- https://github.com/unibest-tech/unibest

## 初始化基于 vite 的项目

- https://uniapp.dcloud.net.cn/quickstart-cli.html
- https://github.com/dcloudio/uni-preset-vue/tree/vite

官网初始化模板命令：

注意官方模板用的是 `vite` 分支的内容，并不是主分支的内容。

```bash
npx degit dcloudio/uni-preset-vue#vite-ts my-vue3-project
```

## 担忧

看了很多关于 uniapp 的坑。需要先提前了解 uniapp 有哪些显著的坑。

### 还能升级 pinia 到最新版么？

- https://github.com/dcloudio/uni-app/issues/4350

不清楚现在最新版本的 uniapp 能否升级 pinia 到最新版本。按照 issue 的说法，看起来最新版的 uniapp 可以升级最新版。

### slot 插槽组件还能继续使用 v-if 来实现动态渲染么？

- https://github.com/dcloudio/uni-app/issues/4755
- [`为什么在微信小程序上使用Popup、ActionSheet、DropDownItem等弹出框组件包裹Slider、Tabs等组件时，Slider、Tabs表现异常？`][(https://wot-ui.cn/guide/common-problems.html#为什么在微信小程序上使用 popup、actionsheet、dropdownitem 等弹出框组件包裹 slider、tabs 等组件时-slider、tabs 表现异常](https://wot-ui.cn/guide/common-problems.html#%E4%B8%BA%E4%BB%80%E4%B9%88%E5%9C%A8%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F%E4%B8%8A%E4%BD%BF%E7%94%A8popup%E3%80%81actionsheet%E3%80%81dropdownitem%E7%AD%89%E5%BC%B9%E5%87%BA%E6%A1%86%E7%BB%84%E4%BB%B6%E5%8C%85%E8%A3%B9slider%E3%80%81tabs%E7%AD%89%E7%BB%84%E4%BB%B6%E6%97%B6-slider%E3%80%81tabs%E8%A1%A8%E7%8E%B0%E5%BC%82%E5%B8%B8)

### 用不了高版本的 vueuse 么？

- https://github.com/dcloudio/uni-app/issues/4604
- https://uni-helper.js.org/uni-use/guide/installation

我看文章，说要自己弄垫片处理。看起来很麻烦。

## 各种疑问

### uniapp 新建页面时，可以新建为小写的 index.vue 么？ 页面文件命名为大写 Index.vue 有什么要求么？

![2025-09-17-08-49-03](https://gh-img-store.ruan-cat.com/img/2025-09-17-08-49-03.png)

可以，没有要求这个是模板自带的只要在 page.json 中声明好就 ok

只要 page.json 路由配置内写好该文件路径就行了？

## 学习 uniapp 的核心概念？

TODO: 学习 uniapp ，我需要掌握那些核心概念？

- tabBar
