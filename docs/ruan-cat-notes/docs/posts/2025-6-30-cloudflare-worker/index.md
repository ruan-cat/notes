---
juejin: TODO
desc: TODO
---

<!-- TODO: 没有准备好发文 -->

# cloudflare worker 怎么准备好 pnpm 管理器？

> **摘要**：
>
> TODO: 没有准备好发文

## ci-info

- https://github.com/watson/ci-info

帮我推荐一个 node 库，实现对 Linux 环境的判断。判断当前环境是 vercel、github workflow、还是 cloudflare worker。

在 cloudflare worker 内，我想部署一个 vite 项目，但是写的 preinstall 脚本没办法在 cloudflare worker 内运行。

```json
{
	"scripts": {
		"preinstall": "npm run corepack:pnpm && npx only-allow pnpm",
		"corepack:pnpm": "corepack enable && corepack install"
	}
}
```

在安装前，没办法先准备好 pnpm，报错如下：

::: details cloudflare worker 的报错

<<< ./error-2025-6-30-01.log

:::

还没有试过 ci-info 来做控制。之前的处理方案很保守，是手动的移除掉 preinstall 钩子，才勉强实现了 cloudflare worker 部署 vite 项目。
