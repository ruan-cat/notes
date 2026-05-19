# 9router Kiro 与 vmess 出口 Runbook

本文记录在 VPS 内部署 9router，并把 Kiro 账号池作为 Sub2API 的备用/实验通道接入的调研结论与执行思路。

当前结论：**9router 适合先独立部署和管理 Kiro 账号池，再作为 OpenAI-compatible 上游接入 Sub2API**。不建议一开始就把 9router 强行改造成 Sub2API 的内嵌后台。

## 1. 当前适用边界

现有两份文档的覆盖范围如下：

|                文档                 |                      覆盖范围                       |                         不足                         |
| :---------------------------------: | :-------------------------------------------------: | :--------------------------------------------------: |
|             `index.md`              |     Sub2API、9router、CLIProxyAPI 的阶段性调研      |        对 Kiro 批量导入和 vmess 出口细节不够         |
| `sub2api-vps-deployment-runbook.md` | Sub2API 单体部署、Cloudflare、Caddy/Nginx、备份迁移 | 没有覆盖 9router、Kiro 账号池和 CLIProxyAPI 备选部署 |
|                本文                 |       9router、Kiro、vmess 出口、Sub2API 串联       |     后续仍需实际在 VPS 上验证账号导入和请求链路      |

因此，如果目标是“Sub2API + 9router + CLIProxyAPI + vmess 出口”，需要把部署拆成三层：

1. **Sub2API**：团队 Key、审计、月底核算、主入口。
2. **9router**：Kiro / AWS Builder ID / 免费 provider 的备用通道和独立后台。
3. **CLIProxyAPI**：保留为 Codex / Claude / Gemini 等 CLI 代理的实验或备选通道。

## 2. 推荐总体架构

```text
团队成员 / Codex / OpenAI SDK
  │
  ▼
Sub2API: https://api.ruan-cat.com
  │
  ├─ OpenAI / Codex / Claude / Gemini 主账号池
  │
  └─ 9router 低优先级上游
       │
       ▼
     9router: http://127.0.0.1:20128/v1
       │
       ├─ Kiro 账号池
       ├─ 其他免费/实验 provider
       └─ Proxy Pools
            │
            ▼
          vmess / clash / xray / sing-box 出口
```

关键点：

1. 对外只暴露 Sub2API。
2. 9router 默认只监听 VPS 本机或内网，不直接对公网开放。
3. Kiro 账号先在 9router 管理。
4. Sub2API 中把 9router 当作 OpenAI-compatible 上游。
5. 9router 里的 Kiro 请求可以绑定 Proxy Pools，走不同出口。

## 3. 9router 对 Kiro 的当前支持

9router 当前已经支持 Kiro provider。代码中可见的 Kiro 接入方式包括：

|           接入方式           |                    入口                     |                     说明                     |
| :--------------------------: | :-----------------------------------------: | :------------------------------------------: |
|        AWS Builder ID        | Dashboard -> Connect Kiro -> AWS Builder ID |             走 device code flow              |
|   AWS IAM Identity Center    |      Dashboard -> Connect Kiro -> IDC       |       需要输入 IDC start URL 和 region       |
| Google / GitHub social OAuth |    代码中有 social authorize / exchange     |    UI 中相关按钮当前隐藏，需要进一步验证     |
|         Import Token         |  Dashboard -> Connect Kiro -> Import Token  |           粘贴 Kiro refresh token            |
|         Auto Import          |        `/api/oauth/kiro/auto-import`        | 从当前运行用户的 `~/.aws/sso/cache` 找 token |

Kiro 手动导入接口：

```text
POST /api/oauth/kiro/import
```

请求体：

```json
{
	"refreshToken": "aorAAAAAG..."
}
```

当前代码会：

1. 校验 refresh token 是否以 `aorAAAAAG` 开头。
2. 调用 Kiro token refresh 验证有效性。
3. 保存为 `provider = kiro`、`authType = oauth` 的 provider connection。
4. 尝试从 access token 的 JWT 中提取邮箱。

