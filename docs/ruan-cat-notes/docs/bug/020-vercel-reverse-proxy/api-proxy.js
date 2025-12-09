import { createProxyMiddleware } from "http-proxy-middleware";

/** @see https://yalisky.eu.org/blogs/2023/12/28/vercel配置跨域 */
export default async function handler(req, res) {
	// 判断请求路径是否以 '/backend' 开头，设置代理目标
	const target = req.url.startsWith("/backend") ? "被代理的接口baseUrl" : "";

	console.log(" 在边缘请求内：req.url ", req.url);

	if (target) {
		// 设置 CORS 头
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
		res.setHeader("Access-Control-Allow-Headers", "Content-Type");

		// 创建代理并等待完成
		await new Promise((resolve) => {
			createProxyMiddleware({
				target,
				changeOrigin: true,
				pathRewrite: {
					"^/backend/": "/",
				},
			})(req, res, resolve);
		});
	} else {
		// 如果没有找到匹配的路径，返回 404
		res.statusCode = 404;
		res.end("Not Found");
	}
}
