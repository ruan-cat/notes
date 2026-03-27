<!-- https://github.com/AVIDS2/memorix/issues/10 -->

# 能否让 memorix 配置忽略特定路径？或者是针对性对指定目录提供 memorix 能力？

我使用了多款 AI 客户端，并且很希望实现跨工具的上下文同步。但是 memorix 总是无条件的给当前被打开的项目，添加提示词文件和钩子配置文件。

我已经给多个 AI 客户端安装了全局的 memorix MCP 配置，也用 pnpm 全局安装了 memorix 这款 MPC 包。现在我想给一个项目写 pr，但是当我用 cursor 打开刚刚 fork 的项目时，memorix 就无条件的在代码内写入大量的配置文件。

我在准备给别的开源库提交 pr，不可能提交这些文件。多余的，自动添加的 memorix 提示词和配置文件很干扰我的后续开发。

我的情况如下图所示：

![2026-02-28-20-49-55](https://gh-img-store.ruan-cat.com/img/2026-02-28-20-49-55.png)

那比如我用 cursor 打开一个项目，然后 memorix 就开始无条件的写入这些配置文件，太干扰开发了。

## 建议

有没有现成的办法，实现忽略配置？或者是开发一个识别配置。比如我传入特定目录地址，那么 memorix 就对被传入的目录地址的项目，写入 memorix 相关的配置文件。

比如在 `C:\Users\pc\.memorix` 内弄个 `C:\Users\pc\.memorix\settings.json` 配置文件，列举出需要提供 memorix 能力的项目。至于其他打开的项目就不会默认写入 memorix 相关的配置文件。
