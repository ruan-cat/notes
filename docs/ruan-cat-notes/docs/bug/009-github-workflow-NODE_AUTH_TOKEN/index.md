# changesets 在 github 工作流并发发包时出现 E404 错误

## 错误情况

在工作流发包时，出现莫名其妙的 E404 错误，称查找包失败。让人很疑惑，查找不到包为什么还会自动失败呢？

::: details E404

<<< ./error.log

:::

## 解决方案

不知道原理，我主动声明清楚特定名称的环境变量后，就可以正常完成并发发包了。

即 NODE_AUTH_TOKEN 。

- https://github.com/changesets/changesets/issues/942#issuecomment-2515960421

::: details 主动增加 NODE_AUTH_TOKEN

<<< ./succ.yaml

:::

::: details 成功使用

复现地址：

- https://github.com/ruan-cat/vercel-monorepo-test/actions/runs/13202754677/job/36858520458

![2025-02-07-23-31-55](https://gh-img-store.ruan-cat.com/img/2025-02-07-23-31-55.png)

:::

::: details 成功执行的日志

<<< ./succ.log

:::

## 可能的注意事项

工作流文件几乎必不可少的 actions/setup-node 工作流，称会主动阅读环境变量 env.NODE_AUTH_TOKEN 。故考虑主动声明该名称的环境变量。

- https://github.com/actions/setup-node/tree/main

::: details

![2025-02-07-23-34-27](https://gh-img-store.ruan-cat.com/img/2025-02-07-23-34-27.png)

:::
