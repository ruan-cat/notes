# my-pull-requests 个人贡献站点的优化提示词，杂项提示词

## 001 <!-- 已完成：本地验收 --> 增加新的功能，搜索栏功能，实现按照文字的模糊搜索，便于快速找到 pr

已在本地运行 `docs/my-pull-requests` 的 dev 并完成验收：搜索栏模糊搜索与 Nitro 联调可用。

针对 `docs\my-pull-requests` 这款 nuxt 项目。

先探索思考一下，需要怎么样的功能接口才能完成对 pr 的模糊搜索，现有依赖的库能否完成按照关键字的搜索功能。设计合适的 nuxt 项目的 nitro 接口。

找到合适的组件，设计好如何增加 vue 组件。恰当的使用 `@nuxt/ui` 包提供的组件库来完成模糊搜索交互的前端搜索栏组件。

确保这个 vue 组件做好 SSR，如果是客户端组件，就做好对应的处理，确保能正常的本地构建。

本地运行 `docs\my-pull-requests\package.json` 的 dev 命令，在谷歌浏览器 MCP 内，自主完成 nitro 接口的联调。
