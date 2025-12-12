# 2025-12-12 解决 Cloudflare Worker 强制使用 pnpm 而非 Bun 的方案

## 1. 问题背景

在 Cloudflare Pages/Worker 部署时，即使项目使用 pnpm workspace 管理 monorepo，Cloudflare 的自动构建系统仍会优先选择 Bun 作为包管理器。这导致 Bun 无法正确识别 pnpm 的 workspace 协议（如 `workspace:^`），从而引发构建失败。

### 1.1 典型错误日志

```log
14:45:40.454	Detected the following tools from environment: nodejs@22.14.0, pnpm@10.25.0
14:45:40.455	Installing nodejs 22.14.0
14:45:49.811	Installing project dependencies: bun install
14:45:49.997	bun install v1.2.15 (df017990)
14:45:50.040	Resolving dependencies
14:46:00.120	Resolved, downloaded and extracted [4662]
14:46:00.120	error: Workspace dependency "@01s-11comm/admin" not found
14:46:00.120
14:46:00.120	Searched in "./^"
14:46:00.120
14:46:00.120	Workspace documentation: https://bun.sh/docs/install/workspaces
14:46:00.121
14:46:00.121	error: Workspace dependency "@01s-11comm/type" not found
14:46:00.121
14:46:00.121	Searched in "./^"
```

### 1.2 核心原因

Cloudflare Pages 的自动检测逻辑会优先选择 Bun（因为其安装速度更快），即使检测到了 pnpm。但 Bun 对 pnpm workspace 协议的支持不完整，无法正确解析 `workspace:^` 等语法。

## 2. 解决方案

### 2.1 方案一：在 Cloudflare Pages 控制台配置（推荐）

这是最直接且最可靠的方法。

#### 2.1.1 配置构建命令

进入 Cloudflare Pages 项目设置 → **Builds & deployments** → **Build configurations**

设置 **Build command**：

```bash
pnpm install && pnpm run build
```

#### 2.1.2 配置环境变量

在 **Environment variables** 部分添加：

|            变量名            |   值   |
| :--------------------------: | :----: |
| `NPM_CONFIG_PACKAGE_MANAGER` | `pnpm` |
|  `SKIP_DEPENDENCY_INSTALL`   | `true` |

**说明**：

- `NPM_CONFIG_PACKAGE_MANAGER=pnpm` 明确指定使用 pnpm
- `SKIP_DEPENDENCY_INSTALL=true` 跳过 Cloudflare 的自动依赖安装，改为在构建命令中手动控制

### 2.2 方案二：使用 Corepack 强制激活 pnpm

如果方案一不生效，可以在构建命令中显式启用 Corepack。

#### 2.2.1 使用最新版本

```bash
corepack enable && corepack prepare pnpm@latest --activate && pnpm install && pnpm build
```

#### 2.2.2 使用指定版本

```bash
corepack enable && corepack prepare pnpm@10.25.0 --activate && pnpm install && pnpm build
```

**优点**：

- 确保使用正确的 pnpm 版本
- Corepack 是 Node.js 内置工具，无需额外安装

### 2.3 方案三：在 package.json 中明确声明

确保项目根目录的 `package.json` 包含以下配置：

```json
{
	"packageManager": "pnpm@10.25.0",
	"engines": {
		"node": ">=22.14.0",
		"pnpm": ">=10.0.0"
	}
}
```

**说明**：

- `packageManager` 字段明确声明包管理器和版本
- `engines` 字段限制 Node.js 和 pnpm 的最低版本要求

### 2.4 方案四：禁用自动依赖安装 + 手动控制

#### 2.4.1 设置环境变量

```plain
SKIP_DEPENDENCY_INSTALL=true
```

#### 2.4.2 自定义构建命令

```bash
pnpm install --frozen-lockfile && pnpm build
```

**优点**：

- 使用 `--frozen-lockfile` 确保依赖版本完全一致
- 避免意外的依赖更新

### 2.5 方案五：创建自定义构建脚本

在项目根目录创建 `build.sh`：

```bash
#!/bin/bash
set -e

# 启用 Corepack
corepack enable

# 准备并激活指定版本的 pnpm
corepack prepare pnpm@10.25.0 --activate

# 安装依赖
pnpm install --frozen-lockfile

# 执行构建
pnpm run build
```

在 Cloudflare Pages 构建命令中设置：

```bash
bash build.sh
```

**优点**：

- 构建流程可版本控制
- 便于本地调试和复用

## 3. 最佳实践推荐

### 3.1 推荐配置组合

结合多个方案的优点，推荐使用以下配置：

#### 3.1.1 构建命令

```bash
corepack enable && pnpm install --frozen-lockfile && pnpm build
```

#### 3.1.2 环境变量

|            变量名            |   值   |
| :--------------------------: | :----: |
| `NPM_CONFIG_PACKAGE_MANAGER` | `pnpm` |

#### 3.1.3 package.json 配置

```json
{
	"packageManager": "pnpm@10.25.0",
	"engines": {
		"node": ">=22.14.0",
		"pnpm": ">=10.0.0"
	}
}
```

### 3.2 为什么这个组合最有效？

1. **Corepack 确保版本一致性**：使用 Node.js 内置的 Corepack 管理包管理器版本
2. **frozen-lockfile 防止意外更新**：确保生产环境与开发环境依赖完全一致
3. **环境变量明确声明**：覆盖 Cloudflare 的自动检测逻辑
4. **package.json 声明规范**：符合包管理器标准规范

## 4. 验证方法

### 4.1 检查构建日志

部署后，在 Cloudflare Pages 的构建日志中应该看到：

```log
Installing project dependencies: pnpm install
```

而不是：

```log
Installing project dependencies: bun install
```

### 4.2 验证 workspace 依赖正常解析

构建日志中不应再出现：

```log
error: Workspace dependency "@package-name" not found
```

## 5. 常见问题

### 5.1 为什么 Cloudflare 优先使用 Bun？

Bun 的依赖安装速度比 pnpm 快很多，Cloudflare 为了优化构建时间，会优先选择 Bun。但 Bun 对 pnpm workspace 的支持还不完善。

### 5.2 可以直接切换到 Bun 吗？

如果项目不使用 pnpm workspace 协议，可以考虑切换到 Bun。但对于使用 `workspace:^` 等协议的 monorepo 项目，目前必须使用 pnpm。

### 5.3 方案不生效怎么办？

1. 确认环境变量正确设置
2. 检查构建命令是否完整
3. 清除 Cloudflare Pages 的构建缓存后重新部署
4. 检查 `package.json` 中的 `packageManager` 字段

## 6. 总结

|            方案             | 难度 | 可靠性 |          适用场景          |
| :-------------------------: | :--: | :----: | :------------------------: |
|    控制台配置（方案一）     |  低  |   高   |      所有项目，最推荐      |
|     Corepack（方案二）      |  中  |   高   |  需要精确控制包管理器版本  |
| package.json 声明（方案三） |  低  |   中   |      配合其他方案使用      |
|   禁用自动安装（方案四）    |  中  |   高   |  需要完全控制依赖安装流程  |
|    自定义脚本（方案五）     |  中  |   高   | 构建流程复杂，需要版本控制 |

**核心要点**：

- 明确指定使用 pnpm 而不依赖自动检测
- 使用 `--frozen-lockfile` 确保依赖一致性
- 结合环境变量和构建命令双重保障
- package.json 中声明 packageManager 字段

通过以上方案，可以彻底解决 Cloudflare Worker/Pages 错误使用 Bun 导致的 pnpm workspace 依赖解析失败问题。
