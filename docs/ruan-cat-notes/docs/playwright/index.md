# playwright,浏览器测试

## 入门 playwright 并整合到自己的 AI 工作流中

- Playwright MCP
- playwright-cli Skill
- @playwright/test
- @playwright/cli

## 一系列问题

- 我很关注 Playwright cli 和 MCP ，这两个工具配合起来，有没有能力完成视觉验证？比如我已经设计了一个很好看的 UI 设计稿，和产品原型布局稿。然后在 claude code、codex 这样的 agent 工具内执行的时候，我该怎么去使用 Playwright cli 和 MCP 完成打开本地 Chrome 浏览器的视觉验证，并在 vite+vue+typescript 架构的前端/全栈项目内，和 UI 设计细节对齐清楚，并完成验证。并确保在 claude code/codex 内的 AI 能够借助 Playwright cli 和 MCP 完成 UI 设计稿的自我校验，视觉验证，和产品交付呢？
- 我应该怎么搭建一个最小化的，可用的，通用的 Playwright cli + MCP 能力，并且在 vite+vitest 的技术栈内，搭建自动化浏览器测试？并设计合适的提示词，让 AI 动用其视觉能力，完成对 UI 设计稿、UI 设计工件，以及实际 dev 本地运行项目的视觉对比与自我核验迭代？我很需要用 Playwright cli 和 MCP 搭建足够简单的，易于快速复用给全部 vite 前端项目的，一套基于 Playwright cli + MCP 能力和 Playwright 包的，视觉验证与 UI 联调能力。

### 如何配置合适的本地级别的多个 Playwright MCP ，完成分门别类使用 Playwright MCP ？

1. 你设计了多款本地项目级别的 MCP，请问我在一个常见的 node、vite、vue 项目内，我怎么才能新建合适的本地项目级别的 MCP 文件，才能确保 claude code/codex/cursor 之类的 agent 开发工具，能够识别这些本地级别的 MCP 配置？
2. 我该怎么设计合适的多款派生出来的 Playwright MCP ，并在通用的 CLAUDE.md/AGENTS.md AI 记忆文档内，设计简短清晰的派生 Playwright MCP 使用规范和使用边界？

### playwright-cli 和 playwright MCP 的使用情况、使用边界、以及最小限度初始化的方式？

1. 我该怎么让 AI 正确的去使用 playwright-cli 和 playwright MCP ？如何让 AI 学会恰当的使用这两个工具，并减少 token 消耗？
2. playwright-cli Skill 只能去说明最基础的 playwright-cli 的操作行为么？对于 playwright MCP ，有配套的使用说明么？还是说已经包含了。请你去对应的 github 仓库认真检索查询，并给我贴切的答案。

## 本地搭建完整 Playwright 工具链

```bash
npm install -D @playwright/test @playwright/cli
npx playwright install chromium
npx playwright-cli install --skills
```
