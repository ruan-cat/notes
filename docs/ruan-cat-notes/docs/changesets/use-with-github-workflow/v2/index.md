# 使用 changesets 的官方 github 工作流实现发包

- https://github.com/changesets/action

使用该工作流，同时生成 github release 发行记录，和 changelog 变更日志文件。

## 想办法同时实现 github release 和 changelog 的生成

在一次提交内，实现两个 github release 的发布，并给各自的子包生成 changelog 文件。

- https://github.com/conventional-changelog/conventional-changelog/releases

![2025-07-01-22-16-56](https://gh-img-store.ruan-cat.com/img/2025-07-01-22-16-56.png)

![2025-07-02-18-04-43](https://gh-img-store.ruan-cat.com/img/2025-07-02-18-04-43.png)

## 总是说 404 错误

无法发包，总是说 404 错误。

```log
error an error occurred while publishing @xxxx/xxx: E404 Not Found - PUT https://registry.npmjs.org/@xxxx - Not found
error npm error 404  '' is not in this registry.
```

```yaml
- name: 在 .npmrc 内写入token
  run: |
    cat << EOF > "$HOME/.npmrc"
      //registry.npmjs.org/:_authToken=$NPM_TOKEN
    EOF
  env:
    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}

- name: 构建并发版
  id: changesets
  uses: changesets/action@v1
  with:
    commit: "chore: release package(s)"
    title: "chore: release package(s)"
    publish: pnpm release
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

- https://github.com/changesets/action/issues/311#issuecomment-1666950465
- https://zhuanlan.zhihu.com/p/25771848717

配置 `NODE_AUTH_TOKEN` 环境变量即可，太坑了。要看官方 issue 才有相关的说明。

## 进度

现在确实实现了基于 changesets/action 工作流的发包，但是 github release 的报告是混杂混乱的。不是短小的增量提交。

要看看是不是非要实现完整的 pr 才能触发发包。

## 提交变更集

现在将变更集提交并合并到 main 分支内了，新建了分支，但是没有新建 pr。

```log
Error: HttpError: Validation Failed: {"resource":"PullRequest","code":"custom","message":"No commits between main and changeset-release/main"} - https://docs.github.com/rest/pulls/pulls#create-a-pull-request
Error: Validation Failed: {"resource":"PullRequest","code":"custom","message":"No commits between main and changeset-release/main"} - https://docs.github.com/rest/pulls/pulls#create-a-pull-request
```

起因是我没有配置对正确的 version 命令。

## 整个发包的操作流程

- https://juejin.cn/post/7282951856514809897

1. 提交变更集文件到 dev 内。
2. 本地合并分支到主分支，生成 pr。
3. 合并 pr，触发发包。

## 参考资料

- https://juejin.cn/post/7140639347937640479

## 基于 `changesets/action` 工作流和 `NODE_AUTH_TOKEN` 的发包工作流

::: details 发包工作流

<<< ./release.yml

:::

## 其他尝试的记录

### trigensoftware/simple-release-action

这个工作流，有点复杂，在 github action 内写的非常冗杂。

不能学。

### semantic-release

- https://github.com/semantic-release/semantic-release
- https://semantic-release.gitbook.io/semantic-release/recipes/ci-configurations/github-actions

这个 github action 写的比较简单，不清楚能不能完成发包。可以试试看。代替现在的发包写法。
