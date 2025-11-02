---
juejin: https://juejin.cn/post/7546582754026504201
desc: 编写 cloudflare worker 边缘计算函数，实现指定域名的重定向功能。最终提供一个短小精悍，便于记忆的自定义域名。
---

# 使用 cloudflare worker 实现域名重定向

> **摘要**：
>
> 编写 cloudflare worker 边缘计算函数，实现指定域名的重定向功能。最终提供一个短小精悍，便于记忆的自定义域名。

我希望用自己的域名，对一个特定链接做重定向。实现 https://juejin.ruan-cat.com 重定向到 https://juejin.cn/user/2406144257559271/posts 。提供一个更加短小易于记忆的域名，访问我的掘金博客。

## 方案选型

我选择用新建 cloudflare worker 的方式，实现重定向。通过编写边缘运行时的函数，用 301 的方式，实现重定向。

## 前提准备

1. 有自己的域名，且已经托管到 cloudflare 内。

## 实施步骤

核心步骤分为以下几步：

1. 新建 worker。
2. 部署 worker。
3. 配置自定义域名。

### 新建 worker

登录 cloudflare，在右上角选择新建，新建一个 worker。

![2025-09-07-18-20-49](https://gh-img-store.ruan-cat.com/img/2025-09-07-18-20-49.png)

### 从 Hello World! 开始

因为我们的需求仅仅是新建一个在 cloudflare 运行的边缘运行时函数，因此不需要选择模板，也不需要导入 git 存储库。直接编写代码即可。

故选择`从 Hello World! 开始`选项。

![2025-09-07-18-21-35](https://gh-img-store.ruan-cat.com/img/2025-09-07-18-21-35.png)

进来后的界面如下：

![2025-09-07-18-25-20](https://gh-img-store.ruan-cat.com/img/2025-09-07-18-25-20.png)

### 更换 worker 名称

这里我为了便于记忆，将 worker 名称改成 `juejin-posts-redirect` 。那么这个 worker 部署成功后，会自动生成一个连接 https://juejin-posts-redirect.1219043956.workers.dev ，稍后我们再通过配置自定义域名的方式，再重定向到这个链接即可。

![2025-09-07-18-28-53](https://gh-img-store.ruan-cat.com/img/2025-09-07-18-28-53.png)

### 部署 worker

我们先部署 worker，稍后再更改 worker 即可。点击右下角的部署按钮即可。

![2025-09-07-18-39-18](https://gh-img-store.ruan-cat.com/img/2025-09-07-18-39-18.png)

### 部署成功

部署成功的界面如下：

![2025-09-07-18-41-03](https://gh-img-store.ruan-cat.com/img/2025-09-07-18-41-03.png)

### 测试链接

在浏览器访问[该链接](https://juejin-posts-redirect.1219043956.workers.dev/)，看到预期的 `Hello World!` 字样，证明该链接是正常可用的。

![2025-09-07-18-46-39](https://gh-img-store.ruan-cat.com/img/2025-09-07-18-46-39.png)

### 进入到修改 worker 的在线编辑界面

点击`编辑代码`按钮：

![2025-09-07-18-48-14](https://gh-img-store.ruan-cat.com/img/2025-09-07-18-48-14.png)

进入到如下界面：

![2025-09-07-18-49-32](https://gh-img-store.ruan-cat.com/img/2025-09-07-18-49-32.png)

### 编写 worker

借助 AI 帮我们编写 worker，这里我使用的是 claude code，提示词如下：

```markdown
请深度思考。
我准备使用 cloudflare worker 实现域名重定向，请为我编写一个边缘运行时的函数，实现该 worker 重定向到【https://juejin.cn/user/2406144257559271/posts】地址。
```

最终生成的代码如下：

```js
/**
 * Cloudflare Worker 域名重定向脚本
 * 重定向到指定的掘金用户页面
 */

export default {
	async fetch(request, env, ctx) {
		// 目标重定向地址
		const targetUrl = "https://juejin.cn/user/2406144257559271/posts";

		try {
			// 获取请求的URL
			const requestUrl = new URL(request.url);

			// 构建重定向响应
			const response = new Response(null, {
				status: 301, // 永久重定向
				headers: {
					Location: targetUrl,
					"Cache-Control": "public, max-age=86400", // 缓存24小时
					"X-Redirect-Reason": "Domain redirect to Juejin profile",
				},
			});

			return response;
		} catch (error) {
			// 错误处理：如果重定向失败，返回错误页面
			return new Response(
				`<!DOCTYPE html>
        <html>
        <head>
          <title>Redirect Error</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1>重定向错误</h1>
          <p>无法完成重定向，请直接访问：<a href="${targetUrl}">${targetUrl}</a></p>
          <p>错误信息：${error.message}</p>
        </body>
        </html>`,
				{
					status: 500,
					headers: {
						"Content-Type": "text/html; charset=utf-8",
					},
				},
			);
		}
	},
};
```

### 重新部署并测试

点击重新部署并测试代码，重新访问链接，注意到 worker 可以直接跳转到期望的指定链接，可以看到自己的掘金文章了。证明该 worker 正常可用。

![2025-09-07-18-52-10](https://gh-img-store.ruan-cat.com/img/2025-09-07-18-52-10.png)

### 下次再继续编辑的访问入口

如果我们日后还需要修改 worker，可以在这里找到入口：

按照下图所示，找到`编辑代码`按钮。

![2025-09-07-18-58-12](https://gh-img-store.ruan-cat.com/img/2025-09-07-18-58-12.png)

### 配置自定义域名

最后一步是配置便于记忆的自定义域名，这样连接就足够语义化，便于记忆，且美观。

1. 在 cloudflare worker 的仪表盘内，找到我们新建的 `juejin-posts-redirect` worker。
2. 点击设置 tab 栏。
3. 点击添加按钮。

![2025-09-07-19-00-28](https://gh-img-store.ruan-cat.com/img/2025-09-07-19-00-28.png)

点击按钮后可以看到右侧抽屉栏，我们点击`自定义域`一栏。如下图所示：

![2025-09-07-19-02-02](https://gh-img-store.ruan-cat.com/img/2025-09-07-19-02-02.png)

输入 `juejin.ruan-cat.com` ，点击`添加域`按钮即可。

![2025-09-07-19-03-03](https://gh-img-store.ruan-cat.com/img/2025-09-07-19-03-03.png)

### 添加自定义域成功

在 worker 仪表盘内，可以看到我们增加了新的自定义域。

![2025-09-07-19-05-04](https://gh-img-store.ruan-cat.com/img/2025-09-07-19-05-04.png)

在 cloudflare 的 DNS 内，可以看到我们自定义域名绑定到 worker 上面了。

![2025-09-07-19-07-21](https://gh-img-store.ruan-cat.com/img/2025-09-07-19-07-21.png)

至此已完成配置。访问 [https://juejin.ruan-cat.com](https://juejin.ruan-cat.com) 链接就能重定向到我自己的掘金文章了。

## 参考资料

- [`利用 Cloudflare Workers 进行批量 301 重定向`](https://dvel.me/posts/cloudflare-workers-redirect/)
