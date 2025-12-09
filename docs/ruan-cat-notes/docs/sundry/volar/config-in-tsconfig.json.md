# 在 tsconfig.json 内配置 volar

volar 毕竟是针对 vue 的语言服务，贴别是 vue3 的语言服务。

在 volar + typescript + vue3 + vscode 的前提下，怎么去配置相关的内容？

## tsconfig.json 的 vueCompilerOptions.plugins 配置？

目前能找到的相关配置如下：

- https://vscode.dev/github/vue-macros/vue2-vue-cli/blob/main/tsconfig.json#L21-L30
- https://vue-macros.sxzz.moe/zh-CN/guide/bundler-integration.html#volar-支持

在 tsconfig.json 的 vueCompilerOptions.plugins 内，还有那些可以用的配置？相关的文档在哪里能找到？

### 可能的配置

- https://vscode.dev/github.com/oku-ui/primitives/blob/main/packages/tsconfig/ts.js

```json
{
	"vueCompilerOptions": {
		"plugins": ["@vue-macros/volar/define-model", "@vue-macros/volar/define-slots"]
	}
}
```
