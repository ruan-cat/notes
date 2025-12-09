# vercel 反向代理问题

在生产环境内，我的项目需要实现反向代理，对生产环境的接口做反向代理。

## 现象

::: details 错误截图

![2024-11-12-23-54-49](https://gh-img-store.ruan-cat.com/img/2024-11-12-23-54-49.png)

:::

::: details 报错信息

```bash
Mixed Content: The page at 'https://01s-09oa.ruancat6312.top/' was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint 'http://8.154.39.107:10001/captcha/get'. This request has been blocked; the content must be served over HTTPS.
```

:::

## 现象解释

是反向代理的问题。后端的接口就是 http 的，我们前端的服务器要做反向代理，即为 vercel 配置反向代理即可。

## 具体解决

配置 vercel.json 文件即可。配置匹配到指定规则的路由时，就重写路由规则。

- https://vercel.com/docs/edge-network/rewrites#how-do-rewrites-work

```json
{
	"framework": null,
	"buildCommand": null,
	"installCommand": null,
	"outputDirectory": null,
	"devCommand": null,
	"public": false,
	"git": {
		"deploymentEnabled": {
			"main": false
		}
	},
	"rewrites": [
		{
			"source": "/api/:path*",
			"destination": "http://8.154.39.107:10001/:path*"
		}
	]
}
```
