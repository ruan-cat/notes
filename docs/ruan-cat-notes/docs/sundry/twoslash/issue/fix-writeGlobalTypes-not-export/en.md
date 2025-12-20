# Fix build failure caused by removal of writeGlobalTypes function in `@vue/language-core@3.2.0`

> [!NOTE] Non-native English speaker
> The reporter is not a native English speaker. The following content has been translated using translation tools.

> [!TIP] Summary
> In the latest release of `@vue/language-core@3.2.0`, the `writeGlobalTypes` function was removed. Since `twoslash-vue` still imports and uses the `writeGlobalTypes` function from the `@vue/language-core` package, this causes VitePress projects to fail during build when the newer version is installed.
> We should refactor the code in `packages\twoslash-vue\src\index.ts` to avoid using the `writeGlobalTypes` function directly.

## Root Cause

### Error Example 1

- Failing workflow: https://github.com/ruan-cat/monorepo/actions/runs/20395605438/job/58610671289

Error screenshot:

![2025-12-20-23-34-53](https://gh-img-store.ruan-cat.com/img/2025-12-20-23-34-53.png)

Key error log:

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
 ELIFECYCLE  Command failed with exit code 1.
```

### Error Example 2

- Failing workflow: https://github.com/ruan-cat/monorepo/actions/runs/20395605438/job/58610671289

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
 ELIFECYCLE  Command failed with exit code 1.
```

## Issue Analysis

### `@vue/language-core` just released version `v3.2.0`

- Release notes: https://github.com/vuejs/language-tools/releases/tag/v3.2.0

![2025-12-20-23-40-22](https://gh-img-store.ruan-cat.com/img/2025-12-20-23-40-22.png)

### This version merged PR #5872 which removed the writeGlobalTypes export

This version merged [PR #5872](https://github.com/vuejs/language-tools/pull/5872).

![2025-12-20-23-42-22](https://gh-img-store.ruan-cat.com/img/2025-12-20-23-42-22.png)

According to [PR #5872](https://github.com/vuejs/language-tools/pull/5872), `writeGlobalTypes` is no longer available.

![2025-12-20-23-43-48](https://gh-img-store.ruan-cat.com/img/2025-12-20-23-43-48.png)

### `twoslash-vue` still directly uses the writeGlobalTypes function

Relevant code in `packages\twoslash-vue\src\index.ts`:

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

## Willing to submit a PR?

Yes, I will provide a PR to fix this issue soon.
