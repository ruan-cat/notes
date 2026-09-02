# 在 agent.minimaxi.com 内使用

> 本节为基于 2026-09-02 实际沙箱调研的笔记，目标是把"能干嘛、不能干嘛、怎么绕"沉淀成可复用规范。

## TL;DR

- **有云 Linux 环境**（ACK / 阿里云容器服务），但出网被阿里云 egress proxy 接管
- **不能**直连 `*.workers.dev`（DNS 劫持到非 CF IP）
- **能**直连 GitHub / Vercel / Neon / Cloudflare 主站
- **能**装 gh、vercel、MCP SDK 三个核心 CLI，但要**走镜像**（gh-proxy / npmmirror / aliyun-pypi）
- **必须**自带 MCP 客户端（官方 `mcp` 包只给服务器 dev 用），我自研了 `mcpc`

## 沙箱网络黑白名单

### ✅ 直连通（出网代理透传）

| 域名                            | 用途                      |
| ------------------------------- | ------------------------- |
| `github.com` / `api.github.com` | GitHub Web / REST         |
| `api.githubcopilot.com`         | **GitHub MCP** 端点       |
| `vercel.com` / `api.vercel.com` | Vercel Web / API          |
| `mcp.vercel.com`                | **Vercel MCP** 端点       |
| `mcp.neon.tech`                 | **Neon MCP** 端点         |
| `cloudflare.com`                | Cloudflare 主站（仅主页） |

### ❌ DNS 劫持 / 端口被挡

| 域名            | 现象                                   | 解决                                          |
| --------------- | -------------------------------------- | --------------------------------------------- |
| `*.workers.dev` | DNS 被改成 `199.59.149.237` 等非 CF IP | **无解**，考虑把 MCP 部署到 Vercel 或自定义域 |

### ⚠️ 慢到挂 / 超时（必须镜像）

| 资源                                   | 镜像                                      |
| -------------------------------------- | ----------------------------------------- |
| `github.com/.../releases/download/...` | `https://gh-proxy.com/<原 URL>`           |
| `registry.npmjs.org`                   | `https://registry.npmmirror.com`          |
| `pypi.org` / 清华源 / 豆瓣             | `https://mirrors.aliyun.com/pypi/simple/` |

### 沙箱代理指纹

`curl -v` 看证书 issuer，如果出现：

```plain
subject: O=hangzhou; OU=alibaba cloud; CN=ack-agent-identity-proxy
```

说明你正经过沙箱的 egress proxy。**主流域名被透明代理**，可疑域名（特别是 `*.workers.dev`）会被劫持。

## CLI 速通安装

### `gh` CLI

```bash
# 走 gh-proxy 镜像
curl -fsSL -o /tmp/gh.tgz \
  "https://gh-proxy.com/https://github.com/cli/cli/releases/download/v2.62.0/gh_2.62.0_linux_amd64.tar.gz"
cd /tmp && tar -xzf gh.tgz \
  && cp gh_2.62.0_linux_amd64/bin/gh /usr/local/bin/ \
  && chmod +x /usr/local/bin/gh
gh --version   # gh version 2.62.0
```

### `vercel` CLI

```bash
# 切 npmmirror
npm config set registry https://registry.npmmirror.com
npm install -g vercel
vercel --version   # Vercel CLI 59.11.1
```

### Python `mcp` SDK

```bash
# 用 venv 绕 PEP 668
python3 -m venv /workspace/mcp-venv
source /workspace/mcp-venv/bin/activate

# 切 aliyun pip 镜像
pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/
pip config set global.trusted-host mirrors.aliyun.com

# 官方 SDK + 高层封装
pip install mcp      # mcp 2.1.1 (Model Context Protocol, LF Projects)
pip install fastmcp  # fastmcp 4.0.0
```

> `mcp` 包归属：Publisher 是 `Model Context Protocol a Series of LF Projects, LLC`（Linux Foundation 旗下），最初由 Anthropic 工程师主导，移交到 MCP org 维护。License MIT。**`pip install mcp` 即是当前最标准的 Python 装法**。

## `mcpc`：自研通用 MCP 客户端 CLI

官方 `mcp` 包**自带的 `mcp` 命令是给服务器端 dev 用的**（`dev` / `run` / `install`），没有"一键调任意远程 MCP"的能力。

