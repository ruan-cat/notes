# axios,接口请求库

## 在设置响应拦截器后，接口返回值怎么做类型声明？

axios 的拦截器，可以更改返回值，一般来说返回值是 AxiosResponse 类型的。

但是拦截器普遍的做法是，直接返回 data。对 AxiosResponse 解包，减少一层的 data。

这样的话，接口返回值也需要同步地做出更改。以下有 2 种方案来实现：

### 强制类型转换方案

以[该仓库](https://github.com/vbenjs/vue-vben-admin)为例：

::: details 响应拦截器解包 data

```txt {5}
client.addResponseInterceptor<HttpResponse>((response) => {
	const { data: responseData, status } = response;
	const { code, data, message: msg } = responseData;
	if (status >= 200 && status < 400 && code === 0) {
		return data;
	}
	throw new Error(msg);
});
```

- https://vscode.dev/github/vbenjs/vue-vben-admin/blob/main/apps/web-ele/src/api/request.ts#L55-L63

:::

用强制类型转换来完成返回值的设置：

::: details 封装通用请求函数并强制类型转换

```txt {11}
class RequestClient {
	/**
	 * 通用的请求方法
	 */
	public async request<T>(url: string, config: AxiosRequestConfig): Promise<T> {
		try {
			const response: AxiosResponse<T> = await this.instance({
				url,
				...config,
			});
			return response as T;
		} catch (error: any) {
			throw error.response ? error.response.data : error;
		}
	}
}
```

- https://vscode.dev/github/vbenjs/vue-vben-admin/blob/main/packages/effects/request/src/request-client/request-client.ts#L218-L231

:::

该方案要求我们封装通用请求函数，并强制类型转换。接口请求函数整体来说就变得比较复杂了。

### 泛型函数传参方案

以[该仓库](https://github.com/youlaitech/vue3-element-admin)为例：

::: details 响应拦截器解包 data

```txt
// 响应拦截器
service.interceptors.response.use(
	(response: AxiosResponse) => {
		// 检查配置的响应类型是否为二进制类型（'blob' 或 'arraybuffer'）, 如果是，直接返回响应对象
		if (response.config.responseType === "blob" || response.config.responseType === "arraybuffer") {
			return response;
		}

		const { code, data, msg } = response.data;
		if (code === ResultEnum.SUCCESS) {
			return data;
		}

		ElMessage.error(msg || "系统出错");
		return Promise.reject(new Error(msg || "Error"));
	},
	(error: any) => {
		// 异常处理
		if (error.response.data) {
			const { code, msg } = error.response.data;
			if (code === ResultEnum.TOKEN_INVALID) {
				ElNotification({
					title: "提示",
					message: "您的会话已过期，请重新登录",
					type: "info",
				});
				useUserStoreHook()
					.resetToken()
					.then(() => {
						location.reload();
					});
			} else {
				ElMessage.error(msg || "系统出错");
			}
		}
		return Promise.reject(error.message);
	},
);
```

- https://vscode.dev/github/youlaitech/vue3-element-admin/blob/master/src/utils/request.ts

:::

在使用的时候，针对第一个泛型参数，直接填值为 any。重点为第二个泛型参数的填写，直接填写我们期望的返回值即可：

::: details 泛型函数传参

```txt {2}
function getPage(queryParams: DictPageQuery) {
	return request<any, PageResult<DictPageVO[]>>({
		url: `${DICT_BASE_URL}/page`,
		method: "get",
		params: queryParams,
	});
}
```

- https://vscode.dev/github/youlaitech/vue3-element-admin/blob/master/src/api/dict.ts

:::

该方案要求我们写较多的 any，可能会带来误导。
