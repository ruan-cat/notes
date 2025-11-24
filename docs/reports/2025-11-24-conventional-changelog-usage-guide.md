# Conventional Changelog 使用指南

本文档详细介绍如何使用 conventional-changelog 工具链生成规范化的项目更新日志,包括工具选择、配置方法和完整的实践流程。

## 1. 工具选型与现状分析

### 1.1 conventional-changelog-cli 是否还应该使用?

**答案: 是的,仍然可以继续使用。**

conventional-changelog-cli 是 conventional-changelog 官方提供的命令行工具,目前仍在积极维护中。但官方同时推荐了三种更高级的自动化工具:

|        工具名称        |                        特点                         |           适用场景           |
| :--------------------: | :-------------------------------------------------: | :--------------------------: |
| commit-and-tag-version | npm version 命令的直接替代品,集成版本号和 CHANGELOG | 简单项目,需要替代 npm 工作流 |
|    semantic-release    |       完全自动化的发布流程,从 CI/CD 直接发布        |   需要完全自动化的企业项目   |
| simple-release-action  |             GitHub Action,支持 monorepo             |    GitHub 托管的 monorepo    |

### 1.2 工具组合推荐方案

根据项目复杂度,推荐以下组合方案:

|    方案类型    |                  工具组合                  |               优势                |
| :------------: | :----------------------------------------: | :-------------------------------: |
| 轻量级方案 🌟  |     bumpp + conventional-changelog-cli     |    灵活可控,配置简单,本地执行     |
|   标准化方案   | standard-version 或 commit-and-tag-version | 一键完成版本号+CHANGELOG+Git 标签 |
| 完全自动化方案 |           semantic-release (CI)            |   零人工干预,从提交到发布全自动   |

**vuepress-theme-plume 项目采用的就是轻量级方案(bumpp + conventional-changelog-cli)**,这也是本文重点推荐的方案。

## 2. vuepress-theme-plume 的 CHANGELOG 生成方式

### 2.1 使用的工具包

vuepress-theme-plume 的 CHANGELOG.md 是通过以下工具组合生成的:

|           工具包           |   版本   |                作用                |
| :------------------------: | :------: | :--------------------------------: |
|           bumpp            | (最新版) |  交互式版本号管理,自动化发布流程   |
| conventional-changelog-cli | (最新版) |  根据 git 提交记录生成 CHANGELOG   |
| cz-conventional-changelog  | (最新版) | 配合 commitizen 规范提交信息(可选) |

### 2.2 生成流程

**核心命令:**

```bash
# 1. 生成 CHANGELOG 的命令
"release:changelog": "conventional-changelog -p angular -i CHANGELOG.md -s"

# 2. 版本发布的完整流程
"release:version": "bumpp package.json ... --execute=\"pnpm release:changelog\" ..."
```

**参数说明:**

| 参数 |                       说明                        |
| :--: | :-----------------------------------------------: |
| `-p` | preset,指定提交规范(angular/atom/ember/eslint 等) |
| `-i` |          infile,指定 CHANGELOG 文件路径           |
| `-s` |         same-file,追加到现有文件而非覆盖          |
| `-r` | release-count,生成的版本数量(0 表示全部重新生成)  |

**工作流程:**

```plain
用户执行发布命令
    ↓
bumpp 交互式选择版本号 (major/minor/patch)
    ↓
更新 package.json 等文件的版本号
    ↓
执行 --execute 参数指定的命令
    ↓
conventional-changelog-cli 生成/更新 CHANGELOG.md
    ↓
Git 提交所有变更
    ↓
创建 Git 标签
    ↓
推送到远程仓库
```

### 2.3 GitHub Diff 链接的生成原理

CHANGELOG 中的 GitHub diff 链接(如 `compare/v1.0.0...v1.0.1`)是 **conventional-changelog-cli 使用 angular preset 时自动生成的**。

**生成原理:**

1. conventional-changelog-cli 读取项目的 `package.json` 中的 `repository.url`
2. 根据 Git 标签自动生成版本对比链接
3. angular preset 内置了 `compareUrlFormat` 配置:

