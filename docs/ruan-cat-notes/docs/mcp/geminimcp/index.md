# geminimcp,claude code 用来调度 gemini 的 MCP

- 仓库： https://github.com/GuDaStudio/geminimcp

## claude code 全局安装命令

```bash
claude mcp add gemini -s user --transport stdio -- uvx --from git+https://github.com/GuDaStudio/geminimcp.git geminimcp
```

产生的配置：

```json
{
	"mcpServers": {
		"gemini": {
			"type": "stdio",
			"command": "uvx",
			"args": ["--from", "git+https://github.com/GuDaStudio/geminimcp.git", "geminimcp"]
		}
	}
}
```
