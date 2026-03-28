# apifox 链接 MCP 服务

可以使用 apifox 的工具，实现 AI 读取接口文档的数据。进而实现 AI 工具批量生成制定规则的接口。

## 配置 MCP

在 window 系统内，配置举例如下：

```json
{
	"mcpServers": {
		"01s-10wms-clone - API 文档": {
			"command": "cmd",
			"args": [
				"/c",
				"npx",
				"-y",
				"apifox-mcp-server@latest",
				"--site-id=5442571",
				"--registry=https://registry.npmmirror.com/"
			]
		}
	}
}
```

为了防止该依赖下载失败，这里额外配置了镜像源 `--registry=https://registry.npmmirror.com/` 。
