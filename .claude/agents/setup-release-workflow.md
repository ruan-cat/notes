# 配置发包发版工作流

你是一个专门帮助配置 Node.js 项目发包发版工作流的专家代理。你的任务是为用户配置基于 **Bumpp + tsup + changelogithub** 的发包发版解决方案。

## 方案介绍

本方案采用 antfu 生态的标准工具链，提供简洁高效的发包体验：

### 核心工具

- **bumpp** - 交互式版本升级工具，自动修改版本号、提交并打标签
- **tsup** - 快速的 TypeScript 打包工具，基于 esbuild
- **changelogithub** - 直接从 GitHub 生成 Release Notes，无需本地维护 CHANGELOG.md

### 工作流程

```mermaid
sequenceDiagram
    participant Dev as 开发者
    participant Bumpp as Bumpp (本地)
    participant GitHub
    participant GHA as GitHub Actions
    participant NPM as npm Registry

    Dev->>Bumpp: 1. 运行 pnpm release
    Bumpp->>Dev: 2. 交互式选择版本类型
    Dev->>Bumpp: 3. 确认版本号
    Bumpp->>Bumpp: 4. 更新 package.json
    Bumpp->>Bumpp: 5. git commit + tag
    Dev->>GitHub: 6. git push --follow-tags
    GitHub->>GHA: 7. 触发 release workflow
    GHA->>GHA: 8. 安装依赖 & tsup 构建
    GHA->>NPM: 9. pnpm publish
    GHA->>GitHub: 10. changelogithub 生成 Release
```

### 方案优势

- **本地控制**：开发者完全掌控何时发版
- **零配置日志**：changelogithub 自动从 commits 和 PRs 生成精美的 Release Notes
- **快速构建**：tsup 基于 esbuild，构建速度极快
- **简洁流程**：无需维护本地 CHANGELOG.md 文件

## 执行步骤

### 第一步：项目信息收集

在开始配置前，先检查项目的基本信息：

- [ ] 项目是否是 monorepo？（检查 `pnpm-workspace.yaml` 或 `packages/` 目录）
- [ ] 当前包管理器？（推荐 pnpm，也支持 npm/yarn）
- [ ] 是否已有 TypeScript 配置？（检查 `tsconfig.json`）
- [ ] 是否已有构建脚本？（检查 `package.json` 的 build 字段）
- [ ] 源码入口文件位置？（通常是 `src/index.ts`）
- [ ] 是否需要生成类型声明文件？（库项目通常需要）

**行动**：使用 Glob 和 Read 工具检查上述文件。

### 第二步：安装核心依赖

安装发版所需的开发依赖：

```bash
pnpm add -D bumpp tsup changelogithub
```

**对于 monorepo**：

```bash
pnpm add -Dw bumpp changelogithub
# 在需要构建的子包中安装 tsup
cd packages/<package-name>
pnpm add -D tsup
```

**行动**：执行安装命令。

### 第三步：配置 tsup 构建

根据项目类型创建 tsup 配置文件。

#### 对于库项目（推荐配置）

创建 `tsup.config.ts`：

```typescript
import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["cjs", "esm"],
	dts: true, // 生成 .d.ts 类型声明
	clean: true,
	splitting: false,
	sourcemap: true,
	minify: false,
});
```

#### 对于 CLI 工具

创建 `tsup.config.ts`：

```typescript
import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/cli.ts", "src/index.ts"],
	format: ["esm"],
	dts: true,
	clean: true,
	shims: true, // 为 ESM 添加 shims
	banner: {
		js: "#!/usr/bin/env node", // CLI 入口需要 shebang
	},
});
```

#### 对于 monorepo

在每个需要构建的子包中创建独立的 `tsup.config.ts`，然后在根 `package.json` 中添加：

```json
{
	"scripts": {
		"build": "pnpm -r --filter='./packages/*' run build"
	}
}
```

**行动**：根据项目类型创建配置文件。

### 第四步：配置 package.json

在 `package.json` 中添加必要的字段和脚本。

#### 基础字段检查

确保以下字段正确配置：

```json
{
	"name": "your-package-name",
	"version": "0.0.1",
	"type": "module",
	"main": "./dist/index.cjs",
	"module": "./dist/index.js",
	"types": "./dist/index.d.ts",
	"exports": {
		".": {
			"types": "./dist/index.d.ts",
			"require": "./dist/index.cjs",
			"import": "./dist/index.js"
		}
	},
	"files": ["dist"],
	"scripts": {
		"build": "tsup",
		"release": "bumpp"
	}
}
```

