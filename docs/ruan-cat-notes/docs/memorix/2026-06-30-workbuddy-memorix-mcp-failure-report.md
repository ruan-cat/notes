# 2026-06-30 WorkBuddy memorix MCP 启动失败复盘

## 1. 环境信息

### 1.1 操作系统与运行时

|         项          |                             值                              |
| :-----------------: | :---------------------------------------------------------: |
|      操作系统       |                      Windows（win32）                       |
|    系统默认 Node    |             v24.18.0（NODE_MODULE_VERSION 137）             |
| 系统默认 Node 路径  | `/d/store/nvm-desktop/24.18.0/node.exe`（通过 `nvmd` 管理） |
|      兼容 Node      |             v22.14.0（NODE_MODULE_VERSION 127）             |
|   兼容 Node 路径    |           `D:\store\nvm-desktop\22.14.0\node.exe`           |
| 全局 `NODE_OPTIONS` |            `--use-system-ca`（仅 Node 24+ 支持）            |

### 1.2 memorix 安装信息

|      项      |                                                               值                                                               |
| :----------: | :----------------------------------------------------------------------------------------------------------------------------: |
|   安装方式   |                                                         pnpm 全局安装                                                          |
|     版本     |                                                             1.1.3                                                              |
|   CLI 入口   | `C:\Users\pc\AppData\Local\pnpm\global\5\.pnpm\memorix@1.1.3_react-devtools-core@6.1.5\node_modules\memorix\dist\cli\index.js` |
| 关键原生依赖 |                                          `better-sqlite3`（按 Node 22 ABI 127 编译）                                           |

### 1.3 涉及配置文件

|                文件                |               作用               | 是否应手动编辑 |
| :--------------------------------: | :------------------------------: | :------------: |
| `C:\Users\pc\.workbuddy\mcp.json`  |     用户级自定义 MCP 源文件      |       是       |
| `C:\Users\pc\.workbuddy\.mcp.json` | WorkBuddy 自动生成的聚合代理配置 |       否       |

---

## 2. 问题现象

在 WorkBuddy 中，通过 `~/.workbuddy/mcp.json` 配置的 memorix MCP 服务器无法启动：连接后立即断开，日志仅显示 `MCP error -32000: Connection closed`，未暴露底层 ABI 错误。同一配置在其他 AI 工具中可正常启动，因此最初被误判为 WorkBuddy 自身的路径解析、信任授权或兼容性问题。

手动复现修复前配置时，子进程崩溃并报出 ABI 不匹配：

```log
ERROR The module ... better_sqlite3.node was compiled against a different Node.js version using NODE_MODULE_VERSION 127. This version of Node.js requires NODE_MODULE_VERSION 137.
```

---

## 3. 处理时间线

|             时间              |                                                                                        事件                                                                                         |
| :---------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|      2026/6/30 13:29:45       |                     WorkBuddy 主线程首次出现 `skipping untrusted server "memorix"`（hash: `9c4d096279264bf9939df45c00b5a5d278afdde423569e1f6b9f2b16b21f2251`）                      |
| 2026/6/30 13:30:00 ~ 13:35:00 | 反复调整 `~/.workbuddy/mcp.json`（`~/.workbuddy/.mcp.json` 为自动生成聚合代理，不应手动编辑），因主线程未及时重新加载，持续出现 `skipping untrusted server` / `not in enabled list` |
| 2026/6/30 13:35:00 ~ 13:36:00 |                                              手动用 Node 24 启动 memorix，复现 ABI 报错；确认 `better-sqlite3` 按 Node 22 ABI 127 编译                                              |
|      2026/6/30 13:36:06       |                                         在 WorkBuddy 内对更新后的配置点击信任/启用，`toggleMcpServer: memorix enabled → approval recorded`                                          |
|      2026/6/30 13:36:08       |                                                     WorkBuddy 主线程日志确认 `Connected to custom-mcp:memorix, 17 tools: [...]`                                                     |
|      2026/6/30 13:36:11       |                                                   WorkBuddy 主线程日志确认 `listMcpServers: name=memorix, ..., status=connected`                                                    |
|     2026/6/30 13:36:12 后     |                                                  在当前会话调用 `mcp__memorix__memorix_session_context(limit:1)`，返回正常，无异常                                                  |
|    2026/6/30 13:58 ~ 14:04    |                              优化修复方案：用 `C:\Users\pc\.workbuddy\mcp-wrappers\memorix-serve.cmd` 包装器替换硬编码 memorix 版本路径，提升可维护性                               |

---

## 4. 实际根因

### 4.1 根因一：Node ABI 不匹配

