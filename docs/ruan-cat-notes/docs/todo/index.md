# 待办

这里存储一大堆等待深入学习的东西，也包含一些学习研究的报告。

## 设计模式的学习

继承、组合、聚合。这三种东西怎么实现？有什么优缺点？在什么时候使用最好？

## 设计模式

- https://notes.youngkbt.cn/design-pattern

## 什么是微前端技术？

了解关于微前端的技术

- https://qiankun.umijs.org/zh

## 构建便于查询的数据结构？

查询？目前有这几种方式实现可以查询性质的数据结构构建。

1： find 函数直接查询。
2： 构建查询用的数据结构。
2.1： Object.assign
2.2： Object.fromEntries

## FileSaver

FileSaver

## vue 组件的即时阅览与单元测试

- https://www.v2ex.com/t/840680
- https://github.com/jaweii/AutoPreview/blob/main/README-zh.md

### 当前进度

vue2 不行，vue3 生态下可以考虑配置

## 学习 rouyi 的搜索栏功能

在 https://gitee.com/y_project/RuoYi-Vue 内，其顶部导航栏的搜索栏非常有用，有空可以考虑嵌套使用。
HeaderSearch 组件

## storybook

这是一个实现组件库的工具。可以考虑以下的技术栈实现组件库：

- storybook
- typescript
- vue3
- vite

目前还不是很懂这个组件库的生成。我没有找到类似的，可以参考的 github 例子。

- https://storybook.js.org/blog/storybook-vue3/

## 腾讯低代码 + 机器人

用低代码平台和机器人来实现通知功能？比如企业微信机器人，QQ 机器人的通知功能？

## prepublishOnly

基于 prepublishOnly 怎么实现发包前的打包？怎么保证其 build 构建过程是遵循 turbo 依赖拓扑结构的？

## ai 平台的接口流式输出

- https://api-docs.deepseek.com/zh-cn/
- https://github.com/LangbaseInc/langui

我现在有 deepseek 的 key 了，尝试实现一个能够流式输出的前端交互界面。对接自己的大模型接口。

### 可能的参考资料

- https://vscode.dev/github/Jannchie/koishi-plugin-openai-chatbot/blob/main/src/index.ts

用简单的调用 api 方式，实现调接口。

```js
import { Configuration, OpenAIApi } from "openai";
```

## langchain

这是什么？为什么很多跟 ai 相关的客户端项目，都有这个东西？

## 尝试多个 ai 客户端平台，看看能否实现预配置提示词的功能

金玉良缘的需求是实现预配置提示词。如果现有的 ai 平台能实现，就先提供出来。

## 探索更多的 AI 生成代码平台

- cursor
- Cline
- v0
- blot

azure 注册：https://azure.microsoft.com/
azure AI 平台：https://ai.azure.com/
CherryStudio：https://cherry-ai.com/
火山引擎：https://www.volcengine.com
硅基流动：https://www.siliconflow.com/zh/home
OpenWeb UI: https://github.com/open-webui/open-webui
秘塔 AI 搜索：https://metaso.cn/
Perplexity 搜索： https://www.perplexity.ai/

## 单独 md 文档直接转义输出成含有 html 和 css 样式的 md

用平常的 md 语法来写文档，试图使用 markdown-it 的方式转义语法，并生成出简单的 md

未来再考虑用生成产物直接上传到各大博客平台，实现含有样式的，折叠栏的文章。

## 拓展好用的 zsh 插件

zsh 是干什么的？

是什么类型的生产力工具？

有什么好用的插件？

## 阅读`fantastic-admin`源码

- https://github.com/fantastic-admin/basic

这个看起来和 vben 有的一拼。有空看看源码。

## 学习 PlusProComponents

这个对 element-plus 有二次封装。似乎很适合实现 curd。

- https://plus-pro-components.com/guide/

个人已经不太想重复造轮子了，封装组件好烦。

## idea 破解版

- https://mp.weixin.qq.com/s/FE9SbCK9QD0vtFdCNoIhlA

找 wjt 跟进

## 试着自己生成一个移动端 app

试试用别人的提示词，和 gemini、v0、cursor 沟通一下，生成原型图，然后制作项目。

- https://juejin.cn/post/7510151175677673487

试一下这一套重新开始的，小 demo 快速起步的工作流程。

## deno 的边缘服务器函数

- https://dash.deno.com/welcome
- https://docs.deno.com/deploy/manual/
- https://dash.deno.com/account

有空试试看 deno 部署大量的边缘计算云函数。

## AI 读代码的平台

- https://zread.ai/
- https://deepwiki.org/
- https://opendeep.wiki/

## doskey

好像是 window 命令的别名方案。

## FormCreate 和 FcDesigner Pro 是不一样的

一个免费开源，另一个要收费。看清楚。

