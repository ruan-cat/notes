# 使用 changeset publish 的 `--otp` 参数实现发包

::: tip

这是第一版本的发包实践。

:::

- https://github.com/changesets/changesets/blob/main/docs/command-line-options.md#publish

最核心的是传递好 npm 的 token 即可，注意要写=等于号，否则传参失败。

## 新建 npm token

新建传统 token 即可。

::: details

![2025-02-05-18-19-06](https://gh-img-store.ruan-cat.com/img/2025-02-05-18-19-06.png)

:::

## 仓库存储 token

名称我们可以取名为 NPM_TOKEN 。

::: details

![2025-02-05-18-20-10](https://gh-img-store.ruan-cat.com/img/2025-02-05-18-20-10.png)

:::

## 基于 `--otp` 的发包工作流

::: details 发包工作流

<<< ./release.yml

:::

## 仍有缺陷

### 触发条件

工作流不是基于 git tag 触发的。不懂怎么根据版本号实现触发。

### 手动消耗掉变更集文件

目前消耗变更集文件是自己手动消耗的。不是根据工作流自动消耗掉的。version 定版本的过程还是需要人为的来实现。该流程不是自动化的。
