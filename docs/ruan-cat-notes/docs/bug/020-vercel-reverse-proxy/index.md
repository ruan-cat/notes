# 基于 vercel 边缘函数解决 vercel.json 配置的反向代理方案失效的新方案

[之前的方案](./007-vercel-reverse-proxy.md)没用了。被迫用新的方案实现接口的反向代理。

## 无法在生产环境内给接口实现反向代理的旧方案

直接给 vercel.json 写配置，不能实现反向代理了。

::: details 无法实现反向代理的写法

<<< ./vercel.old-proxy.json

:::

## 基于 vercel 边缘函数实现的代理

首先阅读以下参考资料：

- [vercel](https://oorzc.cn/linux/其他配置/vercel部署项目.html#nodejs项目-跨域配置)
- [Vercel 配置服务端代理](https://blog.csdn.net/u012961419/article/details/112369710)
- [使用 Vercel 来部署静态页面并解决跨域问题](https://lsworl.github.io/2022/05/27/shi-yong-vercel-lai-bu-shu-jing-tai-ye-mian-bing-jie-jue-kua-yu-wen-ti/)
- [Vercel 跨域处理方案](https://segmentfault.com/a/1190000042276351)
- [vercel 配置跨域](https://yalisky.eu.org/blogs/2023/12/28/vercel配置跨域)

## `@ruan-cat/vercel-deploy-tool` 自有部署工具没有考虑到边缘计算函数的情况

我的项目普遍会包含至少一个主项目，一个文档项目，并且很多项目的仓库并不在 github 内，无法在 cloudflare 或 vercel 云平台内触发部署。故必须使用自己封装的库来完成部署。

本工具之前设计时，仅仅是为了准备上传静态文件。即使用 `vc build` 命令的特点，为项目准备好 `.vercel/output/static` 文件夹，随后上传到 vercel 平台。

上述方案是要求我们准备好[云函数的文件结构目录](https://github.com/vercel/examples/tree/main/build-output-api/serverless-functions)的，云函数目录要求满足 `.vercel/output/functions/index.func` 结构，目前我的工具没办法实现这个目录结构，而且识别与处理都很麻烦。

因此，我需要新的方式准备好云函数的文件目录。

## 使用 vite-plugin-vercel 插件生成云函数目录结构

很幸运能够找到这个插件，这个插件可以让 vite 项目的内容，生成出[Vercel Output API （v3）](https://vercel.com/docs/build-output-api)规范的目录结构。包括云函数。这就解决了上面的问题。

## 安装依赖 http-proxy-middleware

```bash
pnpm i -P http-proxy-middleware
```

我们要在产物内准备好能够被 vercel 平台识别的云函数，这个云函数是生产就绪的，所以要安装成生产环境依赖。先按照教程要求，准备好该代理工具。

## 新建云函数

按照 [vite-plugin-vercel](https://github.com/magne4000/vite-plugin-vercel/blob/v9/packages/vercel/README.md) 和上面参考资料的要求，在 vite 项目根目录内，新建 `_api\proxy.js` 云函数。

代码如下：

::: details `_api\proxy.js` 云函数

<<< ./api-proxy.js

:::

### 云函数必须写在 `_api` 目录内

按照[文档要求](https://github.com/magne4000/vite-plugin-vercel/blob/v9/packages/vercel/README.md#simple-usage)，为了避免重复构建和意外行为，需要将云函数写在 `_api` 目录内。

::: details 文档明确要求

![2025-06-15-17-26-56](https://gh-img-store.ruan-cat.com/img/2025-06-15-17-26-56.png)

:::

目前能诱发出来的意外情况是，http-proxy-middleware 在服务器内找不到，本地因为重复构建，导致依赖丢失。

::: details http-proxy-middleware 找不到

![2025-06-15-17-33-23](https://gh-img-store.ruan-cat.com/img/2025-06-15-17-33-23.png)

:::

## 在 vite.config.ts 内使用 vite-plugin-vercel 插件

::: details 使用插件

<<< ./vite.config.vercel.ts

:::

## 匹配接口路径到云函数

我们需要让满足特定前缀的后端接口，被代理到我们自写的代理中间件内。

如果我使用的是 vercel 平台的部署，那么在项目根目录内的 vercel.json 写以下内容即可。假设接口的反向代理前缀为： `/backend`

<<< ./vercel.new-proxy.json

一般情况下，做到这一步，就可以了。但是我的情况需要使用 Vercel Output API （v3）完成部署，没办法在被部署的产物内写入上述的配置。

只能稍微变通一下，在 vite-plugin-vercel 插件提供的 vercel 配置内，补全上述配置。

::: details 在 vite 内补全 vercel.json 配置

<<< ./vite.config.with-vercel.ts

:::

这样，vercel.json 的配置就能直接写入到本地的 `.vercel/output` 目录内，进而完成反向代理。

## 前端项目仍旧需要完成 vite 的反向代理配置

上述文章仅仅是说明在 vercel 平台内，给接口配置反向代理。项目本身也是需要配置 vite 的前端反向代理的。
