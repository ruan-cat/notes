# mcp

这里记录一些常用的 mcp 配置 json，基于 window 系统 、npx 和 uvx 。

这里为了实现泛用性，故罗列出具体的 json 配置。

## apifox-mcp-server

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

## promptx

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

### 默认占用非常大的上下文

如图所示，promptx 占用了很多上下文。故应该谨慎使用。

![2025-09-27-12-34-27](https://gh-img-store.ruan-cat.com/img/2025-09-27-12-34-27.png)

## context7

据说是一个能够索引最新内容的工具。

- https://github.com/upstash/context7

本地版：

```json
{
	"mcpServers": {
		"context7": {
			"command": "cmd",
			"args": ["/c", "npx", "-y", "@upstash/context7-mcp"]
		}
	}
}
```

在线云端版本：

```json
{
	"mcpServers": {
		"context7": {
			"url": "https://mcp.context7.com/mcp"
		}
	}
}
```

## Fetch MCP Server

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

## MCP NPX Fetch

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

## chrome-devtools-mcp

一个能够调用 Chrome 浏览器并通过视觉功能操作浏览器的 mcp，由谷歌官方提供。

- 仓库： https://github.com/ChromeDevTools/chrome-devtools-mcp/
- [`🚀谷歌Chrome DevTools MCP彻底颠覆AI浏览器自动化！让Cursor、Claude Code、Codex CLI成浏览器控制神器，AI为你打工`](https://www.bilibili.com/video/BV1EynZzcEmh)

### 模仿其他配置写的 mcp 配置

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

### claude code 全局安装命令

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

## Office-Word-MCP-Server

阅读 docx 的 MCP。

- 仓库： https://github.com/GongRzhe/Office-Word-MCP-Server
- smithery： https://smithery.ai/server/@GongRzhe/Office-Word-MCP-Server

::: warning 不推荐全局安装

1. 消耗 token： 该 MCP 如果作为常驻的 MCP，太消耗 token 了，应该少用该 MCP。
2. 启动慢： 每次启动 claude code 时，速度都很慢。主要就是应该这个 MCP。

:::

### 安装网络版： claude code 全局安装命令

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

### 安装本地版

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

## 个人全局通用的 mcp.json

尽量实现频繁更新与配置：

::: details

<<< ./mcp.json

:::
