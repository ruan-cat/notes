# vuepress,文档渲染框架

::: danger

我已经全面使用 vitepress 或者是 nuxt 来搭建文档库了，不再继续使用 vuepress 了。

告别 vuepress 很久了。

:::

## 功能细节优化

- https://notes.youngkbt.cn/about/website/introduce/

参照这个链接内的教程配置。逐步地优化网站的交互效果。

## 开发自己的插件，实现标题序号自动生成

如图，期望菜单可以增加序号功能：

![2023-11-21-17-01-57](https://s2.loli.net/2023/11/21/DuqhNH9tv5pVfZM.png)

比如：

```text
1. 菜单1
 1.1. 某菜单
 1.2. 某菜单
 1.2.1 某菜单
2. 菜单2
```

- 为侧边栏提供序号。
- 为每一个标题栏提供序号。即 h1,h2,h3,h4,h5,h6 提供前缀序号。

### 已完成

该愿望单在 2023-11-21 添加，大约在 2024-09-23 左右完成。

用 css 的手段实现侧边栏添加标题序号，而不是开发 vuepress 插件。

## 当前进度

全面使用了 hope 主题。实现了大多数的常见业务。目前网站似乎找不到什么需要实现的业务了。

## 主内容设置的更宽

注意到这个项目：这个博客网站的宽度更加合适。更加适合大屏显示。

- http://magical-time-space.gitee.io/my-blog/

需要配置的内容：

- https://vuepress-theme-hope.github.io/v2/zh/cookbook/customize/layout.html#主题断点
- https://vuepress-theme-hope.github.io/v2/zh/config/theme/appearance.html#pcbreakpoint

### 不再考虑

如果使用大屏预览，那么显示效果很差的。不考虑该需求。
