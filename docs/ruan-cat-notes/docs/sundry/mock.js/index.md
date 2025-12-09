# 这是一个很糟糕的库

1. 导入格式要求 require，而不是 import。需要额外注意。
2. 会导致高德地图无法请求地图接口。
3. 会导致 axios 的 responsetype=blob 无效，导致前端无法获取到可以下载的文件流。

## 导入格式有要求

- https://www.cnblogs.com/jvziking/p/11474555.html

至少在 vue2 + js 的环境下，该库导入的方式只能用 require。

稍微看了一下在 vue3+ts+vite 的环境下，本库还要处理默认导出的问题。因为是 js 库，没有类型声明文件。

## responsetype blob 无效

- https://www.cnblogs.com/jdWu-d/p/13410664.html

会导致在 axios 配置的 responsetype=blob 无效，导致前端无法获取到可以下载的文件流。

## 高德地图请求地图失败

- https://juejin.cn/post/7143579664424894472
