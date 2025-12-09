# Fetch MCP Server

主动访问 url，获取信息。特别是主动获取 url 提供的 md 信息。

- https://smithery.ai/server/fetch-mcp

```json
{
	"mcpServers": {
		"fetch-mcp": {
			"command": "cmd",
			"args": [
				"/c",
				"npx",
				"-y",
				"@smithery/cli@latest",
				"run",
				"fetch-mcp",
				"--key",
				"需要动态生成的key",
				"--profile",
				"需要动态生成的值"
			]
		}
	}
}
```

::: warning 不推荐

这个 mcp 工具是需要远程连接 smithery 的服务器的，经常出现连接失败的情况。故不打算继续使用该 mcp 了。换另外一个本地的，也能够获取 markdown 文档的 mcp。

:::
