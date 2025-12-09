# wrangler,cloudflare 的 cli 云服务部署工具

一个 node 库，专门用来使用无服务器云产品的。

## 安装

```bash
pnpm i -D wrangler
```

### 高频更新

该包是高频率更新的。很多云服务厂商的 node 包，都是高频率更新的。

## 部署服务 cloudflare worker 服务失败

在我运行完 nitro 的部署命令后，提示我部署到 cloudflare 时，需要运行以下命令，举例如下：

```bash
wrangler deploy .output/server/index.mjs --assets .output/public
```

该命令直接运行，会要求打开浏览器，做验证。但是验证经常不通过，控制台卡死在哪里。

<!--  -->