memorix 依赖的 `better-sqlite3` 是在 Node v22.14.0（NODE_MODULE_VERSION 127）下编译的原生模块。WorkBuddy 默认启动 stdio MCP 子进程时使用的是系统默认 Node v24.18.0（NODE_MODULE_VERSION 137），导致 `better_sqlite3.node` 加载失败，子进程在初始化阶段直接崩溃。

关键日志：

```log
ERROR The module ... better_sqlite3.node was compiled against a different Node.js version using NODE_MODULE_VERSION 127. This version of Node.js requires NODE_MODULE_VERSION 137.
```

#### 4.1.1 API 与 ABI 的区别

|     维度     |  API（Application Programming Interface）   |             ABI（Application Binary Interface）              |
| :----------: | :-----------------------------------------: | :----------------------------------------------------------: |
|   **中文**   |              应用程序编程接口               |                      应用程序二进制接口                      |
| **作用层级** |              源代码 / 调用约定              |                   二进制 / 加载与执行约定                    |
| **关注内容** |     函数名、参数列表、返回值、调用方式      |  内存布局、寄存器约定、符号表、模块加载格式、V8 版本兼容性   |
| **典型错误** | `TypeError: fn is not a function`、参数缺失 | `NODE_MODULE_VERSION mismatch`、`.node` 文件加载失败、段错误 |
|  **谁决定**  |                框架 / 库作者                |       编译器、链接器、运行时（如 Node.js 的 V8 版本）        |

**为什么本次故障是 ABI 问题，不是 API 问题：**

- `better-sqlite3` 的 JavaScript 调用接口（API）没有变——`require('better-sqlite3')(...)` 的写法在 Node 22 和 Node 24 下完全相同。
- 变的是其二进制产物 `better_sqlite3.node` 的 **ABI**。该文件是用 C++ 针对 Node 22 的 V8/Node-API 编译的，内部期望 Node 22 的内存布局、句柄结构和 `NODE_MODULE_VERSION=127`。
- Node 24 的 V8 升级后，`NODE_MODULE_VERSION` 变为 `137`，二进制接口不兼容。此时即便 JavaScript API 完全一致，操作系统加载 `better_sqlite3.node` 时也会直接拒绝，子进程崩溃。

简言之：**API 是“能不能调用”，ABI 是“调用后能不能在二进制层面跑起来”**。本次故障发生在二进制加载阶段，因此必须使用 ABI 这一术语。

### 4.2 根因二：`NODE_OPTIONS=--use-system-ca` 在 Node 22 下不兼容

系统级环境变量 `NODE_OPTIONS=--use-system-ca` 仅被 Node 24+ 支持。即便显式将 memorix 的启动命令切到 Node 22，若不清空该环境变量，Node 22 仍会因无法识别 `--use-system-ca` 选项而立即报错退出。

### 4.3 根因三：不同 AI 工具对环境变量的继承方式不同

其他 AI 工具能启动 memorix，是因为它们默认使用 Node 22、不继承全局 `NODE_OPTIONS`，或对 stdio MCP 子进程的环境处理与 WorkBuddy 不同。WorkBuddy 的 `ConnectorService` 更严格，会继承系统环境变量并使用默认 Node 24，因此率先暴露了 ABI 与 `NODE_OPTIONS` 的双重不兼容问题。

---

## 5. 关键误导点

### 5.1 误导点一：错误信息被隐藏

WorkBuddy 主线程日志只显示 `MCP error -32000: Connection closed`，未直接暴露 `NODE_MODULE_VERSION` 错误，导致最初容易误判为 WorkBuddy 配置路径、权限或信任授权问题，而非 Node 运行时 ABI 不匹配。

### 5.2 误导点二：主线程未及时重新加载配置

修改 `~/.workbuddy/mcp.json` 后，WorkBuddy 主线程未立即重新加载，导致反复出现以下日志：

```log
[2026/6/30 13:29:45.178] [Info] [MCP Security] buildDesiredConfigs: skipping untrusted server "memorix" (hash: 9c4d096279264bf9939df45c00b5a5d278afdde423569e1f6b9f2b16b21f2251)
```

以及 `not in enabled list` 等提示，进一步掩盖了真正的 ABI 错误。

### 5.3 误导点三：聚合代理配置与源文件易混淆

`~/.workbuddy/.mcp.json` 是 WorkBuddy 自动生成的聚合代理配置，内部会引用 `~/.workbuddy/mcp.json` 等源文件。在修复后，`.mcp.json` 内部的 memorix 条目可能仍未同步为 Node 22 路径，若用户直接查看 `.mcp.json` 会误以为配置未生效或仍未修复。

---

