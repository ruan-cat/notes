# codex,AI 工具

截止 26 年 5 月，现在 codex 比 claude code 流行多了。

- 官网： https://chatgpt.com/codex
- 仓库： https://github.com/openai/codex
- 查看额度： https://chatgpt.com/codex/settings/usage
- codex 用量官方套餐额度： https://developers.openai.com/codex/pricing#what-are-the-usage-limits-for-my-plan
- 敏感的用户 session 信息： https://chatgpt.com/api/auth/session

## 用 PayPal 免费领取 ChatGPT plus

### 方案 1 失败

- 教程： https://wu.wubin.cc/200.html
- `第4期：免费获取1个月ChatGPT Plus，手把手教程，保姆级白嫖`： https://www.bilibili.com/video/BV1rco3B6EpZ/
- 咸鱼购买 PayPal： https://www.goofish.com/personal?userId=3328846750

---

日本日区获取免费的 plus 试用权限。没看到免费领取的地方。日区免费领取的渠道被堵住了。

### 方案 2 失败

- `通过 paypal 开通 30 天 chatgpt 免费试用`： https://www.bilibili.com/video/BV16tDXBrEmN/
- 视频配套教程： http://shenao.de/blog/
- **失败**
  > 按照视频教程，输入 javascrip 书签代码，无法跳转到含有 PayPal 的付款页面。

```javascript
(async function () {
	try {
		const t = await (await fetch("/api/auth/session")).json();
		if (!t.accessToken) {
			alert("请先登录 ChatGPT！");
			return;
		}
		const p = {
			plan_name: "chatgptteamplan",
			team_plan_data: { workspace_name: "Sam Altman", price_interval: "month", seat_quantity: 5 },
			billing_details: { country: "FR", currency: "EUR" },
			promo_campaign: { promo_campaign_id: "team-1-month-free", is_coupon_from_query_param: !0 },
			checkout_ui_mode: "custom",
		};
		const r = await fetch("https://chatgpt.com/backend-api/payments/checkout", {
			method: "POST",
			headers: { Authorization: "Bearer " + t.accessToken, "Content-Type": "application/json" },
			body: JSON.stringify(p),
		});
		const d = await r.json();
		d.checkout_session_id
			? (window.location.href = "https://chatgpt.com/checkout/openai_ie/" + d.checkout_session_id)
			: alert("提取失败：" + (d.detail || JSON.stringify(d)));
	} catch (e) {
		alert("发生错误：" + e);
	}
})();
```

### 方案 3

- https://www.nodeseek.com/post-729097-1

### 方案 4 批量注册

- `5月15日还能白嫖CODEX 注册免费 ，现在100%成功，GPT5.5 免费用 之前0撸PLUS无了`： https://www.bilibili.com/video/BV1i75e6fEuR/
- `FlowPilot` 浏览器插件的官方教程： https://flowpilot.qlhazycoder.top/tutorial/guide
- 浏览器插件仓库： https://github.com/QLHazyCoder/FlowPilot

---

这个方案太复杂了。

## ChatGPT promoCode 促销码

在 X 内直接找 `ChatGPT promoCode`、`ChatGPT Plus promoCode` 活动。但是感觉大部分都用不了，没办法。

- http://chatgpt.com/?promoCode=datroaica
- http://chatgpt.com/?promoCode=plus-1-month-free
- https://chatgpt.com/?promoCode=YACFW
- 美国 https://chatgpt.com/?promoCode=STRIPEATLASGPT4BIZ050126
- 可以用 新加坡 https://chatgpt.com/?promoCode=pathfindrsg
- 美国 https://chatgpt.com/?promoCode=THINKTECHNOLOGIESUS
- 美国 https://chatgpt.com/?promoCode=TECHREV2026
- 英国 https://chatgpt.com/?promoCode=codestonegb
- 英国 https://chatgpt.com/?promoCode=openaisequoialondon
