---
juejin: https://juejin.cn/post/7547547103168020530
desc: 使用 github workflow 工作流部署 github page 页面，减少诸如 vercel 的部署平台提供的免费额度使用，并减少自定义域名维护时的心智负担。
---

# 配置 github workflow 工作流文件，实现仓库自动更新 github page 站点

> **摘要**：
>
> 使用 github workflow 工作流部署 github page 页面，减少诸如 vercel 的部署平台提供的免费额度使用，并减少自定义域名维护时的心智负担。

## 动机

随着个人技术的学习，我拥有越来越多的 github 仓库了。对于每一个前端项目，往往都需要提供一个 url 链接，来访问页面。

我需要用合适的方式来部署项目，并提供 url 访问地址。

## 技术选型

### 不想让托管平台的项目管理页面出现过多的项目

尽管我很熟悉基于 vercel 和 cloudflare worker 的前端项目部署流配置，但是我不希望在这些托管平台内看到过多的项目，这加重了我的心智负担。

有时候想要查询某个项目的配置和部署情况时，查询很麻烦。

我更希望用这些云平台部署边缘计算函数，而不是部署项目。

### 减少对 vercel 平台的使用

vercel 平台是好东西，但是针对免费用户，其额度是每天允许部署 100 次。我在某些 github workflow 内集成了基于 vercel cli 的部署方式，使得一次提交就可以触发多个项目的部署，加剧了额度消耗。比如在某个 monorepo 仓库内触发一次部署，vercel 平台就会同时触发 5 个不同子项目的部署。在高强度触发部署时，vercel 平台的额度就显得不够用了。按照这样计算，某个高消耗的仓库一天最多触发 20 次更新。

除开特定项目能够高强度消耗额度，我还有很多 github 仓库都会使用到 vercel 平台。因此每天 100 次的部署额度对我来说仍旧是杯水车薪。

除非在某些需要**快速部署**、**任意部署**的场景内，否则我是尽量避免直接使用 vercel 的。

因此我不能选用 vercel 平台。

### 是否要求我新建专门的 `gh-page` 分支来存储网页文件？

之前阅读过很多使用 github page 的文章，这些文章普遍说需要新建一个单独的 `gh-page` 分支，然后将 html 文件上传到该分支内，然后才可以部署页面。

我不希望仓库内多出一个分支，存放大量的无意义 dist 文件。因为克隆项目时很容易下载一大堆垃圾。

经过实践得知，是不需要新建分支的。下面的教程会配置 github page 的来源。来源选择 github workflow 提供，而不是从特定的 `gh-page` 分支提供。这就避免我们新建冗余的 git 分支了。

### 用 github 工作流就地在当前仓库内部署页面

综上所述，我选择使用 github page 实现项目部署。

1. **减少心智负担**：因为没有专门的部署页面，所以访问仓库时就能直接看到对应的 url 链接，减少统一管理部署站点的心智负担。
2. **没有额度焦虑**：github workflow 提供的额度是每日 2000 次，相比于 vercel 平台的每日 100 次，则要慷慨很多。可以毫无负担的使用 github workflow 触发项目部署。
3. **低速但够用**：github workflow 的运行速度，肯定是慢于 vercel 的。但是作为存储在 github 上的开源项目，是不需要考虑短时间内完成部署并交付给用户的。所以可以接受低速的 github workflow。

## 具体实施

在理清楚思路后，就按照以下步骤实现。

### 一、开启 github 仓库允许 github action 生成 github page 的配置

我们首先需要去 github 仓库内做配置。

如果不开启，那么后续会出现以下故障，如图所示：

