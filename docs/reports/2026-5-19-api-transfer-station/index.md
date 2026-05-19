# 自建 API 中转站

我想弄一个 Codex / GPT 号池，也在探索是否可以基于 Kiro、AWS 或其他工具做备用号池。

本文记录自建中转平台的阶段性调研结论，避免后续继续研究时丢失上下文。

调研时间：2026-05-14。

## 1. 当前结论

当前更适合的主线是：

1. **Sub2API 做主平台**：负责团队成员 Key 分发、账号池调度、用量审计、月底核算。
2. **9router 做备用/实验/低优先级通道**：尤其适合承接 Kiro 这类 Sub2API 暂未原生支持的 provider。
3. **CLIProxyAPI 暂不作为主平台**：它更像 CLI/OAuth provider 的代理和适配器，不适合作为 30 人团队的计费与审计主控台。

我的当前需求不是强制限额拦截，而是 **只做用量审计**：统计谁用了多少，方便月底核算。因此平台选择时，核心优先级是账号池可维护性、团队 Key 归属、用量日志、月度汇总，而不是复杂的实时扣费。

## 2. 项目关系对比

|    项目     |             定位              |                        和本方案的关系                        | 适合程度 |
| :---------: | :---------------------------: | :----------------------------------------------------------: | :------: |
|   Sub2API   |         完整中转平台          |       主平台，承担账号池、用户 Key、审计、未来配额能力       |    高    |
|   9router   |    本地 AI provider 路由器    | 备用/实验通道，尤其用于 Kiro、Cursor、Codex 等 provider 适配 |    中    |
| CLIProxyAPI | CLI/OAuth provider 代理运行时 |           可作为局部适配器，不适合做团队主账务平台           |   中低   |

Sub2API 与 CLIProxyAPI 暂未看到直接依赖、fork 或上下游关系。两者定位不同：Sub2API 更偏 SaaS 化网关和控制面；CLIProxyAPI 更偏 CLI/OAuth provider 代理与协议转换。

## 3. Sub2API 可接入渠道

从 Sub2API 当前代码看，原生平台常量主要是：

- `anthropic`
- `openai`
- `gemini`
- `antigravity`

账号类型包括：

- `oauth`
- `setup-token`
- `apikey`
- `upstream`
- `bedrock`
- `service_account`

|    渠道 / 账号     | Sub2API 是否适合原生接入 |                 推荐方式                 |                          备注                          |
| :----------------: | :----------------------: | :--------------------------------------: | :----------------------------------------------------: |
|       Codex        |            是            |             `openai + oauth`             | 支持 Codex session / access token / refresh token 导入 |
|     OpenAI API     |            是            |            `openai + apikey`             |      可填官方 `api_key`，也可填自定义 `base_url`       |
| GPT / ChatGPT 账号 |     是，但取决于凭据     |    优先用 OpenAI OAuth refresh token     |     如果只有短期 access token，过期后不可自动续期      |
| Claude / Anthropic |            是            |      OAuth / setup-token / API Key       |               Sub2API 的传统主力场景之一               |
|       Gemini       |            是            | OAuth / API Key / Vertex Service Account |                 支持 Google 侧多种接法                 |
|    Antigravity     |            是            |             OAuth 或专用上游             |             支持 Claude 和 Gemini 模型端点             |
|    AWS Bedrock     |            是            |          `anthropic + bedrock`           |                这是 Bedrock，不是 Kiro                 |
|     Vertex AI      |            是            |   `gemini/anthropic + service_account`   |              使用 Google Service Account               |
|        Kiro        |   否，暂未看到原生平台   |  先接 9router，再让 Sub2API 接 9router   |                适合作为低优先级备用通道                |

需要特别区分：**Kiro AWS 账号不等于 AWS Bedrock 账号**。Sub2API 支持 Bedrock，但当前没有看到原生 `kiro` 平台。9router 则明确有 Kiro provider / executor 语义，所以 Kiro 更适合走 9router。

## 4. 批量导入与号池方案

### 4.1 GPT / OpenAI / Codex 账号池

按凭据类型分三种情况：

|            手里的凭据             |        推荐导入方式         | 可持续性 |
| :-------------------------------: | :-------------------------: | :------: |
|   OpenAI / Codex refresh token    | OpenAI OAuth 批量验证并创建 |    高    |
| Codex session JSON / access token |   Codex session 导入接口    |    中    |
|          OpenAI API Key           |      通用账号批量创建       |    高    |
|        浏览器 sessionToken        |     不建议作为长期凭据      |    低    |

