# vue.config.js

## 开发环境的域名变更方案

有时候我们期望开发环境的接口请求更改为本地 `localhost` 的显示，而不是统一配置的后端接口路径值。以下方案展示了如何更改。

### 域名为配置域名的一般写法

`vue.config.js` 的配置

```js
module.exports = {
	devServer: {
		proxy: {
			[process.env.VUE_APP_BASE_API]: {
				target: "http://localhost:8301/",
				changeOrigin: true,
				pathRewrite: {
					["^" + process.env.VUE_APP_BASE_API]: "",
				},
			},
		},
	},
};
```

`axios` 的 `baseURL` 配置，一般为 `process.env.VUE_APP_BASE_API`

```js
const service = axios.create({
	baseURL: process.env.VUE_APP_BASE_API,
});
```

### 域名为自定义路径且为本地 `localhost` 的写法

`vue.config.js` 的配置

```js
module.exports = {
	devServer: {
		proxy: {
			"/rzn-test-api": {
				target: process.env.VUE_APP_BASE_API,
				changeOrigin: true,
				pathRewrite: {
					"^/rzn-test-api": "",
				},
			},
		},
	},
};
```

`axios` 的 `baseURL` 配置，专门设置为特定的路径标识：

```js
const service = axios.create({
	baseURL: "/rzn-test-api",
});
```