![2025-09-08-18-35-12](https://gh-img-store.ruan-cat.com/img/2025-09-08-18-35-12.png)

<!--
	这里为了掘金发文，没有使用vitepress的导入代码片段写法，故代码片段会存在更新不及时的情况。
	完整的代码片段 error-repo-not-github-page-config.log
-->

```log
Error: Get Pages site failed. Please verify that the repository has Pages enabled and configured to build using GitHub Actions, or consider exploring the `enablement` parameter for this action.
Error: HttpError: Not Found
```

在 github 仓库内配置 github page 的来源为 github action 即可。如下图所示：

![2025-09-08-21-27-29](https://gh-img-store.ruan-cat.com/img/2025-09-08-21-27-29.png)

### 二、编写工作流文件

在项目内，新建 `.github\workflows\deploy-github-page.yaml` 工作流文件，随后推送到 github 仓库即可。

<!--
	这里为了掘金发文，没有使用vitepress的导入代码片段写法，故代码片段会存在更新不及时的情况。
	完整的代码片段 deploy-github-page.yaml
-->

```yaml
# 将静态内容部署到 GitHub Pages 的简易工作流程
# https://cn.vitejs.dev/guide/static-deploy#github-pages
# https://blog.meta-code.top/2024/08/15/2024-13/#03-补充-Vite-官方工作流程样本

name: Deploy static content to Pages

on:
  # 仅在推送到默认分支时运行。 这里改成在各种分支内运行，都触发工作流。并不需要严格的限制为主分支。
  push:
    branches: ["*"]

  # 这个选项可以使你手动在 Action tab 页面触发工作流
  workflow_dispatch:

# 设置 GITHUB_TOKEN 的权限，以允许部署到 GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# 允许一个并发的部署
concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  # 单次部署的工作描述
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest

    steps:
      - name: 检出分支
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: 安装pnpm
        uses: pnpm/action-setup@v4
        with:
          run_install: true

      - name: 安装依赖（尝试生成lockfile）
        run: pnpm install --frozen-lockfile

      - name: 安装node
        uses: actions/setup-node@v4
        with:
          node-version: 22.14.0
          cache: "pnpm"

      - name: 安装依赖
        run: pnpm install

      - name: 打包项目
        run: pnpm run build

      - name: 设置github pages
        uses: actions/configure-pages@v4

      - name: 上传打包产物
        uses: actions/upload-pages-artifact@v3
        with:
          path: "./docs/.vitepress/dist"

      - name: 部署到github pages
        id: deployment
        uses: actions/deploy-pages@v4
```

至此已经完成全部需要的配置。

## 完成页面部署

我在仓库 [`ruan-cat/stars-list`](https://github.com/ruan-cat/stars-list) 内提供该工作流，那么部署成功的 github page 页面地址就为 [`https://ruan-cat.github.io/stars-list/`](https://ruan-cat.github.io/stars-list/) 。

## 其他注意事项

我的文档渲染框架使用的是 vitepress。

根据 [vitepress 文档](https://vitepress.dev/zh/guide/deploy#github-pages)得知，在 github page 部署 vitepress 文档时，其 base 地址应该设置成仓库名。在本文的例子中，目标仓库名称为 `stars-list` ，那么 base 就应该设置成 `stars-list` 。

这里不做过多说明，详情请阅读 [vitepress 文档](https://vitepress.dev/zh/guide/deploy#setting-a-public-base-path)。

## 下一步的优化项？

目前实现 github page 部署时，使用的工作流需要经过 [`actions/configure-pages`](https://github.com/actions/configure-pages) 、[`actions/upload-pages-artifact`](https://github.com/actions/upload-pages-artifact) 和 [`actions/deploy-pages`](https://github.com/actions/deploy-pages) 这三个工作流协作才能实现部署。他们分别实现配置、上传文件、和部署页面。有没有可能使用那种更加精简的部署工作流配置方案？降低配置复杂度？

### 可能的技术选型

这些工作流未来我有空再看看，可能会比较好用。目前（2025-9-8）暂且作罢。

- https://github.com/peaceiris/actions-gh-pages/
- https://github.com/sitek94/vite-deploy-demo
- https://github.com/JamesIves/github-pages-deploy-action

## 参考资料

- [`【GitHub】基于Actions和Pages实现项目的自动构建与部署`](https://blog.meta-code.top/2024/08/15/2024-13/)
