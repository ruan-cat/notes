# turbo 配置的长时间运行任务应该补全 persistent 配置

在同事的 mac 电脑内，出现了 turbo 命令运行 vite 本地 dev 任务时，运行完直接关闭的情况。

经过查阅文档得知，是我们的 turbo.json 配置缺少了 persistent 配置。

作为长时间运行的 dev 项目，应该配置 persistent 持久化配置，保持该任务长期运行。

## package.json 任务定义

假设有以下的任务，我们要为 dev 主项目和 docs:dev 文档项目配置 turbo 任务。

::: details 任务定义

<<< ./package.example.json#snipaste{json twoslash}

:::

## turbo.json 任务调度配置

那么两个本地运行的，长期存在的项目，就应该被 turbo 配置为 persistent 持久化。

::: details 任务调度配置

<<< ./turbo.example.json#snipaste{json twoslash}

:::

## persistent 文档

- https://turbo.build/repo/docs/reference/configuration#persistent
