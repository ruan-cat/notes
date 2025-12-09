# Conventional Changelog 使用指南

本文档详细介绍如何使用 conventional-changelog 工具链生成规范化的项目更新日志,包括工具选择、配置方法和完整的实践流程。

## 1. 工具选型与现状分析

### 1.1 conventional-changelog-cli 是否还应该使用?

**⚠️ 答案: 不推荐,建议迁移到 commit-and-tag-version。**

**维护状态:**

|            工具            |   最新版本   |   最后更新   |        当前状态         |
| :------------------------: | :----------: | :----------: | :---------------------: |
| conventional-changelog-cli |    5.0.0     |  约 2 年前   | ⚠️ 更新缓慢,不推荐使用  |
|      standard-version      |    9.5.0     |    已废弃    |     ❌ 官方停止维护     |
| **commit-and-tag-version** | **持续更新** | **活跃维护** | ✅ **官方推荐替代方案** |

**官方推荐的替代工具:**

|           工具名称            |                            特点                            |             适用场景             |
| :---------------------------: | :--------------------------------------------------------: | :------------------------------: |
| **commit-and-tag-version** ⭐ | standard-version 的活跃 fork,一键完成版本号+CHANGELOG+标签 | **个人和团队项目首选**(强烈推荐) |
|        release-please         |            Google 维护,深度集成 GitHub Actions             |        GitHub 托管的项目         |
|       semantic-release        |           完全自动化的发布流程,从 CI/CD 直接发布           |     需要完全自动化的企业项目     |

### 1.2 工具组合推荐方案

根据项目复杂度和维护要求,推荐以下方案(按推荐优先级排序):

|      方案类型       |              工具组合              |                      优势                      |        推荐指数        |
| :-----------------: | :--------------------------------: | :--------------------------------------------: | :--------------------: |
| **一键发布方案** ⭐ |     **commit-and-tag-version**     |   **一个命令完成所有操作,维护活跃,配置简单**   | **🌟🌟🌟🌟🌟 (首选)**  |
|   GitHub 专用方案   |        release-please (CI)         | Google 维护,深度集成 GitHub Actions,零本地操作 | 🌟🌟🌟🌟 (GitHub 用户) |
|   完全自动化方案    |       semantic-release (CI)        |      从提交到发布全自动,企业级 CI/CD 集成      |  🌟🌟🌟🌟 (大型项目)   |
|    遗留兼容方案     | bumpp + conventional-changelog-cli |     灵活可控,但工具更新慢,不推荐新项目使用     |    🌟🌟🌟 (仅兼容)     |

**⚠️ 重要说明:**

- **vuepress-theme-plume 项目采用的是遗留方案**(bumpp + conventional-changelog-cli),但这**不是最佳实践**
- **本文现在推荐使用 commit-and-tag-version**,它功能更强大、维护更活跃、配置更简单
- 如果你正在使用旧方案,请参考第 8 章的迁移指南

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

## 3. commit-and-tag-version 快速上手 ⭐ (推荐方案)

### 3.1 为什么选择 commit-and-tag-version?

commit-and-tag-version 是 standard-version 的活跃维护 fork,提供了完整的版本管理解决方案:

|        功能        |                            说明                            |
| :----------------: | :--------------------------------------------------------: |
|   自动版本号升级   |        根据提交信息自动判断 major/minor/patch 升级         |
| 自动生成 CHANGELOG |            支持 GitHub diff 链接和提交 SHA 链接            |
|   自动 Git 操作    |        自动提交、打标签、推送,无需手动执行 git 命令        |
|   Monorepo 支持    |                 支持多包项目的统一版本管理                 |
|     高度可配置     | 支持 .versionrc、.versionrc.json、.versionrc.js 等配置文件 |

### 3.2 安装与基础配置

**第一步: 安装依赖**

```bash
# 使用 pnpm (推荐)
pnpm add -D commit-and-tag-version

# 或使用 npm
npm install -D commit-and-tag-version

# 或使用 yarn
yarn add -D commit-and-tag-version
```

**第二步: 配置 package.json**

```json
{
	"repository": {
		"type": "git",
		"url": "https://github.com/your-username/your-repo.git"
	},
	"scripts": {
		"release": "commit-and-tag-version",
		"release:major": "commit-and-tag-version --release-as major",
		"release:minor": "commit-and-tag-version --release-as minor",
		"release:patch": "commit-and-tag-version --release-as patch",
		"release:first": "commit-and-tag-version --first-release"
	}
}
```

**第三步: 创建配置文件(可选)**

创建 `.versionrc.json` 或 `.versionrc.js`:

