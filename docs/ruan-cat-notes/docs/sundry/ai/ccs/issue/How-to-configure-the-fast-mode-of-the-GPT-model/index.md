# 如何配置 gpt 的 fast 模式？

> 提问者为中文母语用户，以下内容经过 AI 自动翻译成英文。

如下图所示，我新建了一个 `Variants` ，并且自己配置 `gpt-5.4-high-fast` 模型。我有多个 gpt plus 会员账号，但是我非常喜欢 claude code，不怎么喜欢在 codex 内使用，因此选择用 ccs 来实现对多个 gpt plus 账号做反向代理。

我期望自己配置清楚具体的模型型号，比如我要具体使用 5.4 模型、思考深度各有层次，分别为 xhigh、high 和 medium。最重要的是配置`fast`尾缀，我需要开启 gpt 系列模型的快速模式。我配置自定义模型就是为了实现配置`fast`尾缀。

> ![1111](https://github.com/user-attachments/assets/f92e3a54-b81e-441a-8b99-5b659bd6108d)

<!-- <img width="2560" height="1222" alt="Image" src="https://github.com/user-attachments/assets/f92e3a54-b81e-441a-8b99-5b659bd6108d" /> -->

---

具体的参数 json 如下：

```json
{
	"env": {
		"ANTHROPIC_MODEL": "gpt-5.4-high-fast",
		"ANTHROPIC_DEFAULT_OPUS_MODEL": "gpt-5.4-xhigh-fast",
		"ANTHROPIC_DEFAULT_SONNET_MODEL": "gpt-5.4-high-fast",
		"ANTHROPIC_DEFAULT_HAIKU_MODEL": "gpt-5.4-medium-fast"
	}
}
```

但是很明显出现故障：

> ![2222](https://github.com/user-attachments/assets/faf59b54-f390-4c15-9e99-8309bbcf2810)

<!-- <img width="1079" height="717" alt="Image" src="https://github.com/user-attachments/assets/faf59b54-f390-4c15-9e99-8309bbcf2810" /> -->

---

报错信息如下：

```log
API Error: 502 {"error":{"message":"unknown provider for model gpt-5.4-high-fast","type":"server_error","code":"internal_server_error"}}
```

请问我在那里出现明显的配置错误了么？或者我应该怎么传递参数，实现对 gpt 型号和 fast 模式的配置？
