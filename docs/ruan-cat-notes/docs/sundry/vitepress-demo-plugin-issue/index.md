# 容器组件的样式从 `按md文件注入` 改成 `全局导入`

## 问题起因

我封装了一个名为 [`@ruan-cat/vitepress-preset-config`](https://vitepress-preset.ruancat6312.top/) 依赖包，用来二次包装 `vitepress-demo-plugin` 库。

在运行项目时，出现以下错误：

![2025-03-21-00-07-51](https://gh-img-store.ruan-cat.com/img/2025-03-21-00-07-51.png)

报错日志如下：

```log
build error:
[vite]: Rollup failed to resolve import "vitepress-demo-plugin/dist/style.css" from "D:/code/github-desktop-store/gh.ruancat.monorepo/tests/monorepo-1/.docs/vip/test-vitepress-demo-plugin/index.md".
This is most likely unintended because it can break your application at runtime.
If you do want to externalize this module explicitly add it to
`build.rollupOptions.external`
[vite]: Rollup failed to resolve import "vitepress-demo-plugin/dist/style.css" from "D:/code/github-desktop-store/gh.ruancat.monorepo/tests/monorepo-1/.docs/vip/test-vitepress-demo-plugin/index.md".
This is most likely unintended because it can break your application at runtime.
If you do want to externalize this module explicitly add it to
`build.rollupOptions.external`
    at viteWarn (file:///D:/code/github-desktop-store/gh.ruancat.monorepo/node_modules/.pnpm/vite@5.4.14_@types+node@22.13.10_less@4.2.2_sass-embedded@1.86.0_sass@1.86.0_terser@5.39.0/node_modules/vite/dist/node/chunks/dep-CHZK6zbr.js:65747:17)
    at onRollupWarning (file:///D:/code/github-desktop-store/gh.ruancat.monorepo/node_modules/.pnpm/vite@5.4.14_@types+node@22.13.10_less@4.2.2_sass-embedded@1.86.0_sass@1.86.0_terser@5.39.0/node_modules/vite/dist/node/chunks/dep-CHZK6zbr.js:65779:5)
    at onwarn (file:///D:/code/github-desktop-store/gh.ruancat.monorepo/node_modules/.pnpm/vite@5.4.14_@types+node@22.13.10_less@4.2.2_sass-embedded@1.86.0_sass@1.86.0_terser@5.39.0/node_modules/vite/dist/node/chunks/dep-CHZK6zbr.js:65442:7)
    at file:///D:/code/github-desktop-store/gh.ruancat.monorepo/node_modules/.pnpm/rollup@4.36.0/node_modules/rollup/dist/es/shared/node-entry.js:20633:13
    at Object.logger [as onLog] (file:///D:/code/github-desktop-store/gh.ruancat.monorepo/node_modules/.pnpm/rollup@4.36.0/node_modules/rollup/dist/es/shared/node-entry.js:22362:9)
    at ModuleLoader.handleInvalidResolvedId (file:///D:/code/github-desktop-store/gh.ruancat.monorepo/node_modules/.pnpm/rollup@4.36.0/node_modules/rollup/dist/es/shared/node-entry.js:21245:26)
    at file:///D:/code/github-desktop-store/gh.ruancat.monorepo/node_modules/.pnpm/rollup@4.36.0/node_modules/rollup/dist/es/shared/node-entry.js:21203:26
 ELIFECYCLE  Command failed with exit code 1.
```

## 临时解决方案

在具体的文档项目内，手动安装 `vitepress-demo-plugin` 库，相当于没有二次封装该库。

## 期望做出的更改

针对[被注入的样式文件](https://vscode.dev/github/zh-lx/vitepress-demo-plugin/blob/main/packages/plugin/src/markdown/preview.ts#L253)：

```txt
injectComponentImportScript(mdFile, "vitepress-demo-plugin/dist/style.css");
```

期望删除该逻辑。样式导入方式改成用户在主题配置内手动导入。类似于下面的写法：

```txt
// .vitepress\theme\index.ts
import { h } from "vue";
import type { Theme, EnhanceAppContext } from "vitepress";
import DefaultTheme from "vitepress/theme";
import "./style.css";

// 手动导入全局样式
import "vitepress-demo-plugin/dist/style.css";
...
```

## 为什么期望改成全局导入样式？

在封装 `@ruan-cat/vitepress-preset-config` 时，我同时封装了很多 [@nolebase](https://nolebase-integrations.ayaka.io/pages/zh-CN/)系列的 vitepress 插件，这些 vitepress 插件的样式在经过二次封装后，依然表现正常。`@nolebase` 系列的插件是用全局导入的方式来导入样式的。

如下代码，以下的 `@nolebase` 插件在二次封装并导出时，是能够正常工作的：

```txt
// .vitepress\theme\index.ts
import { h } from "vue";
import type { Theme, EnhanceAppContext } from "vitepress";
import DefaultTheme from "vitepress/theme";
import "./style.css";

import { NolebaseBreadcrumbs } from "@nolebase/vitepress-plugin-breadcrumbs/client";

import {
	NolebaseEnhancedReadabilitiesMenu,
	NolebaseEnhancedReadabilitiesScreenMenu,

	// https://nolebase-integrations.ayaka.io/pages/zh-CN/integrations/vitepress-plugin-enhanced-readabilities/#如何在-vitepress-中进行配置
	InjectionKey,
	type Options,
	LayoutMode,
} from "@nolebase/vitepress-plugin-enhanced-readabilities/client";
import "@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css";

import { NolebaseHighlightTargetedHeading } from "@nolebase/vitepress-plugin-highlight-targeted-heading/client";
import "@nolebase/vitepress-plugin-highlight-targeted-heading/client/style.css";

import { NolebaseGitChangelogPlugin } from "@nolebase/vitepress-plugin-git-changelog/client";
import "@nolebase/vitepress-plugin-git-changelog/client/style.css";

import TwoslashFloatingVue from "@shikijs/vitepress-twoslash/client";
import "@shikijs/vitepress-twoslash/style.css";

const theme = {
	extends: DefaultTheme,
	Layout: () => {
		return h(DefaultTheme.Layout, null, {
			// https://vitepress.dev/guide/extending-default-theme#layout-slots

			"doc-before": () => h(NolebaseBreadcrumbs),

			"nav-bar-content-after": () => h(NolebaseEnhancedReadabilitiesMenu),
			// 为较窄的屏幕（通常是小于 iPad Mini）添加阅读增强菜单
			"nav-screen-content-after": () => h(NolebaseEnhancedReadabilitiesScreenMenu),

			"layout-top": () => [h(NolebaseHighlightTargetedHeading)],
		});
	},
	enhanceApp({ app, router, siteData }: EnhanceAppContext) {
		app.use(NolebaseGitChangelogPlugin);

		app.use(TwoslashFloatingVue);

		app.provide(InjectionKey, {
			layoutSwitch: {
				defaultMode: LayoutMode["BothWidthAdjustable"],
				pageLayoutMaxWidth: {
					defaultMaxWidth: 85,
				},
				contentLayoutMaxWidth: {
					defaultMaxWidth: 95,
				},
			},
		} as Options);
	},
} satisfies Theme;

export default theme;
```

我想的是，既然 @nolebase 的插件在二次封装后仍旧保留样式，那为什么我们的 vitepress-demo-plugin 不能选择同样的全局导入方式来加载样式呢？
