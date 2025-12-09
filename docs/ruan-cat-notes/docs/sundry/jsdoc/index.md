## 用 jsdoc 导入 ts 的类型

在 vue 开发中，特别是在 vue2 + js 的项目中，我经常使用 jsdoc 的注释来导入 ts 的类型，配合 tsconfig.json + volar，实现对基础静态类型的导入。

这会产生很多疑难杂症。因为我把 typescript 当成了静态类型解析工具，而不是语言。

### 在 js 内导入不了类型

在 tsconfig.json 内增加 js 文件的识别。

```json
{
	"compilerOptions": {
		// 这一点我不太确定 当还是加上去了
		"allowJs": true,
		"paths": {
			"@/*": ["src/*"]
		}
	},
	"include": [
		// 增加对js文件的识别
		"src/**/*.js",
		"src/**/*.ts",
		"src/**/*.d.ts",
		"src/**/*.tsx",
		"src/**/*.vue"
	]
}
```

### 其他的 js 都可以，就某些 js 不行

移除掉同目录下同名的 ts 文件。