Sub2API 中可用的导入路径：

- `POST /api/v1/admin/accounts/import/codex-session`
  - 用于导入 Codex session JSON、access token、包含 token 的 JSON 数组或逐行 token。
  - 如果包含 `refresh_token`，可后续续期。
  - 如果只有 `access_token`，过期后无法自动续期。
  - 代码中会忽略 `sessionToken`，不会把它保存为 OAuth `refresh_token`。

- OpenAI RT 批量验证创建
  - 前端逻辑支持“一行一个 refresh token”批量验证并创建 OpenAI OAuth 账号。
  - 默认适合 Codex CLI client，也有 Mobile RT client_id 的分支。

- `POST /api/v1/admin/accounts/batch`
  - 通用批量创建账号。
  - 适合批量导入 OpenAI API Key、Bedrock、Gemini API Key 等结构化账号。

- `POST /api/v1/admin/accounts/data`
  - 通用数据导入。
  - 适合迁移或一次性导入包含代理、账号配置的数据包。

OpenAI API Key 批量导入时，一个账号可以抽象成：

```json
{
	"name": "openai-001",
	"platform": "openai",
	"type": "apikey",
	"credentials": {
		"base_url": "https://api.openai.com",
		"api_key": "sk-..."
	},
	"group_ids": [1],
	"concurrency": 3,
	"priority": 50
}
```

如果是第三方 OpenAI-compatible 上游，也可以把 `base_url` 改成对应上游地址。

### 4.2 Kiro / AWS 账号池

Kiro 这条线建议不要直接塞进 Sub2API，而是：

1. 在 9router 内导入 Kiro / AWS Builder / CodeWhisperer 相关凭据。
2. 让 9router 暴露 OpenAI-compatible `/v1/*`。
3. 在 Sub2API 中创建 `openai + apikey` 账号，把 `base_url` 指向 9router。
4. 将这些账号放入独立分组，或设置更低优先级，作为备用/实验通道。

如果手里是真 AWS Bedrock 凭据，则不需要 9router：

```json
{
	"name": "bedrock-001",
	"platform": "anthropic",
	"type": "bedrock",
	"credentials": {
		"auth_mode": "sigv4",
		"aws_region": "us-east-1",
		"aws_access_key_id": "...",
		"aws_secret_access_key": "..."
	}
}
```

Bedrock 支持 `sigv4` 和 `apikey` 两种认证模式，还可配置 `aws_session_token`、region、模型映射和 pool mode。

## 5. 30 人团队审计设计

当前更适合采用“用户 Key 审计”而不是“严格实时扣费”：

1. 每个团队成员在 Sub2API 内分配独立用户或独立 API Key。
2. 账号池按平台和风险隔离：
   - OpenAI / Codex 主池。
   - Claude / Anthropic 主池。
   - Gemini 主池。
   - 9router / Kiro 备用池。
3. 月底按用户、API Key、模型、上游账号维度导出用量。
4. 先不强制拦截超额，只做统计和核算。
5. 未来如需要，再开启余额、配额、rate limit 或订阅模式。

Sub2API 的账号调度不是简单轮询。OpenAI 调度会参考优先级、负载、等待队列、错误率、首 token 延迟等指标。为了让 9router / Kiro 低优先级运行，可以把它放在独立分组，或给它设置更低调度优先级。

## 6. VPS 部署与 Cloudflare 域名绑定

`ruan-cat.com` 已经托管到 Cloudflare 并不影响把 Sub2API 绑定到这个域名体系下。更推荐不要直接占用根域名 `ruan-cat.com`，而是新建一个独立子域名，例如：

- `api.ruan-cat.com`
- `sub2api.ruan-cat.com`
- `ai-api.ruan-cat.com`

后续实际部署时，按独立执行手册推进：

- [Sub2API VPS 部署 Runbook](./sub2api-vps-deployment-runbook.md)
- [9router Kiro 与 vmess 出口 Runbook](./9router-kiro-vmess-runbook.md)

后续拿到 VPS 的固定公网 IP 后，在 Cloudflare DNS 中新增记录即可：

