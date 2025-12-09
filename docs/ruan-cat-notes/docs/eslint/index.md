# eslint

尽管我清楚 eslint 和 prettier 相互打架，但还是要面对他。必须要面对 eslint 这个困难。

## 系统性的学习策略

值得注意的是，用 @antfu/eslint-config 去配置 eslint 时，其配置风格完全割裂了，完全不像是之前学习的 eslint 配置。

这种感觉就类似于 vue2 突然切换到 vue3 这样。

以后学习 eslint 配置时，自己要意识到什么是旧版配置，什么是新版配置。新旧版本配置如何迁移切换？

在前端工程化的大方向上，学习 eslint。

## git 提交时的自动格式化配置

在观察别人的后台管理项目时，可以在`package.json`内看到类似的配置：

```json
{
	"husky": {
		"hooks": {
			"pre-commit": "lint-staged"
		}
	},
	"lint-staged": {
		"src/**/*.{js,vue}": ["eslint --fix", "git add"]
	}
}
```

目前不清楚这种配置的内容，需要专门看看`package.json`、`git`和`eslint`的文档。记得`eslint`的文档提供了这样的配置。

目前这个配置的效果是：每次`git`推送时，都做一次`eslint`的格式化。

这个配置可以规范团队协作时的代码规范，但是目前不敢使用。因为团队不使用`git`来控制代码版本。

## `前端工程化` eslint

## eslint 和 prettier 的依赖包

- eslint-plugin-prettier
- eslint-config-prettier

这两个依赖包，我一直以来都搞不清楚是什么关系的。