```javascript
compareUrlFormat: "{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}";
commitUrlFormat: "{{host}}/{{owner}}/{{repository}}/commit/{{hash}}";
```

## 3. 在任意 Node 项目中初始化 CHANGELOG 生成

### 3.1 前置要求

|   要求项    |                说明                |
| :---------: | :--------------------------------: |
|  Node 版本  |       建议 >= 18.x LTS 版本        |
|  包管理器   |       npm / yarn / pnpm 均可       |
|  Git 仓库   |       必须已初始化 Git 仓库        |
| GitHub 仓库 | 需要在 package.json 中配置仓库地址 |

### 3.2 安装依赖包

**方案一: 轻量级方案(推荐)**

```bash
# 使用 pnpm
pnpm add -D bumpp conventional-changelog-cli

# 或使用 npm
npm install -D bumpp conventional-changelog-cli

# 或使用 yarn
yarn add -D bumpp conventional-changelog-cli
```

**方案二: 同时安装提交规范工具(推荐)**

```bash
pnpm add -D bumpp conventional-changelog-cli @commitlint/cli @commitlint/config-conventional husky
```

### 3.3 配置 package.json

**第一步: 确保仓库地址正确**

```json
{
	"repository": {
		"type": "git",
		"url": "https://github.com/your-username/your-repo.git"
	}
}
```

**第二步: 添加 scripts 命令**

```json
{
	"scripts": {
		"changelog": "conventional-changelog -p angular -i CHANGELOG.md -s",
		"release": "bumpp --execute=\"npm run changelog\""
	}
}
```

**进阶配置(monorepo 多包场景):**

```json
{
	"scripts": {
		"changelog": "conventional-changelog -p angular -i CHANGELOG.md -s",
		"release": "bumpp package.json packages/*/package.json --execute=\"npm run changelog\"",
		"release:major": "npm run release -- major",
		"release:minor": "npm run release -- minor",
		"release:patch": "npm run release -- patch"
	}
}
```

### 3.4 配置 commitlint(可选但强烈推荐)

**创建 commitlint.config.js:**

```javascript
/** commitlint 配置 */
module.exports = {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"type-enum": [
			2,
			"always",
			[
				"feat", // 新功能
				"fix", // 修复 bug
				"docs", // 文档更新
				"style", // 代码格式(不影响代码运行的变动)
				"refactor", // 重构
				"perf", // 性能优化
				"test", // 测试
				"chore", // 构建过程或辅助工具的变动
				"revert", // 回退
				"build", // 构建系统或外部依赖项的更改
			],
		],
	},
};
```

**配置 husky (自动化提交验证):**

```bash
# 初始化 husky
npx husky init

# 添加 commit-msg 钩子
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

### 3.5 首次生成 CHANGELOG

**生成全量 CHANGELOG:**

```bash
# 第一次生成,包含所有历史提交
conventional-changelog -p angular -i CHANGELOG.md -s -r 0
```

参数说明:

- `-r 0`: 生成所有版本的记录(0 表示无限制)

**增量更新 CHANGELOG:**

```bash
# 日常使用,仅添加最新版本
npm run changelog
```

## 4. 完整的发布流程示例

### 4.1 规范化提交流程

**方式一: 手动遵循约定式提交规范**

```bash
git add .
git commit -m "feat(user): 添加用户登录功能"
git commit -m "fix(api): 修复接口超时问题"
git commit -m "docs: 更新 README 文档"
```

**方式二: 使用 commitizen 交互式提交(推荐)**

```bash
# 安装 commitizen
pnpm add -D commitizen cz-conventional-changelog

# 初始化配置
npx commitizen init cz-conventional-changelog --save-dev --save-exact

# 使用交互式提交
npx cz
```

### 4.2 发布新版本

**使用 bumpp 自动化发布:**

```bash
# 交互式选择版本号
npm run release

# 或直接指定版本类型
npm run release -- patch   # 1.0.0 -> 1.0.1
npm run release -- minor   # 1.0.0 -> 1.1.0
npm run release -- major   # 1.0.0 -> 2.0.0

