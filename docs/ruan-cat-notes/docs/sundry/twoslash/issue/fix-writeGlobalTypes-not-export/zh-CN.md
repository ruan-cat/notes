# 处理因 `@vue/language-core@3.2.0` 移除 writeGlobalTypes 函数而导致的故障

> [!NOTE] 非英语母语报告者
> 报告者并不是**以英文为母语**的用户，以下内容均使用翻译软件翻译。

> [!TIP] 摘要
> 在最新发布的 `@vue/language-core@3.2.0` 包内，移除了 `writeGlobalTypes` 函数，由于 `twoslash-vue` 仍旧在使用来自 `@vue/language-core` 包导出的 `writeGlobalTypes` 函数，故导致在安装高版本依赖的时候，`vitepress` 项目构建失败。
> 我们应该在 `packages\twoslash-vue\src\index.ts` 文件内，重构代码，避免再直接使用 `writeGlobalTypes` 函数了。

## 问题起因

### 错误例子 1

- 出现故障的工作流： https://github.com/ruan-cat/monorepo/actions/runs/20395605438/job/58610671289

错误截图：

![2025-12-20-23-34-53](https://gh-img-store.ruan-cat.com/img/2025-12-20-23-34-53.png)

关键报错日志：

```log
vitepress build src/docs

failed to load config from /home/runner/work/monorepo/monorepo/packages/vitepress-preset-config/src/docs/.vitepress/config.mts
build error:
Named export 'writeGlobalTypes' not found. The requested module '@vue/language-core' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from '@vue/language-core';
const { defaultMapperFactory, CompilerOptionsResolver, writeGlobalTypes, createVueLanguagePlugin, createLanguage, FileMap } = pkg;

file:///home/runner/work/monorepo/monorepo/node_modules/.pnpm/twoslash-vue@0.3.4_typescript@5.9.3/node_modules/twoslash-vue/dist/index.mjs:1
import { defaultMapperFactory, CompilerOptionsResolver, writeGlobalTypes, createVueLanguagePlugin, createLanguage, FileMap } from '@vue/language-core';
                                                        ^^^^^^^^^^^^^^^^
SyntaxError: Named export 'writeGlobalTypes' not found. The requested module '@vue/language-core' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from '@vue/language-core';
const { defaultMapperFactory, CompilerOptionsResolver, writeGlobalTypes, createVueLanguagePlugin, createLanguage, FileMap } = pkg;

    at ModuleJob._instantiate (node:internal/modules/esm/module_job:180:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:263:5)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:578:26)
    at async loadConfigFromBundledFile (file:///home/runner/work/monorepo/monorepo/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.3_less@4.5.1_sass-embedded@1.97.1_sass@1.97.1/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:66975:15)
    at async loadConfigFromFile (file:///home/runner/work/monorepo/monorepo/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.3_less@4.5.1_sass-embedded@1.97.1_sass@1.97.1/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:66816:24)
    at async resolveUserConfig (file:///home/runner/work/monorepo/monorepo/node_modules/.pnpm/vitepress@1.6.4_@algolia+client-search@5.46.1_@types+node@22.19.3_async-validator@4.2.5_502abf0f22706814b61ba7105cc59174/node_modules/vitepress/dist/node/chunk-D3CUZ4fa.js:17502:27)
    at async resolveConfig (file:///home/runner/work/monorepo/monorepo/node_modules/.pnpm/vitepress@1.6.4_@algolia+client-search@5.46.1_@types+node@22.19.3_async-validator@4.2.5_502abf0f22706814b61ba7105cc59174/node_modules/vitepress/dist/node/chunk-D3CUZ4fa.js:17422:48)
    at async build (file:///home/runner/work/monorepo/monorepo/node_modules/.pnpm/vitepress@1.6.4_@algolia+client-search@5.46.1_@types+node@22.19.3_async-validator@4.2.5_502abf0f22706814b61ba7105cc59174/node_modules/vitepress/dist/node/chunk-D3CUZ4fa.js:49562:22)
 ELIFECYCLE  Command failed with exit code 1.
```

### 错误例子 2

- 出现故障的工作流： https://github.com/ruan-cat/monorepo/actions/runs/20395605438/job/58610671289

![2025-12-20-23-50-22](https://gh-img-store.ruan-cat.com/img/2025-12-20-23-50-22.png)

```log
vitepress build docs

failed to load config from /home/runner/work/notes/notes/docs/docs-01-star/docs/.vitepress/config.mts
build error:
Named export 'writeGlobalTypes' not found. The requested module '@vue/language-core' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from '@vue/language-core';
const { defaultMapperFactory, CompilerOptionsResolver, writeGlobalTypes, createVueLanguagePlugin, createLanguage, FileMap } = pkg;

file:///home/runner/work/notes/notes/node_modules/.pnpm/twoslash-vue@0.3.4_typescript@5.9.3/node_modules/twoslash-vue/dist/index.mjs:1
import { defaultMapperFactory, CompilerOptionsResolver, writeGlobalTypes, createVueLanguagePlugin, createLanguage, FileMap } from '@vue/language-core';
                                                        ^^^^^^^^^^^^^^^^
SyntaxError: Named export 'writeGlobalTypes' not found. The requested module '@vue/language-core' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from '@vue/language-core';
const { defaultMapperFactory, CompilerOptionsResolver, writeGlobalTypes, createVueLanguagePlugin, createLanguage, FileMap } = pkg;

    at ModuleJob._instantiate (node:internal/modules/esm/module_job:180:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:263:5)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:578:26)
    at async loadConfigFromBundledFile (file:///home/runner/work/notes/notes/node_modules/.pnpm/vite@5.4.21_@types+node@24.10.4_less@4.5.1_sass@1.97.1/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:66975:15)
    at async loadConfigFromFile (file:///home/runner/work/notes/notes/node_modules/.pnpm/vite@5.4.21_@types+node@24.10.4_less@4.5.1_sass@1.97.1/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:66816:24)
    at async resolveUserConfig (file:///home/runner/work/notes/notes/node_modules/.pnpm/vitepress@1.6.4_@algolia+client-search@5.46.1_@types+node@24.10.4_async-validator@4.2.5_35cad79346f67e7f109385d54123aa58/node_modules/vitepress/dist/node/chunk-D3CUZ4fa.js:17502:27)
    at async resolveConfig (file:///home/runner/work/notes/notes/node_modules/.pnpm/vitepress@1.6.4_@algolia+client-search@5.46.1_@types+node@24.10.4_async-validator@4.2.5_35cad79346f67e7f109385d54123aa58/node_modules/vitepress/dist/node/chunk-D3CUZ4fa.js:17422:48)
    at async build (file:///home/runner/work/notes/notes/node_modules/.pnpm/vitepress@1.6.4_@algolia+client-search@5.46.1_@types+node@24.10.4_async-validator@4.2.5_35cad79346f67e7f109385d54123aa58/node_modules/vitepress/dist/node/chunk-D3CUZ4fa.js:49562:22)
 ELIFECYCLE  Command failed with exit code 1.
```

## 问题定位

### `@vue/language-core` 包在最近刚刚发布了 `v3.2.0` 版本

- releases： https://github.com/vuejs/language-tools/releases/tag/v3.2.0

![2025-12-20-23-40-22](https://gh-img-store.ruan-cat.com/img/2025-12-20-23-40-22.png)

### 该版本合并了 5872 pr，该 pr 删除了 writeGlobalTypes 函数的导出

该版本合并了 [5872 pr](https://github.com/vuejs/language-tools/pull/5872)。

![2025-12-20-23-42-22](https://gh-img-store.ruan-cat.com/img/2025-12-20-23-42-22.png)

根据 [5872](https://github.com/vuejs/language-tools/pull/5872) 的说明，`writeGlobalTypes` 不再提供了。

![2025-12-20-23-43-48](https://gh-img-store.ruan-cat.com/img/2025-12-20-23-43-48.png)

### 在 `twoslash-vue` 内仍旧在直接使用 writeGlobalTypes 函数

在 `packages\twoslash-vue\src\index.ts` 内的关键使用代码：

```ts
import { writeGlobalTypes } from "@vue/language-core";
function getLanguage() {
	const resolver = new CompilerOptionsResolver(ts.sys.fileExists);
	resolver.addConfig(vueCompilerOptions, ts.sys.getCurrentDirectory());
	const vueOptions = resolver.build();
	writeGlobalTypes(vueOptions, ts.sys.writeFile);
	const vueLanguagePlugin = createVueLanguagePlugin<string>(ts, compilerOptions, vueOptions, (id) => id);
	return createLanguage(
		[vueLanguagePlugin],
		new FileMap(ts.sys.useCaseSensitiveFileNames) as unknown as Map<string, SourceScript<string>>,
		() => {},
	);
}
```
