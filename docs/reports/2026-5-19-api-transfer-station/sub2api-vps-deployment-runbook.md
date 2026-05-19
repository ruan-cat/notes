# Sub2API VPS 部署 Runbook

本文用于指导在 VPS 上部署 Sub2API。目标读者包括未来接手部署的 AI CLI 工具，例如 Claude Code、Codex CLI，或人工运维人员。

当前建议方案：**单台 VPS + Docker Compose local 目录版 + Caddy/Nginx 反向代理 + Cloudflare DNS 子域名**。

如果本次部署还包含 9router、Kiro 账号池或 vmess 出口，请同时阅读：[9router Kiro 与 vmess 出口 Runbook](./9router-kiro-vmess-runbook.md)。

## 1. 部署目标

部署完成后，应形成以下拓扑：

```text
api.ruan-cat.com
  │
  ▼
Cloudflare DNS / WAF，可选橙云代理
  │
  ▼
VPS: Caddy 或 Nginx 提供 HTTPS 与反向代理
  │
  ▼
Sub2API Docker Compose
  ├─ sub2api
  ├─ PostgreSQL
  └─ Redis
```

优先使用 `api.ruan-cat.com` 作为示例子域名。实际部署前可改为 `sub2api.ruan-cat.com` 或 `ai-api.ruan-cat.com`。

## 2. 部署前必须确认的信息

在开始部署前，必须先补齐以下信息：

|       信息项        |               需要确认的内容                |                 备注                 |
| :-----------------: | :-----------------------------------------: | :----------------------------------: |
|      VPS 系统       |    Ubuntu 22.04/24.04、Debian 12，或其他    |        推荐 Ubuntu 24.04 LTS         |
|      机器规格       |          CPU、内存、磁盘容量、带宽          |        建议至少 2C / 4G / 40G        |
|      公网地址       |         IPv4、IPv6、是否固定公网 IP         |       固定 IPv4 最方便配置 DNS       |
|      SSH 信息       |        主机、端口、用户名、认证方式         |     推荐 SSH Key，不推荐长期密码     |
|     目标子域名      | `api.ruan-cat.com` 或其他 Cloudflare 子域名 |    不建议直接占用 `ruan-cat.com`     |
| Cloudflare 代理模式 |        Proxied 橙云或 DNS only 灰云         |   初始可橙云，遇到流式超时再改灰云   |
|    反向代理方案     |               Caddy 或 Nginx                | Caddy 简单；Nginx 需额外处理下划线头 |
|     管理员邮箱      |             Sub2API 管理员邮箱              |      例如 `admin@ruan-cat.com`       |
|     管理员密码      |             Sub2API 管理员密码              |       建议部署时生成并妥善保存       |

## 3. 敏感信息交接原则

不要在普通聊天记录中长期暴露 root 密码、Cloudflare 全权限 Token、Sub2API 管理员密码、上游 AI 账号凭据。

推荐顺序：

1. 使用临时 `deploy` 用户登录 VPS。
2. 使用 SSH Key 登录，而不是长期 root 密码。
3. 给 `deploy` 用户临时 `sudo` 权限。
4. 部署完成后，删除临时用户或撤销该用户的 SSH Key。
5. Cloudflare 如需自动改 DNS，只提供最小权限 API Token。
6. 上游账号池凭据等到 Sub2API 后台部署完成后再手动导入。

如果只能提供密码，部署完成后必须立即修改密码。

## 4. VPS 初始检查

登录 VPS 后先执行：

```bash
whoami
uname -a
uname -m
cat /etc/os-release
free -h
df -h
ip a
ss -tulpn
```

重点确认：

|  检查项  |         期望结果         |
| :------: | :----------------------: |
| CPU 架构 |  `x86_64` 或 `aarch64`   |
| 系统版本 | Ubuntu / Debian 稳定版本 |
|   内存   |    至少 2G，建议 4G+     |
|   磁盘   |   至少 30G，建议 40G+    |
| 公网地址 | 能找到公网 IPv4 或 IPv6  |
|   端口   |  22 可登录，80/443 可用  |

