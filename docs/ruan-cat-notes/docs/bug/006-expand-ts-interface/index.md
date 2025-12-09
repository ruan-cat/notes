# export 类型导致全量导入类型时无法全局识别到

## 需要全局导入的类型

重点关注 ImportMetaEnv 的类型提示效果：

```txt
// vite.config.ts
import "./types/env.shim.d.ts";
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
	const env = loadEnv(mode, process.cwd()) as unknown as ImportMetaEnv;
}
```

```txt
// types/env.shim.d.ts
/// <reference types="vite/client" />
interface ImportMetaEnv {
	/**
	 * 应用端口
	 * @example
	 * "8080"
	 */
	VITE_app_port: `${number}`;

	/**
	 * API 基础路径(代理前缀)
	 * @example
	 * "/dev-api"
	 */
	VITE_proxy_prefix: string;

	/**
	 * API 地址。即接口请求最终的服务器地址。
	 * @example
	 * "https://pcapi-xiaotuxian-front-devtest.itheima.net"
	 */
	VITE_base_url: string;

	/** 是否开启 Mock 服务 */
	VITE_MOCK_DEV_SERVER: `${boolean}`;
}
```

## 成功情况

类型提示可以找到两个接口。符合期望。

::: details 成功情况

![2024-10-24-15-54-00](https://gh-img-store.ruan-cat.com/img/2024-10-24-15-54-00.png)

:::

## 错误情况

类型提示只能索引到 `vite/client` 提供的接口，自己写的接口就找不到了。

::: details 错误的类型导出

```txt
// types/env.shim.d.ts
/// <reference types="vite/client" />
export interface ImportMetaEnv {
	// ...
}
```

:::

::: details 错误情况

![2024-10-24-15-59-11](https://gh-img-store.ruan-cat.com/img/2024-10-24-15-59-11.png)

:::
