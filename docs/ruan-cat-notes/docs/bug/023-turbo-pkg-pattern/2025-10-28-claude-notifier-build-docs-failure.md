# 事故报告：@ruan-cat/claude-notifier 包文档构建失败

## 事故概述

**问题描述**：在 GitHub Actions 工作流中执行 `turbo deploy-vercel` 命令时，`@ruan-cat/claude-notifier` 包的 `build:docs` 任务始终无法被 Turbo 识别和执行，导致该包的文档无法部署到 Vercel。

**影响范围**：

- 影响包：`@ruan-cat/claude-notifier`
- 影响环境：GitHub Actions CI/CD 环境
- 影响功能：文档自动构建和部署

**严重程度**：中等

- ✅ 不影响代码包的正常发布
- ❌ 导致文档站点无法更新

## 时间线

| 时间       | 事件                                                                                            |
| ---------- | ----------------------------------------------------------------------------------------------- |
| 初始报告   | 用户发现在 GitHub Actions 日志中，`@ruan-cat/claude-notifier:build:docs` 没有出现在任务列表中   |
| 排查阶段 1 | **错误假设**：认为是文档入口文件（`index.md`、`CHANGELOG.md`）被 `.gitignore` 忽略导致          |
| 修复尝试 1 | 修改 `packages/claude-notifier/.gitignore`，将文档文件添加到 Git 追踪                           |
| 用户反馈   | 用户指出 `@ruan-cat/vercel-deploy-tool` 的 `docs/index.md` 也未提交，但其 `build:docs` 正常执行 |
| 排查阶段 2 | **关键发现**：对比两个包在根 `package.json` 中的依赖声明                                        |
| 根因定位   | 发现 `@ruan-cat/vercel-deploy-tool` 在根包依赖中，但 `@ruan-cat/claude-notifier` 不在           |
| 修复实施   | 在根包 `package.json` 中添加 `@ruan-cat/claude-notifier: workspace:^`                           |
| 验证成功   | 运行 `turbo run build:docs --dry-run` 确认任务已被正确识别                                      |

## 根本原因分析

### 技术根因

**Turbo 的依赖解析机制导致的任务过滤问题**

在 `turbo.json` 中定义的根任务：

```json
"//#deploy-vercel": {
  "cache": false,
  "dependsOn": ["^build:docs"]
}
```

**关键点**：`^build:docs` 的语义是"执行所有**被当前包依赖**的工作区包的 `build:docs` 任务"

Turbo 会根据 `package.json` 中的 `dependencies` 和 `devDependencies` 字段来构建依赖图，只有在依赖图中的包才会被包含在任务执行范围内。

### 对比验证

**根包的 `package.json` (package.json:49-61)**：

```json
"devDependencies": {
  "@antfu/eslint-config": "^5.4.1",
  "@changesets/cli": "^2.29.7",
  "@prettier/plugin-oxc": "^0.0.4",
  // ❌ 缺失 "@ruan-cat/claude-notifier": "workspace:^",
  "@ruan-cat/commitlint-config": "workspace:^",
  "@ruan-cat/domains": "workspace:^",
  // ...
  "@ruan-cat/vercel-deploy-tool": "workspace:^", // ✅ 存在
  "@ruan-cat/vitepress-preset-config": "workspace:^",
  "@ruan-cat/vuepress-preset-config": "workspace:^",
  // ...
}
```

**结果对比**：

| 包名                           | 根包依赖声明  | Turbo 识别 | build:docs 执行 |
| ------------------------------ | ------------- | ---------- | --------------- |
| `@ruan-cat/vercel-deploy-tool` | ✅ 在 line 59 | ✅ 是      | ✅ 执行         |
| `@ruan-cat/claude-notifier`    | ❌ 不存在     | ❌ 否      | ❌ 跳过         |

### 为什么本地环境没有问题？

如果直接在包目录下运行 `pnpm run build:docs`，不会触发 Turbo 的依赖解析逻辑，所以本地测试时可能不会发现这个问题。

## 问题定位过程

### 第一轮排查（错误方向）

**假设**：文档入口文件被 `.gitignore` 忽略，导致云端环境缺失必要文件

**验证步骤**：

1. 检查 `packages/claude-notifier/.gitignore`，发现：

```gitignore
# 忽略自动复制过来的文件
src/docs/CHANGELOG.md
src/docs/index.md
```

2. 检查 Git 追踪状态：