## 5. 基础软件准备

Ubuntu / Debian 可先安装基础工具：

```bash
sudo apt update
sudo apt install -y curl git vim tmux ca-certificates gnupg ufw openssl
```

建议所有长时间部署动作都在 `tmux` 中执行：

```bash
tmux new -s sub2api-deploy
```

断线后可恢复：

```bash
tmux attach -t sub2api-deploy
```

## 6. 安装 Docker 与 Compose

如果 VPS 未安装 Docker，优先使用 Docker 官方安装方式。安装完成后验证：

```bash
docker --version
docker compose version
sudo systemctl status docker --no-pager
```

将当前部署用户加入 `docker` 组：

```bash
sudo usermod -aG docker "$USER"
```

重新登录后验证：

```bash
docker ps
```

如果 `docker ps` 仍提示权限不足，可临时使用 `sudo docker` 和 `sudo docker compose` 完成部署。

## 7. Cloudflare DNS 准备

在 Cloudflare 中为 `ruan-cat.com` 新增子域名记录。

|        场景        | DNS 记录类型 | 名称  |       内容       |       代理状态建议       |
| :----------------: | :----------: | :---: | :--------------: | :----------------------: |
| VPS 有固定 IPv4 IP |     `A`      | `api` |  VPS 公网 IPv4   | 可先 Proxied，必要时灰云 |
| VPS 有固定 IPv6 IP |    `AAAA`    | `api` |  VPS 公网 IPv6   | 可先 Proxied，必要时灰云 |
| VPS 只有主机名地址 |   `CNAME`    | `api` | VPS 服务商主机名 |       视服务商情况       |

DNS 生效检查：

```bash
dig api.ruan-cat.com
nslookup api.ruan-cat.com
```

如果使用 Cloudflare Proxied 橙云，`dig` 返回的通常是 Cloudflare IP，不是 VPS 原始 IP。此时应在 Cloudflare 控制台核对源站记录是否正确。

## 8. 创建部署目录

建议统一部署到：

```bash
sudo mkdir -p /opt/sub2api-deploy
sudo chown -R "$USER":"$USER" /opt/sub2api-deploy
cd /opt/sub2api-deploy
```

## 9. 获取 Sub2API Docker 部署文件

推荐使用官方脚本准备 Docker Compose local 目录版：

```bash
curl -sSL https://raw.githubusercontent.com/Wei-Shaw/sub2api/main/deploy/docker-deploy.sh | bash
```

脚本会完成：

1. 下载 `docker-compose.local.yml`。
2. 下载 `.env.example`。
3. 生成 `.env`。
4. 自动生成 `JWT_SECRET`、`TOTP_ENCRYPTION_KEY`、`POSTGRES_PASSWORD`。
5. 创建 `data/`、`postgres_data/`、`redis_data/`。

执行完成后检查：

```bash
ls -la
test -f docker-compose.local.yml && echo "compose ok"
test -f .env && echo "env ok"
test -d data && test -d postgres_data && test -d redis_data && echo "data dirs ok"
```

## 10. 调整关键环境变量

编辑 `.env`：

```bash
vim .env
```

建议确认或修改：

```bash
BIND_HOST=127.0.0.1
SERVER_PORT=8080
SERVER_MODE=release
RUN_MODE=standard
TZ=Asia/Shanghai

ADMIN_EMAIL=admin@ruan-cat.com
ADMIN_PASSWORD=请生成强密码并妥善保存

POSTGRES_PASSWORD=请生成强密码并妥善保存
JWT_SECRET=请使用 openssl rand -hex 32
TOTP_ENCRYPTION_KEY=请使用 openssl rand -hex 32
```

`BIND_HOST=127.0.0.1` 的目的是避免 `8080` 直接暴露到公网。公网只暴露 `80/443`，由 Caddy 或 Nginx 转发。

如需生成密钥：

```bash
openssl rand -hex 32
```

## 11. 启动 Sub2API

启动服务：

```bash
docker compose -f docker-compose.local.yml up -d
```

查看容器：