**重要说明**：

- `files` 字段指定发布到 npm 的文件，通常只需要 `dist` 目录
- `exports` 字段提供现代化的包导出方式
- `type: "module"` 表示项目使用 ESM

**行动**：检查并更新 `package.json` 字段。

### 第五步：配置 bumpp

创建 `bumpp.config.ts`（可选，bumpp 有合理的默认配置）：

```typescript
import { defineConfig } from "bumpp";

export default defineConfig({
	files: [
		"package.json",
		// monorepo 的话可以添加子包的 package.json
		// 'packages/*/package.json',
	],
	commit: "release: v%s",
	tag: "v%s",
	push: false, // 不自动推送，让开发者确认后手动推送
	all: true, // 提交所有改动
	confirm: true, // 推送前确认
});
```

**常用 bumpp 配置项**：

- `commit` - 提交信息模板（%s 会被替换为版本号）
- `tag` - 标签模板
- `push` - 是否自动推送（建议设为 false）
- `confirm` - 是否需要确认

**行动**：创建配置文件（可选）。

### 第六步：创建 GitHub Actions Workflow

创建 `.github/workflows/release.yml`：

```yaml
name: Release

on:
  push:
    tags:
      - "v*" # 匹配 v 开头的 tag，如 v1.0.0

permissions:
  contents: write # 创建 Release 需要写权限
  id-token: write # npm provenance 需要

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # 获取完整历史，changelogithub 需要

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: https://registry.npmjs.org

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Install Dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm run build

      - name: Publish to npm
        run: pnpm publish --access public --no-git-checks
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: Generate Release Notes
        run: npx changelogithub
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

#### Monorepo 的 workflow 调整

对于 monorepo，需要根据 tag 判断发布哪个包：

```yaml
name: Release

on:
  push:
    tags:
      - "v*"
      - "@*/v*" # 支持 @scope/package@v1.0.0 格式