```bash
git ls-files packages/claude-notifier/src/docs/
# 结果：确实不包含 index.md 和 CHANGELOG.md
```

3. 检查本地文件：

```bash
ls packages/claude-notifier/src/docs/
# 结果：本地存在这些文件
```

**结论**：看似合理，但被用户的反例推翻

### 用户反例（关键转折）

用户指出：

> `vercel-deploy-tool/docs/index.md` 也从来没有提交到 git 云端内，可是在 GitHub workflow 工作流内，`@ruan-cat/vercel-deploy-tool` 包也正常使用了 `build:docs` 命令。

**验证用户反例**：

```bash
git ls-files packages/vercel-deploy-tool/docs/
# 结果：也不包含 index.md
```

这证明了 `.gitignore` 不是根本原因！

### 第二轮排查（正确方向）

**新假设**：Turbo 的依赖解析逻辑导致任务被过滤

**验证步骤**：

1. 检查根包依赖声明：

```bash
grep -n "@ruan-cat/\(claude-notifier\|vercel-deploy-tool\)" package.json
# 结果：
# 59:		"@ruan-cat/vercel-deploy-tool": "workspace:^",
# （没有 claude-notifier）
```

2. 阅读 Turbo 文档，理解 `^` 符号的含义：
   - `^build:docs` = 依赖的工作区包的 `build:docs` 任务
   - 依赖关系由 `package.json` 决定

3. 修复后验证：

```bash
turbo run build:docs --dry-run
# 结果：@ruan-cat/claude-notifier#build:docs 出现在任务列表中
```

**结论**：问题确认！

## 解决方案

### 实施步骤

**1. 在根包 `package.json` 中添加依赖声明**

修改位置：`package.json:52-54`

```diff
  "@prettier/plugin-oxc": "^0.0.4",
+ "@ruan-cat/claude-notifier": "workspace:^",
  "@ruan-cat/commitlint-config": "workspace:^",
```

**2. 安装依赖，链接工作区包**

```bash
pnpm install
```

**3. 验证修复效果**

```bash
turbo run build:docs --dry-run
```

预期结果：`@ruan-cat/claude-notifier#build:docs` 出现在任务列表中，且 Command 为 `vitepress build src/docs`

### 验证结果

**修复前**（来自 GitHub Actions 日志）：

```log
• Packages in scope: //, @giegie/components, @giegie/resolver, @ruan-cat-learn/lccl-app,
  @ruan-cat/commitlint-config, @ruan-cat/domains, @ruan-cat/generate-code-workspace,
  @ruan-cat/release-toolkit, @ruan-cat/taze-config, @ruan-cat/utils,
  @ruan-cat/vercel-deploy-tool, @ruan-cat/vite-plugin-ts-alias, @ruan-cat/vitepress-demo-plugin,
  @ruan-cat/vitepress-preset-config, @ruan-cat/vuepress-preset-config, @test/monorepo-1,
  @test/monorepo-4, gobang, jtly-generators

• Running deploy-vercel in 20 packages
```

❌ 没有 `@ruan-cat/claude-notifier`

**修复后**（本地验证）：

```plain
@ruan-cat/claude-notifier#build:docs
  Task                           = build:docs
  Package                        = @ruan-cat/claude-notifier
  Hash                           = 994cb91007f4c08b
  Command                        = vitepress build src/docs
  Dependencies                   = @ruan-cat/vitepress-preset-config#build
```

✅ 任务被正确识别

## 预防措施

### 1. 文档化 Monorepo 依赖规范

**更新 CLAUDE.md**，添加以下说明：

> ### Turbo 任务依赖规则
>
> 根任务使用 `^` 前缀（如 `^build:docs`）时，只会执行**在根包 package.json 中声明为依赖**的工作区包的对应任务。
> **示例**：
> 如果希望 `turbo deploy-vercel` 能构建某个包的文档，必须在根 `package.json` 的 `devDependencies` 中添加该包：
>
> ```json
> {
> 	"devDependencies": {
> 		"@ruan-cat/your-package": "workspace:^"
> 	}
> }
> ```

### 2. 添加 CI 检查脚本

创建 `scripts/validate-deploy-packages.ts`，在 CI 中自动检查所有有文档的包是否都在根依赖中：

