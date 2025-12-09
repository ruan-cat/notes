# postcss-pxtorem

为了实现响应式。包括 PC 端、数据大屏、移动端

这里大概记录一下使用思路。

## 参考资料

[《Vue 项目自动转换 px 为 rem，高保真还原设计图》](https://juejin.cn/post/6844903557930418189)
[《postcss-pxtorem 插件自动转换 rem 单位的配置》](https://juejin.cn/post/7096367751626752008)
[《vue 配置 以及 postcss-pxtorem 的使用》](https://juejin.cn/post/7088133930674552868)

## 使用 postcss-pxtorem 生产依赖

配置相关的文件。注意忽略掉

### 忽略掉指定的第三方 UI 库？

### 导入的 import 模块化样式没有被更改？

postcss-pxtorem 导入的样式不生效？

目前没有在 bing 内看到相关的内容。

## rem.js

有些文章称单独配置好插件也不行，仍旧需要手写东西实现响应式调整。

rem.js。 手动编写一个响应式字体大小控制代码。实现根标签字体大小的变化。

## vite 项目内配置导入该插件

注意到 vite 本身提供了 postcss，该插件可以以函数形式，显性导入。可读性更好。但是目前不清楚怎么取舍。是用 vite 来配置？还是用 postcss.config.cjs 来配置？

https://blog.csdn.net/m0_54089303/article/details/128100595
