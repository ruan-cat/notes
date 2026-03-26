# 处理存放代码的 monorepo 仓库与实际 git 根目录不相符而产生的故障

在 eams-frontend-monorepo 项目集成 relizy 时，由于实际开展发包的代码目录，和实际的 git 目录存在间距，中间隔了 1 个文件夹，二者目录不对齐，导致 relizy 内部的处理逻辑出现故障。故无法完成发包。在临时的 patch 本地修复补丁内，完成修复。先需要将这个修复以 pr 的形式，在上游 relizy 包内完成修复。

你的核心任务是，帮我实现对 relizy 仓库的 pr，完成闭环式的故障解决。

## 获取错误上下文信息，了解事故情况

1. 兼容性处理代码： https://github.com/ruan-cat/monorepo/blob/dev/packages/utils/src/node-esm/scripts/relizy-runner/index.ts
2. 兼容层代码设计理由： https://utils.ruan-cat.com/node-esm/scripts/relizy-runner.md
3. eams-frontend-monorepo 项目的错误报告：
   - `D:\code\01s\202603-13hzb\yunxiao\01s-2603-13eams\eams-frontend-monorepo\docs\reports\2026-03-25-relizy-pnpm-patch-why-nested-git-root.md`
   - `D:\code\01s\202603-13hzb\yunxiao\01s-2603-13eams\eams-frontend-monorepo\docs\reports\2026-03-23-relizy-independent-release-breaking-change.md`
4. eams-frontend-monorepo 项目生成的 patch 修复补丁：
   - `D:\code\01s\202603-13hzb\yunxiao\01s-2603-13eams\eams-frontend-monorepo\patches\relizy@1.2.1.patch`
   - `D:\code\01s\202603-13hzb\yunxiao\01s-2603-13eams\eams-frontend-monorepo\patches\relizy@1.2.2-beta.1.patch`

## 整个任务的流程

1. 先阅读我提供给你的错误报告。必要时，请你去对应的仓库看看历史的处理代码。
2. 阅读我提供给你上下文链接。务必全面阅读，并思考理解。
3. 阅读当前这个已经 fork 到本地的 relizy 仓库。你的修改和后续 pr 将在这里开始。
4. 在 `D:\code\github-desktop-store\gh.notes\docs\ruan-cat-notes\docs\sundry\relizy\issues` 目录内，在合适的地方内，分别编写好两份内容相同的 issue 稿。
   - zh.md 纯中文的 issue 稿。因为我看不懂英文。
   - en.md 纯英文的 issue 稿，因为 relizy 仓库的维护者语言是英文。
   - 注意 issue 稿要说明发布者为非英文母语者，以下内容均为 AI 辅助翻译并生成。
   - issue 要说明清楚事故起因，以及预期的修改设计方案。
   - 格式参考请参考： `https://github.com/LouisMazel/relizy/issues/52`
5. 停下来，让我审核检查 issue。我同意内容以后，再发布纯英文的 issue。
6. 在当前的 relizy 仓库的 develop 分支的基础上，新建分支。按照规范，在新的分支内做出修改并完成 pr 流程。
7. 编写你的修改。完成修改任务。
8. 发布 pr。
   - pr 要主动关联到刚才已经发布成功的 issue 序号。
   - pr 稿的 title 标题要满足 Conventional Commits 规范的命名。
   - 编写的 git commit 推送，要附带需要解决的 issue 序号，满足标准的 github pr 处理方式。

## 允许使用的 agent 工具

注意使用 github MCP，本机没有提供 gh 包来完成任务。

## 补充编写 vitest 测试用例

无论你是新增功能，还是处理故障。你都应该在本次 pr 内，补全基于 vitest 的测试用例。具体编写 vitest 的代码写法和编码风格，应该参考现有的 relizy 仓库代码例子。

## pr 的代码约束规范

1. 尽量不要大范围的修改代码，做最小修改；如果不得不大规模修改文件时，必须在 pr 稿内说明清楚为什么要这样修改，避免维护者阅读困难。
2. 别为了实现完美的测试，而私自修改测试用例。不要欺骗自己。

## 本地构建包并测试发版

1. 在当前分支下，build 构建产物包 relizy。
2. 使用 pnpm link 的方式，创建链接到本地产物的依赖包。
3. 在这两个本地项目内，完成 link 并测试发版行为。
   - 本地项目目录： `D:\code\01s\202603-13hzb\yunxiao\01s-2603-13eams\eams-frontend-monorepo`
   - 本地项目目录： `D:\code\github-desktop-store\01s-11comm`
4. 在 link 本地包后，确保这款本地包能够使用。
5. 在本地测试项目的项目根目录内，运行命令 `relizy release --no-publish --no-provider-release --yes --force` 。直接调用被链接的 relizy 包完成一次发版任务，预期能够完成发版。
   - 如果发版失败，试着删除掉多余的 relizy patch 补丁文件，再继续完成发版。
