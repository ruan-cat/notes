# 修复 vue 组件未导出的故障

> 报告者并非英文母语者，以下内容均由翻译软件翻译成英文。

修复由 `bunup/plugins` 的 `copy` 未配置好合适的文件复制路径，而导致的 vue 组件识别失败的错误。

## 复现问题

如以下工作流所示：

- https://github.com/ruan-cat/monorepo/actions/runs/19414221627/job/55540021850

![2025-11-17-20-08-28](https://gh-img-store.ruan-cat.com/img/2025-11-17-20-08-28.png)

相关报错如下：

```log
llmstxt »   vitepress-plugin-llms initialized (client build) with workDir: /home/runner/work/monorepo/monorepo/packages/vercel-deploy-tool/src/docs
@nolebase/vitepress-plugin-git-changelog: Prepare to gather git logs...
llmstxt »   Build started, file collection cleared
@nolebase/vitepress-plugin-git-changelog: Done. (406ms)
x Build failed in 2.67s
✖ building client + server bundles...
build error:
[vite]: Rollup failed to resolve import "vitepress-plugin-llms/vitepress-components/CopyOrDownloadAsMarkdownButtons.vue" from "/home/runner/work/monorepo/monorepo/packages/vitepress-preset-config/src/theme.ts".
This is most likely unintended because it can break your application at runtime.
If you do want to externalize this module explicitly add it to
`build.rollupOptions.external`
[vite]: Rollup failed to resolve import "vitepress-plugin-llms/vitepress-components/CopyOrDownloadAsMarkdownButtons.vue" from "/home/runner/work/monorepo/monorepo/packages/vitepress-preset-config/src/theme.ts".
This is most likely unintended because it can break your application at runtime.
If you do want to externalize this module explicitly add it to
`build.rollupOptions.external`
    at viteWarn (file:///home/runner/work/monorepo/monorepo/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.1_less@4.4.2_sass-embedded@1.93.3_sass@1.94.0/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:65855:17)
    at onRollupWarning (file:///home/runner/work/monorepo/monorepo/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.1_less@4.4.2_sass-embedded@1.93.3_sass@1.94.0/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:65887:5)
    at onwarn (file:///home/runner/work/monorepo/monorepo/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.1_less@4.4.2_sass-embedded@1.93.3_sass@1.94.0/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:65550:7)
    at file:///home/runner/work/monorepo/monorepo/node_modules/.pnpm/rollup@4.53.2/node_modules/rollup/dist/es/shared/node-entry.js:20961:13
    at Object.logger [as onLog] (file:///home/runner/work/monorepo/monorepo/node_modules/.pnpm/rollup@4.53.2/node_modules/rollup/dist/es/shared/node-entry.js:22834:9)
    at ModuleLoader.handleInvalidResolvedId (file:///home/runner/work/monorepo/monorepo/node_modules/.pnpm/rollup@4.53.2/node_modules/rollup/dist/es/shared/node-entry.js:21578:26)
    at file:///home/runner/work/monorepo/monorepo/node_modules/.pnpm/rollup@4.53.2/node_modules/rollup/dist/es/shared/node-entry.js:21536:26
 ELIFECYCLE  Command failed with exit code 1.
Error:  command finished with error: command (/home/runner/work/monorepo/monorepo/packages/vercel-deploy-tool) /home/runner/setup-pnpm/node_modules/.bin/pnpm run build:docs exited (1)
```

`vitepress-plugin-llms/vitepress-components/CopyOrDownloadAsMarkdownButtons.vue` **竟然不存在**。之前的版本是存在该文件的，现在在 `v1.9.2` 版本内出现故障。

## 检查 vue 组件是否正确导出

### 阅读 `v1.9.1` 版本导出的 vue 组件

- https://www.npmjs.com/package/vitepress-plugin-llms/v/1.9.1

![2025-11-17-20-13-19](https://gh-img-store.ruan-cat.com/img/2025-11-17-20-13-19.png)

vue 组件的导出路径在 `/vitepress-plugin-llms/dist/vitepress-components/CopyOrDownloadAsMarkdownButtons.vue` 内，满足期望。

### 阅读 `v1.9.2` 版本导出的 vue 组件

- https://www.npmjs.com/package/vitepress-plugin-llms/v/1.9.2

![2025-11-17-20-13-30](https://gh-img-store.ruan-cat.com/img/2025-11-17-20-13-30.png)

vue 组件的导出路径在 `/vitepress-plugin-llms/dist/CopyOrDownloadAsMarkdownButtons.vue` 内，不满足期望。

可以得知构建的时候没有移动到 `vitepress-components` 文件夹内。

## 修复构建故障

让 `bunup/plugins` 的 `copy` 插件正确的复制到 `vitepress-components` 目录即可。

```ts
// bunup.config.ts
import { defineConfig } from "bunup";
import { copy } from "bunup/plugins";

export default defineConfig({
	entry: ["src/index.ts", "src/vitepress-components/utils.ts"],
	// Generate declaration file (`.d.ts`)
	dts: {
		entry: ["src/index.ts"],
		splitting: true,
	},
	banner: "// Built with bunup (https://bunup.dev)",
	plugins: [copy(["src/vitepress-components/*.vue"]).to("vitepress-components")],
});
```

## 对比修改前后的本地构建结果

### 修改前

![2025-11-17-20-18-54](https://gh-img-store.ruan-cat.com/img/2025-11-17-20-18-54.png)

### 修改后

![2025-11-17-20-19-03](https://gh-img-store.ruan-cat.com/img/2025-11-17-20-19-03.png)
