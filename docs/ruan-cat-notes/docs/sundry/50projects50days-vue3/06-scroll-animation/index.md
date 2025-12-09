---
dir:
  collapsible: false
  link: true
  order: 60
---

# 滚动动画

## 自写重构 demo

<demo vue="./scroll-animation.vue" />

## 文章教程

- https://juejin.cn/post/7263009476058513464#heading-3

## 改写思路

原来的写法，滚动过程会高频次触发函数，性能有损失。需要降低滚动过程中函数的执行次数。

## 拓展

应该找到某些专门用于制作滚动动画的第三方库，学一个简单的滚动动画。

- https://juejin.cn/post/7018850667653496839

## 源码

::: details

<<< ./scroll-animation.vue

:::