```bash
docker compose -f docker-compose.local.yml ps
```

查看日志：

```bash
docker compose -f docker-compose.local.yml logs -f sub2api
```

本机健康检查：

```bash
curl -i http://127.0.0.1:8080/health
```

如果没有手动设置 `ADMIN_PASSWORD`，在日志中查找自动生成的管理员密码：

```bash
docker compose -f docker-compose.local.yml logs sub2api | grep "admin password"
```

## 12. 配置反向代理

### 12.1 Caddy 方案

Caddy 配置更简单，适合首选。

安装 Caddy 后，编辑 Caddyfile：

```bash
sudo vim /etc/caddy/Caddyfile
```

示例：

```caddyfile
api.ruan-cat.com {
	reverse_proxy 127.0.0.1:8080
}
```

检查并重载：

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
sudo systemctl status caddy --no-pager
```

### 12.2 Nginx 方案

如果使用 Nginx，需要在 `http` 块中开启下划线请求头：

```nginx
underscores_in_headers on;
```

站点配置示例：

```nginx
server {
	listen 80;
	server_name api.ruan-cat.com;

	location / {
		proxy_pass http://127.0.0.1:8080;
		proxy_http_version 1.1;
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "upgrade";
	}
}
```

检查并重载：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 13. 防火墙建议

如果使用 UFW：

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

不要开放：

| 端口 |    服务    |           处理方式           |
| :--: | :--------: | :--------------------------: |
| 5432 | PostgreSQL |    仅 Docker 内部网络访问    |
| 6379 |   Redis    |    仅 Docker 内部网络访问    |
| 8080 |  Sub2API   | 绑定 `127.0.0.1`，由反代访问 |

## 14. 外部验证

DNS 生效后，在本机或任意外部机器执行：

```bash
curl -I https://api.ruan-cat.com
curl -i https://api.ruan-cat.com/health
```

在浏览器访问：

```text
https://api.ruan-cat.com
```

登录管理员后台后，应先完成：

1. 修改并保存管理员密码。
2. 开启 2FA，如适用。
3. 创建团队用户或 API Key。
4. 创建账号分组。
5. 导入 OpenAI / Codex / Claude / Gemini 等上游账号。
6. 后续再接入 9router 备用通道。

## 15. 备份与迁移

Docker Compose local 目录版的优势是数据集中在部署目录。

备份前建议先停止服务：

```bash
cd /opt
docker compose -f /opt/sub2api-deploy/docker-compose.local.yml down
tar czf sub2api-deploy-$(date +%F-%H%M%S).tar.gz sub2api-deploy/
docker compose -f /opt/sub2api-deploy/docker-compose.local.yml up -d
```

如不想停机，也至少需要分别备份 PostgreSQL、Redis 和 `data/`。后续生产稳定后再设计热备份方案。

迁移到新 VPS：

```bash
scp sub2api-deploy-YYYY-MM-DD-HHMMSS.tar.gz user@new-vps:/opt/
ssh user@new-vps
cd /opt
tar xzf sub2api-deploy-YYYY-MM-DD-HHMMSS.tar.gz
cd sub2api-deploy
docker compose -f docker-compose.local.yml up -d
```

## 16. 更新与回滚

### 16.1 推荐更新策略

Sub2API、9router 和 CLIProxyAPI 都处在高频更新状态。生产环境不建议无条件自动追 `latest`，更推荐“及时发现、人工确认、备份后更新、冒烟验证、可回滚记录”的节奏。

推荐节奏：

1. 平时订阅上游仓库的 Release、Watch 或 commit 动态。
2. 每周或每两周固定一个维护窗口更新一次。
3. 遇到安全修复、上游协议失效、Codex / Kiro / OAuth 登录异常时，临时提前更新。
4. 每次更新只改一个主要组件，先 Sub2API，再 9router，最后 CLIProxyAPI。
5. 每次更新前记录旧镜像版本和部署目录备份，避免只知道“之前能用”，但不知道之前具体是哪一个镜像。

|    组件     |                           当前推荐更新方式                            |                 是否建议全自动                  |
| :---------: | :-------------------------------------------------------------------: | :---------------------------------------------: |
|   Sub2API   | 使用官方 `docker-compose.local.yml` 执行 `docker compose pull` 后重建 |   不建议生产自动更新，数据库迁移可能是前进式    |
|   9router   |  拉取 `decolua/9router:latest` 后重建容器，保留 `$DATA_DIR` 数据目录  | 不建议生产自动更新，Kiro 与代理链路需要冒烟验证 |
| CLIProxyAPI | 使用 compose 拉取 `eceasy/cli-proxy-api:latest`，保留配置和 auth 目录 |    不建议生产自动更新，除非只是备用实验通道     |

### 16.2 更新前检查

更新前先确认当前生产状态：

```bash
cd /opt/sub2api-deploy
docker compose -f docker-compose.local.yml ps
docker compose -f docker-compose.local.yml logs --tail=100 sub2api
```

记录当前镜像摘要：

```bash
mkdir -p ops/update-logs
stamp=$(date +%F-%H%M%S)
docker compose -f docker-compose.local.yml images > "ops/update-logs/images-before-${stamp}.txt"
docker image inspect weishaw/sub2api:latest --format '{{json .RepoDigests}}' >> "ops/update-logs/images-before-${stamp}.txt"
```

更新前必须先做完整备份。对于 Sub2API，优先备份整个 `/opt/sub2api-deploy` 目录；对于 9router，至少备份 `$DATA_DIR`；对于 CLIProxyAPI，至少备份 `config.yaml`、`auths/` 和 `logs/`。

### 16.3 Sub2API 更新命令

Sub2API 官方 Docker Compose local 版本使用 `weishaw/sub2api:latest`。更新命令如下：

```bash
cd /opt/sub2api-deploy
docker compose -f docker-compose.local.yml pull
docker compose -f docker-compose.local.yml up -d
docker compose -f docker-compose.local.yml ps
docker compose -f docker-compose.local.yml logs --tail=200 sub2api
```

如果需要持续观察日志：

```bash
docker compose -f docker-compose.local.yml logs -f sub2api
```

### 16.4 9router 与 CLIProxyAPI 更新命令

9router 如果使用单容器部署，先保留 `$HOME/.9router` 或实际 `DATA_DIR`，再重建容器：

```bash
docker pull decolua/9router:latest
docker rm -f 9router
docker run -d \
  -p 127.0.0.1:20128:20128 \
  -v "$HOME/.9router:/app/data" \
  -e DATA_DIR=/app/data \
  --name 9router \
  decolua/9router:latest
