# 从 vue 组件生成文档

如何实现写 vue 组件，直接生成文档？

期望实现有效的的文档生成。比如说我使用 vue 的组合式 api，或者是选项式 api。不论在 vue2 还是 vue3，都可以根据 jsdoc 或者是 tsdoc 的格式来自动生成文档。

以下是可能的技术选型，等待逐步学习，调研。

## documentation

- https://github.com/documentationjs/documentation

## vue-styleguidist

- https://github.com/vue-styleguidist/vue-styleguidist

- https://www.cnblogs.com/mfyngu/p/13049965.html

## vuedoc <Badge type="tip" text="优选" />

### 相关仓库

- https://github.com/vuedoc
- https://github.com/vuedoc/md
- https://github.com/vuedoc/parser

### 文档

https://gitlab.com/vuedoc/parser#features

### 评价

感觉有点东西：

- 有专门的配置文件。
- 能识别 jsdoc
- 强制要求 node16，esm 格式。
- 跨度大。vue2.6、vue2.7 和 vue3 的写法均能够覆盖。

### 进度

相关细节[点此](./vuedoc/index.md)。

## vuepress-apidoc <Badge type="info" text="值得商榷" />

- https://gitee.com/DoLaMi/vuepress-apidoc

目前不会直接使用此工具，基于以下缘故：

- 是 gitee 而不是 github，没有足够的反馈

但是本项目的 readme 却提供了很多类似的框架，可以作为一个目录。

## vuepress-jsdoc <Badge type="info" text="值得商榷" />

- https://github.com/ph1p/vuepress-jsdoc

称可以对 javascript、typescript 和 vue 一起做 md 生成。通过阅读源码发现，其 jsdoc 配置了和 babel-jsdoc。很奇怪。

## jsdoc-vuedoc

- https://github.com/ccqgithub/jsdoc-vuedoc

## rollup-plugin-vuedoc

- https://github.com/h-ikeda/rollup-plugin-vuedoc

## libpack <Badge type="danger" text="不考虑" />

- https://github.com/Zenquan/libpack

不考虑。这个更加倾向于作为一个模板。没有看到去生成 doc 的配置。

## vuese <Badge type="danger" text="不考虑" />

- https://github.com/vuese/vuese

- https://juejin.cn/post/6892314449488576520

不能接受。因为要使用其专属的注释语法。不是通用的 jsdoc 语法。

## jsdoc-vue <Badge type="danger" text="不考虑" />

- https://github.com/QingWei-Li/jsdoc-vue

不考虑。这个仓库废弃了。

## jsdoc-vuejs <Badge type="danger" text="不考虑" />

- https://github.com/Kocal/jsdoc-vuejs

- https://zhuanlan.zhihu.com/p/205225678

不能接受。因为要写专有的标签才能识别。

## vite-plugin-vue-docs-2 <Badge type="danger" text="不考虑" />

- https://github.com/meetqy/vite-plugin-vue-docs-2

文档没说清楚怎么使用。在 vite 项目内不敢使用。

## 自动化文档生成的整体进度

截止目前，比较熟悉的文档生成框架是 jsdoc 和 typedoc。

按照数据源来划分，数据源对象可以是：

- .js 文件
- .ts 文件
- .vue 文件

按照注释格式划分，可以被划分为：

- jsdoc
- tsdoc
- 框架自有的格式

按照生成结果划分。可以被划分为：

- html
- md

## 不再跟进考虑

### 人工编写 vitepress 文档代替自动生成文档

现在写 vue3 + typescript 的组件时，只需要定义好 typescript 类型就行。写一个组件就对应写 vitepress 动态展示的 vue 组件文档即可。不需要考虑用什么注释的方式来生成文档了。

### 让 AI 阅读参数并编写文档

没必要自己折腾从 vue 组件内获取数据并渲染了，让 AI 读取组件的参数，生成 markdown 文档就可以了。这样效率更高。
