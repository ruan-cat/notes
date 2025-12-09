# vueuse 的 useAxios 使用默认的拦截器行为

## bug 说明

- https://vueuse.pages.dev/integrations/useAxios/

useAxios 允许我们传递 axios 示例，但是其内部的返回值，却是默认返回原值的，我们写的拦截器返回值，生效但是会引发取值失败的错误。

比如下面的拦截器写法， 我们期望 `(res) => res.data` 会实现默认的解包，但是 useAxios 的默认行为总是认定我们没有写任何拦截行为，内部代码总是会做一次取值，取用 data。

```js
// axios 响应拦截器
request.interceptors.response.use(
	// 这里决定了 每一个接口返回值的数据 都默认完成data数据解包。
	(res) => res.data,
	// 其他配置也用 可能出现冲突
	// (res) => res,

	(e) => {
		// 统一响应错误
		const userStore = useUserStore();
		console.warn(" 出现请求错误 错误如下： ", e);
		ElMessage.warning(e.response.data.message);
		// 401token失效处理
		// 1.清除用户数据
		// 2.跳转登录页
		if (e.response.status === 401) {
			userStore.clearUserInfo();
			router.push("/login");
		}
		return Promise.reject(e);
	},
);
```

这个 data 是 AxiosResponse 类型返回的 data。useAxios 默认地帮我们解包了 AxiosResponse 的 data，所以我们使用时，直接使用一层 data 即可。

问题就是出在这样的默认行为，出现 bug 的情况是这样的：

1. useAxios 首先做一次默认的 AxiosResponse 解包，解包了一层 data

2. 然后我们自己写的拦截器也解包了一层 data，期望返回业务数据。

3. 最后到了业务层代码内，useAxios 包装的返回的 ref(data) 就是空值，拿不到期望的数据了。

## 解决方案

目前的临时解决方案时，定义一个全新的，独立的，专用的 axios 实例给 useAxios 使用，不做任何的返回值解包。原样返回。