```typescript
// 伪代码示例
import { getWorkspacePackages } from "./utils";

const rootPkg = require("../package.json");
const allPackages = getWorkspacePackages();

const packagesWithDocs = allPackages.filter((pkg) => pkg.scripts?.["build:docs"]);

const missingInRoot = packagesWithDocs.filter((pkg) => !rootPkg.devDependencies[pkg.name]);

if (missingInRoot.length > 0) {
	console.error("以下包有 build:docs 脚本但未在根包中声明依赖：");
	console.error(missingInRoot.map((p) => p.name).join("\n"));
	process.exit(1);
}
```

### 3. 使用 Turbo 全局任务配置

**替代方案**：如果希望执行**所有**包的 `build:docs`，可以修改 `turbo.json`：

```json
{
	"tasks": {
		"build:docs": {
			"cache": false,
			"outputs": ["**/.vitepress/dist/**", "**/.vuepress/dist/**"],
			"dependsOn": ["^build"]
		},
		"//#deploy-vercel": {
			"cache": false,
			"dependsOn": ["build:docs"] // 移除 ^，表示所有包
		}
	}
}
```

**权衡**：

- ✅ 优点：不需要在根包中声明所有依赖
- ❌ 缺点：可能会构建不需要部署的包的文档，浪费 CI 时间

## 经验教训

### 技术层面

1. **Turbo 的 `^` 前缀语义容易误解**
   - `^build` 不是"所有包的 build"
   - 而是"依赖包的 build"

2. **本地测试与 CI 环境的差异**
   - 直接运行 `pnpm -F @ruan-cat/claude-notifier build:docs` 会成功
   - 但通过 Turbo 根任务触发时会被过滤掉

3. **Git 追踪状态的红鲱鱼**
   - 文件是否在 Git 中不影响 Turbo 的任务解析
   - 但会影响 VitePress 是否能找到文件（这是另一个问题）

### 排查方法论

1. **反例验证的重要性**
   - 用户的反例推翻了第一个假设，避免了错误的修复方向
   - 应该主动寻找反例来验证假设

2. **工具行为的深入理解**
   - 不能只看表面现象
   - 需要理解工具（Turbo）的内部机制

3. **增量验证**
   - 使用 `--dry-run` 等调试模式验证修复效果
   - 避免直接提交到生产环境

### 沟通层面

1. **及时承认错误**
   - 第一次排查方向错误时，应该快速撤销错误修改
   - 避免引入新的问题

2. **清晰的问题复现**
   - 用户提供了精确的 GitHub Actions 日志链接
   - 大大加快了问题定位速度

## 附录：相关配置文件

### turbo.json

```json
{
	"$schema": "https://turbo.build/schema.json",
	"ui": "tui",
	"tasks": {
		"build": {
			"cache": true,
			"outputs": ["**/dist/**", "**/.output/**"],
			"dependsOn": ["^build"]
		},
		"build:docs": {
			"cache": false,
			"outputs": ["**/.vitepress/dist/**", "**/.vuepress/dist/**"],
			"dependsOn": ["^build"]
		},
		"//#deploy-vercel": {
			"cache": false,
			"dependsOn": ["^build:docs"] // ← 关键配置
		}
	}
}
```

### 根 package.json (修复后)

```json
{
	"devDependencies": {
		"@prettier/plugin-oxc": "^0.0.4",
		"@ruan-cat/claude-notifier": "workspace:^", // ← 新增
		"@ruan-cat/commitlint-config": "workspace:^",
		"@ruan-cat/domains": "workspace:^",
		"@ruan-cat/vercel-deploy-tool": "workspace:^",
		"@ruan-cat/vitepress-preset-config": "workspace:^"
	}
}
```

### GitHub Actions 工作流

```yaml
- name: 运行自写的vercel部署工具
  run: |
    curl -sfS https://dotenvx.sh/install.sh | sh
    pnpm dotenvx run -- pnpm run deploy  # 触发 turbo deploy-vercel
```

## 总结

这是一个典型的**工具机制理解不足**导致的配置问题。Turbo 的依赖解析逻辑是基于 `package.json` 的依赖声明，而不是基于文件系统扫描或 Git 追踪状态。

通过这次事故，我们学到：

1. 深入理解工具的工作机制比表面的配置更重要
2. 反例验证是排除错误假设的有效方法
3. Monorepo 工具链的复杂性需要完善的文档和检查机制

**最终修复**：一行代码

```json
"@ruan-cat/claude-notifier": "workspace:^"
```

**排查时间**：约 30 分钟（包含一次错误方向）

---

**报告生成时间**：2025-10-28
**报告作者**：Claude Code
**审核状态**：已确认
