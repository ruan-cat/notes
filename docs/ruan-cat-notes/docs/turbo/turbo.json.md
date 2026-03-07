# turbo.json 的配置

## 单包内的任务调度

在 monorepo 内，一个子包的任务可能需要经过几个前置命令。

比如在 utils\package.json 内生成文档，需要先生成文件，移动文件，然后才能本地跑命令，做打包。

```json
{
	"scripts": {
		"copy-readme": "cpx readme.md docs",
		"typedoc": "typedoc",
		"docs:dev-main": "vuepress-vite dev docs",
		"docs:dev": "turbo docs:dev",
		"build:docs-main": "vuepress-vite build docs",
		"build:docs": "turbo do-build-docs"
	}
}
```

我们可以在子包内定义这样的 turbo.json 配置：

::: details turbo.json 配置

在 utils/turbo.json 内：

<<< ./turbo.example.json#snipaste{json twoslash}

:::

### extends 继承根配置

因为是子包，所以要求继承根包配置的文件。语法如下：

```json
{
	"extends": ["//"]
}
```

### 最底层的任务无需缓存

按照这样的业务设计，移动文件，生成文档，以及未来可能增加的 prettier 文件格式化，都不应该被缓存。

如果文件移动任务被 turbo 缓存了，那么下一次执行时就会跳过，就不会真正地移动最新的文件了。

```json
{
	"tasks": {
		"copy-readme": {
			"cache": false
		},
		"typedoc": {
			"cache": false
		}
	}
}
```

### 可以封装中间任务 generate-md

在当前业务内，移动文件，生成文件都是一个阶段的任务，都是并行任务，我们可以凭空封装一个不在 package.json 内的任务 generate-md，让其他的任务更好地声明。

```json
{
	"tasks": {
		"generate-md": {
			"dependsOn": ["copy-readme", "typedoc"]
		}
	}
}
```

### 重命名以避免死循环

这里因为涉及到和根任务配置相关的东西，为了避免死循环，turbo 定义的任务名称为 do-build-docs，而不是重名的 build:docs。

```json
{
	"tasks": {
		"do-build-docs": {
			"dependsOn": ["build:docs-main"]
		}
	}
}
```

## tui 多任务分屏配置

构建效果如图所示：

> ![2026-03-08-02-26-26](https://gh-img-store.ruan-cat.com/img/2026-03-08-02-26-26.png)

---

核心配置是在 monorepo 的根包内，配置 ui 即可。

```json
{
	"ui": "tui"
}
```
