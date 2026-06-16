# playwright,浏览器测试

## 入门 playwright 并整合到自己的 AI 工作流中

- Playwright MCP
- playwright-cli Skill
- @playwright/test
- @playwright/cli
- @playwright/mcp

## 一系列问题

- （已询问）我很关注 Playwright cli 和 MCP ，这两个工具配合起来，有没有能力完成视觉验证？比如我已经设计了一个很好看的 UI 设计稿，和产品原型布局稿。然后在 claude code、codex 这样的 agent 工具内执行的时候，我该怎么去使用 Playwright cli 和 MCP 完成打开本地 Chrome 浏览器的视觉验证，并在 vite+vue+typescript 架构的前端/全栈项目内，和 UI 设计细节对齐清楚，并完成验证。并确保在 claude code/codex 内的 AI 能够借助 Playwright cli 和 MCP 完成 UI 设计稿的自我校验，视觉验证，和产品交付呢？
- （已询问）我应该怎么搭建一个最小化的，可用的，通用的 Playwright cli + MCP 能力，并且在 vite+vitest 的技术栈内，搭建自动化浏览器测试？并设计合适的提示词，让 AI 动用其视觉能力，完成对 UI 设计稿、UI 设计工件，以及实际 dev 本地运行项目的视觉对比与自我核验迭代？我很需要用 Playwright cli 和 MCP 搭建足够简单的，易于快速复用给全部 vite 前端项目的，一套基于 Playwright cli + MCP 能力和 Playwright 包的，视觉验证与 UI 联调能力。

### <!-- 已经询问，产物为 ./init-playwright-mcp.md --> 如何配置合适的本地级别的多个 Playwright MCP ，完成分门别类使用 Playwright MCP ？

1. 你设计了多款本地项目级别的 MCP，请问我在一个常见的 node、vite、vue 项目内，我怎么才能新建合适的本地项目级别的 MCP 文件，才能确保 claude code/codex/cursor 之类的 agent 开发工具，能够识别这些本地级别的 MCP 配置？
2. 我该怎么设计合适的多款派生出来的 Playwright MCP ，并在通用的 CLAUDE.md/AGENTS.md AI 记忆文档内，设计简短清晰的派生 Playwright MCP 使用规范和使用边界？

### <!-- TODO: --> playwright-cli 和 playwright MCP 的使用情况、使用边界、以及最小限度初始化的方式？

1. 我该怎么让 AI 正确的去使用 playwright-cli 和 playwright MCP ？如何让 AI 学会恰当的使用这两个工具，并减少 token 消耗？
2. 我在本地项目安装`@playwright/mcp`依赖之后，执行 `pnpm exec playwright-cli install --skills` 命令后所产生的文件，playwright-cli Skill 只能去说明最基础的 playwright-cli 的操作行为么？对于 playwright MCP ，有配套的使用说明么？还是说已经包含了。请你去对应的 github 仓库认真检索查询，并给我贴切的答案。

### <!-- TODO: --> 如何让 AI 在开发过程中设计可固化的，可持续自主验证的 Playwright + vitest 自动化测试套件？

我现在清楚了这三个工具的职责：

- playwright-cli
  > 日常打开页面、操作状态、截图、读取样式，最省 Token
- Playwright MCP
  > 未知页面探索、截图交给视觉模型、复杂浏览器推理
- @playwright/test
  > 固化截图基线、像素比较、响应式测试、CI 门禁

---

- CLI：完成快速的“修改—截图—测量—再修改”
- MCP：完成需要视觉模型参与的设计判断
- Playwright Test：完成不可绕过的自动验收

我该如何在开发过程中，让 AI 去设计，固化基于 Playwright + vitest 的测试套件，实现固定规格的自动验收？

### <!-- TODO: --> playwright 在 vite 项目目录结构与特定文件作用，和具体配置？

我现在清楚了，在通用的 Vite + Vue + TypeScript 项目内，搭配 playwright 的项目工件目录大体如下

```txt
project/
├─ src/
├─ design/
├─ tests/
│  ├─ fixtures/
│  └─ visual/
│     ├─ dashboard.visual.spec.ts
│     ├─ login.visual.spec.ts
│     └─ visual-stability.css
├─ artifacts/
│  ├─ actual/
│  ├─ reports/
│  └─ playwright-mcp/
├─ .playwright/
│  └─ cli.config.json
├─ playwright.config.ts
├─ CLAUDE.md
├─ AGENTS.md
└─ .mcp.json
```