## 4. Kiro 批量导入判断

目前没有看到现成的 Kiro 批量导入接口。现有能力更接近：

|              能力              |              当前状态              |                    适合程度                    |
| :----------------------------: | :--------------------------------: | :--------------------------------------------: |
|    单个 refresh token 导入     |   已有 `/api/oauth/kiro/import`    |                  适合少量账号                  |
|  本机 AWS SSO cache 自动发现   | 已有 `/api/oauth/kiro/auto-import` | 只适合当前服务器用户已登录 Kiro/AWS SSO 的情况 |
|    批量 refresh token 导入     |          暂未看到现成接口          |     需要二次开发或写脚本循环调用单导入接口     |
|     批量 device code 登录      |             技术上困难             |         每个账号通常需要人工浏览器确认         |
| 批量 Google/GitHub social 登录 |             技术上困难             |         需要逐账号网页登录和 callback          |

实际可行方案分两类：

### 4.1 无代码方案

适合刚开始验证：

1. 在 9router Dashboard 中进入 Kiro provider。
2. 逐个使用 AWS Builder ID 或 Import Token 添加账号。
3. 在 Proxy Pools 中批量导入 vmess 转换后的代理出口。
4. 在 Kiro provider 详情页批量选择账号并绑定代理池。
5. 使用 9router API Key 测试 `kr/claude-sonnet-4.5` 等模型。

缺点：账号多时操作成本高。

### 4.2 小改造方案

适合账号池规模变大后：

1. 增加一个 `POST /api/oauth/kiro/import-batch`。
2. 入参支持一行一个 refresh token，或 JSON 数组。
3. 后端循环复用 `KiroService.validateImportToken()`。
4. 每个 token 成功后调用 `createProviderConnection()`。
5. 返回 created / skipped / failed 明细。
6. 前端在 Kiro provider 页面增加批量导入弹窗。

建议批量格式：

```text
aorAAAAAG...token1
aorAAAAAG...token2
aorAAAAAG...token3
```

或：

```json
{
	"items": [
		{ "name": "kiro-001", "refreshToken": "aorAAAAAG..." },
		{ "name": "kiro-002", "refreshToken": "aorAAAAAG..." }
	]
}
```

## 5. 在服务器内如何操作 Kiro 导入

服务器内可按以下顺序验证。

### 5.1 部署 9router

Docker 方式：

```bash
docker run -d \
	-p 127.0.0.1:20128:20128 \
	-v "$HOME/.9router:/app/data" \
	-e DATA_DIR=/app/data \
	-e PORT=20128 \
	-e HOSTNAME=0.0.0.0 \
	-e JWT_SECRET="$(openssl rand -hex 32)" \
	-e INITIAL_PASSWORD="请改成强密码" \
	-e API_KEY_SECRET="$(openssl rand -hex 32)" \
	-e MACHINE_ID_SALT="$(openssl rand -hex 32)" \
	--name 9router \
	decolua/9router:latest
```

本机验证：

```bash
curl -I http://127.0.0.1:20128
```

如果需要给自己远程访问 Dashboard，可以临时通过 SSH 隧道访问：

```bash
ssh -L 20128:127.0.0.1:20128 user@your-vps
```

然后本地浏览器打开：

```text
http://127.0.0.1:20128
```

### 5.2 获取或导入 Kiro refresh token

当前可行路径：

1. 在本地 Kiro IDE 登录账号。
2. 从本机 AWS SSO cache 或 9router 的 auto-import 能力定位 refresh token。
3. 手动粘贴到 9router Dashboard 的 Kiro Import Token。

如果 token 已经在服务器某文件内，可用单导入接口验证：

```bash
curl -X POST http://127.0.0.1:20128/api/oauth/kiro/import \
	-H "Content-Type: application/json" \
	-d '{"refreshToken":"aorAAAAAG..."}'
```

