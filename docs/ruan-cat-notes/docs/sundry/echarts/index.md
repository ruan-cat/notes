# echarts

## 在新的场景下使用 echarts 图表库

看了几篇文章，至少能遇到以下的这几种问题：

- 获取合适的 echart 类型？
- 用 ref 来获取 dom 并实现初始化？
- 图表 option 字段过多，解除 vue 的响应式？

## echarts + typescript + vue3

一些参考资料：

- https://blog.csdn.net/huangfengnt/article/details/124846246
- https://juejin.cn/post/7066817168335175688

## 用 vue 组合式 api

这里重点考虑的用 ref 来实现初始化图表。

## 尝试在 vue2.7 + 组合式 api + jsdoc + typescript（类型） 的方案实现初始化

```js
/** @see https://echarts.apache.org/handbook/zh/basics/release-note/v5-upgrade-guide/#引用-echarts */
import * as echarts from "docs/ruan-cat-notes/docs/sundry/echarts/echarts";

/** @type { Ref<HTMLElement | undefined> } 获取dom元素 */
const chartRef = ref();

/** @type { Ref<import("docs/ruan-cat-notes/docs/sundry/echarts/echarts").EChartsType | null> } chart图表实例 */
const chartInstance = ref(null);

/** @type { import("docs/ruan-cat-notes/docs/sundry/echarts/echarts").EChartsOption } */
const chartOpions = {};

onMounted(() => {
	// 在获取到dom时，初始化实例
	chartInstance.value = echarts.init(chartRef.value);

	// 设置值
	chartInstance.value.setOption(chartOpions);
});
```