1. 为什么测试套件的尾缀是 xxx.spec.ts ？而不是 xxx.test.ts ？二者命名规范是什么？有什么区别？
2. 这里的 visual-stability.css 文件设计是什么？我用常见的 UI 设计工具设计出来的 css，和这个有什么区别？
3. artifacts/ 目录应该被 git 忽略么？
4. 这个目录结构设计内，那些文件和目录是在 playwright cli 和 MCP 执行的过程中持续产生的临时文件？并且应该在 git 忽略的？
5. .playwright/cli.config.json 和 playwright.config.ts 的具体设计应该是怎么样的？

## 本地搭建完整 Playwright 工具链

```bash
pnpm add -D @playwright/test @playwright/cli @playwright/mcp
pnpm exec playwright install chromium
pnpm exec playwright-cli install --skills
pnpm exec playwright-mcp --help
```

## playwright.config.ts 的配置参考

配置 playwright 配置文件时需要考虑的范畴：

- 固定 Viewport
- DPR
- 语言
- 主题
- 时区

```ts
import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
	testDir: "./tests",

	snapshotPathTemplate: "{testDir}/__screenshots__/{projectName}/{testFilePath}/{arg}{ext}",

	use: {
		baseURL: "http://127.0.0.1:5173",

		viewport: {
			width: 1440,
			height: 900,
		},

		deviceScaleFactor: 1,
		colorScheme: "light",
		locale: "zh-CN",
		timezoneId: "UTC",
		reducedMotion: "reduce",

		trace: "retain-on-failure",
		screenshot: "only-on-failure",
		video: "retain-on-failure",
	},

	expect: {
		toHaveScreenshot: {
			animations: "disabled",
			caret: "hide",
			scale: "css",

			// 初期建议稍宽松，稳定以后逐步收紧。
			maxDiffPixelRatio: 0.001,

			stylePath: "./tests/visual/visual-stability.css",
		},
	},

	projects: [
		{
			name: "chromium-desktop",
			use: {
				...devices["Desktop Chrome"],
				viewport: {
					width: 1440,
					height: 900,
				},
				deviceScaleFactor: 1,
			},
		},

		{
			name: "chromium-mobile",
			use: {
				viewport: {
					width: 390,
					height: 844,
				},
				deviceScaleFactor: 1,
				isMobile: true,
				hasTouch: true,
			},
		},
	],

	webServer: {
		command: "pnpm dev --host 127.0.0.1",
		url: "http://127.0.0.1:5173",
		reuseExistingServer: !process.env.CI,
	},
});
```

## .playwright/cli.config.json 的设计参考

```json
{
	"browser": {
		"browserName": "chromium",
		"isolated": true,
		"launchOptions": {
			"channel": "chrome",
			"headless": false
		},
		"contextOptions": {
			"viewport": {
				"width": 1440,
				"height": 900
			},
			"locale": "zh-CN",
			"serviceWorkers": "block"
		}
	},
	"outputDir": "./artifacts/playwright-cli",
	"outputMode": "file",
	"console": {
		"level": "error"
	},
	"snapshot": {
		"mode": "full"
	}
}
```

## AI 做视觉检查时的检查维度清单表

1. 页面整体布局和视觉层级
2. X/Y 对齐、宽高和比例
3. Padding、Margin、Gap
4. 字体、字号、字重、行高
5. 颜色、渐变、边框、阴影
6. 圆角、图标和图片裁切
7. 文本换行和截断
8. 可滚动区域和固定定位
9. Hover、Focus、Disabled、Loading 状态

输出差异表，每项包含：

- 严重程度
- 元素名称
- 设计预期
- 当前结果
- 可能对应的 Vue/CSS 文件
- 下一步需要测量的属性

## AI 做 UI 视觉修改与联调时被允许更改的代码范围

- 设计 Token
- CSS Variables
- 共享组件
- 布局容器
- Element Plus Theme Variables
- UnoCSS / Tailwind 配置

而不是给每个页面临时堆叠像素值。

## 完成视觉对齐和一次联调后固化测试

及时编写 @playwright/test 测试套件来完成自动化的测试。避免未来继续跑偏。

编写 playwright 自动化测试时需要注意范围：

- 像素视觉
- 组件局部视觉
- 准确 CSS 属性
- 几何布局
- 稳定测试数据
- 字体加载完成

## 需要被验证的前端交互行为

- Default
- Hover
- Focus
- Active
- Disabled
- Loading
- Empty
- Error
- Dialog Open
- Dropdown Open
- Tooltip Visible
- Mobile Menu Open
