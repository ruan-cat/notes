# 遇到布局组件的热更新失效

vue 自动化路由布局插件，在 vite6 内不能 HMR，热更新。

## 更换插件即可

将不能热更新的 [vite-plugin-vue-layouts](https://github.com/JohnCampionJr/vite-plugin-vue-layouts) 换成 [vite-plugin-vue-meta-layouts](https://github.com/dishait/vite-plugin-vue-meta-layouts) 即可。
