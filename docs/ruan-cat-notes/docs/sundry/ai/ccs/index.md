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