注意：该接口是否需要 Dashboard 登录 Cookie，需要按实际部署验证。9router 当前中间件主要保护 `/api/settings`、`/api/keys`、`/api/providers/client` 等路径，`/api/oauth/kiro/import` 是否暴露给未登录请求，需要实测确认。生产环境不应把 9router Dashboard 直接暴露公网。

### 5.3 生成 9router API Key

在 Dashboard 中创建 API Key，或调用：

```bash
curl -X POST http://127.0.0.1:20128/api/keys \
	-H "Content-Type: application/json" \
	-d '{"name":"sub2api-upstream"}'
```

如果接口启用了 Dashboard 鉴权，则需要通过浏览器后台创建。

### 5.4 测试 9router Kiro 模型

用 OpenAI-compatible endpoint 测试：

```bash
curl http://127.0.0.1:20128/v1/chat/completions \
	-H "Authorization: Bearer 9router-api-key" \
	-H "Content-Type: application/json" \
	-d '{
		"model": "kr/claude-sonnet-4.5",
		"messages": [
			{ "role": "user", "content": "hello" }
		],
		"stream": false
	}'
```

## 6. vmess 出口如何接入

vmess 不是 9router / Sub2API 可直接填写的代理 URL。需要先用代理客户端把 vmess 节点转换成本地 HTTP 或 SOCKS 出口。

推荐链路：

```text
vmess 节点
  │
  ▼
xray / clash / sing-box
  │
  ▼
本地 HTTP/SOCKS 代理端口
  │
  ▼
9router Proxy Pool
  │
  ▼
Kiro provider connection
```

可填写到 9router Proxy Pool 的格式示例：

```text
http://127.0.0.1:7890
socks5://127.0.0.1:7891
http://user:pass@127.0.0.1:7890
```

9router 的 Proxy Pools 页面已有批量导入能力，支持：

|      输入格式       |                示例                |
| :-----------------: | :--------------------------------: |
|     带协议 URL      |      `http://127.0.0.1:7890`       |
|     带协议 URL      |     `socks5://127.0.0.1:7891`      |
| host:port:user:pass | `proxy.example.com:8080:user:pass` |

需要注意：9router 当前 `proxyFetch` 使用 `undici.ProxyAgent`。虽然依赖中有 `socks-proxy-agent`，但当前代码路径主要使用 `undici.ProxyAgent`。因此 `socks5://` 是否能稳定工作需要实测；最稳妥是让 clash/xray/sing-box 提供 HTTP 代理端口给 9router。

## 7. Proxy Pools 与 Kiro 账号绑定

9router provider 详情页已有批量代理绑定能力：

1. 可选择多个 provider connections。
2. 可统一绑定到一个 proxy pool。
3. 可按账号顺序一对一分配 active proxy pools。

建议策略：

|     账号规模      |                        策略                        |
| :---------------: | :------------------------------------------------: |
| 1-5 个 Kiro 账号  |           先共用一个稳定 vmess HTTP 出口           |
| 5-20 个 Kiro 账号 |        建立多个 Proxy Pools，批量一对一绑定        |
|     20 个以上     | 需要记录账号、出口、失败率、冷却时间，避免无序扩张 |

## 8. 9router 与 Sub2API 如何整合

推荐先做“松耦合整合”：

1. 9router 独立运行在 VPS 本机 `127.0.0.1:20128`。
2. 在 9router 内管理 Kiro 账号池和代理池。
3. 在 9router 内创建一个 API Key，例如 `sub2api-upstream`。
4. 在 Sub2API 中创建 OpenAI-compatible 上游账号：
   - `platform`: `openai`
   - `type`: `apikey`
   - `base_url`: `http://host.docker.internal:20128/v1` 或 Docker 网络内地址
   - `api_key`: 9router 生成的 API Key
5. 将这个上游放入低优先级分组或备用分组。

