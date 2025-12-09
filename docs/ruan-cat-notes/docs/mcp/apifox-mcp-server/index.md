# apifox-mcp-server

apifox 的官方 mcp，用于链接 apifox 文档。主要用于读取 apifox 接口文档。目前不包括修改 apifox 文档。

```json
{
	"mcpServers": {
		"01s-10wms-clone - API 文档": {
			"command": "cmd",
			"args": ["/c", "npx", "-y", "apifox-mcp-server@latest", "--site-id=5442571"]
		}
	}
}
```
