---
juejin: https://juejin.cn/post/7547927106437955635
desc: 使用 vite 的 base 命令行参数来解决项目部署在 github page 的路径问题，从而避免在vite配置内写死base参数。
---

# 使用 vite 的 base 命令行参数来解决项目部署在 github page 的路径问题

> **摘要**：
>
> 使用 vite 的 base 命令行参数来解决项目部署在 github page 的路径问题，从而避免在 vite 配置内写死 base 参数。

## github page 要求 vite 项目必须配置 base 参数

如果我们想把 `vite` 或 `vitepress` 项目部署到 `github page` ，那么根据 `vite` 和 `vitepress` 的文档要求，我们必须在 `vite` 的 `base` 配置内配置好仓库路径。

比如我的 `github` 仓库是 [`stars-list`](https://github.com/ruan-cat/stars-list) ，那么我的 `base` 配置就必须写成 `stars-list` 。这是写死的。

## build 构建流程和 deploy 部署流程应该是解耦的

这看起来没什么问题，确实项目的泛用性降低了。如果我在 `base` 配置内写死了部署地址，那么项目要部署到其他平台的时候，该怎么办呢？总不可能提供好几个 `vite` 配置文件吧？

`build` 打包项目，就是很单纯的打包。不应该去考虑自己被部署到哪里的。现在 `github page` 这个部署平台，竟然反过来要求构建的时候要做出让步，要多配置东西来兼容他。这就导致 `deploy` 流程反过来耦合了 `build` 流程。

_我不希望在 `vite` 配置内写死 `base` 参数，这降低了可部署平台的泛用性。_

## 尝试解决问题

在 vite 配置文件内，很不好去做动态判断。

### 不能去判断部署目标是谁

为了解决这个问题，我们很容易的会想到用某种方式实现动态判断，通过判断部署目标是不是 `github page`，从而决定自己的 `base` 配置。

这个方案行不行呢？答案是**不行**。这个思路是离谱的，因为没有手段去向构建行为传递参数，并告诉 `build` 命令现在部署目标是 `github page`。

### 不能去判断工作流种类

那可不可以通过判断当前的工作流是谁，从而决定 `base` 配置呢？

这个方案行不行呢？答案是**不行**。

我们可能会这样思考问题：

- 当前 `build` 运行环境是不是 `cloudflare worker` ？ 是，那 `base` 配置`留空`。
- 当前 `build` 运行环境是不是 `vercel` ？ 是，那 `base` 配置`留空`。
- 当前 `build` 运行环境是不是 `github workflow` ？ 是，那 `base` 配置就`特殊化处理`。

这样看起来实现了对部署平台的通用性，但是 `github workflow` 泛用性更强，难道 `github workflow` 就一定会绑定 `github page` 么？

比如以下这几种场景：

- 用 `github workflow` 运行 `build` 命令，并借助 [wrangler](https://www.npmjs.com/package/wrangler) 包的 cli 参数，直接上传工件到 `cloudflare`，实现 `cloudflare` 平台的部署。
- 用 `github workflow` 运行 `build` 命令，并借助 [vercel](https://www.npmjs.com/package/vercel) 包的 cli 参数，并直接上传工件到 `vercel`，实现 `vercel` 平台的部署。
- 用 `github workflow` 运行 `build` 命令，并借助[`actions/configure-pages`](https://github.com/actions/configure-pages) 、[`actions/upload-pages-artifact`](https://github.com/actions/upload-pages-artifact) 和 [`actions/deploy-pages`](https://github.com/actions/deploy-pages) 这三个工作流，实现 `github page` 平台的部署。

考虑到 `github workflow` 的泛用性，那我们就不能通过判断 `github workflow` 进而来判断部署平台到底是谁了。

综上所述，在 `vite` 配置文件内，不好去做这样的判断。

**关键是**，我们要有某种手段，可以**向构建行为本身，提供参数，并更改构建行为**。

## 用 base 命令行参数，配置单独的 build 命令专供于 github page 部署场景

按照这样的思考，我们很容易的就可以想到，在使用 `vite` 或 `vitepress` 构建项目时，能不能传递 `base` 参数呢？这样就可以在 `vite` 配置文件内不考虑 `base` 配置了，增强了灵活性。

幸运的是，`vite` 和 `vitepress` 的 `build` 命令，均提供 `base` 参数，允许我们在构建前，看情况提供参数，进而满足 `github page` 的部署要求。

那么我们就可以这样写打包命令了：

```json
{
	"scripts": {
		"docs:build": "vitepress build docs",
		"docs:build-in-github-page": "vitepress build docs --base=/stars-list/",
		"build": "pnpm docs:build-in-github-page"
	}
}
```

在明确部署平台是 `github page` 时，就用专门专供的命令来打包。就用 `docs:build-in-github-page` 命令。否则部署到其他平台时，就用单纯的 `docs:build` 命令即可。

至此就解决了 `base` 参数在 `build` 和 `deploy` 流程的耦合问题。

## 参考资料

- https://cn.vite.dev/guide/cli#options-1
- https://vitepress.dev/zh/reference/cli#vitepress-build