|        场景        | DNS 记录类型 |          名称           |       内容       |               备注               |
| :----------------: | :----------: | :---------------------: | :--------------: | :------------------------------: |
| VPS 有固定 IPv4 IP |     `A`      |          `api`          |  VPS 公网 IPv4   |     最常见，推荐优先使用该项     |
| VPS 有固定 IPv6 IP |    `AAAA`    |          `api`          |  VPS 公网 IPv6   |      仅 IPv6 场景或双栈补充      |
| VPS 只给主机名地址 |   `CNAME`    |          `api`          | VPS 服务商主机名 | 适合没有固定 IP 但有稳定主机名时 |
|  根域名已经有用途  |      -       | `ruan-cat.com` 不直接改 |        -         | 避免影响现有文档站或其他线上服务 |

Cloudflare 的代理状态需要按实际使用效果选择：

|        模式        |          优点           |                         风险 / 适用条件                         |
| :----------------: | :---------------------: | :-------------------------------------------------------------: |
| Proxied，橙云开启  | 隐藏源站 IP，带 WAF/CDN | Cloudflare 有代理读超时限制；长时间无数据的流式请求可能触发 524 |
| DNS only，灰云关闭 |  链路更直接，问题更少   | 会暴露 VPS 源站 IP，需要依赖 VPS 防火墙、Caddy/Nginx 和系统安全 |

Sub2API 是 API 网关，未来会承载 Codex / OpenAI / Claude / Gemini 等流式请求。初始可以先用 Cloudflare Proxied 模式获得更好的入口防护；如果后续遇到流式请求中断、524、长请求超时，再把该子域名切换为 DNS only，并加强 VPS 防火墙。

推荐部署拓扑：

```text
api.ruan-cat.com
  │
  ▼
Cloudflare DNS / WAF，可选橙云代理
  │
  ▼
VPS: Caddy 或 Nginx 负责 HTTPS 与反向代理
  │
  ▼
Sub2API Docker Compose
  ├─ sub2api
  ├─ PostgreSQL
  └─ Redis
```

VPS 内建议采用 Docker Compose local 目录版部署 Sub2API：

1. 使用 `docker-compose.local.yml`。
2. 数据落在 `data/`、`postgres_data/`、`redis_data/`。
3. `PostgreSQL` 和 `Redis` 不暴露到公网，只在 Docker 内部网络访问。
4. `Sub2API` 监听本机 `8080`，由 Caddy/Nginx 转发 HTTPS 流量。
5. 定期打包备份整个部署目录，便于迁移到新 VPS。

后续实际部署前，需要补齐 VPS 信息：

|     信息项      |                  需要确认的内容                  |
| :-------------: | :----------------------------------------------: |
|    系统版本     |      Ubuntu 22.04/24.04、Debian 12，或其他       |
|    机器规格     |            CPU、内存、磁盘容量、带宽             |
|    公网地址     |           IPv4、IPv6、是否固定公网 IP            |
|    登录方式     |        SSH 端口、用户名、是否支持 SSH Key        |
|   域名子域名    |     最终使用 `api.ruan-cat.com` 还是其他名称     |
| Cloudflare 模式 | 初始使用 Proxied 还是 DNS only，部署后按表现调整 |
|  反向代理方案   |      推荐 Caddy；如用 Nginx 需额外注意配置       |

如果使用 Nginx 反向代理并搭配 Codex CLI，需要在 Nginx 的 `http` 块中添加：

```nginx
underscores_in_headers on;
```

否则 Nginx 可能丢弃名称中带下划线的请求头，例如 `session_id`，进而影响多账号环境下的粘性会话。

## 7. 仓库与 fork 策略

当前阶段不需要先 fork Sub2API。只要目标是部署和配置，而不是修改 Sub2API 功能，优先使用官方镜像与官方部署文件即可。

建议把“运行平台”和“部署配置”分开管理：

|   仓库 / 资产    | 当前是否需要 |                             推荐用途                             |
| :--------------: | :----------: | :--------------------------------------------------------------: |
|   Sub2API fork   |   暂不需要   |     只有修改 Sub2API 后台、账号导入、调度或审计逻辑时再 fork     |
|   9router fork   | 后续可能需要 |          如果要做 Kiro 批量导入接口，优先 fork 9router           |
| CLIProxyAPI fork |   暂不需要   |        只有要改 CLIProxyAPI provider / 管理 API 时再 fork        |
| 私有部署配置仓库 |   建议准备   | 存放 compose、Caddyfile、脱敏 `.env.example`、备份脚本和部署记录 |
| 当前 notes 仓库  |   已在使用   |            继续存放调研、Runbook、架构决策和执行记录             |