```json
{
	"types": [
		{ "type": "feat", "section": "✨ Features" },
		{ "type": "fix", "section": "🐛 Bug Fixes" },
		{ "type": "docs", "section": "📝 Documentation", "hidden": false },
		{ "type": "style", "section": "💄 Styles", "hidden": true },
		{ "type": "refactor", "section": "♻️ Code Refactoring" },
		{ "type": "perf", "section": "⚡ Performance Improvements" },
		{ "type": "test", "section": "✅ Tests", "hidden": true },
		{ "type": "build", "section": "📦 Build System", "hidden": true },
		{ "type": "ci", "section": "👷 CI", "hidden": true },
		{ "type": "chore", "section": "🔧 Chores", "hidden": true }
	]
}
```

### 3.3 使用方法

**首次发布:**

```bash
# 首次发布时使用(不会自动升级版本号)
npm run release:first
```

**日常发布:**

```bash
# 自动判断版本号类型(推荐)
npm run release

# 或手动指定版本类型
npm run release:patch   # 1.0.0 -> 1.0.1
npm run release:minor   # 1.0.0 -> 1.1.0
npm run release:major   # 1.0.0 -> 2.0.0

# 指定具体版本号
npx commit-and-tag-version --release-as 2.3.4
```

**预览模式(不实际执行):**

```bash
# 预览会执行的操作,不实际修改文件
npx commit-and-tag-version --dry-run
```

### 3.4 自动化工作流程

执行 `npm run release` 后,commit-and-tag-version 会自动完成:

```plain
1. 分析 Git 提交历史
   ↓
2. 根据约定式提交确定版本号类型
   ↓
3. 更新 package.json 中的版本号
   ↓
4. 生成/更新 CHANGELOG.md
   ↓
5. Git 提交变更 (commit message: "chore(release): x.x.x")
   ↓
6. 创建 Git 标签 (tag: vx.x.x)
   ↓
7. 完成 (可选: 手动执行 git push --follow-tags)
```

**自动推送配置:**

如果希望自动推送到远程仓库,可以配置:

```json
{
	"scripts": {
		"release": "commit-and-tag-version && git push --follow-tags origin main"
	}
}
```

### 3.5 高级配置示例

**Monorepo 配置:**

```json
{
	"scripts": {
		"release": "commit-and-tag-version -t '@my-scope@'",
		"release:all": "pnpm -r exec commit-and-tag-version"
	}
}
```

**自定义提交信息:**

```json
{
	"releaseCommitMessageFormat": "chore(release): 发布版本 {{currentTag}}"
}
```

**跳过某些步骤:**

```bash
# 跳过 changelog 生成
npx commit-and-tag-version --skip.changelog

# 跳过 git commit
npx commit-and-tag-version --skip.commit

# 跳过 git tag
npx commit-and-tag-version --skip.tag
```

## 4. 在任意 Node 项目中初始化 CHANGELOG 生成 (传统方案)

> ⚠️ **注意**: 本章节介绍的是传统方案(bumpp + conventional-changelog-cli),仅供参考和兼容性需求。**新项目请直接使用第 3 章介绍的 commit-and-tag-version 方案。**

### 4.1 前置要求

|   要求项    |                说明                |
| :---------: | :--------------------------------: |
|  Node 版本  |       建议 >= 18.x LTS 版本        |
|  包管理器   |       npm / yarn / pnpm 均可       |
|  Git 仓库   |       必须已初始化 Git 仓库        |
| GitHub 仓库 | 需要在 package.json 中配置仓库地址 |

### 4.2 安装依赖包

**方案一: 轻量级方案**

```bash
# 使用 pnpm
pnpm add -D bumpp conventional-changelog-cli

# 或使用 npm
npm install -D bumpp conventional-changelog-cli

# 或使用 yarn
yarn add -D bumpp conventional-changelog-cli
```

**方案二: 同时安装提交规范工具**

```bash
pnpm add -D bumpp conventional-changelog-cli @commitlint/cli @commitlint/config-conventional husky
```

### 4.3 配置 package.json

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

### 4.4 配置 commitlint(可选但强烈推荐)

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

### 4.5 首次生成 CHANGELOG

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

## 5. 完整的发布流程示例

### 5.1 规范化提交流程

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

### 5.2 使用 commit-and-tag-version 发布(推荐)

```bash
# 自动判断版本类型
npm run release

# 或手动指定
npm run release:patch
npm run release:minor
npm run release:major
```

### 5.3 使用 bumpp 发布(传统方案)

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

### 5.4 验证生成的 CHANGELOG

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

## 6. 常见问题与解决方案

### 6.1 CHANGELOG 没有生成 GitHub 链接?

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

### 6.2 CHANGELOG 内容为空?

**原因:** Git 提交信息不符合约定式提交规范

**解决方案:**

- 确保提交信息格式为: `type(scope): description`
- 有效的 type: feat, fix, docs, style, refactor, perf, test, chore 等

### 6.3 如何自定义 CHANGELOG 格式?

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

