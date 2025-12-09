# 正在开发迭代的小爱丽丝官网

## 需求 1

所有网页布局必须遵从这个简洁的理念

这里有`新闻发布系统`、`插件版本系统`、`文档介绍系统`，跳转的网页也必须像封面这样简单

UI 样式，以及业务需求的核心原型

- http://earphones-official.com/

## 需求理解

这是一个相当简单的网页。不需要很多的跳转功能。目前先考虑从一个完善的 hope 主题中做减法，通过减法实现初步的 demo。

钻头着重强调的是样式和审美问题。页面的内容尽可能偏软一点。采用明亮的背景色。增加较多的圆形。

### 暂定的开发策略

- 构建标准的，泛用的 dev 分支。
- 在 dev 内开一个 theme-hope 分支。
- 实例化初等的 hope 主题内容。
- 确定大部分被删减掉的功能。
- 最后开始考虑样式重构。从 vue 的角度重新捏造侧边栏的样式。

## 当前情况

- [项目仓库](https://github.com/DrillUp/SmallAliceWeb)

## 项目进度

先找一下有哪些 vuepress-theme 主题，满足钻头的 UI 样式，先做技术选型。

### ？基于 CMS 的技术选型？

CMS，内容管理系统。我们还有更好的技术选型么？

### vuepress-theme 主题的技术选型

主题列表

- https://www.npmjs.com/search?q=vuepress-theme
- https://80shuo.com/vuepress-theme/

- vuepress-theme-qblog

  > 仓库 https://github.com/sanqi377/vuepress-theme-qblog
  > demo https://www.qblog.cc/

- vuepress-theme-maker

  > https://github.com/80maker/vuepress-theme-maker
  > demo https://80shuo.com/

- vuepress-theme-ting
  > demo https://chenyating.github.io/

### 选型结果

### 不使用之前提供的项目原型

不使用之前提供的原型，使用钻头直接提供的截图来制作即可。

## 需求 2

界面：

![2024-08-08-11-36-35](https://gh-img-store.ruan-cat.com/img/2024-08-08-11-36-35.jpeg)

## 小爱丽丝移动动效

另外右下角加个小爱丽丝。鼠标接近这个 div，小爱丽丝就往下躲起来，离开 div，小爱丽丝又冒出来。
