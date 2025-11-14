# MCP NPX Fetch

- https://glama.ai/mcp/servers/@tokenizin-agency/mcp-npx-fetch?locale=zh-CN#readme-md
- https://github.com/tokenizin-agency/mcp-npx-fetch

只提供本地版：

```json
{
	"mcpServers": {
		"fetch-mcp": {
			"command": "cmd",
			"args": ["/c", "npx", "-y", "@tokenizin/mcp-npx-fetch"]
		}
	}
}
```

## 不好用

我觉得这个是垃圾 MCP，实际用起来，太容易获取到过多的上下文了，很容易超限。

对于 claude code 而言，还是要用 `Fetch` 或 `WebFetch` 来实现最好，获取的上下文不会太太多，token 不会超限。

应该更多的让 claude code 主动使用原生的，自带的 markdown 云链接获取工具。