### 6.4 monorepo 如何生成统一的 CHANGELOG?

```bash
# bumpp 支持同时更新多个 package.json
bumpp package.json packages/*/package.json --execute="conventional-changelog -p angular -i CHANGELOG.md -s"
```

## 7. 最佳实践建议

### 7.1 团队协作规范

|     实践项     |                       建议                        |
| :------------: | :-----------------------------------------------: |
|  提交信息规范  |         强制使用 commitlint + husky 钩子          |
|    工具选择    |        **优先使用 commit-and-tag-version**        |
|  版本发布流程  |             统一使用 npm run release              |
| CHANGELOG 维护 |            禁止手动修改,完全由工具生成            |
|  Git 标签管理  | 由 commit-and-tag-version 自动创建,禁止手动打标签 |
|   版本号策略   |        严格遵循语义化版本规范(SemVer 2.0)         |

### 7.2 CI/CD 集成

**方案一: 使用 commit-and-tag-version 本地发布(推荐小团队)**

```yaml
name: Publish on Tag

on:
  push:
    tags:
      - "v*"

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          registry-url: "https://registry.npmjs.org"
      - run: npm ci
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**使用方式:**

```bash
# 本地执行,自动创建标签并推送
npm run release
```

**方案二: 使用 release-please 全自动发布(推荐 GitHub 用户)**

```yaml
name: Release Please

on:
  push:
    branches: [main]

permissions:
  contents: write
  pull-requests: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: googleapis/release-please-action@v4
        id: release
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          release-type: node

      - uses: actions/checkout@v4
        if: ${{ steps.release.outputs.release_created }}
      - uses: actions/setup-node@v4
        if: ${{ steps.release.outputs.release_created }}
        with:
          node-version: "20"
          registry-url: "https://registry.npmjs.org"
      - run: npm ci
        if: ${{ steps.release.outputs.release_created }}
      - run: npm publish
        if: ${{ steps.release.outputs.release_created }}
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**方案三: 使用 semantic-release 全自动(推荐大型项目)**

```yaml
name: Semantic Release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
      - run: npm run build
      - run: npx semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 7.3 版本号策略

|  变更类型  |    版本号变化    |      示例      |
| :--------: | :--------------: | :------------: |
| 破坏性变更 |  MAJOR (主版本)  | 1.0.0 -> 2.0.0 |
|  新增功能  |  MINOR (次版本)  | 1.0.0 -> 1.1.0 |
|  Bug 修复  | PATCH (补丁版本) | 1.0.0 -> 1.0.1 |

**判断标准:**

- `feat` + `BREAKING CHANGE` → major
- `feat` → minor
- `fix` → patch

## 8. 从旧方案迁移到 commit-and-tag-version

### 8.1 迁移准备清单

|       检查项       |                  说明                   |
| :----------------: | :-------------------------------------: |
| 备份现有 CHANGELOG |   确保现有 CHANGELOG.md 已提交到 Git    |
|    提交所有变更    |       确保工作区干净,无未提交文件       |
|  了解现有发布流程  | 记录当前使用的命令和配置,便于迁移后对比 |
|    团队成员沟通    |  提前通知团队成员工具变更,更新发布文档  |

### 8.2 从 bumpp + conventional-changelog-cli 迁移

**第一步: 卸载旧依赖**

```bash
# 保留 @commitlint 和 husky,仅卸载 bumpp 和 conventional-changelog-cli
pnpm remove bumpp conventional-changelog-cli
```

**第二步: 安装新依赖**

```bash
pnpm add -D commit-and-tag-version
```

**第三步: 更新 package.json scripts**

**迁移前:**

```json
{
	"scripts": {
		"changelog": "conventional-changelog -p angular -i CHANGELOG.md -s",
		"release": "bumpp --execute=\"npm run changelog\""
	}
}
```

**迁移后:**

```json
{
	"scripts": {
		"release": "commit-and-tag-version",
		"release:major": "commit-and-tag-version --release-as major",
		"release:minor": "commit-and-tag-version --release-as minor",
		"release:patch": "commit-and-tag-version --release-as patch"
	}
}
```

**第四步: 创建配置文件(可选)**

如果需要自定义 CHANGELOG 格式,创建 `.versionrc.json`:

```json
{
	"types": [
		{ "type": "feat", "section": "✨ Features" },
		{ "type": "fix", "section": "🐛 Bug Fixes" },
		{ "type": "docs", "section": "📝 Documentation" },
		{ "type": "refactor", "section": "♻️ Code Refactoring" },
		{ "type": "perf", "section": "⚡ Performance Improvements" }
	]
}
```

**第五步: 测试迁移**

```bash
# 使用 --dry-run 预览,不实际修改文件
npx commit-and-tag-version --dry-run

