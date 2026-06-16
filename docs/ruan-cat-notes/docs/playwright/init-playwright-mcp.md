# 初始化 playwright 的本地 MCP

## 本地安装项目级别的 playwright MCP

```bash
pnpm add -D @playwright/mcp
pnpm exec playwright-mcp --help
```

## 配套的推荐 playwright 目录结构

```txt
your-project/
├─ .mcp.json                         # Claude Code
├─ .cursor/
│  └─ mcp.json                       # Cursor
├─ .codex/
│  └─ config.toml                    # Codex
├─ tools/
│  └─ mcp/
│     └─ playwright/
│        ├─ core.json                # 低 Token 功能验证
│        └─ visual.json              # 有头视觉验证
├─ artifacts/
│  └─ playwright-mcp/
│     ├─ core/
│     └─ visual/
├─ tests/
│  └─ e2e/
├─ AGENTS.md                         # Codex + Cursor 公共规则
├─ CLAUDE.md                         # 导入 AGENTS.md
├─ package.json
├─ pnpm-lock.yaml
└─ playwright.config.ts
```

## 设计两款 MCP ，以及对应的 playwright 配置文件

一共设计两款本地的 MCP，不设计太多。设计太多的 playwright MCP 变体会多出太多重复的 tools，占用 AI 主 agent 的上下文窗口。

### pw_core

`tools/mcp/playwright/core.json`

#### 核心配置如下

```json
{
	"browser": {
		"browserName": "chromium",
		"isolated": true,
		"launchOptions": {
			"channel": "chrome",
			"headless": true
		},
		"contextOptions": {
			"viewport": {
				"width": 1440,
				"height": 900
			},
			"locale": "zh-CN",
			"timezoneId": "Asia/Singapore",
			"colorScheme": "light",
			"reducedMotion": "reduce",
			"serviceWorkers": "block"
		}
	},
	"capabilities": ["core"],
	"console": {
		"level": "error"
	},
	"outputDir": "artifacts/playwright-mcp/core",
	"imageResponses": "omit",
	"snapshot": {
		"mode": "none"
	},
	"codegen": "none",
	"timeouts": {
		"action": 7000,
		"navigation": 60000,
		"expect": 7000
	}
}
```

#### 自身定位

- Headless Chrome。
- 独立且一次性的 Browser Context。
- 不自动返回图片。
- 操作后不自动返回完整 Accessibility Snapshot。
- 只默认保留 Console Error。
- 不自动生成测试代码。
- 需要页面结构时，Agent 显式调用局部 Snapshot。
- Network、Console、Evaluate、截图等核心能力仍然可用。

#### 承担的职责

- 打开 localhost 页面
- 点击、输入和表单验证
- 读取页面语义结构
- 检查 Console Error
- 列出和读取目标 API 请求
- 读取 DOM、boundingBox 和 computedStyle
- Mock 或验证业务流程
- 临时截图，但不把图片自动放入模型上下文

### pw_visual

`tools/mcp/playwright/visual.json`

#### 核心配置如下

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
			"deviceScaleFactor": 1,
			"locale": "zh-CN",
			"timezoneId": "Asia/Singapore",
			"colorScheme": "light",
			"reducedMotion": "reduce",
			"serviceWorkers": "block"
		}
	},
	"capabilities": ["core", "devtools"],
	"console": {
		"level": "warning"
	},
	"outputDir": "artifacts/playwright-mcp/visual",
	"imageResponses": "allow",
	"snapshot": {
		"mode": "none"
	},
	"codegen": "typescript",
	"timeouts": {
		"action": 10000,
		"navigation": 60000,
		"expect": 10000
	}
}
```

#### 承担的职责

- 打开可见的本地 Google Chrome。
- 允许把截图发送给支持图片的 Agent。
- 加载 Playwright MCP 的 devtools Capability。

## 各个 AI agent 的本地级别 MCP 配置

### claude code

在项目根目录的 `.mcp.json` 内：

```json
{
	"mcpServers": {
		"pw_core": {
			"command": "pnpm",
			"args": [
				"exec",
				"playwright-mcp",
				"--config",
				"tools/mcp/playwright/core.json",
				"--output-mode",
				"file",
				"--output-max-size",
				"104857600"
			],
			"timeout": 120000
		},
		"pw_visual": {
			"command": "pnpm",
			"args": [
				"exec",
				"playwright-mcp",
				"--config",
				"tools/mcp/playwright/visual.json",
				"--output-mode",
				"file",
				"--output-max-size",
				"209715200"
			],
			"timeout": 600000
		}
	}
}
```

### codex

`.codex/config.toml`

```toml
[mcp_servers.pw_core]
command = "pnpm"
args = [
  "exec",
  "playwright-mcp",
  "--config",
  "tools/mcp/playwright/core.json",
  "--output-mode",
  "file",
  "--output-max-size",
  "104857600"
]
cwd = ".."
startup_timeout_sec = 30
tool_timeout_sec = 120
required = false
enabled = true
disabled_tools = ["browser_run_code_unsafe"]

[mcp_servers.pw_visual]
command = "pnpm"
args = [
  "exec",
  "playwright-mcp",
  "--config",
  "tools/mcp/playwright/visual.json",
  "--output-mode",
  "file",
  "--output-max-size",
  "209715200"
]
cwd = ".."
startup_timeout_sec = 30
tool_timeout_sec = 600
required = false
enabled = true
disabled_tools = ["browser_run_code_unsafe"]
```

### cursor

`.cursor/mcp.json`

内容基本与 Claude 相同，但 Cursor 支持 ${workspaceFolder}，最好显式写绝对工作区路径：

```json
{
	"mcpServers": {
		"pw_core": {
			"command": "pnpm",
			"args": [
				"exec",
				"playwright-mcp",
				"--config",
				"${workspaceFolder}/tools/mcp/playwright/core.json",
				"--output-mode",
				"file",
				"--output-max-size",
				"104857600"
			]
		},
		"pw_visual": {
			"command": "pnpm",
			"args": [
				"exec",
				"playwright-mcp",
				"--config",
				"${workspaceFolder}/tools/mcp/playwright/visual.json",
				"--output-mode",
				"file",
				"--output-max-size",
				"209715200"
			]
		}
	}
}
```
