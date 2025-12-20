# 以`#snipaste{ts twoslash}`的方式导入代码块时，twoslash 称找不到文件

我现在在 vitepress 内以 `<<< path.ts#snipaste{ts twoslash}` 的方式来使用 @shikijs/vitepress-twoslash 包。对于大多数例子来说，twoslash 是可以正常的读取到 ts 文件的。但是仍有部分导入是识别不出来的，这令人困惑。

## 成功例子 1

比如以下例子是成功的：

```ts
/**
 * apifox 生成的标准返回值对象
 * @description
 * 接口请求的标准返回值对象 接口的返回值均满足该对象
 */
export interface ApifoxModel<T> {
	/**
	 * 业务状态码, 1成功, 其他失败
	 */
	code: string;
	/**
	 * 响应消息
	 */
	msg: string;
	/**
	 * 响应结果
	 */
	result: T;
}
```

以下 md 写法在 vitepress 内是正常可用的：

```markdown
<<< ./tests/types/ApifoxModel.ts#snipaste{ts twoslash}
```

如图所示，twoslash 正常工作了：

![2025-03-18-22-42-43](https://gh-img-store.ruan-cat.com/img/2025-03-18-22-42-43.png)

## 成功例子 2

在本例子中，我二次包装了 axios。

```txt
import axios from "axios";
import qs from "qs";

/**
 * 创建axios实例
 * @description
 * 从商城项目内获取得来
 *
 * @see https://apifox.com/apidoc/shared-c05cb8d7-e591-4d9c-aff8-11065a0ec1de/api-67132167
 */
export function createAxiosInstance() {
	const instance = axios.create({
		baseURL: "https://pcapi-xiaotuxian-front-devtest.itheima.net",

		/** 请求超时时间 */
		timeout: 10000,

		/** 允许跨域 */
		withCredentials: true,

		/**
		 * 在 vitest 内做接口请求时，会使用node环境内的环境变量
		 * 比如 HTTPS_PROXY 变量。这里设置为false，不使用代理。
		 */
		proxy: false,
	});

	// 使用qs序列化参数params参数
	instance.defaults.paramsSerializer = function (params) {
		return qs.stringify(params);
	};

	return instance;
}
```

md 写法也是类似的，如下：

```markdown
<<< ./tests/createAxiosInstance.ts#snipaste{ts twoslash}
```

如图所示，twoslash 也是正常工作了：

![2025-03-18-22-41-28](https://gh-img-store.ruan-cat.com/img/2025-03-18-22-41-28.png)

## 失败例子

当我尝试导入这两个工具时，就出现错误了。

具体代码：

```txt
import type { ApifoxModel } from "./types/ApifoxModel";
import { createAxiosInstance } from "./createAxiosInstance";
/**
 * 接口请求时用的请求实例
 */
const projectRequestInstance = createAxiosInstance();
```

在 vitepress 内显示代码：

```markdown
<<< ./tests/projectRequest.ts#snipaste{ts twoslash}
```

报错如下：

```txt
> vitepress build


  vitepress v1.6.3

⠹ building client + server bundles...

--------
Twoslash error in code:
--------
import type { ApifoxModel } from "./types/ApifoxModel";
import { createAxiosInstance } from "./createAxiosInstance";

/**
 * 接口请求时用的请求实例
 */
const projectRequestInstance = createAxiosInstance();
--------

x Build failed in 768ms
✖ building client + server bundles...
build error:
[vitepress]
## Errors were thrown in the sample, but not included in an error tag

These errors were not marked as being expected: 2307.
Expected: // @errors: 2307

Compiler Errors:

index.ts
  [2307] 33 - Cannot find module './types/ApifoxModel' or its corresponding type declarations.
  [2307] 92 - Cannot find module './createAxiosInstance' or its corresponding type declarations.
file: D:/code/tests/2025-3-18-001/index.md
[vitepress]
## Errors were thrown in the sample, but not included in an error tag

These errors were not marked as being expected: 2307.
Expected: // @errors: 2307

Compiler Errors:

index.ts
  [2307] 33 - Cannot find module './types/ApifoxModel' or its corresponding type declarations.
  [2307] 92 - Cannot find module './createAxiosInstance' or its corresponding type declarations.
file: D:/code/tests/2025-3-18-001/index.md
    at validateCodeForErrors (file:///D:/code/tests/2025-3-18-001/node_modules/.pnpm/twoslash@0.3.1_typescript@5.8.2/node_modules/twoslash/dist/core.mjs:40:20)
    at twoslasher2 (file:///D:/code/tests/2025-3-18-001/node_modules/.pnpm/twoslash@0.3.1_typescript@5.8.2/node_modules/twoslash/dist/core.mjs:345:7)
    at twoslasher (file:///D:/code/tests/2025-3-18-001/node_modules/.pnpm/twoslash-vue@0.3.1_typescript@5.8.2/node_modules/twoslash-vue/dist/index.mjs:34:14)
    at Object.preprocess (file:///D:/code/tests/2025-3-18-001/node_modules/.pnpm/@shikijs+twoslash@3.2.1_typescript@5.8.2/node_modules/@shikijs/twoslash/dist/core.mjs:1130:30)
    at Object.preprocess (file:///D:/code/tests/2025-3-18-001/node_modules/.pnpm/@shikijs+vitepress-twoslash@3.2.1_typescript@5.8.2/node_modules/@shikijs/vitepress-twoslash/dist/index.mjs:226:34)
    at codeToHast (file:///D:/code/tests/2025-3-18-001/node_modules/.pnpm/@shikijs+core@2.5.0/node_modules/@shikijs/core/dist/index.mjs:1179:37)
    at codeToHtml (file:///D:/code/tests/2025-3-18-001/node_modules/.pnpm/@shikijs+core@2.5.0/node_modules/@shikijs/core/dist/index.mjs:1414:23)
    at Object.codeToHtml (file:///D:/code/tests/2025-3-18-001/node_modules/.pnpm/@shikijs+core@2.5.0/node_modules/@shikijs/core/dist/index.mjs:1844:37)
    at Object.highlight (file:///D:/code/tests/2025-3-18-001/node_modules/.pnpm/vitepress@1.6.3_@algolia+client-search@5.21.0_axios@1.8.3_postcss@8.5.3_search-insights@2.17.3_typescript@5.8.2/node_modules/vitepress/dist/node/chunk-Zsoi3j4v.js:35377:39)
    at default_rules.fence (file:///D:/code/tests/2025-3-18-001/node_modules/.pnpm/vitepress@1.6.3_@algolia+client-search@5.21.0_axios@1.8.3_postcss@8.5.3_search-insights@2.17.3_typescript@5.8.2/node_modules/vitepress/dist/node/chunk-Zsoi3j4v.js:24984:27)
 ELIFECYCLE  Command failed with exit code 1.
```

报错截图如下：

![2025-03-18-22-45-21](https://gh-img-store.ruan-cat.com/img/2025-03-18-22-45-21.png)

不理解为什么导入两个成功的例子后，会报错。
