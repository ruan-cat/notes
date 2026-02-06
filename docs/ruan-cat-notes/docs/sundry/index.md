# 杂项

这里存储了一大堆很杂乱的文章。

这些文章、文档满足以下特点：

1. 偶尔使用，低频使用
2. 几乎不维护
3. 曾经重要但是逐步过时
4. 一次性使用，复用率很低

## 平时可以高强度删减的东西

按照处理后收益最高来排序：

- 浏览器收藏夹
- B 站稍后再看
- 本项目的待办
- 本项目的历史文档
- B 站收藏视频
- B 站关注 up 主
- QQ 收藏

## GitHub Spec Kit

- spec-kit 仓库： https://github.com/github/spec-kit

用这个工具来按照规范生成提示词。但是我目前不打算弄单人的独立项目，所以暂时不考虑该工具约束提示词。

## Wuunu 内嵌应用式的 AI 客户端

- 插件： https://marketplace.visualstudio.com/items?itemName=WuunuAI.wuunu-ai-extension
- 视频教程： https://www.bilibili.com/video/BV1rCxLzbEQq/

这是一个 vscode 插件，以插入式注入代码片段的方式，在应用内启动一个 AI 客户端，提供一个对话交流框，并允许选中页面元素，进行针对性的 UI 沟通与修改。

该方案实现起来太脏了。而且在 uniapp 内无法选择元素，该方案被放弃。

## 对 mintlify 文档云平台的思考

- https://www.mintlify.com/docs/zh/migration#手动迁移
- https://github.com/mintlify

我觉得太冷门了。做出来的产品是明星产品，但是技术本身很冷门，迁移成本太大。

1. 文档格式必须是 `*.mdx` 格式，很不喜欢这种 markdown 的衍生格式。
2. 要制作专门的 `docs.json` 文件。
3. 静态资源必须要移动到规定的目录内。

这个要求决定了，mintlify 不太适合现在大多数的静态文档渲染框架。不合适。专有专用的格式太多了。

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

## 前端发展方向

- 网页
- 管理后台
- 大屏
- 移动端
- 桌面端 electron
- 游戏前端

## 独立前端组件显示文档

- histoire
- storybook

这两个都可以实现对 vue 组件生成专用的，独立的，可交互的组件。

## 对 `影刀Forma` 的思考

- https://forma.yingdao.com/create

一个快速生成 AI ppt 和视频的站点，特别适合生成精美的，自动化的教程。比如我做的一个工具，说明清楚使用文档，然后让 AI 根据文档生成一个课程式的视频。

很适合用户培训，宣传自己的开源工具包，说明版本更新内容。

### 使用体验

点击生成课程无反应，算了。

## automa

针对浏览器操作的节点式自动化拖拽工作流，实现对浏览器或者是整个电脑的完整自动化操作工作流。

![2025-12-15-16-16-13](https://gh-img-store.ruan-cat.com/img/2025-12-15-16-16-13.png)

- 产品站点： https://www.automa.site/zh-CN
- 浏览器插件的产品站点： https://extension.automa.site/
- 浏览器插件，中文说明文档： https://automa.wiki/
- 浏览器插件，github 仓库： https://github.com/AutomaApp/automa

我暂时没有需要用浏览器批量自动化做重复操作的场景。

## 让 AI 实现高强度自动任务

一个任务编排器。目前还没有那么多任务需要该工具实现调度与编排。故暂时不考虑。

- https://github.com/subsy/ralph-tui

## 基于 git worktree 的 AI cli 工具并行开发工具

- https://www.conductor.build/

## RackNerd

- `RackNerd购买及基础设置教程：如何购买、连接VPS、重装系统、发送工单、更换IP`： https://vpsfq.com/?p=1422

## 购买 vps

- `高性价比VPS | 精品线路 | 月付不到17元人民币 | 美国原生IP | 美国洛杉矶机房 | 低价VPS | 一键多协议脚本 | 从购买到搭建`： https://www.youtube.com/watch?v=cGYFKL3ZveY
- https://potoh.com/posts/2025-12-30/vmiss/
- https://potoh.com/vps/

## 开通虚拟卡

### bitget 供应商

- `免费申请虚拟海外银行卡 | 0开卡费0年费 | 支持大陆身份 | 线上直接开卡 | Bitget Wallet 银行卡 | 可订阅GPT和Gemini | 从注册到使用全过程教程`：https://www.youtube.com/watch?v=RRap2O_vzgk
- `Bitget虚拟U卡，从注册到使用全过程教程`： https://potoh.com/posts/2025-12-3/bitget-card/

看了视频教程，个人感觉太复杂，太繁琐了。流程非常繁杂。

从 2026 年 1 月 23 日起，将不支持身份证作为 KYC，只支持护照做 KYC 了。

### bybit 供应商

- `币圈神卡 | bybit亚洲虚拟U卡 | 支持大陆身份 | 线上直接开卡 | 0开卡费0年费0激活门槛 | 无需地址证明 | 可订阅GPT和Gemini`： https://www.youtube.com/watch?v=WWki8oJ8X1w
- https://potoh.com/posts/2026-1-11/bybitcard/

视频评论说无法绑定卡，就不继续弄了。不打算继续弄这个方案。

## 开通国外接码用途手机号

- `免实名海外esim卡 | 免费接收短信 | 长期保号 | 一年不到10元 | 荷兰沃达丰0月租手机卡 | 注册tg`： https://www.youtube.com/watch?v=RGu5jTQgKKw&t=191s
- https://potoh.com/posts/2026-1-5/wdfesim/

注意到这个视频，是要求我们先要有虚拟 visa 卡才能申请账号的。
