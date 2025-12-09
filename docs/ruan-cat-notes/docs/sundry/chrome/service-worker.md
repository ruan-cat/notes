# service worker 离线应用

## 360 浏览器总是访问旧页面

::: details
针对网址 https://www.ruan-cat.com/，目前 360 浏览器总是使用旧页面

![image-20230420094355415](https://gh-img-store.ruan-cat.com/img/image-20230420094355415.png)
:::

::: details
使用的都是 23 年 1 月 31 号的东西

![image-20230420094427169](https://gh-img-store.ruan-cat.com/img/image-20230420094427169.png)
:::

::: details
根据[参考资料](https://juejin.cn/post/6844904035284156424)，用 chrome://inspect/#service-workers 链接进入，发现当前浏览器存在有 3 个 service-workers 实例

![image-20230420094507143](https://gh-img-store.ruan-cat.com/img/image-20230420094507143.png)
:::

::: details
手动删除 Cache Storage 之后，浏览器不会再请求旧版本的内容了。

![image-20230420095104146](https://gh-img-store.ruan-cat.com/img/image-20230420095104146.png)
:::