docker logs --tail=200 9router
```

CLIProxyAPI 如果使用官方 compose：

```bash
cd /opt/cliproxyapi-deploy
docker compose pull
docker compose up -d
docker compose ps
docker compose logs --tail=200 cli-proxy-api
```

### 16.5 更新后冒烟验证

更新后不要只看容器是否启动，还要验证业务链路：

|      验证项      |                    通过标准                     |
| :--------------: | :---------------------------------------------: |
|     管理后台     |   能登录，账号、Key、分组、用量记录可正常打开   |
|     API Key      |   已有用户 Key 仍可调用，新增 Key 可正常创建    |
|     模型列表     |  OpenAI-compatible `/v1/models` 可返回预期模型  |
|     流式请求     | Codex / OpenAI / Claude / Gemini 流式请求不中断 |
|     用量审计     |   调用后能归属到正确用户、Key、模型和上游账号   |
| 9router 备用通道 |   Kiro provider 可调用，vmess 出口代理仍生效    |
| CLIProxyAPI 通道 |      备用 provider 可调用，配置文件未丢失       |

### 16.6 AI 执行升级自检 SOP

以后如果让 AI 在 VPS 内代为升级，建议直接把本小节作为操作协议。AI 在未完成上一项验证前，不应继续升级下一个组件。

AI 接手前，人需要提供或确认：

|    信息    |                        要求                         |
| :--------: | :-------------------------------------------------: |
|  目标组件  | 只能是 `sub2api`、`9router`、`cliproxyapi` 三者之一 |
|  维护窗口  |              明确允许短暂重启的时间段               |
|  登录方式  |           SSH 用户、端口、是否需要 `sudo`           |
|  部署目录  |  例如 `/opt/sub2api-deploy`、`/opt/9router-deploy`  |
|  回滚方式  |       最近一次完整备份路径或上一版镜像 digest       |
|  测试 Key  |  仅用于自检的低权限 API Key，不使用真实用户主 Key   |
| 测试模型名 |        至少一个主通道模型和一个备用通道模型         |

AI 必须按以下顺序执行：

1. 进入 `tmux` 或 `screen`，避免 SSH 断开导致升级中断。
2. 读取本文档、`index.md` 和实际部署目录内的 `README.md` 或 `ops/` 记录。
3. 执行 `docker compose ps`、`docker ps`、`df -h`、`free -h`，确认当前服务和磁盘状态。
4. 保存更新前基线：镜像列表、容器状态、最近日志、当前时间。
5. 创建或确认完整备份已经存在。
6. 只升级本次指定的一个组件。
7. 等待容器健康，查看最近日志。
8. 执行对应组件的自检命令。
9. 把升级前后镜像 digest、执行命令、验证结果写入 `ops/update-logs/`。
10. 只有当前组件自检通过，才允许进入下一个组件升级。

Sub2API 自检命令模板：

```bash
cd /opt/sub2api-deploy
docker compose -f docker-compose.local.yml ps
docker compose -f docker-compose.local.yml logs --tail=200 sub2api
curl -fsS http://127.0.0.1:8080/health || true
curl -fsS https://api.ruan-cat.com/v1/models \
  -H "Authorization: Bearer ${SMOKE_TEST_API_KEY}"
