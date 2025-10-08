<!-- https://github.com/uni-ku/root/issues/29 -->

# 在本仓库的 examples 示例内，因`路径匹配失败`而出现无法自动注册全局的 `<global-ku-root>` 组件的现象，进而导致点击`展示Toast`按钮不生效

针对本仓库，在 examples 内的项目，运行后点击 `展示Toast` 按钮，没有办法显示出预期期望的弹框。

## 最小复现案例

本仓库的 examples 示例项目。

## 运行环境与版本号

- 操作系统： win10 专业版
- 包管理器： pnpm@10.16.1
- node： 22.14.1

## 临时解决方案

去 main.ts 内手动全局注册 `<global-ku-root>` 组件即可。

```ts
// examples\src\main.ts
import { createSSRApp } from "vue";
import App from "./App.vue";
import GlobalKuRoot from "./KuRoot.vue";

export function createApp() {
	const app = createSSRApp(App);
	app.component("global-ku-root", GlobalKuRoot);
	return {
		app,
	};
}
```

### 解决效果

如下图所示，可以看到弹框，且没有控制台报错：

![2025-10-08-14-26-03](https://gh-img-store.ruan-cat.com/img/2025-10-08-14-26-03.png)

## 其他项目内使用该临时解决方案

[unibest](https://github.com/unibest-tech/unibest) 模板同样使用了 `@uni-ku/root` ，比如在 unibest 项目的 main.ts 内手动注册 `<global-ku-root>` 组件，也能解决该故障。

如下图代码所示，手动导入，手动注册：

![2025-10-08-14-29-38](https://gh-img-store.ruan-cat.com/img/2025-10-08-14-29-38.png)

具体代码如下：

```ts
import { VueQueryPlugin } from "@tanstack/vue-query";
import { createSSRApp } from "vue";
import GlobalKuRoot from "./App.ku.vue";
import App from "./App.vue";
import { requestInterceptor } from "./http/interceptor";
import { routeInterceptor } from "./router/interceptor";

import store from "./store";
import "@/style/index.scss";
import "virtual:uno.css";

export function createApp() {
	const app = createSSRApp(App);
	app.use(store);
	app.use(routeInterceptor);
	app.use(requestInterceptor);
	app.use(VueQueryPlugin);

	app.component("global-ku-root", GlobalKuRoot);

	return {
		app,
	};
}
```

### 解决效果

能够打开期望的全局弹框了，如下图所示：

![2025-10-08-14-31-48](https://gh-img-store.ruan-cat.com/img/2025-10-08-14-31-48.png)

1. 能看到期望的全局弹框。
2. 控制台没有出现 `<global-ku-root>` 组件不存在且注册失败的警告报错。

## 长期解决方案

通过和 AI 沟通，得知是`文件匹配失败`的问题。

### 查询故障的提示词

<details>
<summary>
  <strong>(点击展开) 查询故障的提示词</strong>
</summary>

> 以 claude code + GLM4.6 为模型

```txt
在 examples 内的项目，运行后点击【展示Toast】按钮，没有办法显示出预期期望的弹框。请你用谷歌浏览器MCP运行 examples 项目，并点击【展示Toast】按钮，帮我解决按钮无法显示的bug。
请深度思考。解决问题后请为我出示一个报告，告诉我为什么会出现这样的bug？
```

</details>

### AI 给出来的故障分析报告

<details>
<summary>
	<strong>(点击展开) AI 给出来的故障分析报告</strong>
</summary>

问题根本原因和最终解决方案

经过深度调试，我找到了 Toast 显示 Bug 的根本原因：

📋 问题根源分析

你选择的代码段确实是问题所在！ 在 src/index.ts:75-78：

```ts
const filterMain = createFilter(`${rootPath}/main.(ts|js)`);
if (filterMain(id)) {
	ms = await registerKuApp(code, options.rootFileName);
}
```

🔍 具体失败原因

1. 路径格式问题：
   - `createFilter('D:/code/.../src/main.(ts|js)')` 中的正则表达式无法正确匹配具体文件路径
   - Vite 的 createFilter 函数对这种 glob 模式处理存在问题
2. 路径分隔符不一致：
   - 代码中硬编码了 Windows 路径分隔符：`'${process.env.INIT_CWD}\\src'`
   - 但 Vite 内部使用标准化的正斜杠路径
3. 匹配模式错误：
   - 使用 glob 模式 'main.(ts|js)' 不如使用精确路径数组 `['main.ts', 'main.js']`

✅ 最终修复方案

修改了两个关键地方：

1. 路径标准化：

```ts
// 修复前
const rootPath = process.env.UNI_INPUT_DIR || `${process.env.INIT_CWD}\\src`;

// 修复后
const rootPath = normalizePath(process.env.UNI_INPUT_DIR || resolve(process.env.INIT_CWD || process.cwd(), "src"));
```

2. 过滤器模式修复：

```ts
// 修复前
const filterMain = createFilter(`${rootPath}/main.(ts|js)`);

// 修复后
const filterMain = createFilter([`${rootPath}/main.ts`, `${rootPath}/main.js`]);
```

3. 正则表达式全局标志：

```ts
// 修复前
const rootTagNameRE = /<(KuRootView|ku-root-view)(?:\s*\/>|><\/\1>)/;

// 修复后
const rootTagNameRE = /<(KuRootView|ku-root-view)(?:\s*\/>|><\/\1>)/g;
```

🏆 修复结果

现在 `@uni-ku/root` 插件能够：

- ✅ 自动识别和匹配 main.ts 文件
- ✅ 自动注册 global-ku-root 组件
- ✅ 自动转换 KuRoot.vue 中的`<KuRootView />`为`<slot />`
- ✅ Toast 功能完全正常工作
- ✅ 无需手动修改任何项目代码

这个 Bug 是一个典型的 Vite 插件开发中的路径匹配问题，通过 Chrome DevTools
MCP 的深度调试，我们成功定位并解决了根本原因！ 🎉

</details>

## 是否愿意 pr？

目前我不清楚你是否能够认同并接受 AI 提供的解决方案，所以本 issue 仅负责说明存在`路径匹配失败`的情况，还需要你自己斟酌是否要用 normalizePath 或者是其他匹配写法的方式解决此故障。

故暂时不考虑 pr。
