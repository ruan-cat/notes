# vp-update

一个升级工具。有点问题：

0.1.2 就没错

0.6 就报错

## 尝试命令

```bash
pnpm exec vp-update
pnpm dlx vp-update
```

### 成功

```bash
pnpm dlx vp-update@0.1.2
pnpm dlx vp-update@0.5
```

### 出错

```bash
pnpm dlx vp-update@0.6
pnpm dlx vp-update@latest
pnpm dlx vp-update@next
```

## 独立完成 bug 测试与 pr

经过和作者在 QQ 群的沟通，作者要求我独立完成 pr，因为作者不愿意为了该功能额外导入依赖，而是使用 node 原生的功能。

目前我还是不懂。升级就先用保守的方式升级吧。

## 添加 packageManager 导致 vp-update 出错

- https://github.com/vuepress/vp-update/issues/7

添加 packageManager 导致 vp-update 出错。

```json
{
	"name": "java-pilot-base-doc",
	"license": "MIT",
	"type": "module",
	"scripts": {
		"docs:build": "vuepress-vite build src",
		"docs:clean-dev": "vuepress-vite dev src --clean-cache",
		"docs:dev": "vuepress-vite dev src",
		"docs:update-package": "pnpm dlx vp-update"
	},
	"devDependencies": {
		"@vuepress/bundler-vite": "2.0.0-rc.8",
		"vue": "^3.4.21",
		"vuepress": "2.0.0-rc.8",
		"vuepress-theme-hope": "2.0.0-rc.31"
	},
	"packageManager": ">=pnpm@8.0.0"
}
```

截图如下：

![2024-03-17-17-22-01](https://gh-img-store.ruan-cat.com/img/2024-03-17-17-22-01.png)

## 不作处理

是我这边的问题，是我的 packageManager 写错了，其格式不对，没有不等号的。

这个写法是不对的。

```json
{
	"packageManager": ">=pnpm@8.0.0"
}
```

## 仅在 vuepress hope 主题场景内有效

目前我已经很少用 vuepress hope 主题了。vp-update 可以不用了。