我写了 150 行的 `mcpc`，把 `ClientSession` + `streamable_http_client` 包成一行 shell：

```bash
# 信息
mcpc info   --token-env GITHUB_PAT_TOKEN https://api.githubcopilot.com/mcp/

# 列工具
mcpc list   --token-env GITHUB_PAT_TOKEN https://api.githubcopilot.com/mcp/

# 看 schema
mcpc schema --token-env GITHUB_PAT_TOKEN https://api.githubcopilot.com/mcp/ pull_request_read

# 调用
mcpc call   --token-env GITHUB_PAT_TOKEN --raw \
  https://api.githubcopilot.com/mcp/ pull_request_read \
  '{"owner":"ruan-cat","repo":"monorepo","pullNumber":154,"method":"get"}'
```

**特性**：

- `--token-env` 从 `secret` 工具引用 token，不接触明文
- args 既能内联 JSON，也能 `@file.json`
- `--raw` 模式只输出工具真实 result（剥离 MCP envelope）
- 输出纯 JSON 到 stdout，可 pipe 到 `jq` / `python3 -m json.tool`

## 三个 MCP 实测

| MCP        | 端点                                 | 工具数  | 实测                                                             |
| ---------- | ------------------------------------ | ------- | ---------------------------------------------------------------- |
| GitHub MCP | `https://api.githubcopilot.com/mcp/` | 44      | `get_me`、`pull_request_read`（PR #154）、`search_pull_requests` |
| Vercel MCP | `https://mcp.vercel.com`             | 37      | `list_teams`、`list_projects`（27 个项目）、`list_deployments`   |
| Neon MCP   | `https://mcp.neon.tech/mcp`          | **104** | `list_organizations`（2 orgs）、`list_projects`、`list_regions`  |

**Neon MCP 警告**：server 声明 `Write mode active`，破坏性工具（`delete_*` / `reset_*`）**必须**先经用户确认。

## 与 `mcode-tools` 的关系

沙箱**预装**了 `/usr/local/bin/mcode-tools`（`@minimax/mcode-tools@0.0.3`），是个独立的 connector 客户端：

- 调 MiniMax Matrix 多媒体 AI（image / video / TTS / vision / ...）
- 通过 `mcode-tools connector call connector__matrix__*` 调用
- 通过 `mcode-tools get-asset-url` / `upload-temp-url` 拿 Drive 资源

**与 `mcpc` 不冲突**，各管一摊：

- `mcode-tools` → 沙箱内置 MiniMax 多媒体
- `mcpc` → 直连任意 MCP server

## 使用建议（基于这次实际经验）

### ✅ DO

- 用 `mcpc` 调远程 MCP，token 走 `secret` 工具
- 装 CLI 第一时间试官方源，不通就上镜像（gh-proxy / npmmirror / aliyun-pypi）
- 复杂的 args 写到 `@file.json` 里，避免 shell 转义
- MCP 工具调用前先 `mcpc schema` 看真实入参（MCP 字段命名跟原生 API 不一样）

### ❌ DON'T

- 不要相信 GitHub MCP 给你所有原生 GitHub API 字段（它会做 normalize，`path` → `filename`、嵌套到 `details` 等）
- 不要把 token 明文贴聊天里 —— 用 `secret` 工具存
- 不要假定 `*.workers.dev` 域能从沙箱访问到（DNS 劫持）
- 不要让 Neon MCP 调 `delete_*` 工具，除非用户明确同意
- 不要假定沙箱的 `gh` / `vercel` / `mcp` 长期存活 —— 沙箱 reset 后要重装

## 后续待办

- [ ] `mcpc` 加 `stdio` transport 支持
- [ ] `mcpc` 加 session cache（避免每次重启 MCP session）
- [ ] 写 `install-cli <name>` 一键脚本自动化第 3 节
- [ ] 评估 MCP server 替代域：是否需要在 Vercel 或自定义域部署 skill-router-mcp 镜像

---

> 报告生成时间：2026-09-02
> 工具链版本：`gh` 2.62.0 · `vercel` 59.11.1 · `mcp` 2.1.1 · Python 3.11.2 · Node v22.19.0
