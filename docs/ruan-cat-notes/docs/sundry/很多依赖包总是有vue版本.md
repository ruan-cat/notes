# 很多依赖包总是有 vue 版本

这种库总是乱七八糟的。

- swiper swiper-vue
- Highcharts Highcharts-vue
- axios axios-vue
- jsdoc jsdoc-vue
- amap vue-amap
- print print-vue

上述的包名不一定准确。越是这种小小的工具依赖包，越是容易搞出这种额外的 vue 版本

反正我是搞不定这种额外拓展的 vue 版本依赖包了。

## 黑名单警告

TODO: 尝试弄一个可维护的黑名单工具，当项目包含上述依赖时，提出警告，并要求跟换。