推荐新建一个私有 GitHub 仓库，例如：

```text
ruan-cat-ai-gateway-deploy
```

建议目录结构：

```text
README.md
sub2api/
  docker-compose.yml
  .env.example
  Caddyfile
  backup.sh
9router/
  docker-compose.yml
  .env.example
  README.md
cliproxyapi/
  docker-compose.yml
  config.example.yaml
ops/
  checklist.md
  restore.md
```

这个私有部署仓库可以保存“可复现部署配置”，但不要提交真实密钥：

|             内容              | 是否可以提交 |                备注                |
| :---------------------------: | :----------: | :--------------------------------: |
|     `docker-compose.yml`      |      是      |   可以提交，注意不要内嵌真实密钥   |
|        `.env.example`         |      是      |         只写变量名和占位符         |
|            `.env`             |      否      | 真实密钥文件必须加入 `.gitignore`  |
|           Caddyfile           |      是      |      域名可保留，密钥不要写入      |
|           备份脚本            |      是      |       脚本内不要写死远端密码       |
|      Kiro refresh token       |      否      |             高敏感凭据             |
| OpenAI / Claude / Gemini 凭据 |      否      |             高敏感凭据             |
|    Cloudflare 全权限 Token    |      否      | 如需自动化，只用最小权限临时 Token |

fork 触发条件如下：

|               触发条件                |        应该 fork 哪个仓库         |                         原因                          |
| :-----------------------------------: | :-------------------------------: | :---------------------------------------------------: |
|            只部署 Sub2API             |            不需要 fork            |           官方镜像和 Docker Compose 已满足            |
|       只把 9router 接入 Sub2API       |            不需要 fork            |    Sub2API 可把 9router 当 OpenAI-compatible 上游     |
|     给 9router 增加 Kiro 批量导入     |           fork 9router            | Kiro provider、导入接口和 Proxy Pools 都在 9router 内 |
| 在 Sub2API 后台直接管理 9router 节点  | fork Sub2API，可能也 fork 9router | 需要新增 Sub2API 管理 UI/API，并对接 9router 管理接口 |
|    把 Kiro executor 移植进 Sub2API    |           fork Sub2API            |             属于深度功能改造，维护成本高              |
| 改 CLIProxyAPI 的 provider 或管理能力 |         fork CLIProxyAPI          |             属于 CLIProxyAPI 自身功能扩展             |

当前最务实的路线：

1. 暂不 fork Sub2API。
2. 暂不 fork 9router。
3. 先准备私有部署配置仓库。
4. 用官方镜像部署 Sub2API、9router、CLIProxyAPI。
5. 跑通 Kiro 账号池、vmess 出口和 Sub2API 串联。
6. 如果 Kiro 账号批量导入成为刚需，再 fork 9router 增加 `import-batch`。
7. 如果统一后台成为刚需，再评估是否 fork Sub2API 做“外部 9router 节点管理”。

## 8. 上游更新与维护策略

Sub2API、9router 和 CLIProxyAPI 都可能高频更新，后续部署到 VPS 后，关键不是让服务“自动无脑追 latest”，而是建立一个可控的更新节奏。

推荐策略：

1. 使用官方镜像和官方 compose 作为基础。
2. 订阅上游仓库 Release、Watch 或 commit 动态，及时知道更新。
3. 每周或每两周安排维护窗口，先备份，再逐个组件更新。
4. 更新顺序建议为 Sub2API、9router、CLIProxyAPI，不要一次同时更新全部组件。
5. 每次更新前记录镜像 digest 和部署目录备份。
6. 每次更新后做冒烟验证：管理后台、API Key、模型列表、流式请求、用量审计、9router Kiro 通道、CLIProxyAPI 备用通道。
7. 不建议生产环境直接用 Watchtower 之类工具自动更新 Sub2API，数据库迁移和账号池调度问题需要人工确认。
8. 如果以后交给 AI 代为升级，应要求 AI 严格执行 Runbook 内的 `### 16.6 AI 执行升级自检 SOP`，一次只升级一个组件，失败时立即停止并收集日志。

不同组件的更新方式：

