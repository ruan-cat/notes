# chrome-devtools-mcp

一个能够调用 Chrome 浏览器并通过视觉功能操作浏览器的 mcp，由谷歌官方提供。

- 仓库： https://github.com/ChromeDevTools/chrome-devtools-mcp/
- [`🚀谷歌Chrome DevTools MCP彻底颠覆AI浏览器自动化！让Cursor、Claude Code、Codex CLI成浏览器控制神器，AI为你打工`](https://www.bilibili.com/video/BV1EynZzcEmh)

## 模仿其他配置写的 mcp 配置

```json
{
	"mcpServers": {
		"chrome-devtools": {
			"command": "cmd",
			"args": ["/c", "npx", "-y", "chrome-devtools-mcp@latest"]
		}
	}
}
```

## claude code 全局安装命令

- 按照特定范围安装 claude code 的 mcp： https://docs.claude.com/en/docs/claude-code/mcp#choosing-the-right-scope

```bash
claude mcp add chrome-devtools npx chrome-devtools-mcp@latest --scope user
```

产生的配置：

```json
{
	"mcpServers": {
		"chrome-devtools": {
			"type": "stdio",
			"command": "npx",
			"args": ["chrome-devtools-mcp@latest"],
			"env": {}
		}
	}
}
```

根据 claude code 的自检命令，应该写成：

```json
{
	"mcpServers": {
		"chrome-devtools": {
			"type": "stdio",
			"command": "cmd",
			"args": ["/c", "npx", "chrome-devtools-mcp@latest"],
			"env": {}
		}
	}
}
```
