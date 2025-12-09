# 在使用动态路由时，teek 主题无法正常渲染

<!-- issue地址： https://github.com/Kele-Bingtang/vitepress-theme-teek/issues/142 -->

- 可复现案例： https://github.com/ruan-cat/vitepress-theme-teek-bug-when-use-dynamic-routes

复现步骤如下：

## 不使用 teek 主题时的效果

1. 整个侧边栏都是正常的。
2. 全部的几个动态路由，都能正常渲染。右侧的使用自定义组件渲染数据时，也能够正常获取数据。

![2025-09-04-18-11-17](https://gh-img-store.ruan-cat.com/img/2025-09-04-18-11-17.png)

## 开启 teek 主题出现的故障

### 在主题配置内开启 teek 主题

![2025-09-04-18-13-40](https://gh-img-store.ruan-cat.com/img/2025-09-04-18-13-40.png)

### 在文档配置内开启 teek 主题

![2025-09-04-18-14-14](https://gh-img-store.ruan-cat.com/img/2025-09-04-18-14-14.png)

### 故障

侧边栏已经看不到动态路由了。

![2025-09-04-18-15-31](https://gh-img-store.ruan-cat.com/img/2025-09-04-18-15-31.png)

### 配置的路径解析器 `[project].paths.ts` 没有生效

模板被原样渲染。

![2025-09-04-18-16-16](https://gh-img-store.ruan-cat.com/img/2025-09-04-18-16-16.png)
