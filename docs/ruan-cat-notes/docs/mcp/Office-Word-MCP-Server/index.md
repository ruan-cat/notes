# Office-Word-MCP-Server

阅读 docx 的 MCP。

- 仓库： https://github.com/GongRzhe/Office-Word-MCP-Server
- smithery： https://smithery.ai/server/@GongRzhe/Office-Word-MCP-Server

::: warning 不推荐全局安装

1. 消耗 token： 该 MCP 如果作为常驻的 MCP，太消耗 token 了，应该少用该 MCP。
2. 启动慢： 每次启动 claude code 时，速度都很慢。主要就是应该这个 MCP。

:::

## 安装网络版： claude code 全局安装命令

```bash
claude mcp add --transport http gong-rzhe-office-word-mcp-server "https://server.smithery.ai/@GongRzhe/Office-Word-MCP-Server/mcp" --scope user
```

产生的配置：

```json
{
	"mcpServers": {
		"gong-rzhe-office-word-mcp-server": {
			"type": "http",
			"url": "https://server.smithery.ai/@GongRzhe/Office-Word-MCP-Server/mcp"
		}
	}
}
```

::: warning 效果不佳

云 MCP 工具太容易链接失败了。不能用。

:::

## 安装本地版

- https://github.com/GongRzhe/Office-Word-MCP-Server#method-2-without-installation-using-uvx

需要的配置：

```json
{
	"mcpServers": {
		"office-word-mcp-server": {
			"command": "uvx",
			"args": ["--from", "office-word-mcp-server", "word_mcp_server"]
		}
	}
}
```
