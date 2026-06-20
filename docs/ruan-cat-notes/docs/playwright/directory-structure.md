# 目录结构设计

playwright cli + MCP + test 的目录结构设计：

```txt
project/
├─ src/
│
├─ design/                         # 产品设计输入，提交 Git
│  ├─ references/
│  └─ specs/
│
├─ tests/
│  ├─ fixtures/                    # Playwright 自定义 Fixture
│  ├─ pages/                       # 可选：Page Object
│  ├─ e2e/
│  │  ├─ login.e2e.spec.ts
│  │  └─ dashboard.e2e.spec.ts
│  ├─ visual/
│  │  ├─ dashboard.visual.spec.ts
│  │  ├─ login.visual.spec.ts
│  │  └─ visual-stability.css
│  └─ __screenshots__/             # 视觉基线，提交 Git
│
├─ playwright/
│  └─ .auth/                       # 登录状态，忽略 Git
│
├─ artifacts/                      # 所有运行产物，忽略 Git
│  ├─ playwright-cli/
│  ├─ playwright-mcp/
│  ├─ test-results/
│  ├─ reports/
│  └─ manual/
│
├─ .playwright/
│  └─ cli.config.json              # CLI 配置，提交 Git
│
├─ playwright.config.ts            # Playwright Test 配置，提交 Git
├─ CLAUDE.md
├─ AGENTS.md
└─ .mcp.json
```

## visual-stability.css 定位

仅在 Playwright 截图时临时注入页面、用于消除随机视觉噪声的测试样式。

Playwright 的 toHaveScreenshot() 支持 stylePath，截图时会把指定 CSS 临时应用到页面。官方定位是隐藏动态或不稳定元素，提高截图比较的确定性。

visual-stability.css

它只负责截图期间的稳定性：

隐藏实时变化的时间；
隐藏随机广告和第三方组件；
隐藏鼠标闪烁或随机光标；
固定滚动条占位；
避免平滑滚动影响截图；
暂时隐藏不可控的远程 iframe。

推荐内容如下：

```css
/*
 * 只在 Playwright 视觉截图期间注入。
 * 不得用于修复或掩盖真实 UI 问题。
 */

/* 保持滚动条出现和消失时的布局宽度稳定。 */
html {
	scrollbar-gutter: stable;
	scroll-behavior: auto !important;
}

/*
 * 使用 visibility 而不是 display:none，
 * 避免隐藏元素后破坏原有布局。
 */
[data-visual-volatile="true"],
[data-live-time="true"],
[data-random-content="true"],
[data-third-party-widget="true"] {
	visibility: hidden !important;
}

/* 对无法控制内容的第三方 iframe 使用明确标记。 */
iframe[data-visual-ignore="true"] {
	visibility: hidden !important;
}
```