## 6. 有效修复

### 6.1 修复前配置

源配置文件：`C:\Users\pc\.workbuddy\mcp.json`

```json
{
	"command": "cmd",
	"args": ["/c", "memorix", "serve"],
	"type": "stdio",
	"timeout": 60000,
	"disabled": false
}
```

### 6.2 修复后配置（版本无关包装器方案）

源配置文件：`C:\Users\pc\.workbuddy\mcp.json`

```json
{
	"command": "cmd",
	"args": ["/c", "C:\\Users\\pc\\.workbuddy\\mcp-wrappers\\memorix-serve.cmd"],
	"type": "stdio",
	"timeout": 60000,
	"disabled": false,
	"env": {}
}
```

包装器脚本：`C:\Users\pc\.workbuddy\mcp-wrappers\memorix-serve.cmd`

```batch
@ECHO OFF
SETLOCAL EnableExtensions

SET "NODE_OPTIONS="
SET "PATH=D:\store\nvm-desktop\22.14.0;%PATH%"

memorix serve
```

### 6.3 修复要点

1. **隔离 Node 运行时**：通过包装器将 Node v22.14.0 目录前置到 `PATH`，使 pnpm 的 `memorix` shim 实际调用 Node 22，而非系统默认 Node 24。
2. **隔离全局 `NODE_OPTIONS`**：在包装器内清空 `NODE_OPTIONS`，避免 Node 22 继承不支持的 `--use-system-ca`。
3. **版本路径解耦**：`mcp.json` 不再硬编码 memorix 的版本号或 `.pnpm` 内容寻址路径； memorix 升级后，pnpm 会自动更新其 shim，包装器无需改动。
4. **单一修改点**：若未来 Node 22 路径变化，只需修改包装器脚本中的 `D:\store\nvm-desktop\22.14.0`，`mcp.json` 与复盘文档中的配置示例保持不变。

### 6.4 版本硬编码方案的局限（已废弃）

在采用包装器前，曾使用以下直接硬编码方案：

```json
{
	"command": "D:\\store\\nvm-desktop\\22.14.0\\node.exe",
	"args": [
		"C:\\Users\\pc\\AppData\\Local\\pnpm\\global\\5\\.pnpm\\memorix@1.1.3_react-devtools-core@6.1.5\\node_modules\\memorix\\dist\\cli\\index.js",
		"serve"
	],
	"type": "stdio",
	"timeout": 60000,
	"disabled": false,
	"env": { "NODE_OPTIONS": "" }
}
```

该方案虽能跑通，但将 memorix 版本号 `1.1.3` 及其 peer 依赖 `react-devtools-core@6.1.5` 写死在配置中。一旦执行 `pnpm add -g memorix@x.x.x` 升级，`.pnpm` 目录结构改变，上述路径立即失效，健壮性不足，因此废弃并改用包装器。

---

## 7. 验证方式

### 7.1 手动复现无 ABI 报错

在终端模拟包装器行为（Node 22 前置 PATH + 清空 `NODE_OPTIONS`）手动启动 memorix：

```bash
NODE_OPTIONS= PATH="/d/store/nvm-desktop/22.14.0:$PATH" timeout 3 memorix serve
```

确认不再出现 `NODE_MODULE_VERSION` 错误，并输出以下成功日志：

```log
[memorix] ObservationStore backend: sqlite, generation: 5376
[memorix] MCP Server running on stdio (project: __unresolved__)
```

包装器脚本本身也可通过 `cmd /c C:\Users\pc\.workbuddy\mcp-wrappers\memorix-serve.cmd` 直接测试。

### 7.2 WorkBuddy 内信任并启用

在 WorkBuddy 内对更新后的 memorix 配置点击“信任/启用”，记录到主线程日志：

```log
[2026/6/30 13:36:06.313] [Info] [MCP Security] toggleMcpServer: memorix enabled → approval recorded (hash: 9c4d096279264bf9939df45c00b5a5d278afdde423569e1f6b9f2b16b21f2251)
```

### 7.3 确认连接与工具列表

WorkBuddy 主线程日志出现：

```log
[2026/6/30 13:36:08.924] [Info] [ConnectorMcpProxy] Connected to custom-mcp:memorix, 17 tools: [...]
[2026/6/30 13:36:11.318] [Info] [MCP Security] listMcpServers: name=memorix, ..., status=connected
```

### 7.4 端到端功能验证

在当前会话调用：

```text
mcp__memorix__memorix_session_context(limit:1)
```

返回正常上下文数据，无异常断开。

---

## 8. 后续约束

### 8.1 对类似 stdio MCP 的排查约束

