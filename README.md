# 阮喵喵的笔记 📚

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/ruan-cat/notes)

这是一个基于 **pnpm workspaces** 和 **Turbo** 构建编排的 monorepo 文档项目，管理多个基于 VitePress 的文档站点，包含个人笔记、RPGMV 开发文档和团队文档。

## 📋 项目概览

这个项目采用现代化的 monorepo 架构，统一管理多个文档站点，提供高效的开发和构建体验。所有文档站点均基于 VitePress 构建，支持 Markdown 和 Vue 组件的混合使用。

## 🚀 技术栈

- **包管理器**: pnpm (>= 10.15.0)
- **构建系统**: Turbo 用于跨工作空间的任务编排
- **文档引擎**: VitePress 用于所有文档站点
- **开发语言**: TypeScript (目标 ESNext)
- **运行环境**: Node.js >= 22.14.0

## 📁 项目结构

```plain
gh.notes/
├── docs/
│   ├── ruan-cat-notes/         # 个人笔记文档 (@ruan-cat-docs/notes)
│   ├── rpgmv-dev-notes/        # RPGMV 开发文档 (@ruan-cat-docs/rpgmv-dev-notes)
│   └── docs-01-star/           # 01-star 团队文档 (@ruan-cat-docs/docs-01-star)
├── package.json                # 根目录 package.json
├── pnpm-workspace.yaml        # pnpm 工作空间配置
├── turbo.json                 # Turbo 配置
├── tsconfig.json              # TypeScript 配置
└── CLAUDE.md                  # Claude Code 指导文件
```

## ⚡ 快速开始

### 环境要求

- Node.js >= 22.14.0
- pnpm >= 10.15.0

### 安装依赖

```bash
# 安装所有依赖
pnpm install
```

### 开发模式

选择一个文档站点进行开发：

```bash
# 个人笔记文档
cd docs/ruan-cat-notes && pnpm docs:dev

# RPGMV 开发文档
cd docs/rpgmv-dev-notes && pnpm docs:dev

# 01-star 团队文档
cd docs/docs-01-star && pnpm docs:dev
```

### 构建项目

```bash
# 构建所有文档站点
pnpm build

# 构建特定文档站点
pnpm run build:docs:note        # 构建笔记文档
pnpm run build:docs:01star       # 构建 01star 文档
```

## 🛠️ 开发指南

### 测试

```bash
# 运行测试，带 UI 界面和监听模式
pnpm test
```

### 代码格式化

```bash
# 使用 Prettier 格式化所有文件
pnpm format
```

### 依赖管理

```bash
# 使用 taze 更新依赖
pnpm run up-taze

# 更新 VitePress 相关包
pnpm update-package
```

### 清理缓存

```bash
# 清理构建缓存
pnpm run clear:cache

# 清理依赖（小心使用）
pnpm run clear:deps
```

## 🚀 部署

### 部署所有站点

```bash
pnpm deploy
```

### 部署到 Vercel

```bash
pnpm run deploy-on-vercel
```

## 🔧 Git 分支管理

```bash
# dev 分支变基到 main 分支并推送
pnpm run git:dev-2-main

# dev 分支变基到 vc 分支并推送
pnpm run git:dev-2-vc
```

## 📦 核心依赖

### 文档生成

- **VitePress**: 1.6.4+ 静态站点生成器
- **@ruan-cat/vitepress-preset-config**: 共享配置
- **vitepress-demo-plugin**: 交互式示例

### Vue 生态系统

- **Vue**: 3.5.20+ 组合式 API
- **Element Plus**: 2.11.1+ UI 组件库
- **VueUse**: 13.8.0+ 实用工具集
- **Pinia**: 3.0.3+ 状态管理

### 工具库

- **lodash-es**: 工具函数库
- **dayjs**: 日期处理
- **axios**: HTTP 请求
- **@ruan-cat/utils**: 自定义工具集

## ⚙️ 配置详情

### TypeScript 配置

- 使用复合项目设置，包含路径映射
- 支持 Markdown 文件中的 Vue 组件
- 同时支持 DOM 和 Node 环境
- 使用 `@/*` 和 `utils/*` 路径别名

### 代码质量

- **Prettier**: 使用 Tab 缩进，120 字符行宽
- **Commitlint**: 使用 @ruan-cat/commitlint-config 配置
- **Git Hooks**: 自动化代码质量检查

### 构建流程

- Turbo 管理跨工作空间的并行构建
- VitePress 构建输出到 `.vitepress/dist/` 目录
- 启用构建缓存优化
- 笔记文档构建使用大内存分配 (8GB)

## 📄 许可证

此项目为个人文档项目，请遵守相关使用规范。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

---

更多详细信息请参考 [CLAUDE.md](./CLAUDE.md) 文件。
