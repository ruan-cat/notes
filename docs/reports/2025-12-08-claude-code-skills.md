# Claude Code Skill 资源清单

## 1 报告说明

- 目标：整理 25 个 Claude 生态常用 Skill 仓库与资源，涵盖 MCP Server、Coding Agent、Prompt/规则清单与自动化工具。
- 真实性声明：基于公开信息和广泛引用的 GitHub 仓库，未在本地实时访问验证；若需逐仓库拉取 README 或再次核验，请告知。

## 2 MCP 与 Skill 标准类

- `modelcontextprotocol/servers`：官方 MCP 参考实现与示例 Server。
- `modelcontextprotocol/python-sdk`：MCP Python SDK，便于自定义 Server。
- `modelcontextprotocol/typescript-sdk`：MCP TS/JS SDK，对接前后端工具。
- `microsoft/playwright-mcp`：浏览器自动化 MCP，让 Claude 具备页面操作能力。
- `BeehiveInnovations/zen-mcp-server`：MCP Server 示例，可参考多工具接入。
- `appcypher/awesome-mcp-servers`：社区 MCP Server 清单。
- `wong2/awesome-mcp-servers`：另一份 MCP Server 精选清单。
- `anthropic/anthropic-cookbook`：官方示例，含 MCP、工具调用、RAG 等。
- `pydantic/pydantic-ai`：含 mcp-run-python 等能力，支持安全执行代码。
- `simonw/llm`：CLI 工具，插件生态可与 Claude 协同。

## 3 Coding Agent / IDE 插件

- `cline/cline`：原 Claude Dev，VS Code 插件，强化文件、终端、浏览器工具链。
- `Aider-AI/aider`：CLI 结对编程，支持 Claude 3.5，长程多文件修改强。
- `continuedev/continue`：开源 IDE Copilot，支持自定义上下文与 Claude。
- `All-Hands-AI/OpenHands`：原 OpenDevin，自主软件工程 Agent 平台。
- `abi/screenshot-to-code`：视觉生成前端代码，可配合 Claude 视觉能力。
- `Exafunction/codeium`：自托管/云补全，对比参考 Claude 工具链。
- `TabbyML/tabby`：自托管补全，可与 Claude/工具结合。

## 4 Prompt 与规则集合

- `patrickjmcd/awesome-cursorrules`：Cursor 规则合集，含多栈专家模式。
- `langgptai/awesome-claude-prompts`：Claude 提示词大全。
- `danielmiessler/fabric`：提示模式库，可作技能模板。
- `anthropic/anthropic-cookbook`：再次列出，便于按提示/工具示例检索。
- `quemsah/awesome-claude-plugins`：社区插件与规则清单。
- `hesreallyhim/awesome-claude-code`：Claude 相关资源整理。
- `ComposioHQ/composio`：Agent/工具编排，支持 Claude。
- `Cloudflare/flows`：自动化/工作流示例，可与 Claude 工具结合。
- `replicate/cog-templates`：模型/工具生成部署模板，可配合 Claude 生成代码后落地。

## 5 使用建议

- MCP 入门：从 `modelcontextprotocol/servers` 运行官方示例，再参考 `playwright-mcp` 体验浏览器自动化。
- Agent 体验：VS Code 选 `cline`，命令行选 `aider`；需要容器隔离可看 `OpenHands`。
- 规则与提示：在 Cursor 复制 `awesome-cursorrules` 中的规则；常规提示从 `awesome-claude-prompts` 获取。
- 自动化与编排：结合 `composio`、`flows` 设计工具链；需要安全代码执行可看 `pydantic-ai` 的 mcp-run-python。
- 深入学习：`anthropic-cookbook` 里有工具调用、RAG、MCP 示例，可直接复用。

## 6 后续可做

- 如需严格逐仓库验证与 README 摘要，可告知我批量抓取并翻译。
- 可按场景（文档生成、Web、ML、DevOps、协作、自动化）再细分 30+ 条目并补安装步骤与示例 prompt。
