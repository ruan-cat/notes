---
juejin: https://juejin.cn/post/7546565160363507739
desc: 使用tsx直接运行typescript脚本，避免先经过一次rollup打包，减少编译环节，进而提高性能。
---

# 记一次基于 tsx 的脚本性能优化

> **摘要**：
>
> 使用 tsx 直接运行 typescript 脚本，避免先经过一次 rollup 打包，减少编译环节，进而提高性能。

## 问题起因

我在阅读[其他开源项目](https://github.com/Open-Yami-Community/awesome-yami)时，发现存在这样的脚本写法：

在 package.json 内，注意到存在这几个脚本 `cp`、`contributors` 和 `news`。

```json
{
	"scripts": {
		"dev": "vitepress dev docs",
		"build": "pnpm news && pnpm contributors && vitepress build docs",
		"rbuild": "rollup -c",
		"cp": "pnpm rbuild && node scripts/dist/cp.js",
		"contributors": "pnpm rbuild && node scripts/dist/update-contributors.js",
		"news": "pnpm rbuild && node scripts/dist/update-news.js"
	}
}
```

这是一个 vitepress 文档项目。那么在运行 build 命令时，会经过这几个步骤：

1. 先运行 news 和 contributors 命令。
2. 在运行 news 和 contributors 命令前，要先完成脚本的打包构建，生成出 js 文件后，才能继续运行脚本。
3. 最后才是 vitepress 的文档构建命令。

上述步骤多了一个脚本本身的编译转换步骤，可以省略掉这个步骤。直接跳过脚本编译，直接运行 typescript 脚本。

## 技术选型

有什么办法可以直接快速运行 typescript 脚本呢？这里我选择的是 [tsx](https://github.com/privatenumber/tsx) 来实现直接运行 typescript 脚本。

## 实施更改

### 安装开发依赖

tsx 通常的用法是作为脚本运行工具，基本上不参与发包，很少作为发包的依赖，故安装为 devDependencies 而不是 dependencies 依赖。

```bash
pnpm i -D tsx
```

### 更改命令写法

更改后的命令如下：

```json
{
	"scripts": {
		"cp": "tsx scripts/cp.ts",
		"contributors": "tsx scripts/update-contributors.ts",
		"news": "tsx scripts/update-news.ts"
	}
}
```

直接让 tsx 运行指定 typescript 文件即可。

## 其他问题

### 在 github workflow 补充安装 tsx

本项目在 github workflow 流水线内运行，那么在流水线运行时，打包构建依赖时会出现问题么？就我之前的经验来说，是会出现 tsx 找不到，无法运行脚本的情况的。

这里保险起见，给流水线配置文件，增加全局安装 tsx 依赖的配置。

写法如下：

```yaml
- uses: pnpm/action-setup@v3
  with:
    # 安装全局依赖 确保脚本能够在 action 中稳定运行
    run_install: |
      - recursive: true
      - args: [--global, "tsx"]
```

在使用 pnpm/action-setup 时，增加全局安装的依赖即可。

## 提交 pr

上述更改已经落实为对目标项目的具体 pr 了。[点此阅读 pr](https://github.com/Open-Yami-Community/awesome-yami/pull/3)。
