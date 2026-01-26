# openai-gemini,基于无服务器实现自建 gemini 代理

::: warning 低优先级

现在不打算用这个工具了，工具迭代太快，被淘汰了。现在不考虑自己新建一大堆谷歌 key 来完成轮询。维护麻烦。

:::

## 目前不支持 key 轮询

## 教程

视频教程：

- [`【十几个场景榨干AI善人，Gemini 2.5 Pro API又免费了】`](https://www.bilibili.com/video/BV1Bi3XzZESn/)

fork 仓库：

- https://github.com/PublicAffairs/openai-gemini
- https://github.com/ruan-cat/openai-gemini

手动 fork，然后进入 netlify，手动导入项目并部署项目。直接点击 README 文档的 netlify 部署按钮，会创建一个新的 github 仓库，产生冗余。我不希望创建新的仓库，而是复用自己 fork 的仓库。

在 netlify 手动部署后提供的地址：

- https://openai-gemini-by-ruan-cat.netlify.app

### 暂不考虑 cloudflare 代理

不敢让 cloudflare 经常性的代理该地址，怕被封号。在相关视频评论区下，经常看到 cloudflare 制作的 gemini 代理被封号了。

## 在 cursor 内配置

受视频教程启发，在 cursor 内配置自建的地址。

::: details

![2025-08-04-12-23-47](https://gh-img-store.ruan-cat.com/img/2025-08-04-12-23-47.png)

openai 的地址配置为 `https://openai-gemini-by-ruan-cat.netlify.app/edge` ，使用边缘运行时的尾缀。

key 配置为在 `aistudio.google.com` 内申请的 `gemini API key`。

:::

### 仍有缺陷

在 cursor 内运行时，没有办法使用高级模型，用的还是 `gemini-2.5-flash`，而不是期望的 `gemini-2.5-pro` 。
