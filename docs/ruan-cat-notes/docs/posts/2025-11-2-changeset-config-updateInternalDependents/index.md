---
juejin: https://juejin.cn/post/7567350088617312308
desc: 使用changeset的updateInternalDependents配置，让monorepo架构下相互依赖的node包实现基于底层依赖包触发上层依赖包共同升级的效果
---

# 在使用 changeset 时，如何在更新底部依赖时，触发上层依赖更新

> **摘要**：
>
> 使用 changeset 的 updateInternalDependents 配置，让 monorepo 架构下相互依赖的 node 包实现基于底层依赖包触发上层依赖包共同升级的效果。

## changeset 发版版本号有明显差异

在发版方案使用 [changeset](https://github.com/changesets/changesets) 时，我注意到在 monorepo 架构的 node 项目内，发版号并不是随着底层依赖升级而升级的。这引出一个问题？

> 是否要在底层依赖更新时，使得同一个 monorepo 内的上层依赖**也一起更新**版本号呢？

我举以下例子说明存在两种版本号处理策略差异。

### 依赖情况

在我的 monorepo 内输入命令： `pnpm why @ruan-cat/utils` ，检查在 monorepo 内，指定依赖的包依赖情况：

```log
Legend: production dependency, optional only, dev only

@ruan-cat-monorepo/root@1.0.0 D:\code\github-desktop-store\gh.ruancat.monorepo (PRIVATE)

devDependencies:
@ruan-cat/commitlint-config link:configs-package/commitlint-config
└── @ruan-cat/utils link:packages/utils
@ruan-cat/generate-code-workspace link:packages/generate-code-workspace
└── @ruan-cat/utils link:packages/utils
@ruan-cat/release-toolkit link:packages/release-toolkit
└─┬ @ruan-cat/commitlint-config link:configs-package/commitlint-config
  └── @ruan-cat/utils link:packages/utils
@ruan-cat/utils link:packages/utils
@ruan-cat/vercel-deploy-tool link:packages/vercel-deploy-tool
└── @ruan-cat/utils link:packages/utils
@ruan-cat/vitepress-preset-config link:packages/vitepress-preset-config
└── @ruan-cat/utils link:packages/utils
@ruan-cat/vuepress-preset-config link:packages/vuepress-preset-config
└── @ruan-cat/utils link:packages/utils
```

如图所示：

![2025-11-02-19-13-56](https://gh-img-store.ruan-cat.com/img/2025-11-02-19-13-56.png)

我们可以知道依赖包 `@ruan-cat/utils` 在该项目内是一个底层包，那么如果对这个底层包做版本号升级，其他的几款依赖是否能够更新版本号呢？

### 不同的版本号升级情况

[该项目](https://github.com/ruan-cat/monorepo)目前采用的是基于 [`changesets/action`](https://github.com/changesets/action) github 工作流的发版流程，会产生一个 pr。我们阅读以下这个 pr 信息和截图：

- https://github.com/ruan-cat/monorepo/pull/39

1. 单一包升级情况：

如图，只有一个底层包 `@ruan-cat/utils` 的版本号升级了，且产生了唯一一个包的更新日志。

![2025-10-10-16-18-37](https://gh-img-store.ruan-cat.com/img/2025-10-10-16-18-37.png)

2. 多个包升级情况：

如图，全部依赖 `@ruan-cat/utils` 的包，他们的版本号也一起升级了，且各自产生了更新日志，说明本包升级版本号是因为所依赖的底层包升级了。

![2025-10-10-16-19-21](https://gh-img-store.ruan-cat.com/img/2025-10-10-16-19-21.png)

我们可以注意到，在同一个 pr 内，版本号的更新策略是完全不同的。是什么配置导致这种差异呢？怎么去控制在 changeset 内是否要同时更新上层依赖包呢？

## 具体做法

在 changeset 配置文件 `.changeset\config.json` 内， 配置 `updateInternalDependents` 和 `onlyUpdatePeerDependentsWhenOutOfRange` 即可。

值得注意的是，这个配置现在是普遍关闭的，因为大家很不喜欢这种发版版本号变更策略，因为版本号变更过于频繁，而且语义化不强。

除非需要做到那种强制通知的效果，才需要这种配置。

核心配置如下：

```json
{
	"$schema": "https://unpkg.com/@changesets/config@3.1.1/schema.json",
	"updateInternalDependencies": "patch",
	"___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH": {
		"onlyUpdatePeerDependentsWhenOutOfRange": true,
		"updateInternalDependents": "always"
	}
}
```

## 不推荐大家去做这个配置

这种版本号更新策略并不受大家欢迎，因为版本号更新时其核心内容没有很强的语义化。除非你认为底层依赖更新对上层依赖影响很大，有必要通知到使用方时。该发版策略才适合你。否则还是别用这个配置了，噪音太大。
