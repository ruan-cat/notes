# promptx

据说是一个提示词与 AI 角色管理工具，用起来稍显怪异。故暂时（2025-7-3）不使用。

该工具似乎不能够自定义提示词，预设的前端开发者角色使用的提示词，不一定能够满足业务需求。

```json
{
	"mcpServers": {
		"promptx": {
			"command": "cmd",
			"args": ["/c", "npx", "-y", "-f", "--registry", "https://registry.npmjs.org", "dpml-prompt@latest", "mcp-server"]
		}
	}
}
```

## 默认占用非常大的上下文

如图所示，promptx 占用了很多上下文。故应该谨慎使用。

![2025-09-27-12-34-27](https://gh-img-store.ruan-cat.com/img/2025-09-27-12-34-27.png)
