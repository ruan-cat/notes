# Claude Code Switch,基于 CLIProxyAPI 的本地 AI 客户端代理工具

- 仓库： https://github.com/kaitranntt/ccs
- 文档： https://docs.ccs.kaitran.ca/introduction

## 安装

```bash
pnpm i -g @kaitranntt/ccs
```

## 常用命令

```bash
ccs config
# 打开仪表盘 http://localhost:3000
```

![2026-01-26-17-19-38](https://gh-img-store.ruan-cat.com/img/2026-01-26-17-19-38.png)

## 使用 gemini cli 模型出现 bug

- 相关 issue
  - https://github.com/router-for-me/CLIProxyAPI/issues/1243
  - https://github.com/kaitranntt/ccs/issues/219

```log
API Error: 400 {"error":{"code":400,"message":"The
    GenerateContentRequest proto is invalid:\n  *
    tools[0].function_declarations[24].name: [FIELD_INVALID] Invalid
    function name. Must start with a letter or an underscore. Must be
    a-z, A-Z, 0-9, or contain underscores (_), dots (.), colons (:),
    or dashes (-), with a maximum length of
    64.","status":"INVALID_ARGUMENT"}}
```

1. 我在特定项目内，发现这样的错误。
   > ![2026-01-26-19-37-51](https://gh-img-store.ruan-cat.com/img/2026-01-26-19-37-51.png)
   - 出现工具识别错误的情况。
2. 我判断是 mcp 工具命名过于冗长的缘故，超出了最大长度 64。在我手动修改 `.mcp.json` 的 MCP 工具名称从 `gitmcp__plus-pro-components__plus-pro-components` 长名称换成 `gitmcp__plus-pro-components` 短名称之后，就能正常运行了。
   > ![2026-01-26-19-42-00](https://gh-img-store.ruan-cat.com/img/2026-01-26-19-42-00.png)

## 项目无法启动

目前，这个版本是安全的，能够正常使用。没有故障。

```bash
pnpm i -g @kaitranntt/ccs@7.34.1
```