- [FormCreate](https://www.form-create.com/v3/guide/install)
- [FcDesigner Pro](https://pro.form-create.com/doc/)

不过我目前（2025-6-30）也不折腾这个低代码平台。留着。

## biome 还不能成为首选

目前（2025-6-30）biome，唉，现在只能说还是一个小丑。就等吧。md 不能格式化，那谁敢那这个替代 prettier 和 eslint。还是要等。

再等 oxlint 就抢走 biome 市场份额了。

- https://biomejs.dev/zh-cn/internals/language-support/

![2025-06-30-22-59-12](https://gh-img-store.ruan-cat.com/img/2025-06-30-22-59-12.png)

## 含有 vue 响应式变量的接口请求工具

### @tanstack/vue-query 和 useAxios

看看这个技术选型如何？对于获取接口请求的响应式变量而言，该方案有没有可行性？

这个东西会不会引入了太多概念了？大家觉得这个和我们现在的 useAxios 方案比起来，哪一个更加适合我们团队？

- https://tanstack.com/query/latest/docs/framework/vue/overview

### 对一个异步函数做包装，好像有点东西

- https://tanstack.com/query/latest/docs/framework/vue/installation#use-of-composition-api-with-script-setup

### vue-request

- https://github.com/AttoJS/vue-request

### alova ？

- https://alova.js.org/zh-CN/tutorial/getting-started/introduce

## git clean -fdx

试试看，看看能不能实现一次性删除一大堆内容？

## 基于 taze 的依赖更新工作流配置

<!-- 低优先级 -->

期望实现利用 github action 检查并升级 node 项目依赖。

- https://docs.github.com/zh/code-security/dependabot/working-with-dependabot/automating-dependabot-with-github-actions?learn=dependency_version_updates

确保手上的项目一定是时刻保持最新版本的依赖。特别是我自己封装的那一些包。

## openapi-ts-request ？

- https://github.com/openapi-ui/openapi-ts-request

## 给自己的 monorepo 库新建一个关系图表

- https://github.com/uni-helper/website/pull/22
- https://unjs.io/relations
- https://uni-helper.js.org/relations

## 利用智谱 GLM 的大容量，搭建 github workflow 实现 pr 后自动调用工具

- https://docs.claude.com/zh-CN/docs/claude-code/github-actions

## CodeRabbit

这是什么 github pr 机器人？

## 基于动态组件的精细化，高性能组件编写方案

`<component :is>` + `defineAsyncComponent` + `<keep-alive>` = 高性能动态组件系统。

- https://juejin.cn/post/7549314246204522506

## node 内置的测试框架

- https://juejin.cn/post/7536817253879513123

```js
// test/math.test.js
import { test, describe } from "node:test";
import assert from "node:assert";
import { add, multiply } from "../math.js";

describe("Math functions", () => {
	test("adds numbers correctly", () => {
		assert.strictEqual(add(2, 3), 5);
	});

	test("handles async operations", async () => {
		const result = await multiply(2, 3);
		assert.strictEqual(result, 6);
	});

	test("throws on invalid input", () => {
		assert.throws(() => add("a", "b"), /Invalid input/);
	});
});
```

## 从公开的 Figma 设计稿内提取出样式设计风格，优化项目的视觉设计

- https://juejin.cn/post/7506051295951732748
- https://juejin.cn/post/7515231445276852239#heading-8

## 发布依赖包相关的杂事 ？

### antfu ？

[点此专项阅读](../sundry/antfu-release-plan/index.md)。

## 发包日志包含提交记录 ？

期望实现 github release 的日志包含 git commit 。

standard-version + cz-git

[standard-version](https://github.com/conventional-changelog/standard-version)，不能继续弄，这个库已经被声明弃用了。

standard-version 会要求新建配置文件 `.versionrc` 。声明那些 commit 提交类型会写入到那些范围。

继任者 [release-please](https://github.com/googleapis/release-please) ，也不能落实。因为触发 pr 合并的 github workflow 工作流，我已经选择了 [changesets/action](https://github.com/changesets/action) ，所以不太可能换装成这个方案实现 pr 写入 git commit。

### 发包日志生成工具

需要参考注意的仓库：

- changelogen
- changelogithub
- conventional-changelog-conventionalcommits
- conventional-recommended-bump

## 做一个控制台初始化工具包 ？

我还想做一个 cli，实现按需初始化各类配置文件。直接复制粘贴文件的。

```bash
ruan-cat-cli init config -- eslint prettier cz taze
ruan-cat-cli init ghw -- ci
ruan-cat-cli init cc -- statusline
```

直接覆写，覆盖，预设一大堆配置文件，实现渐进式升级旧项目，一键初始化其他规格的新项目。

先去调研一下类似的配置初始化工具。

## 学习相关的 claude code 周边库

- 一体化方案？
- 模型路由切换方案？
- 计费统计方案？
- 状态栏方案？

- https://github.com/UfoMiao/zcf
- https://github.com/Haleclipse/CCometixLine

## 方舟 Coding Plan 首月特惠 ？

￥ 9.90 ，晚点购买测试效果。

- https://www.volcengine.com/activity/codingplan

## 阅读并翻译这些提示词仓库

阅读这些提示词仓库，针对性的阅读自己想看的内容，整理翻译成中文提示词。便于高强度阅读学习。

- https://github.com/PatrickJS/awesome-cursorrules
- https://github.com/BehiSecc/awesome-claude-skills
- https://github.com/wshobson/agents

## academy.openai.com

去探索这个网站，能够提供哪些有用的，实用的提示词。

- https://academy.openai.com/

## RIPER-5 Mode ？

疑似是一种提示词工程。

- https://forum.cursor.com/t/i-created-an-amazing-mode-called-riper-5-mode-fixes-claude-3-7-drastically/65516
- https://github.com/wubin28/ICMwRIPER-5

## 全局找一款工作流，将 github 开源信息的 TODO 都收集起来，制作成报表文档，便于整理复盘

## vitepress 的 AI 搜索栏插件，便于让文档介入 AI 或者是大模型实现沟通，便于精准检索

## 阿里云也有免费的边缘云计算套餐了

- 从 github 内导入项目： https://help.aliyun.com/zh/edge-security-acceleration/esa/user-guide/connect-pages-to-github
- ESA 产品控制台： https://esa.console.aliyun.com/edge/pages/list
