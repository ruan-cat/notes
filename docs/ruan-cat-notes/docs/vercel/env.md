# 环境变量

vercel 平台有很多环境变量，为了实现特殊的需求，需要部署环境能够读取平台提供的特定环境变量。

- 文档： https://vercel.com/docs/environment-variables
- 管理环境变量： https://vercel.com/docs/environment-variables/managing-environment-variables

## 设置团队级别的环境变量

不可能每一个 vercel 项目都配置环境变量，这里我选择配置团队级别的环境变量。称呼为`团队环境变量`。

按照以下步骤，在 vercel 的团队配置内设置环境变量：

1. 选择团队。
2. tab 栏，选择设置栏。
3. 侧边栏，选择环境变量。
4. 下拉选择栏，默认选择全部环境。
5. 设置环境变量。
6. 记得点击保存按钮。

::: details

![2025-09-12-19-29-07](https://gh-img-store.ruan-cat.com/img/2025-09-12-19-29-07.png)

:::

### 在项目内连接`团队环境变量`

新建`团队环境变量`后，按照官方文档，我们使用`共享环境变量`的方式，实现局部项目导入全局变量的目的。

- 文档： https://vercel.com/docs/environment-variables/shared-environment-variables

1. 仪表盘选择项目。
2. tab 栏，选择设置栏。
3. 侧边栏，选择环境变量。
4. tab 栏，选择`共享环境变量`。
5. 下拉多选框，勾选刚才在团队里面配置的环境变量。
6. 记得点击链接按钮，链接到团队环境变量。

![2025-09-12-19-43-19](https://gh-img-store.ruan-cat.com/img/2025-09-12-19-43-19.png)

## 允许使用 corepack

配置 `ENABLE_EXPERIMENTAL_COREPACK` 环境变量即可。

- 文档： https://vercel.com/docs/builds/configure-a-build#corepack
- 博客： https://vercel.com/changelog/corepack-experimental-is-now-available

具体示例如下：

```bash
ENABLE_EXPERIMENTAL_COREPACK=1
```

![2024-05-17-14-23-45](https://gh-img-store.ruan-cat.com/img/2024-05-17-14-23-45.png)

## 获取全部的 git 日志信息

- https://nolebase-integrations.ayaka.io/pages/zh-CN/integrations/vitepress-plugin-git-changelog/getting-started#在-vercel-上进行构建

```bash
VERCEL_DEEP_CLONE=true
```