# 或指定具体版本号
npm run release -- 2.3.4
```

**bumpp 会自动完成:**

1. ✅ 提示选择版本号
2. ✅ 更新所有 package.json 的版本号
3. ✅ 执行 `npm run changelog` 生成/更新 CHANGELOG.md
4. ✅ Git 提交所有变更
5. ✅ 创建 Git 标签(如 v1.0.1)
6. ✅ 推送到远程仓库

### 4.3 验证生成的 CHANGELOG

生成的 CHANGELOG.md 应该包含:

```markdown
## [1.0.1](https://github.com/owner/repo/compare/v1.0.0...v1.0.1) (2025-11-24)

### Features

- **user:** 添加用户登录功能 ([a1b2c3d](https://github.com/owner/repo/commit/a1b2c3d))

### Bug Fixes

- **api:** 修复接口超时问题 ([e4f5g6h](https://github.com/owner/repo/commit/e4f5g6h))
```

**关键特征:**

- ✅ 版本号标题自动生成
- ✅ GitHub compare 链接(版本对比)
- ✅ 提交 SHA 链接
- ✅ 按类型分组(Features/Bug Fixes/等)
- ✅ 自动提取 scope 和描述

## 5. 常见问题与解决方案

### 5.1 CHANGELOG 没有生成 GitHub 链接?

**原因:** package.json 中未配置正确的 repository 字段

**解决方案:**

```json
{
	"repository": {
		"type": "git",
		"url": "https://github.com/username/repo.git"
	}
}
```

### 5.2 CHANGELOG 内容为空?

**原因:** Git 提交信息不符合约定式提交规范

**解决方案:**

- 确保提交信息格式为: `type(scope): description`
- 有效的 type: feat, fix, docs, style, refactor, perf, test, chore 等

### 5.3 如何自定义 CHANGELOG 格式?

**方式一: 使用不同的 preset**

```bash
# angular (默认,最严格)
conventional-changelog -p angular

# atom
conventional-changelog -p atom

# ember
conventional-changelog -p ember
```

**方式二: 创建自定义 preset**

创建 `.changelogrc` 或 `changelog.config.js` 进行详细配置。

### 5.4 monorepo 如何生成统一的 CHANGELOG?

```bash
# bumpp 支持同时更新多个 package.json
bumpp package.json packages/*/package.json --execute="conventional-changelog -p angular -i CHANGELOG.md -s"
```

## 6. 最佳实践建议

### 6.1 团队协作规范

|     实践项     |               建议               |
| :------------: | :------------------------------: |
|  提交信息规范  | 强制使用 commitlint + husky 钩子 |
|  版本发布流程  |     统一使用 npm run release     |
| CHANGELOG 维护 |   禁止手动修改,完全由工具生成    |
|  Git 标签管理  | 由 bumpp 自动创建,禁止手动打标签 |

### 6.2 CI/CD 集成

**GitHub Actions 示例:**

```yaml
name: Release

on:
  push:
    tags:
      - "v*"

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm publish
```

### 6.3 版本号策略

|  变更类型  |    版本号变化    |      示例      |
| :--------: | :--------------: | :------------: |
| 破坏性变更 |  MAJOR (主版本)  | 1.0.0 -> 2.0.0 |
|  新增功能  |  MINOR (次版本)  | 1.0.0 -> 1.1.0 |
|  Bug 修复  | PATCH (补丁版本) | 1.0.0 -> 1.0.1 |

**判断标准:**

- `feat` + `BREAKING CHANGE` → major
- `feat` → minor
- `fix` → patch

## 7. 参考资源

- [conventional-changelog 官方仓库](https://github.com/conventional-changelog/conventional-changelog)
- [约定式提交规范](https://www.conventionalcommits.org/zh-hans/)
- [bumpp 文档](https://github.com/antfu/bumpp)
- [commitlint 文档](https://commitlint.js.org/)
- [语义化版本规范](https://semver.org/lang/zh-CN/)

---

**生成日期:** 2025-11-24
**作者:** Claude Code
**文档版本:** 1.0.0
