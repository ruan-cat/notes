# 生成变更日志文件 `CHANGELOG.md`

我很纠结，很在意如何在项目内生成美观，统一的更新日志文件。

本文的重心仅限于生成 `CHANGELOG.md` 文件。

## 生成 changlog.md 的要求

我期望生成出来的 `CHANGELOG.md` 文件满足以下要求：

1. 包含基于 git tag 的 github diff 差异对比链接。

参考资料：

- [`Gitmoji x Conventional Commit 工作流 (三) - 使用 commit-and-tag-version 自動化生成 CHANGELOG.md`](https://notes.boshkuo.com/blog/gitmoji-x-conventional-commit-workflow-commit-and-tag-version)
- [`如何维护更新日志`](https://keepachangelog.com/zh-CN/1.1.0/)

## 基于 changelogithub 的日志生成方案

## 基于 changelogen 的日志生成方案

## 基于 conventional-changelog-cli 的日志生成方案

个人有点膈应这个方案，因为 `conventional-changelog-cli` 本身不更新维护了，我也不清楚继任改名后的包是哪个，如何使用也不清楚。

有点洁癖，用起来不放心，但是配合 bumpp 来生成日志时，生成效果还算勉强可以。

安装：

```bash
pnpm i -D conventional-changelog-cli
```

编写 package.json 命令：

```json
{
	"changelog": "conventional-changelog -p angular -i CHANGELOG.md -s"
}
```

### 生成效果

1. 包含版本更新日期。
2. 包含 github diff 链接。

![2025-11-25-06-25-22](https://gh-img-store.ruan-cat.com/img/2025-11-25-06-25-22.png)

### 为什么缺少内容？

如上图所示，生成日志是空的，什么都没有。是因为根据 `conventional-changelog-config-spec` 规范，默认的提交 type 类型如下：

- https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.2.0/README.md#types

![2025-11-26-02-56-04](https://gh-img-store.ruan-cat.com/img/2025-11-26-02-56-04.png)

按照配置规范，我们应该去配置 `.versionrc.js` 文件，声明清楚那些提交类型需要添加到更新日志内。
