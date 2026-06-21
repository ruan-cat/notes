# 学习与使用 Open Design 的一系列疑问

## 01 <!-- 已询问 --> Open Design 本身预装了那些设计用途的 skills？

我注意到本地的 Open Design 应用会提供设计 UI 的能力，请问有那些 skills，或者是这里面有那些系统预装的提示词，帮助实现 UI 设计的？请你调研仓库源码：

- 仓库： https://github.com/nexu-io/open-design

---

Open Design 的 UI 设计能力不是来自某一个隐藏的“大型系统提示词”，而是运行时把以下几层内容组合起来：

基础设计师 System Prompt
→ 需求发现与设计哲学
→ 视觉方向库
→ 当前 DESIGN.md 设计系统
→ Craft 设计规范
→ 当前选中的 SKILL.md
→ 插件、组件、项目上下文

其中，真正负责通用 Web UI 生成的核心内置 Skill 是 `frontend-design`；已有页面的二次审查与精修则主要由 `impeccable-design-polish` 承担。

## 02 <!-- 已询问 --> Open Design 有能力专门完成 figma 文件生成吗？

1. Open Design 有能力专门完成 figma 文件生成吗？
2. 生成出来的 figma，我怎么在 vite+typescript+vue3 的具体前端/全栈项目内，让 claude code/codex/cursor 等 AI 代理，完成对 figma 文件的读取，并严格按照产品原型设计来完成前端 vue 组件的直接生成，与视觉样式联调？我该使用那些 figma 相关的 MCP/cli 工具来完成前端开发时的组件生成和样式联调呢？
3. figma 有专门的 skills 么？官方 figma 的 skills 主要是做什么的？

---

能生成，依赖 Open Design 内部的 figma MCP 完成生成。但是生成的是云端的 figma 项目。

安装 figma MCP：

```bash
claude mcp add --transport http figma https://mcp.figma.com/mcp
codex mcp add figma --url https://mcp.figma.com/mcp
```

另外，Open Design 主要的交付产物首先是纯 H5，然后再根据用户要求，生成定稿的 figma。不过，能生成定稿的 H5，也能作为可识别使用的产品原型了，不必要非要追求 figma 这个流程了，感觉可以放弃掉 figma 这个流程。

## 03 <!-- 已询问 --> 安装全局 figma skills

我本机全局安装了 skills 这个 node 包，我需要安装 figma 官方的 skills。请给我生成安装全局 figma skills 的命令。

---

```bash
skills add figma/mcp-server-guide -g -s "*" -y
```

## 04 <!-- TODO: --> @figma/code-connect CLI

你说的 @figma/code-connect CLI 这个 node 包，是什么？是做什么的？和我介绍一下，跟我说明清楚这个包在我开发流程中的作用。

## 05 <!-- TODO: --> figma MCP 对于免费用户的限制情况？

阅读 https://github.com/figma/mcp-server-guide/ 的 README 时，我看到免费用户的限额条款。

我目前是 figma 的免费用户，我很担心我在使用 figma MCP 创建远程 figma 项目时，受到速率和使用次数的影响。请你去看看 figma 官方的 blog 和 docs 文档，用联网查询的手段找到免费用户使用 figma 的限制条款。我需要清楚我的使用情况，了解清楚明确的使用边界。
