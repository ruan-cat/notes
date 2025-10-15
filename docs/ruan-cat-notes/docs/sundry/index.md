# 杂项

这里存储了一大堆很杂乱的文章。

这些文章、文档满足以下特点：

1. 偶尔使用，低频使用
2. 几乎不维护
3. 曾经重要但是逐步过时
4. 一次性使用，复用率很低

## GitHub Spec Kit

- spec-kit 仓库： https://github.com/github/spec-kit

用这个工具来按照规范生成提示词。但是我目前不打算弄单人的独立项目，所以暂时不考虑该工具约束提示词。

## Wuunu 内嵌应用式的 AI 客户端

- 插件： https://marketplace.visualstudio.com/items?itemName=WuunuAI.wuunu-ai-extension
- 视频教程： https://www.bilibili.com/video/BV1rCxLzbEQq/

这是一个 vscode 插件，以插入式注入代码片段的方式，在应用内启动一个 AI 客户端，提供一个对话交流框，并允许选中页面元素，进行针对性的 UI 沟通与修改。

该方案实现起来太脏了。而且在 uniapp 内无法选择元素，该方案被放弃。

## 用于原型设计与最小 MVP 产品设计的 AI 平台

- https://zhuanlan.zhihu.com/p/19533859140

- [v0](https://v0.app/)
- [bolt.new](https://bolt.new/)
- [lovable](https://lovable.dev/)
- [dyad](https://github.com/dyad-sh/dyad)

## 对提示词的思考

2025 年是高强度使用 AI 的一年，用了很多 AI 工具，对提示词的划分理解如下：

- 一次性片段式提示词
- 一次性文档式提示词
- 可复用代理式提示词

### 提示词 4 要素

基于 `gemini-for-google-workspace-prompting-guide-101` ：

- 角色
- 任务
- 上下文
- 格式

## vite mock 插件技术选型

- [vite-plugin-fake-server](https://github.com/condorheroblog/vite-plugin-fake-server)
- [vite-plugin-mock-dev-server](https://github.com/pengzhanbo/vite-plugin-mock-dev-server)
- [vite-plugin-mock](https://github.com/vbenjs/vite-plugin-mock)

## changeset 发版版本号控制导致的差异

是否要在底层依赖更新时，是的同一个 monorepo 内的上层依赖也一起更新版本号呢？以下是两种差异：

- https://github.com/ruan-cat/monorepo/pull/39

单一包升级情况：

![2025-10-10-16-18-37](https://gh-img-store.ruan-cat.com/img/2025-10-10-16-18-37.png)

多个包升级情况：

![2025-10-10-16-19-21](https://gh-img-store.ruan-cat.com/img/2025-10-10-16-19-21.png)

## 使用 vite-plugin-fake-server 插件打包项目时出现的 require 函数故障

按理说不应该出现的，在生产环境内不应该出现 require 函数的。

针对 vue-pure-admin 仓库，该模板项目打包后，是正常的。但是我的项目也是用这个模板二开的，却出现了故障。

在 dist 内搜索这些关键词：

- `vite-plugin-fake-server`
- `__VITE__PLUGIN__FAKE__SERVER__`
- `window.__VITE__PLUGIN__FAKE__SERVER__.xhook`

无 require：

![2025-10-10-16-21-50](https://gh-img-store.ruan-cat.com/img/2025-10-10-16-21-50.png)

有 require：

![2025-10-10-16-22-03](https://gh-img-store.ruan-cat.com/img/2025-10-10-16-22-03.png)

## 依赖冲突

- resolutions
- overrides

到底怎么使用？

## 在 pnpm-workspace.yaml 写 overrides 似乎没用，要在 package.json 内写 pnpm.overrides 才有效

疑似故障，无法实现依赖覆盖。

```bash
pnpm why vue-router
```

![2025-10-15-19-00-29](https://gh-img-store.ruan-cat.com/img/2025-10-15-19-00-29.png)
