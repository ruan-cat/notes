# url 参数处理

用 url 的 searchParams 属性做完善的参数管理

举例如下：

```js
url = "https://juejin.cn/post/7023974792789393439?itemName=jaluik.dot-log&aqa=fucker";
// "https://mp.weixin.qq.com/s?__biz=MzIzNjc1NzUzMw==&mid=2247681317&idx=1&sn=61c8dab00937b7592dab0254b7403bf6";

const targetURL = new URL(url);

console.log(" a ? ", {
	toString: targetURL.toString(),
	searchParams: targetURL.searchParams,
});
targetURL.searchParams.set("Mode", "Work");
console.log(" b ? ", {
	toString: targetURL.toString(),
	searchParams: targetURL.searchParams,
});
```
