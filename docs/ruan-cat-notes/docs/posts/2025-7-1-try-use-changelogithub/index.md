---
juejin: https://juejin.cn/post/7567309723479031860
desc: 尝试使用changelogithub生成github release发行版日志和changelog文件，发现changelogithub目前(2025-7-1)没办法支持在monorepo场景下的日志生成。
---

# 尝试使用 changelogithub 生成 github release 发行版日志和 changelog 文件

> **摘要**：
>
> 尝试使用 changelogithub 生成 github release 发行版日志和 changelog 文件，发现 changelogithub 目前(2025-7-1)没办法支持在 monorepo 场景下的日志生成。

## 折腾动机

我非常喜欢基于 [changelogithub](https://github.com/antfu/changelogithub) 生成发版日志，很好看。

> 我在想，能不能在基于 monorepo + changeset 的项目内，使用这款日志生成库呢？

## 寻找相关仓库并大胆尝试

- [`unjs/changelogen`](https://github.com/unjs/changelogen)
- [`antfu/changelogithub`](https://github.com/antfu/changelogithub)

值得注意的是，这两个库，更加倾向于设置 github release 的发行版报告，而不是设置到 changelog 文件内。

实际尝试下来，在 monorepo 内，效果不好。

工作流：

```yaml
- name: 生成github release的信息
	run: npx changelogithub
	env:
		GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
```

## 更改触发条件

在 monorepo 内，生成的 git tags 不是 v 开头的，需要改写触发条件。

```yaml
on:
  push:
    tags:
      - "@ruan-cat/*"
```

这产生了额外的心智负担。

## 单标签触发发版时成功

如果推送时，git tag 只包含一个包的标签时，就成功。

## 多标签触发发版时失败

### 上述的匹配方式会导致多个工作流启动

一个提交触发了两次部署。发包提交不应该触发多个部署的。

<details>
<summary>
  <strong>(点击展开) 触发多个工作流</strong>
</summary>

![2025-07-01-23-54-45](https://gh-img-store.ruan-cat.com/img/2025-07-01-23-54-45.png)

</details>

### 并发发包导致的版本号重名

<details>
<summary>
  <strong>(点击展开) 并发发包导致的版本号重名</strong>
</summary>

![2025-07-01-23-58-13](https://gh-img-store.ruan-cat.com/img/2025-07-01-23-58-13.png)

</details>

上面说包没有发行，然后实际发行的时候，又被另外的工作流完成了，被干扰了，导致本工作流无法继续执行。

因为已经被完成了，所以发包才会出现这种上下矛盾的情况。

<details>
<summary>
  <strong>(点击展开) 发包矛盾日志</strong>
</summary>

<!--
	这里为了掘金发文，没有使用vitepress的导入代码片段写法，故代码片段会存在更新不及时的情况。
	完整的代码片段
	<<< ./error-2025-7-1-01.log
-->

```log
🦋  info @ruan-cat/vuepress-preset-config is being published because our local version (0.1.34) has not been published on npm
🦋  info Publishing "@ruan-cat/domains" at "0.6.5"
🦋  info Publishing "@ruan-cat/vuepress-preset-config" at "0.1.34"
🦋  error an error occurred while publishing @ruan-cat/vuepress-preset-config: E403 403 Forbidden - PUT https://registry.npmjs.org/@ruan-cat%2fvuepress-preset-config - You cannot publish over the previously published versions: 0.1.34.
🦋  error In most cases, you or one of your dependencies are requesting
🦋  error a package version that is forbidden by your security policy, or
🦋  error on a server you do not have access to.
🦋  error npm notice Publishing to https://registry.npmjs.org/ with tag latest and public access
🦋  error npm error code E403
🦋  error npm error 403 403 Forbidden - PUT https://registry.npmjs.org/@ruan-cat%2fvuepress-preset-config - You cannot publish over the previously published versions: 0.1.34.
🦋  error npm error 403 In most cases, you or one of your dependencies are requesting
🦋  error npm error 403 a package version that is forbidden by your security policy, or
🦋  error npm error 403 on a server you do not have access to.
🦋  error npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2025-07-01T06_35_14_874Z-debug-0.log
```

</details>

### 多标签导致 github 修改日志的 url 生成失败

格式不对，无法生成基于 tag 标签的 github 修改日志。

<details>
<summary>
  <strong>(点击展开) 多标签导致 github 修改日志的 url 生成失败</strong>
</summary>

<!--
	这里为了掘金发文，没有使用vitepress的导入代码片段写法，故代码片段会存在更新不及时的情况。
	完整的代码片段
	<<< ./error-2025-7-1-02.log
-->

```log
Run npx changelogithub
npm warn exec The following package was not found and will be installed: changelogithub@13.16.0

changelogithub v13.16.0
fatal: ambiguous argument '@ruan-cat/vuepress-preset-config@0.1.34...@ruan-cat/domains@0.6.5
@ruan-cat/vuepress-preset-config@0.1.34': unknown revision or path not in the working tree.
Use '--' to separate paths from revisions, like this:
'git <command> [<revision>...] -- [<file>...]'
Error: Command failed: git --no-pager log "@ruan-cat/vuepress-preset-config@0.1.34...@ruan-cat/domains@0.6.5
@ruan-cat/vuepress-preset-config@0.1.34" --pretty="----%n%s|%h|%an|%ae%n%b" --name-status
fatal: ambiguous argument '@ruan-cat/vuepress-preset-config@0.1.34...@ruan-cat/domains@0.6.5
@ruan-cat/vuepress-preset-config@0.1.34': unknown revision or path not in the working tree.
Use '--' to separate paths from revisions, like this:
'git <command> [<revision>...] -- [<file>...]'

@ruan-cat/vuepress-preset-config@0.1.34" --pretty="----%n%s|%h|%an|%ae%n%b" --name-status
fatal: ambiguous argument '@ruan-cat/vuepress-preset-config@0.1.34...@ruan-cat/domains@0.6.5
@ruan-cat/vuepress-preset-config@0.1.34': unknown revision or path not in the working tree.
Use '--' to separate paths from revisions, like this:
'git <command> [<revision>...] -- [<file>...]'

    at genericNodeError (node:internal/errors:983:15)
    at wrappedFn (node:internal/errors:537:14)
    at checkExecSyncError (node:child_process:890:11)
    at execSync (node:child_process:962:15)
    at execCommand (file:///home/runner/.npm/_npx/b62f3a6189db43a0/node_modules/changelogen/dist/shared/changelogen.a79f5d5c.mjs:14:10)
    at getGitDiff (file:///home/runner/.npm/_npx/b62f3a6189db43a0/node_modules/changelogen/dist/shared/changelogen.a79f5d5c.mjs:39:13)
    at generate (file:///home/runner/.npm/_npx/b62f3a6189db43a0/node_modules/changelogithub/dist/shared/changelogithub.AtDj_jnB.mjs:431:28)
    at async CAC.<anonymous> (file:///home/runner/.npm/_npx/b62f3a6189db43a0/node_modules/changelogithub/dist/cli.mjs:41:37)
Error: Process completed with exit code 1.
```

</details>

## 对上述失败情况的思考

通过翻查源码和 issue 得知，changelogithub 是基于 changelogen 的，而 changelogen 本身目前还不支持纯粹的 monorepo。

现在使用的，基于 changeset 的发包方案，是多标签的发包方案。是传统意义上的 monorepo 项目发包方案。

而 changelogen 事实上是单标签发包方案，monorepo 里面的子包都不是独立的，都是附属于某款具体的依赖包上面的。发包时，这些附属包的版本号也是跟随主包的版本号的。

changelogen 目前作为 tsdown 的 vue 组件库默认模版内使用的发包工具，仅考虑单包单标签的发包场景。

该差异才导致了上述实践失败。

## 不如暂停，不钻牛角尖

changelogen 有专门的 [issue](https://github.com/unjs/changelogen/issues/85) 和 pr，实现对正统 monorepo 方案的支持，实现对 changeset 的支持时，就不需要上述的折腾了。

## 产生结论

本次碰壁，我至少得知，现在发版的方案有两款，一款是基于 changeset 的，另一款是基于 changelogen 的，二者的发版场景是不一样的。

最大的差异是：changeset 允许 monorepo 项目的**每个子包都拥有独立的版本号**，而基于 changelogen 的 monorepo **永远只能有唯一的版本号**。