如果 Sub2API 和 9router 都用 Docker 部署，建议让两者加入同一个 Docker network，避免走公网。

示意：

```text
Sub2API container
  │
  ▼
http://9router:20128/v1
  │
  ▼
9router container
```

## 9. 是否能统一成一个 Admin 后台

可以做，但不是当前现成功能。

|   方案   |                       做法                        |               推荐程度                |
| :------: | :-----------------------------------------------: | :-----------------------------------: |
|  松耦合  |    Sub2API 总控；Kiro 账号在 9router 后台管理     |            最高，最快落地             |
|  半集成  |   Sub2API 增加“外部 9router 节点”配置和跳转入口   |            中，开发量较小             |
| API 集成 | Sub2API 后台调用 9router 管理 API 导入 Kiro token | 中，需要处理 9router 鉴权和接口稳定性 |
| 深度合并 | 把 9router Kiro provider/executor 移植到 Sub2API  |        低，成本高、维护风险大         |

当前最务实的路线：

1. 不急着合并后台。
2. 先部署 9router，用它自己的 Dashboard 管 Kiro。
3. Sub2API 只把 9router 当一个低优先级 OpenAI-compatible upstream。
4. 等链路稳定后，再考虑给 Sub2API 做一个“9router 节点管理”页面。

## 10. CLIProxyAPI 的位置

CLIProxyAPI 仍然更适合作为备选运行时，而不是主控台：

|    项目     |                    适合角色                    |
| :---------: | :--------------------------------------------: |
|   Sub2API   |        团队 Key、审计、月底核算、主入口        |
|   9router   |  Kiro 与免费 provider 备用通道，带 Dashboard   |
| CLIProxyAPI | Codex / Claude / Gemini CLI 代理实验或局部适配 |

CLIProxyAPI 支持全局和单账号 `proxy-url`，并支持 socks5/http/https 代理。它可以接入 vmess 转换出的本地 HTTP/SOCKS 端口，但它当前并不是 Kiro 管理的首选工具。

## 11. 后续需要验证的问题

|                    问题                    |            当前判断             |               验证方式               |
| :----------------------------------------: | :-----------------------------: | :----------------------------------: |
|        Kiro 批量导入是否已有隐藏 UI        | 暂未看到，当前只有单 token 导入 | 在 Dashboard 实测 Kiro provider 页面 |
|   `/api/oauth/kiro/import` 是否要求登录    |  代码中未见专门保护，需要实测   |    未登录 curl 与登录后 curl 对比    |
| `socks5://` 在 9router Proxy Pool 是否稳定 |            需要实测             |      优先使用 HTTP 代理端口规避      |
|     Sub2API 到 9router 的模型名兼容性      |            理论可行             |     测试 `kr/claude-sonnet-4.5`      |
|      Cloudflare 橙云是否影响流式请求       |         可能影响长流式          |      先橙云，出现 524 后改灰云       |
|           统一 Admin 后台开发量            |             中到高              |       等松耦合方案稳定后再设计       |

## 12. 参考来源

- 9router 仓库：https://github.com/decolua/9router
- 9router 架构说明：https://github.com/decolua/9router/blob/master/docs/ARCHITECTURE.md
- 9router Docker 说明：https://github.com/decolua/9router/blob/master/DOCKER.md
- 9router Kiro OAuth 服务：https://github.com/decolua/9router/blob/master/src/lib/oauth/services/kiro.js
- 9router Kiro 导入接口：https://github.com/decolua/9router/blob/master/src/app/api/oauth/kiro/import/route.js
- 9router Proxy Pools 接口：https://github.com/decolua/9router/blob/master/src/app/api/proxy-pools/route.js
- CLIProxyAPI 仓库：https://github.com/router-for-me/CLIProxyAPI/
- CLIProxyAPI 配置示例：https://github.com/router-for-me/CLIProxyAPI/blob/main/config.example.yaml
