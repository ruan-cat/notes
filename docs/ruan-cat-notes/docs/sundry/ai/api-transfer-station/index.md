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

## 6. 风险与待验证问题

|          问题           |              当前判断              |                             后续动作                             |
| :---------------------: | :--------------------------------: | :--------------------------------------------------------------: |
|    GPT 账号凭据类型     |              还不明确              | 需要确认是 API Key、refresh token，还是短期 session/access token |
|      Kiro 凭据形态      |           需要进一步验证           |            需要实际跑 9router Kiro provider 导入流程             |
|      多账号稳定性       | 取决于 token、代理和 provider 风控 |               建议账号池分组、代理隔离、低并发启动               |
|      月度核算口径       |            已明确偏审计            |           后续定义用户、Key、模型、上游账号的报表字段            |
| Sub2API 与 9router 串联 |             技术上可行             |         需要验证 OpenAI-compatible 端点兼容性和日志归属          |

## 7. 来源索引

本轮调研主要依据以下仓库与代码文件，后续继续推进时应重新确认最新代码：

- Sub2API 仓库：https://github.com/Wei-Shaw/sub2api
- Sub2API 平台和账号类型：https://github.com/Wei-Shaw/sub2api/blob/main/backend/internal/domain/constants.go
- Sub2API Codex session 导入：https://github.com/Wei-Shaw/sub2api/blob/main/backend/internal/handler/admin/account_codex_import.go
- Sub2API OpenAI OAuth：https://github.com/Wei-Shaw/sub2api/blob/main/backend/internal/handler/admin/openai_oauth_handler.go
- Sub2API 管理端账号路由：https://github.com/Wei-Shaw/sub2api/blob/main/backend/internal/server/routes/admin.go
- Sub2API 账号创建前端：https://github.com/Wei-Shaw/sub2api/blob/main/frontend/src/components/account/CreateAccountModal.vue
- 9router 仓库：https://github.com/decolua/9router
- 9router 架构说明：https://github.com/decolua/9router/blob/master/docs/ARCHITECTURE.md
- CLIProxyAPI 仓库：https://github.com/router-for-me/CLIProxyAPI/
