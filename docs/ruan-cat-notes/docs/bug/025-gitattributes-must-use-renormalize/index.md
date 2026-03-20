---
juejin: https://juejin.cn/post/7619219565653983295
desc: 加了.gitattributes设eol=lf却忘跑renormalize，全团队代码库出现幽灵差异、合并被阻塞，10个分支全中招。
title: "加了 .gitattributes 就万事大吉？我差点毁了整个团队的 Git 工作流"
date: 2026-03-21
categories: ["Git", "工程化", "避坑指南"]
tags: ["gitattributes", "renormalize", "eol", "CRLF", "LF", "团队协作"]
---

# 加了 .gitattributes 就万事大吉？我差点毁了整个团队的 Git 工作流

> **摘要**：
>
> 我给团队项目加了 [`.gitattributes`](https://git-scm.com/docs/gitattributes) 文件，规定所有文本文件统一使用 LF 行尾，本以为从此解决了跨平台换行符的烦恼。但我犯了一个致命的遗漏：**忘记执行 `git add --renormalize`**。结果，团队所有同事的本地仓库里，某些文件开始出现神秘的「幽灵差异」——文件内容明明没改，`git status` 却永远显示已修改，切换分支也无法消除，合并工作被迫全面停摆。

> **AI 协助编写的博客文章**：
>
> 这篇文章有参与 AI 协助的。使用了 AI 润色文章。

## 1. 事情的起因：我以为加了 .gitattributes 就够了

团队在 Windows 上开发，默认行尾是 CRLF；CI 跑在 Linux，行尾是 LF；不同成员的编辑器设置也五花八门。为了解决这个经典的跨平台换行符问题，我决定给项目加一个 `.gitattributes` 文件：

```ini
# Auto detect text files and perform LF normalization
* text=auto eol=lf

# 各类源文件明确指定 LF
*.vue  text eol=lf diff
*.ts   text eol=lf diff
*.js   text eol=lf diff
*.json text eol=lf diff
*.md   text eol=lf diff
# ...（省略其余类型）

# 锁文件当二进制处理，避免合并冲突
pnpm-lock.yaml merge=binary
```

加完之后，我把文件提交推送上去了。心里想：**大功告成，以后大家的代码都会统一成 LF 了。**

然而我完全错了。

## 2. 故障现象：全团队的文件开始「鬼打墙」

提交之后的第二天，同事陆续跟我反馈一个奇怪的问题：

> "我的 `README.md` 一直显示有改动，但我根本没动过这个文件！切换分支也不消失！"

我一看，`git status` 确实显示：

```log
 M eams-frontend-monorepo/README.md
```

再看 `git diff`，输出的是这样的内容：

```log
diff --git a/eams-frontend-monorepo/README.md b/eams-frontend-monorepo/README.md
index 1c1ae00c..0a573bd6 100644
--- a/eams-frontend-monorepo/README.md
+++ b/eams-frontend-monorepo/README.md
@@ -1,3 +1,3 @@
-# 这是 monorepo 项目的根目录
-
-<!-- 等待AI补全 -->
+# 这是 monorepo 项目的根目录
+
+<!-- 等待AI补全 -->
```

看起来什么都没变，但 Git 就是认为文件被修改了。更要命的是，**这个「已修改」状态切换分支也不会消失**——只要分支里存在这个文件，它就永远处于脏状态。

排查之后发现，不只是 `README.md`，项目中 **10 个不同的 `f1-*` 子分支** 都中招了，每个分支里都存在若干文件永久处于「已修改」状态，根本无法正常进行 Git 操作，合并工作全线瘫痪。

## 3. 根因分析：.gitattributes 只管「以后」，不管「过去」

### 3.1. Git 对象库里的历史 CRLF 没有消失

`.gitattributes` 是一个「声明文件」，它告诉 Git：**从现在起，对这些文件进行行尾转换**。但它并不会追溯历史——那些在添加 `.gitattributes` 之前就已经以 CRLF 格式存入 Git 对象库的文件 blob，还是原来的样子。

以 `README.md` 为例：

|        存储位置         | 行尾格式 |                         说明                         |
| :---------------------: | :------: | :--------------------------------------------------: |
| Git 对象库（历史 blob） |   CRLF   | 历史提交时以 CRLF 写入，加了 .gitattributes 也不会变 |
|       工作区文件        |    LF    |    Git 检出时按 .gitattributes 规则转换，写入 LF     |

Git 在比较「工作区文件」和「索引中的 blob」时，发现两者行尾不一致，于是永远认为文件被修改了。

### 3.2. 为什么是「幽灵差异」？

这个问题极其隐蔽，因为：

1. **文件内容完全相同**：只有行尾不同，不涉及任何业务逻辑变更
2. **`git diff` 输出几乎为空**：很多 diff 工具会忽略空白字符差异，看起来什么都没改
3. **切换分支不会消失**：只要该分支的索引里存着 CRLF 版的 blob，切过去就中招
4. **无法通过常规手段修复**：`git checkout -- file` 不管用，因为根源在索引里

## 4. 正确姿势：加了 .gitattributes 之后必须跑 renormalize

### 4.1. 什么是 renormalize

[`git add --renormalize`](https://git-scm.com/docs/git-add#Documentation/git-add.txt---renormalize) 是专门为这个场景设计的命令。它的作用是：

**重新将工作区文件按当前 `.gitattributes` 规则进行行尾转换，并将转换后的内容重新写入 Git 索引（staging area）。**

简单来说，就是让 Git 索引里的 blob 从 CRLF 变成 LF，与工作区保持一致，幽灵差异自然消失。

### 4.2. 正确的操作流程

加了 `.gitattributes` 之后，正确的操作顺序应该是：

```bash
# 第一步：对整个工作区执行 renormalize
git add --renormalize .

# 第二步：提交这次规范化
git commit -m "chore: normalize line endings per .gitattributes"

# 第三步（可选）：验证工作区干净
git status
```

如果只需要处理特定文件，也可以指定路径：

```bash
git add --renormalize eams-frontend-monorepo/README.md
git commit -m "chore: normalize README.md line endings (CRLF to LF)"
```

**这一步必须在每个受影响的分支上分别执行。** 因为每个分支的 Git 索引是独立的，只在一条分支上 renormalize 并不能影响其他分支。

## 5. 修复过程：10 个分支逐一补救

由于我当时没有执行 renormalize 就把 `.gitattributes` 推上了远程，团队里所有基于旧提交创建的分支全部中招。我需要对所有受影响的分支逐一修复。

### 5.1. 确认哪些分支受影响

先检查每个分支的状态：

```bash
git checkout <branch>
git diff --name-only eams-frontend-monorepo/README.md
```

结果排查下来，共有 **9 个 `f1-*` 子分支** 存在幽灵差异：

```log
f1-edit-modal-dongfang : DIRTY
f1-kxgbd-EW            : DIRTY
f1-pccalendar-wangzirui: DIRTY
f1-rom                 : DIRTY
f1-ruancat             : DIRTY
f1-table-lianjiu       : DIRTY
f1-xiaoyu              : DIRTY
f1-yuji                : DIRTY
f1-zhongxia            : DIRTY
f1-赵俊杰              : DIRTY
```

### 5.2. 批量修复

对每个脏分支执行 renormalize 并提交：

```bash
git checkout <branch>
git add --renormalize eams-frontend-monorepo/README.md
git commit -m "chore: renormalize line endings (CRLF to LF) per .gitattributes"
```

⚠️ **注意 commitlint**：如果项目启用了 commitlint，合并子分支时的提交信息也需要符合规范。`merge: xxx into f1` 这种写法会被 commitlint 拒绝，必须改为合法的 type，例如：

```bash
git merge <branch> -m "chore: merge <branch> into f1"
```

### 5.3. 修复后验证

在每个分支上验证：

```bash
git checkout <branch>
git status -sb
```

看到该文件不再出现在 `git status` 输出中，说明修复成功。

## 6. 举一反三：配套 .editorconfig 减少后续问题

光靠 `.gitattributes` 管控 Git 层的行尾，治标不治本。如果团队成员的编辑器在创建新文件时默认用 CRLF，将来还会不断出现新的 CRLF 文件。

建议同时更新 `.editorconfig`，在 `[*]` 节下加上：

```ini
[*]
end_of_line = lf
```

支持 EditorConfig 的编辑器（VS Code、JetBrains 系列等）会在保存文件时自动使用 LF，从源头上减少 CRLF 文件的产生。

## 7. 总结：三条必须记住的规则

这次事故给整个团队造成了不小的麻烦，正式总结三条操作约束，供日后参考：

|    规则    |                                       内容                                        |
| :--------: | :-------------------------------------------------------------------------------: |
| **规则 1** | 新增或修改 `.gitattributes` 后，**必须立即执行 `git add --renormalize .` 并提交** |
| **规则 2** |        renormalize 需要在**所有受影响的分支**上分别执行，不能只在主干上做         |
| **规则 3** |  `.gitattributes` + `.editorconfig` 双管齐下，才能从源头到存储全链路管控行尾格式  |

遇到「文件内容没变但 `git status` 显示已修改」的情况，**优先怀疑行尾问题**，用 `git diff` 仔细看一眼是不是只有换行符差异，然后直接用 `git add --renormalize` 解决，不要去动业务代码。

最后说一句让我印象最深的教训：

> **`.gitattributes` 只管「从今往后」，不管「历史过去」。** 你必须亲自动手，让过去的历史 blob 也换新装。
