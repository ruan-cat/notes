# 在 agentmore.chatglm.cn 内使用

本文档记录在 agentmore.chatglm.cn（智谱清言云 Linux agent 环境）内执行云任务时的关键经验、已知坑与最佳实践。重点记录云 Linux 环境的会话级隔离特性，以及基于 GitHub PR 的云任务执行规范。

## 云 Linux 环境的会话级隔离（关键经验）

### 核心结论

agentmore.chatglm.cn 提供的云 Linux 环境**不是持久化的**，而是**会话级隔离**的。环境会在某些时机被重置到初始模板状态，用户在会话中安装的工具、写入的配置文件、创建的脚本**不会跨会话保留**。这一特性由平台层控制，agent 无法干预也无法预测具体重置时间。

### 实测证据

在一次完整的会话中观察到以下重置行为：

| 项目                             | 会话中创建/修改                 | 重置后状态                            | 结论             |
| -------------------------------- | ------------------------------- | ------------------------------------- | ---------------- |
| `.env` 文件                      | 写入 GitHub/Vercel token        | 还原成初始模板（只剩 `DATABASE_URL`） | 被还原           |
| `.env.bak` 备份                  | 创建                            | 消失                                  | 被删除           |
| `.gitignore`                     | 追加 `.env`、`.mcp-config.json` | 还原成初始内容                        | 被还原           |
| `.mcp-config.json`               | 创建                            | 消失                                  | 被删除           |
| `scripts/mcp_call.py`            | 创建                            | 消失                                  | 被删除           |
| `scripts/fastmcp_test.py`        | 创建                            | 保留                                  | 留下             |
| `gh` 二进制（`~/.local/bin/gh`） | 下载安装                        | 消失                                  | 被删除           |
| `vercel` 全局 npm 包             | 安装                            | 消失                                  | 被删除           |
| git commit hash                  | `9cf305c`                       | `975f588`                             | 仓库被重新初始化 |
| `skills/` 目录                   | 系统预置                        | 保留                                  | 留下             |

### 重置规律

1. **不是定时清空**：观察到的重置间隔约 1 小时 50 分钟，但这不是固定周期，更像是新会话开始时触发的环境重置。
2. **重置方式是"还原到初始模板"**，不是完全清空：
   - 保留：`skills/`（系统预置）、`scripts/`（空目录）、`download/`（含 README）、`upload/`、`.git`（重新初始化）
   - 还原：`.env`、`.gitignore`、git 历史
   - 删除：用户创建的文件（`.mcp-config.json`、`mcp_call.py`、`.env.bak`、gh 二进制、vercel 全局包）
3. **重置边界**：项目目录 `/home/z/my-project/` 内会被还原成初始模板；项目目录外（`~/.local/bin/`、`~/.npm-global/`）也会被清理。
4. **重置是一次性事件**：重置之后创建的文件会保留，不是持续清空。

### 对云任务的影响

- **跨会话不能依赖本地存储**：token、配置、安装的工具、创建的脚本都不保证跨会话保留。
- **每次新会话都要重新初始化**：重新安装 gh、vercel，重新写入配置，重新创建调用脚本。
- **Python MCP 包是预装的**：`mcp`（Anthropic 官方 SDK）和 `fastmcp`（社区框架）由环境镜像预装，不用重装。

### 应对策略

每次新会话开始时，执行"一键恢复"流程：

1. 下载安装 gh CLI（约 10 秒）
2. npm 全局安装 vercel CLI（约 30 秒）
3. 写入 `.env`（token）和 `.mcp-config.json`（MCP 配置）
4. 创建 `scripts/mcp_call.py`（MCP 调用脚本）
5. 验证三个 MCP 服务器（GitHub、Vercel、Neon）可用

整个过程 1 分钟内完成。建议用户在新会话开始时主动提供 token，由 agent 执行恢复流程。

## 本技能的核心目的

本技能主要用于实现初始化位于云 Linux 环境的基础工具，初始化必要的 MCP 客户端以及具体的 MCP 配置、CLI 工具，以及后续对话内需要的指导 skills 技能。

本技能还主要提供基于 GitHub PR 的云任务执行规范。

## 本技能的快速执行流程

1. 检查并安装 MCP 客户端：检查当前 Linux 环境内，是否有来自 Anthropic 的 Python 形式的 MCP CLI。如果没有，就安装 Anthropic Python MCP CLI 客户端。当前环境默认预装 `mcp`（Anthropic 官方 SDK）和 `fastmcp`（社区框架），无需额外安装。
2. 安装 MCP 服务：见下面 templates 目录的 `mcp.json`，或直接访问 `https://github.com/ruan-cat/monorepo/blob/dev/ai-plugins/common-tools/skills/init-linux-cloud-agent-env/templates/mcp.json` 查看具体 MCP 格式。或者是根据用户专门发的 JSON 格式的 MCP 配置来安装 MCP。
3. 安装 CLI：安装以下清单的 CLI，便于和 MCP 工具辅助完成后续任务。
   - gh CLI（直接下载官方二进制 tarball，避免 Linux 系统内缺失 root 权限的问题）
   - vercel CLI（npm 全局安装）