|    组件     |                  推荐更新方式                   |                    风险点                     |
| :---------: | :---------------------------------------------: | :-------------------------------------------: |
|   Sub2API   | `docker compose pull` 后 `docker compose up -d` |    数据库迁移可能前进式，回滚依赖完整备份     |
|   9router   |    拉取最新镜像并重建容器，保留 `$DATA_DIR`     |    Kiro 登录、代理池、模型转换链路需要验证    |
| CLIProxyAPI |  拉取最新镜像并重建容器，保留配置与 auth 数据   | provider 配置、OAuth 凭据和协议兼容性需要验证 |

具体命令、AI 自检 SOP 和回滚流程记录在 [Sub2API VPS 部署 Runbook](./sub2api-vps-deployment-runbook.md) 的 `## 16. 更新与回滚`。

## 9. 风险与待验证问题

|          问题           |              当前判断              |                             后续动作                             |
| :---------------------: | :--------------------------------: | :--------------------------------------------------------------: |
|    GPT 账号凭据类型     |              还不明确              | 需要确认是 API Key、refresh token，还是短期 session/access token |
|      Kiro 凭据形态      |           需要进一步验证           |            需要实际跑 9router Kiro provider 导入流程             |
|      多账号稳定性       | 取决于 token、代理和 provider 风控 |               建议账号池分组、代理隔离、低并发启动               |
|      月度核算口径       |            已明确偏审计            |           后续定义用户、Key、模型、上游账号的报表字段            |
| Sub2API 与 9router 串联 |             技术上可行             |         需要验证 OpenAI-compatible 端点兼容性和日志归属          |
|   VPS 与域名配置细节    |      已确认 Cloudflare 可绑定      |       需要补齐 VPS 配置、公网 IP、SSH 登录方式和目标子域名       |
|    Kiro 批量导入需求    |          当前建议先不改造          |       实测账号规模后，再决定是否 fork 9router 增加批量导入       |
|    私有部署仓库准备     |            建议尽早建立            |       存放脱敏配置和脚本，不存放真实 token、密码、账号凭据       |
|    上游高频更新风险     |     不建议生产环境无脑自动更新     |        建立维护窗口、备份、镜像 digest 记录和冒烟验证流程        |

## 10. 来源索引

本轮调研主要依据以下仓库与代码文件，后续继续推进时应重新确认最新代码：

- Sub2API 仓库：https://github.com/Wei-Shaw/sub2api
- Sub2API Docker 部署说明：https://github.com/Wei-Shaw/sub2api/blob/main/deploy/README.md
- Sub2API Docker Compose local：https://github.com/Wei-Shaw/sub2api/blob/main/deploy/docker-compose.local.yml
- Sub2API 平台和账号类型：https://github.com/Wei-Shaw/sub2api/blob/main/backend/internal/domain/constants.go
- Sub2API Codex session 导入：https://github.com/Wei-Shaw/sub2api/blob/main/backend/internal/handler/admin/account_codex_import.go
- Sub2API OpenAI OAuth：https://github.com/Wei-Shaw/sub2api/blob/main/backend/internal/handler/admin/openai_oauth_handler.go
- Sub2API 管理端账号路由：https://github.com/Wei-Shaw/sub2api/blob/main/backend/internal/server/routes/admin.go
- Sub2API 账号创建前端：https://github.com/Wei-Shaw/sub2api/blob/main/frontend/src/components/account/CreateAccountModal.vue
- 9router 仓库：https://github.com/decolua/9router
- 9router 架构说明：https://github.com/decolua/9router/blob/master/docs/ARCHITECTURE.md
- 9router Docker 说明：https://github.com/decolua/9router/blob/master/DOCKER.md
- 9router Kiro OAuth 服务：https://github.com/decolua/9router/blob/master/src/lib/oauth/services/kiro.js
- 9router Kiro 导入接口：https://github.com/decolua/9router/blob/master/src/app/api/oauth/kiro/import/route.js
- 9router Proxy Pools 接口：https://github.com/decolua/9router/blob/master/src/app/api/proxy-pools/route.js
- CLIProxyAPI 仓库：https://github.com/router-for-me/CLIProxyAPI/
- CLIProxyAPI 配置示例：https://github.com/router-for-me/CLIProxyAPI/blob/main/config.example.yaml
- Cloudflare 创建 DNS 记录：https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/
- Cloudflare Proxy status：https://developers.cloudflare.com/learning-paths/get-started/domain-resolution/proxy-status/
- Cloudflare 524 超时说明：https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-5xx-errors/error-524/