```

9router 自检命令模板：

```bash
docker ps --filter name=9router
docker logs --tail=200 9router
curl -fsS http://127.0.0.1:20128/v1/models \
  -H "Authorization: Bearer ${NINEROUTER_SMOKE_TEST_API_KEY}"
```

CLIProxyAPI 自检命令模板：

```bash
cd /opt/cliproxyapi-deploy
docker compose ps
docker compose logs --tail=200 cli-proxy-api
curl -fsS http://127.0.0.1:8317/v1/models \
  -H "Authorization: Bearer ${CLIPROXYAPI_SMOKE_TEST_API_KEY}"
```

如需验证流式请求，可使用一个低成本模型发起短请求：

```bash
curl -N https://api.ruan-cat.com/v1/chat/completions \
  -H "Authorization: Bearer ${SMOKE_TEST_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "'"${SMOKE_TEST_MODEL}"'",
    "stream": true,
    "messages": [
      {
        "role": "user",
        "content": "ping"
      }
    ]
  }'
```

通过判定：

|   检查项   |                         通过标准                         |
| :--------: | :------------------------------------------------------: |
|  容器状态  |             目标容器处于 running 或 healthy              |
|  错误日志  | 最近 200 行没有持续 panic、migration failed、auth failed |
|  模型列表  |               `/v1/models` 能返回 2xx 响应               |
| 非流式请求 |                    能返回正常文本响应                    |
|  流式请求  |                   能持续输出并正常结束                   |
|  用量审计  |         后台或数据库中能看到本次 smoke test 记录         |
| 上游账号池 |            没有大量账号被禁用、冷却或连续失败            |

失败处理：

1. 先停止继续升级，不要升级下一个组件。
2. 收集 `docker compose ps`、最近 300 行日志、失败命令和响应。
3. 如果只是配置变量缺失，先恢复配置再重启目标组件。
4. 如果升级后核心 API 不可用，按 `16.8 回滚策略` 恢复。
5. 如果涉及数据库迁移失败，不要盲目降级镜像，优先恢复完整备份。
6. 在 `ops/update-logs/` 写明失败原因、回滚动作和当前状态。

### 16.7 自动化建议

可以做“提醒自动化”，暂时不要做“生产自动更新”。

推荐自动化：

1. 私有部署配置仓库启用 GitHub Watch 或 Release 订阅。
2. 用 Renovate 之类的工具给 Docker 镜像 digest 开 PR，但由人工合并。
3. 在 VPS 上写定时任务只检查上游镜像是否有新 digest，并输出提醒，不直接 `up -d`。
4. 如果一定要用 Watchtower，优先放在测试环境或备用通道；生产 Sub2API 不建议直接自动重启升级。

### 16.8 回滚策略

回滚优先策略：

1. 停止当前服务。
2. 恢复上一次完整部署目录备份。
3. 启动旧目录中的 compose。
4. 验证登录、账号池、用量日志。

注意：Sub2API 数据库迁移通常是前进式迁移，回滚代码不一定能自动回滚数据库结构，因此备份比单纯保留旧镜像更重要。

如果更新后只是应用层问题，且数据库没有发生迁移，可以临时把 compose 中的镜像改成更新前记录的 digest 再启动。只要不确定是否发生数据库迁移，就按完整备份恢复处理。

## 17. VPS 内 AI 工具接手要求

如果未来在 VPS 内使用 Claude Code、Codex CLI 或其他 AI 工具继续部署，需要确保：

|    能力    |                         要求                         |
| :--------: | :--------------------------------------------------: |
| Shell 执行 |      AI 工具能运行命令，并能在必要时使用 `sudo`      |
|  持久会话  |               使用 `tmux` 或 `screen`                |
|  网络访问  | 可访问 GitHub、Docker Hub、Cloudflare、AI 服务商 API |
| 上下文文件 |           能读取本文和 `index.md` 调研结论           |
|  密钥录入  |   敏感凭据由人工录入或通过最小权限临时 Token 提供    |
|  验证能力  |     能执行 `curl`、`docker compose ps`、查看日志     |

AI 工具不能保证“自动完成一切”。它能可靠工作的前提是：权限、网络、密钥和上下文都已经准备好。

## 18. 故障排查

|        现象        |                   可能原因                    |                                       排查命令                                       |
| :----------------: | :-------------------------------------------: | :----------------------------------------------------------------------------------: |
|    访问域名失败    | DNS 未生效、Cloudflare 记录错误、防火墙未放行 |                      `dig api.ruan-cat.com`、`sudo ufw status`                       |
|   HTTPS 证书失败   |    域名未解析到 VPS、Caddy/Nginx 配置错误     |                    `sudo systemctl status caddy`、`sudo nginx -t`                    |
|    Sub2API 502     |     容器未启动、8080 未监听、反代地址错误     | `docker compose -f docker-compose.local.yml ps`、`curl http://127.0.0.1:8080/health` |
|   数据库连接失败   | Postgres 未健康、密码不一致、数据目录权限问题 |              `docker compose -f docker-compose.local.yml logs postgres`              |
|   Redis 连接失败   |  Redis 未健康、密码不一致、数据目录权限问题   |               `docker compose -f docker-compose.local.yml logs redis`                |
| Codex 粘性会话异常 |            Nginx 丢弃下划线请求头             |                          检查 `underscores_in_headers on;`                           |
| 流式请求中断或 524 |            Cloudflare 橙云代理超时            |                              临时切换 DNS only 灰云验证                              |

## 19. 参考来源

- Sub2API 仓库：https://github.com/Wei-Shaw/sub2api
- Sub2API Docker 部署说明：https://github.com/Wei-Shaw/sub2api/blob/main/deploy/README.md
- Sub2API Docker Compose local：https://github.com/Wei-Shaw/sub2api/blob/main/deploy/docker-compose.local.yml
- 9router Docker 说明：https://github.com/decolua/9router/blob/master/DOCKER.md
- CLIProxyAPI Docker Compose：https://github.com/router-for-me/CLIProxyAPI/blob/main/docker-compose.yml
- Cloudflare 创建 DNS 记录：https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/
- Cloudflare Proxy status：https://developers.cloudflare.com/learning-paths/get-started/domain-resolution/proxy-status/
- Cloudflare 524 超时说明：https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-5xx-errors/error-524/