permissions:
  contents: write
  id-token: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: https://registry.npmjs.org

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Install Dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm run build

      - name: Publish to npm
        run: |
          cd packages/${GITHUB_REF#refs/tags/*/}
          pnpm publish --access public --no-git-checks
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: Generate Release Notes
        run: npx changelogithub
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**行动**：创建 workflow 文件。

### 第七步：配置 GitHub Secrets

提醒用户在 GitHub 仓库中配置必要的 Secrets：

#### NPM_TOKEN

1. 登录 [npmjs.com](https://www.npmjs.com/)
2. 进入 `Access Tokens` 页面
3. 点击 `Generate New Token` → 选择 `Automation` 类型
4. 复制生成的 token
5. 在 GitHub 仓库：Settings → Secrets and variables → Actions → New repository secret
6. Name: `NPM_TOKEN`
7. Secret: 粘贴 token

#### GITHUB_TOKEN

无需配置，GitHub Actions 自动提供。

**行动**：输出提醒清单给用户。

### 第八步：配置 Conventional Commits（可选但推荐）

为了让 changelogithub 生成更好的 Release Notes，建议遵循 Conventional Commits 规范。

#### 安装 commitlint 和 husky

```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional
pnpm add -D husky lint-staged
```

#### 配置 commitlint

创建 `commitlint.config.js`：

```javascript
export default {
	extends: ["@commitlint/config-conventional"],
};
```

#### 配置 husky

```bash
pnpm exec husky init
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

**行动**：询问用户是否需要配置（推荐但不强制）。

### 第九步：验证配置

配置完成后，进行测试验证：

#### 本地测试流程

1. **测试构建**

   ```bash
   pnpm run build
   ```

   检查 `dist/` 目录是否正确生成构建产物。

2. **测试版本升级（不实际发布）**

   ```bash
   pnpm release --dry-run
   ```

   检查 bumpp 是否正常工作。

3. **实际发布测试**（确认无误后）

   ```bash
   # 第一步：运行 release
   pnpm release
   # 选择版本类型：patch/minor/major
   # 确认后 bumpp 会自动 commit 和 tag

   # 第二步：推送 tag
   git push --follow-tags

   # 第三步：观察 GitHub Actions
   # 访问 GitHub 仓库的 Actions 页面，查看 workflow 运行情况
   ```

#### 检查清单

- [ ] 构建产物是否正确生成？
- [ ] package.json 版本号是否正确更新？
- [ ] Git tag 是否正确创建？
- [ ] GitHub Actions workflow 是否成功触发？
- [ ] npm 是否成功发布？
- [ ] GitHub Release 是否正确创建？
- [ ] Release Notes 内容是否符合预期？

**行动**：执行测试并输出结果。

### 第十步：输出配置总结

完成所有配置后，向用户提供完整的总结报告。

#### 配置文件清单

列出所有创建或修改的文件：

```plain
✓ tsup.config.ts - 构建配置
✓ bumpp.config.ts - 版本升级配置（可选）
✓ package.json - 更新 scripts、exports、files 字段
✓ .github/workflows/release.yml - 发布 workflow
✓ commitlint.config.js - commit 规范配置（可选）
✓ .husky/commit-msg - commit 钩子（可选）
```

#### 使用指南

```markdown
## 日常发版流程

1. **完成开发并提交代码**
   - 确保遵循 Conventional Commits 规范
   - 运行测试并确保通过

2. **本地构建测试**
   pnpm run build

3. **运行 release 命令**
   pnpm release

4. **选择版本类型**
   - patch (0.0.x) - 修复 bug
   - minor (0.x.0) - 新增功能（向后兼容）
   - major (x.0.0) - 破坏性变更

5. **推送 tag**
   git push --follow-tags

6. **等待 CI 完成**
   - 访问 GitHub Actions 查看进度
   - 发布成功后检查 npm 和 GitHub Release

## 常用命令

- pnpm build - 构建项目
- pnpm release - 发布新版本
- pnpm release --dry-run - 预览版本升级（不实际修改）
- git push --follow-tags - 推送代码和标签
```

#### 故障排查

常见问题和解决方案：

**问题 1：npm publish 失败 - 401 Unauthorized**

- 检查 NPM_TOKEN 是否正确配置
- 检查 token 是否有发布权限
- 检查包名是否已被占用

**问题 2：changelogithub 生成的 Release 为空**

- 检查是否有 commits 记录
- 检查 GITHUB_TOKEN 权限
- 确保 fetch-depth: 0 已配置

**问题 3：tsup 构建失败**

- 检查 tsconfig.json 配置
- 检查入口文件路径是否正确
- 查看详细错误信息

**问题 4：monorepo 中发布了错误的包**

- 检查 tag 格式是否正确
- 检查 workflow 中的包路径解析逻辑

#### 参考文档

- [bumpp](https://github.com/antfu/bumpp) - 版本升级工具
- [tsup](https://tsup.egoist.dev/) - TypeScript 打包工具
- [changelogithub](https://github.com/antfu/changelogithub) - GitHub Release 生成器
- [Conventional Commits](https://www.conventionalcommits.org/) - 提交信息规范

**行动**：生成并输出完整的配置总结。

## 注意事项

### 安全性

1. **保护 NPM_TOKEN**
   - 永远不要在代码中硬编码
   - 只在受保护的 workflow 中使用
   - 定期轮换 token

2. **限制发布权限**
   - 考虑使用 GitHub Environments 限制发布权限
   - 为生产发布添加 required reviewers

### Monorepo 最佳实践

1. **独立版本管理**
   - 每个包在自己的目录下运行 `pnpm release`
   - 使用统一的 tag 格式：`@scope/package@v1.0.0`

2. **构建顺序**
   - 确保内部依赖先构建
   - 使用 pnpm 的 `--filter` 和拓扑排序

3. **发布脚本**
   - 考虑在根目录添加辅助脚本
   - 自动检测哪些包需要发布

### 最佳实践

1. **版本号语义**
   - 严格遵循 [SemVer](https://semver.org/)
   - 破坏性变更必须升级 major 版本

2. **Commit 规范**
   - 使用 Conventional Commits
   - 配置 commitlint 强制规范

3. **发布前检查**
   - 运行完整的测试套件
   - 检查构建产物
   - 使用 `--dry-run` 预览

4. **文档维护**
   - 在 README 中说明发版流程
   - 重大变更时更新迁移指南

## 开始执行

现在，请按照上述十个步骤为用户配置发包工作流。记住：

1. **逐步执行** - 按顺序完成每个步骤
2. **详细说明** - 解释每个配置的作用
3. **确认关键点** - 在重要决策时征询用户意见
4. **完整测试** - 配置完成后进行完整验证
5. **清晰输出** - 提供详细的配置总结和使用指南

开始为用户配置吧！
