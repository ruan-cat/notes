<!--
	pr https://github.com/okineadev/vitepress-plugin-llms/pull/104
	issue https://github.com/okineadev/vitepress-plugin-llms/issues/103
 -->

# Fix Vue Component Export Issue

> Note: The reporter is not a native English speaker. This document has been translated for clarity.

## Summary

This PR fixes an error where Vue components failed to be recognized due to improper file copy path configuration in `bunup/plugins`'s `copy` plugin.

## Problem Description

The build process was failing because Vue components were not being copied to the correct directory during the build, resulting in unresolved import errors.

## Reproduction

As demonstrated in the following workflow run:

- https://github.com/ruan-cat/monorepo/actions/runs/19414221627/job/55540021850

![2025-11-17-20-08-28](https://gh-img-store.ruan-cat.com/img/2025-11-17-20-08-28.png)

The relevant error log:

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
 ELIFECYCLE  Command failed with exit code 1.
Error:  command finished with error: command (/home/runner/work/monorepo/monorepo/packages/vercel-deploy-tool) /home/runner/setup-pnpm/node_modules/.bin/pnpm run build:docs exited (1)
```

The import path `vitepress-plugin-llms/vitepress-components/CopyOrDownloadAsMarkdownButtons.vue` **does not exist**. This file existed in previous versions but broke in version `v1.9.2`.

## Root Cause Analysis

### Checking Vue Component Exports

#### Version 1.9.1 (Working)

- NPM Package: https://www.npmjs.com/package/vitepress-plugin-llms/v/1.9.1

![2025-11-17-20-13-19](https://gh-img-store.ruan-cat.com/img/2025-11-17-20-13-19.png)

The Vue component export path is `/vitepress-plugin-llms/dist/vitepress-components/CopyOrDownloadAsMarkdownButtons.vue`, which matches the expected path.

#### Version 1.9.2 (Broken)

- NPM Package: https://www.npmjs.com/package/vitepress-plugin-llms/v/1.9.2

![2025-11-17-20-13-30](https://gh-img-store.ruan-cat.com/img/2025-11-17-20-13-30.png)

The Vue component export path is `/vitepress-plugin-llms/dist/CopyOrDownloadAsMarkdownButtons.vue`, which does NOT match the expected path.

**Diagnosis**: During the build process, the Vue components are not being moved into the `vitepress-components` folder as expected.

## Solution

Fix the `bunup/plugins` `copy` plugin configuration to correctly copy files to the `vitepress-components` directory.

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

## Verification

### Before Fix

![2025-11-17-20-18-54](https://gh-img-store.ruan-cat.com/img/2025-11-17-20-18-54.png)

Vue components are incorrectly placed in the `dist` root directory.

### After Fix

![2025-11-17-20-19-03](https://gh-img-store.ruan-cat.com/img/2025-11-17-20-19-03.png)

Vue components are correctly placed in the `dist/vitepress-components` directory.
