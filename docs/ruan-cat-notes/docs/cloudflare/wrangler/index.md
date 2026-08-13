# wrangler,cloudflare 的 cli 云服务部署工具

一个 node 库，专门用来使用无服务器云产品的。在 AI 时代，这是使用 cloudflare 云能力的重要本地 cli 工具。

## 安装

推荐全局安装 wrangler 。

```bash
pnpm i -g wrangler
```

### 高频更新

该包是高频率更新的。很多云服务厂商的 node 包，都是高频率更新的。

## 常用命令

```bash
# 查看目前token的类型
wrangler auth token --json
# 登录
wrangler login
wrangler whoami
```

## 部署服务 cloudflare worker 服务失败

在我运行完 nitro 的部署命令后，提示我部署到 cloudflare 时，需要运行以下命令，举例如下：

```bash
wrangler deploy .output/server/index.mjs --assets .output/public
```

该命令直接运行，会要求打开浏览器，做验证。但是验证经常不通过，控制台卡死在哪里。