4. 验证 MCP 的可用性：
   - 重点验证 GitHub MCP
   - 然后是 skill-router-mcp
   - 其次是 vercel MCP
   - 最后是 neon MCP

## 基于 GitHub PR 的云任务要求和注意事项

1. 云任务获取连接器、MCP、或 CLI：你现在是在云 Linux 系统内执行的云任务。动用你的 GitHub 和 `skill-router-mcp` 这两款工具的全部可用工具来完成基于主 PR 和多轮 PR 测试性 PR 的自测自检方式的云任务。
   - 如果你无法完成这两个连接器的连接使用，请你及时中断任务，告诉我你出现 bug 了，无法找到，无法在本轮会话内找到必要的工具了。
   - 在绝大多数情况下，你的工具基本上不会突然丢失。如果你的 MCP 和 CLI 突然出现 Linux 沙箱层面上的工具丢失，请你及时暂停并告知我。
2. 连接器优先级表：
   - 优先 `@Github` 连接器，没有这个连接器就什么工作都做不了了。
   - 其次是 `@Skill Router MCP` 连接器，这个连接器是用来获取指导 skills 的，没有的话，也能勉强地继续推进任务。
3. 备份工具降级使用的优先级：当 MCP 连接器不可用时，可降级使用 gh CLI 和 vercel CLI 直接完成任务。
4. 临时 PR 自测自检：在主 PR 之外，可创建临时 PR 用于 CI 自检，确认 CI 通过后再合并到主 PR。
5. 主动收尾：阶段任务结束后，主动删除临时分支、关闭临时 PR，避免污染仓库。
6. 主 PR 编号汇报：完成任务后，告诉用户需要审核审批的主 PR 编号。
7. 工作分支汇报：告诉用户哪些 origin branch 属于主工作分支，避免误删除；哪些是需要介入删除的临时云分支。

## 已知坑

### 云 Linux 环境会话级隔离（最高优先级）

- **环境会重置**：云 Linux 环境会在会话间被重置到初始模板，安装的工具、写入的配置、创建的脚本不保证跨会话保留。
- **不是定时清空**：重置时机不固定，更像是新会话开始时触发，观察到的间隔约 1-2 小时。
- **重置方式是还原模板**：`.env`、`.gitignore`、git 历史会被还原；用户创建的文件会被删除；系统预置的 `skills/` 目录会保留。
- **应对策略**：每次新会话开始时执行一键恢复流程（安装 gh/vercel、写入配置、创建脚本），约 1 分钟完成。
- **不要承诺持久化**：agent 不应向用户承诺"token 会长期保存""配置会一直有效"，应明确告知会话级隔离特性。

### GitHub MCP 文件操作

- **禁止传 `encoding: base64`** — 工具内部自动处理编码，传入会双重 base64 导致乱码。
- **用 `content` 传原始文本** — 不要手动 base64 编码。
- **更新必须传 `sha`** — 先读取文件获取 blob SHA，否则会创建而非更新。
- **返回格式不稳定** — `get_file_contents` 可能返回 `TextContent` 或 `EmbeddedResource`，需检查类型再提取。

### skill-router MCP

- **匿名、无需 Token** — Cloudflare Workers 部署，直连即用。
- **只读** — 技能注册表查询与加载，不支持写入。
- **核心工具**：`search_skills`、`load_skill`、`list_skill_resources`、`load_skill_resource`。

## MCP 客户端技术栈说明

当前云 Linux 环境预装两个 MCP 相关 Python 包：

| 包        | 版本   | 提供方                  | 角色                                                                     |
| --------- | ------ | ----------------------- | ------------------------------------------------------------------------ |
| `mcp`     | 1.27.0 | Anthropic, PBC.（官方） | MCP 协议官方 Python SDK，提供 `ClientSession` 和 `streamablehttp_client` |
| `fastmcp` | 2.14.3 | Jeremiah Lowin（社区）  | 基于 `mcp` SDK 的上层框架，API 更简洁，返回值结构化                      |

两者关系：`fastmcp` 依赖 `mcp`，是上层封装。纯消费 MCP 服务器时 `fastmcp` 更易用（返回 `structured_content` 直接是 dict），追求底层控制力时用 `mcp` SDK。

## CLI 安装命令参考

### gh CLI（免 root，直接下载二进制）

```bash
mkdir -p $HOME/.local/bin && cd /tmp && \
GH_VERSION="2.65.0" && \
curl -fsSL "https://github.com/cli/cli/releases/download/v${GH_VERSION}/gh_${GH_VERSION}_linux_amd64.tar.gz" -o gh.tar.gz && \
tar xzf gh.tar.gz && \
cp gh_${GH_VERSION}_linux_amd64/bin/gh $HOME/.local/bin/gh && \
chmod +x $HOME/.local/bin/gh && \
export PATH="$HOME/.local/bin:$PATH"
```

认证方式（无头环境用 token）：

```bash
echo "YOUR_GITHUB_TOKEN" | gh auth login --with-token
```

### vercel CLI（npm 全局安装）

```bash
npm install -g vercel
```

认证方式（无头环境用 token）：

```bash
vercel --token YOUR_VERCEL_TOKEN --yes
# 或调用时带 token
vercel --token "$VERCEL_TOKEN" ls
```
