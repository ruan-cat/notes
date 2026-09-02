# 买 pro 订阅，免费升级到 ultra 订阅

关于 cursor 卡 bug 升级 ultra 的方案。本质上是利用支付宝订阅地址缺失的订阅漏洞实现的。

## 咸鱼购买

关键词 `cursor zfb` ：

> ![2026-03-22-15-28-02](https://gh-img-store.ruan-cat.com/img/2026-03-22-15-28-02.png)

---

## 执行代码实现 pro 账号自动升级到 ultra

部分卖家提供这样的方案：

- 卖家：
  - https://www.goofish.com/item?spm=a21ybx.personal.feeds.1.53096ac2u3qG1g&id=1032609205034&categoryId=50023914
  - https://www.goofish.com/item?spm=a21ybx.personal.feeds.1.2c146ac2619qf0&id=1027650989908&categoryId=50025461
- 教程： https://www.kdocs.cn/l/ca5qkMnjGZT2

```js
fetch("https://cursor.com/api/checkout", {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
	},
	body: JSON.stringify({
		tier: "ultra",
		allowAutomaticPayment: true,
		yearly: false,
	}),
});
```

## 咸鱼，从正版的 pro 升级到最高的 ultra

一共分为两个步骤：

1. **先购买**一个能够支持支付宝付款方式的账号。一定要支付宝方式的账号才行。
2. 对这个支持支付宝付款方式的账号，购买 140 元月度订阅。
3. 必须在支付宝内先取消掉自动扣款。
4. 再购买一个升级卡密，根据 WorkosCursorSessionToken 实现对 pro 账号升级到 ultra 账号。

### 阶段 1： 购买支付宝渠道小白号

- 卖家地址： https://www.goofish.com/item?spm=a21ybx.personal.feeds.2.12526ac2GfCQMP&id=1028552865236&categoryId=50025461

购买获取的账号信息如下格式所示：

```log
xxxx@outlook.com----xxxxx----xxxxx----{'WorkosCursorSessionToken':'user_xxxxx'}
```

- 带有`支付宝付款方式的空白号`，购买的卡密： `6D55-1B3E-916C-D501` （已使用，兑换无效）

- 兑换卡密平台： https://yzre.cn
- 邮箱： xxxx@outlook.com

该方案必须要通过支付宝去渠道亲自付款。按照美元汇率，需付款约 138 元。

---

### 阶段 2： 购买升级卡密

- 卡密激活平台： https://yzre.cn/ultra
- 卖家地址： https://www.goofish.com/item?spm=a21ybx.personal.feeds.1.12526ac2GfCQMP&id=1026393090919&categoryId=50023914
- 自助升级卡密： `22B3-1AF8-F031-ADED` （已使用，兑换无效）
- 价格： 10 元
- 原理： 原理是使用预订单，开通 ultra 后，因为你支付宝解约了，它没法扣钱。不知道官方什么时候修复，所以不做质保保证，最长能用一个月。

成功激活卡密：

> ![2026-03-17-11-03-23](https://gh-img-store.ruan-cat.com/img/2026-03-17-11-03-23.png)

---

### 最终效果

> ![2026-03-17-11-13-29](https://gh-img-store.ruan-cat.com/img/2026-03-17-11-13-29.png)

---

### 该方案总价

2.5 + 138.44 + 9.9 = 150.84 元
