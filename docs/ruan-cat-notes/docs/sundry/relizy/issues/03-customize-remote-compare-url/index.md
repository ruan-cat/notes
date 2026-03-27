# 让 relizy 实现自定义的 git 远程托管平台的 compare url 格式，实现对阿里云效平台 `codeup.aliyun.com` 的兼容

在实际使用 relizy 时，生成的基于 tags 的对比 url 链接，不能满足我的 git 远程托管平台，需要实现自定义。

relizy 生成的这样的链接 `https://codeup.aliyun.com/zero-one-star/zero-awei/zero-one-eams2603/compare/hello-world@0.1.0...hello-world@0.1.1` 。

对于 `hello-world@0.1.0...hello-world@0.1.1` 格式的链接来说，在 github 上是成立的，正确的。可是在我当前使用的特殊的 git 托管平台内，有效的路径是：`https://codeup.aliyun.com/zero-one-star/zero-awei/zero-one-eams2603/compare?from=hello-world@0.1.0&to=hello-world@0.1.1&tab=tags` 。我需要实现配置链接，才能完成我的特殊需求。你需要在 relizy 内以 pr 的形式，实现好这个功能，

你的核心任务是，帮我实现对 relizy 仓库的 pr，完成闭环式的功能新增。

## 获取错误上下文信息，了解事故情况

1. eams-frontend-monorepo 项目的错误报告：
   - `D:\code\01s\202603-13hzb\yunxiao\01s-2603-13eams\eams-frontend-monorepo\docs\reports\2026-03-25-relizy-pnpm-patch-why-nested-git-root.md`
   - `D:\code\01s\202603-13hzb\yunxiao\01s-2603-13eams\eams-frontend-monorepo\docs\reports\2026-03-23-relizy-independent-release-breaking-change.md`
2. eams-frontend-monorepo 项目生成的 patch 修复补丁：
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
3. 具体的测试项目需要使用覆盖的方式，增加 link 并实现本地联调。`pnpm-workspace.yaml` 如下：

```yaml
overrides:
  # 本地联调 relizy：保留下一行；无需本地包时删除 relizy 行并执行 pnpm i 重算 lockfile
  relizy: link:../relizy__ruan-cat
```

4. 在这两个本地项目内，完成 link 并测试发版行为。
   - 本地项目目录： `D:\code\01s\202603-13hzb\yunxiao\01s-2603-13eams\eams-frontend-monorepo`
   - 本地项目目录： `D:\code\github-desktop-store\01s-11comm`
5. 在 link 本地包后，确保这款本地包能够使用。
6. link 本地包后，使用 pnpm i 安装依赖。
7. 使用 git 贮藏区来临时存储被修改的内容。因为 relizy 发版需要干净的 git。
8. 在本地测试项目的项目根目录内，运行命令 `pnpm exec relizy release --no-publish --no-provider-release --yes --patch --force` 。直接调用被链接的 relizy 包完成一次发版任务，预期能够完成发版。
   - 如果发版失败，试着删除掉多余的 relizy patch 补丁文件，再继续完成发版。
9. 如果本地包实现了发版，并看到 git 提交记录内产生了新的 git tag，那么就认定为完成了修改。将修改内容以贮藏区的形式存储。