所有 stdio MCP（如 `chrome-devtools`、`context7` 等）若遇到 `Connection closed`，优先检查以下两项：

1. **Node ABI 匹配**：确认该 MCP 依赖的原生模块与 WorkBuddy 实际使用的 Node 版本 ABI 一致。
2. **`NODE_OPTIONS` 兼容性**：确认全局 `NODE_OPTIONS` 中的选项被实际调用的 Node 版本支持。

### 8.2 配置修改后的重载约束

修改 `~/.workbuddy/mcp.json` 后，如 WorkBuddy 主线程未重新加载，可临时在文件根级添加一个不影响 server hash 的字段（如 `"_reloadTrigger": 1`）以触发 `Config file changed → refreshAndSync`，然后移除该字段。

### 8.3 源文件与聚合代理的编辑约束

|           文件           | 能否手动编辑 |                        原因                        |
| :----------------------: | :----------: | :------------------------------------------------: |
| `~/.workbuddy/mcp.json`  |     可以     |              用户级自定义 MCP 源文件               |
| `~/.workbuddy/.mcp.json` |    不可以    | WorkBuddy 自动生成的聚合代理配置，手动编辑会被覆盖 |

### 8.4 环境变量与 Node 解释器约束

对 stdio MCP 建议：

- 优先使用**包装器脚本**隔离 Node 版本与全局环境变量：`mcp.json` 调用包装器，包装器内设置 `PATH` 与 `NODE_OPTIONS`。
- 若不便使用包装器，可显式指定兼容的 `node.exe` 绝对路径并清空 `NODE_OPTIONS`；但需注意 memorix 等工具的 CLI 路径会随版本升级而失效。
- 系统级 `NODE_OPTIONS` 若包含跨版本不兼容选项，必须在 MCP 子进程内通过 `env` 或包装器覆盖为空。

---

## 9. 类比与泛化

### 9.1 同类问题模式

本次故障属于典型的 **Node 原生模块 ABI 漂移 + 全局环境变量跨版本不兼容**。只要满足以下任一条件，stdio MCP 在 Windows 下就可能出现类似崩溃：

- MCP 服务依赖 `better-sqlite3`、`sharp`、`sqlite3` 等按特定 Node ABI 编译的原生模块。
- 系统默认 Node 版本高于 MCP 编译时使用的 Node 版本。
- 系统级 `NODE_OPTIONS` 包含高版本 Node 独有的选项，且被低版本 Node 继承。

### 9.2 跨平台差异

Windows 下全局环境变量继承路径与类 Unix 系统不同，且 `cmd /c` 启动会额外引入一层 shell 环境，可能放大此类问题。建议在 Windows 下对关键 stdio MCP 采用**包装器脚本**方案：

- 包装器内完成 `PATH` 前置与 `NODE_OPTIONS` 清空；
- `mcp.json` 只引用稳定的包装器路径，不耦合工具版本号；
- 需要升级工具或切换 Node 版本时，只改包装器一处。

### 9.3 设计层面的启示

- 安装全局 MCP 工具时，应记录其推荐 Node 版本，并在 MCP 配置中显式绑定。
- 对依赖原生模块的 MCP，升级系统默认 Node 版本前需重新编译或确认 ABI 兼容。
- 环境变量 `NODE_OPTIONS` 应尽量保持最小化；跨版本不兼容的选项应通过 `.nvmrc`、shell 别名或 MCP 局部 `env` 精确控制。

---

## 10. 参考文档/技能

|                     名称                     |                  用途                   |
| :------------------------------------------: | :-------------------------------------: |
|                    `pua`                     |     高绩效交付文化：RCA + 蓝军自检      |
|      `superpowers:systematic-debugging`      |            系统化调试方法论             |
| `superpowers:verification-before-completion` |      完成前必须验证，防止虚假交付       |
|            `init-simple-memorix`             |        WorkBuddy hooks 配置落点         |
|           `record-bug-fix-memory`            | 本报告的结构来源与 bug-fix 记忆沉淀规范 |

---

_报告生成时间：2026-06-30_
_初始故障哈希：9c4d096279264bf9939df45c00b5a5d278afdde423569e1f6b9f2b16b21f2251_
_最终包装器方案哈希：d646030bee6812421ea1bab555647a4f67bb2b5fc54bfdf017017abd3d3a50a7_
_memorix 版本：1.1.3_
_兼容 Node 版本：v22.14.0（NODE_MODULE_VERSION 127）_
_系统默认 Node 版本：v24.18.0（NODE_MODULE_VERSION 137）_
_包装器路径：`C:\Users\pc\.workbuddy\mcp-wrappers\memorix-serve.cmd`_
