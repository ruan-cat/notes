# 和 vue3 结合起来使用

目前不清楚该使用什么好的写法结合使用。看到的几种方式使用起来都差异挺大的。

## 官方 iconify 库

这是当前使用的 iconify 使用方式。

直接使用官方提供的组件库。直接导入组件按需使用。

参考资料

https://docs.iconify.design/icon-components/vue/

### 样式修改

直接写 class 选择器，而不是使用组件的 props 传参。

## 使用已经封装好的 skills 技能来完成对 vue3 项目的 iconify 能力初始化

已经封装好技能了，直接复用即可。

- https://github.com/ruan-cat/monorepo/tree/dev/ai-plugins/dev-skills/skills/init-pure-admin-iconify
