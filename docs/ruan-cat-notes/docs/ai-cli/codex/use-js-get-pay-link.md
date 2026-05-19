# 通过 javascript 脚本获取 PayPal 支付链接

这一系列方案很考究`长链`和`短链`的区别。

## 方案 1

- 文字教程： https://flowpilot.qlhazycoder.top/tutorial/guide

进入 ChatGPT 并打开开发者工具，在控制台输入 `allow pasting` 并回车。粘贴并执行脚本：

```javascript
(async function () {
	try {
		const t = await (await fetch("/api/auth/session")).json();
		if (!t.accessToken) {
			alert("请先登录 ChatGPT！");
			return;
		}

		// 核心1：强制使用触发 PayPal 的欧洲区参数 (DE 德国 / EUR 欧元)
		const payload = {
			entry_point: "all_plans_pricing_modal",
			plan_name: "chatgptplusplan", // Plus 的套餐名
			billing_details: {
				country: "DE", // 必须是 DE 或 FR 才能在后续页面使用 PayPal
				currency: "EUR",
			},
			checkout_ui_mode: "custom",
			promo_campaign: {
				promo_campaign_id: "plus-1-month-free", // Plus 对应优惠码
				is_coupon_from_query_param: false,
			},
		};

		const response = await fetch("https://chatgpt.com/backend-api/payments/checkout", {
			method: "POST",
			headers: {
				Authorization: "Bearer " + t.accessToken,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});

		const data = await response.json();

		if (data.checkout_session_id) {
			// 核心2：拼接 Plus 的专属支付短链
			// 如果 openai_ie 报错，可以直接把 /openai_ie 删掉，变成 "https://chatgpt.com/checkout/" + data.checkout_session_id
			const shortLink = "https://chatgpt.com/checkout/openai_ie/" + data.checkout_session_id;

			// 弹窗让你复制这个带有 PayPal 的短链
			prompt("提取成功！这是你的 Plus 支付短链（复制保留）：", shortLink);

			// 自动跳转到该短链
			window.location.href = shortLink;
		} else {
			console.error(data);
			alert("提取失败：" + (data.detail || JSON.stringify(data)));
		}
	} catch (e) {
		alert("发生异常：" + e);
	}
})();
```

## 方案 2

别人转发的 html 文档，原本的[帖子](https://linux.do/t/topic/2190394)已经被删了。

```javascript
(async function generatePlusHostedLink() {
	let accessToken;
	try {
		const session = await fetch("/api/auth/session").then((r) => r.json());
		accessToken = session?.accessToken;
		if (!accessToken) throw new Error("accessToken 为空");
	} catch (e) {
		return;
	}

	const payload = {
		entry_point: "all_plans_pricing_modal",
		plan_name: "chatgptplusplan",
		billing_details: {
			country: "DE",
			currency: "EUR",
		},
		promo_campaign: {
			promo_campaign_id: "plus-1-month-free",
			is_coupon_from_query_param: false,
		},
		checkout_ui_mode: "hosted",
		cancel_url: "https://chatgpt.com/",
		success_url: "https://chatgpt.com/",
	};

	let data;
	try {
		const response = await fetch("https://chatgpt.com/backend-api/payments/checkout", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});
		data = await response.json();

		if (!response.ok) {
			return;
		}
	} catch (e) {
		return;
	}
	console.clear();
	console.log(data.url);
})();
```

## 方案 3

```javascript
(async function generatePlusHostedLink() {
	console.log("⏳ [plus-link] 正在获取 Session Token...");

	// ── 1. 获取当前登录的 Access Token ──────────────────────────────────────
	let accessToken;
	try {
		const session = await fetch("/api/auth/session").then((r) => r.json());
		accessToken = session?.accessToken;
		if (!accessToken) throw new Error("accessToken 为空");
	} catch (e) {
		console.error("❌ [plus-link] 获取 Token 失败，请确保已登录 ChatGPT：", e.message);
		return;
	}
	console.log("✅ [plus-link] Token 获取成功");

	// ── 2. 构造请求 Payload ──────────────────────────────────────────────────
	// plan_name : chatgptplusplan（Plus 个人计划）
	// promo_campaign_id : plus-1-month-free（首月免费优惠活动）
	// checkout_ui_mode : hosted（关键！让 OpenAI 返回 Stripe Hosted URL）
	// billing_details : 填写账号所在地区，影响币种和税率
	const payload = {
		plan_name: "chatgptplusplan",
		billing_details: {
			country: "US",
			currency: "USD",
		},
		cancel_url: "https://chatgpt.com/#pricing",
		promo_campaign: {
			promo_campaign_id: "plus-1-month-free",
			is_coupon_from_query_param: false,
		},
		checkout_ui_mode: "hosted",
	};

	// ── 3. 发送请求 ──────────────────────────────────────────────────────────
	console.log("⏳ [plus-link] 正在请求 Stripe 长链接...");
	let data;
	try {
		const response = await fetch("https://chatgpt.com/backend-api/payments/checkout", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});
		data = await response.json();

		if (!response.ok) {
			console.error("❌ [plus-link] 请求失败，HTTP", response.status, data);
			return;
		}
	} catch (e) {
		console.error("❌ [plus-link] 网络请求异常：", e.message);
		return;
	}

	// ── 4. 输出结果 ──────────────────────────────────────────────────────────
	const hostedUrl = data?.url || data?.stripe_hosted_url || data?.checkout_url;

	if (!hostedUrl) {
		console.warn("⚠️ [plus-link] 未找到长链接，原始响应如下：");
		console.log(data);
		return;
	}

	console.log("─".repeat(60));
	console.log("✅ [plus-link] 生成成功！");
	console.log("");
	console.log("📋 Checkout Session ID :", data.checkout_session_id);
	console.log("🏢 Processor Entity :", data.processor_entity);
	console.log("💰 Plan : ChatGPT Plus（首月 €0/免费试用）");
	console.log("");
	console.log("🔗 Stripe 长链接：");
	console.log(hostedUrl);
	console.log("─".repeat(60));
})();
```
