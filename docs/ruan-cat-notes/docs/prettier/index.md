# 官网

## 配置的困境

这个问题很大，格式化取决于本地的 vscode 插件或配置，而不是‘项目根目录下的配置文件’或‘开发环境依赖包’。这个让我很坐牢。

我希望的是，vscode 的相关格式化插件，可以自己识别项目根目录下的配置文件，识别到有.eslintrc 的文件时，他就按照文件配置来做格式化。

否则就按照 vscode 的用户配置，或工作区配置来格式化。

这个阶段有严格的优先级：
1： 项目本身的配置。
2： vscode 全局用户配置。
3： vscode 本地工作区配置。

但我不停地切换不同的项目时，上述 3 种阶段的配置差异让我坐牢。

有的项目不需要格式化，有的项目需要主动的，自动的格式化，有的项目需要手动格式化。

情况太多了。希望搞一个配置文件，一次性处理好。

## 可能的配置识别方案

让 vscode 的用户或工作区配置，识别出本地的 prettier 配置。

![image-20221020100452727](https://gh-img-store.ruan-cat.com/img/image-20221020100452727.png)

## vscode + prettier + wxml

在微信小程序开发中，使用`vscode`，配合`vscode`的`prettier`插件，结合一些配置，实现本地项目的格式化配置。

参考资料：[https://blog.csdn.net/HoweeGoss/article/details/125744750](https://blog.csdn.net/HoweeGoss/article/details/125744750)

`.vscode\settings.json`

```json
{
	"editor.formatOnSave": true,
	"editor.defaultFormatter": "esbenp.prettier-vscode",
	"[wxml]": {
		"editor.defaultFormatter": "esbenp.prettier-vscode"
	},
	"[wxss]": {
		"editor.defaultFormatter": "esbenp.prettier-vscode"
	},
	"prettier.documentSelectors": ["**/*.wxml", "**/*.wxss"]
}
```

`.prettierrc`

```json
{
	"overrides": [
		{
			"files": "*.wxml",
			"options": {
				"parser": "html"
			}
		},
		{
			"files": "*.wxss",
			"options": {
				"parser": "css"
			}
		}
	]
}
```

至此已完成。目前点击保存即可完成对`wxml`文件的格式化。

## 待整理的笔记

一般情况下，使用 `vsc` 的 `prettier` 插件和 `prettier.config.js` 来完成 `node` 项目的格式化。

如果是非 `node` 项目，是很普通的 `md`，`js` 文件等内容，就不使用 `prettier.config.js` 来约束其行为，而是用用户本身提供的 `settings.json` 来控制编辑器本身的格式化行为。

因为现在没有项目，没有 `git` 管理，仅仅只需要实现单纯的格式化即可。

`vue2` 的格式化行为用 `vetur` 的 `vscode` 配置实现，而不是 `prettier`。用 `vetur` 去配置 `prettier`，主动声明 `vetur` 的格式化行为为 `prettier` 即可。

代码间距用`.editorconfig` 来配置，而不是 `prettier.config.js`。因为`.editorconfig` 可以同时兼容 `vsc` 和 `webstorm`。

不使用插件 `rvest.vs-code-prettier-eslint` ，因为该插件仅仅针对于 `node` 项目，且要求项目本身安装多个依赖。被限定在 `node` 项目，而不是更多的情况

参考资料：
https://rileycai.com/不以规矩，不能成方圆-彻底搞懂-eslint-和-prettier/
https://luzhaoyang.com/zh/posts/dai-ma-gui-fan-zhi-li-jie-eslint-prettier-editorconfig.html

## 待研究的配置？

https://juejin.cn/post/7018810975822282760

"javascript.format.insertSpaceBeforeFunctionParenthesis":

## 在 vscode 的 prettier 插件内对 .xml 文件做格式化

结论，在无 node 项目，无 prettier 配置文件的前提下，做不到让 esbenp.prettier-vscode 插件实现对单文件 .xml 的格式化处理。

- https://github.com/prettier/prettier-vscode#plugins
  这篇文章称，esbenp.prettier-vscode 插件可以识别出 package.json 配置的插件。可是不符合当前业务场景。

- https://prettier.io/docs/en/configuration.html#setting-the-parserdocsenoptionshtmlparser-option
  官方文档说明了特定文件类型的格式化配置写法。可是我们无法提供格式化配置文件。

- https://prettier.io/docs/en/plugins.html#official-plugins
  针对 .xml 是有官方插件的。

- https://github.com/prettier/plugin-xml#getting-started
  官方插件 .xml 默认总是在 node 项目内作用。

## prittier 格式化代码报错

- https://blog.csdn.net/qq_42309685/article/details/121821177

我不知道为什么是 prettierrc.config.js 文件

目前无法让 vscode 的 prettier 插件和 npm 安装 prettier 共同使用。 prettier --write 命令无效。

### 已完成

已处理。不清楚是什么时候处理完 eslint 和 prettier 了，现在（2024-10-11）基本上不会去纠结 prettier 问题了。

该问题于 2023-6-15 记录。16 个月之前的问题。

## 标签总是另起一行

- https://blog.csdn.net/shd_0310/article/details/120769177

处理方式是在用户全局 vscode 配置文件中写死。

## prettier 依赖包和 vsc 的 prettier 在格式化时的细节差异？

TODO: prettier 依赖包和 vsc 的 prettier 在格式化时的细节差异？

这导致了 vue 组件在使用时，有着不同的操作行为。

## --experimental-cli 和 @prettier/plugin-oxc

- https://juejin.cn/post/7518931398340001802

prettier 的性能优化手段，配置以上参数，安装新的插件，可以有效提高 prettier 的运行速度。

## 高版本的 `prettier-vscode` 插件，出现严重故障

v12 版本的 prettier 格式化插件，出现严重故障。

- https://github.com/prettier/prettier-vscode/issues/3887
- https://github.com/prettier/prettier-vscode/issues/3907
- https://github.com/prettier/prettier-vscode/issues/3908
