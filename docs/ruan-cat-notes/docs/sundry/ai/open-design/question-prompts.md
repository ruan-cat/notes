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

## 02 <!-- TODO: --> Open Design 有能力专门完成 figma 文件生成吗？

1. Open Design 有能力专门完成 figma 文件生成吗？
2. 生成出来的 figma，我怎么在 vite+typescript+vue3 的具体前端/全栈项目内，让 claude code/codex/cursor 等 AI 代理，完成对 figma 文件的读取，并严格按照产品原型设计来完成前端 vue 组件的直接生成，与视觉样式联调？我该使用那些 figma 相关的 MCP/cli 工具来完成前端开发时的组件生成和样式联调呢？
3. figma 有专门的 skills 么？官方 figma 的 skills 主要是做什么的？

---

能生成，依赖 Open Design 内部的 figma MCP 完成生成。但是生成的是云端的 fig 项目。