# 确认输出正确后,执行首次发布
npm run release
```

### 8.3 从 standard-version 迁移

**好消息**: commit-and-tag-version 是 standard-version 的直接 fork,**API 完全兼容**!

```bash
# 卸载 standard-version
pnpm remove standard-version

# 安装 commit-and-tag-version
pnpm add -D commit-and-tag-version

# 更新 package.json (如果有的话)
# 将 "standard-version" 替换为 "commit-and-tag-version"
```

**无需修改:**

- ✅ `.versionrc` / `.versionrc.json` / `.versionrc.js` 配置文件
- ✅ scripts 命令参数
- ✅ 已有的 CHANGELOG.md 格式

### 8.4 迁移后的验证

**验证清单:**

|     验证项     |                  验证方法                   |
| :------------: | :-----------------------------------------: |
|  版本号正确性  |    检查 package.json 版本号是否正确更新     |
| CHANGELOG 格式 | 对比新生成的 CHANGELOG 与旧版本格式是否一致 |
|    Git 标签    |        检查 `git tag` 确认标签已创建        |
|    Git 提交    |     检查 `git log` 确认 release commit      |
|  GitHub 链接   |   验证 CHANGELOG 中的 compare 链接可访问    |

**回滚方案:**

如果迁移出现问题:

```bash
# 1. 重置到迁移前的提交
git reset --hard HEAD~1

# 2. 删除错误的标签
git tag -d v错误版本号

# 3. 重新安装旧依赖
pnpm add -D bumpp conventional-changelog-cli
```

### 8.5 团队迁移最佳实践

**分步迁移策略:**

1. **个人项目先试点** - 在个人项目上先验证迁移流程
2. **文档先行** - 更新团队发布文档,添加新工具使用说明
3. **选择合适时机** - 在版本发布间隙进行迁移,避免影响正常发布
4. **团队培训** - 组织简短的工具使用培训
5. **监控首次发布** - 首次使用新工具时,由有经验的成员监督

**沟通模板:**

```markdown
【发布流程变更通知】

从下一个版本开始,我们将使用 commit-and-tag-version 替代原有的 bumpp + conventional-changelog-cli 方案。

**变更原因:**

- 原工具维护缓慢,已 2 年未更新
- 新工具功能更强大,一个命令完成所有操作
- 官方推荐的最佳实践

**操作变更:**
旧命令: npm run release
新命令: npm run release (命令相同,但内部逻辑更优)

**文档链接:** [内部发布文档链接]

**生效时间:** YYYY-MM-DD

如有疑问,请联系 [负责人]
```

## 9. 参考资源

### 9.1 官方文档

|           资源名称            |                                    链接                                    |                说明                |
| :---------------------------: | :------------------------------------------------------------------------: | :--------------------------------: |
| **commit-and-tag-version** ⭐ |    [GitHub](https://github.com/absolute-version/commit-and-tag-version)    | **首选工具,standard-version fork** |
|        约定式提交规范         |            [官网](https://www.conventionalcommits.org/zh-hans/)            |       提交信息规范的核心标准       |
|    conventional-changelog     | [GitHub](https://github.com/conventional-changelog/conventional-changelog) |        工具链生态的核心仓库        |
|          commitlint           |                     [官网](https://commitlint.js.org/)                     |          提交信息校验工具          |
|        语义化版本规范         |                   [官网](https://semver.org/lang/zh-CN/)                   |           版本号命名规范           |

### 9.2 相关工具

|     工具名称     |                              链接                              |            说明             |
| :--------------: | :------------------------------------------------------------: | :-------------------------: |
|  release-please  |     [GitHub](https://github.com/googleapis/release-please)     | Google 维护的 GitHub Action |
| semantic-release | [GitHub](https://github.com/semantic-release/semantic-release) |    企业级自动化发布工具     |
|      bumpp       |            [GitHub](https://github.com/antfu/bumpp)            |  交互式版本管理工具(遗留)   |
|    commitizen    |         [GitHub](https://github.com/commitizen/cz-cli)         |    交互式提交信息生成器     |
|      husky       |          [GitHub](https://github.com/typicode/husky)           |       Git hooks 工具        |

### 9.3 社区资源

- [Conventional Changelog Ecosystem](https://github.com/conventional-changelog) - 官方工具生态
- [Awesome Conventional Commits](https://github.com/topics/conventional-commits) - 相关项目合集
- [Keep a Changelog](https://keepachangelog.com/zh-CN/) - CHANGELOG 最佳实践指南

---

**文档信息:**

|     属性     |              值               |
| :----------: | :---------------------------: |
|   生成日期   |          2025-11-24           |
|   更新日期   |          2025-11-24           |
|     作者     |          Claude Code          |
|   文档版本   |             2.0.0             |
| **推荐方案** | **commit-and-tag-version** ⭐ |
