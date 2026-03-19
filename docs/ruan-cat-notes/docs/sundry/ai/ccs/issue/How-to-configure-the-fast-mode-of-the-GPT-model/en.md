# How to configure the fast mode of the GPT model?

> The original poster is a native Chinese speaker. The following content has been automatically translated into English by AI.

As shown in the screenshot below, I created a new `Variants` and configured the `gpt-5.4-high-fast` model myself. I have multiple GPT Plus accounts, but I strongly prefer Claude Code over Codex, so I chose to use CCS to set up a reverse proxy for multiple GPT Plus accounts.

I want to explicitly configure the specific model variant — for example, I want to use the 5.4 model with different reasoning depths: `xhigh`, `high`, and `medium`. Most importantly, I need to enable the `fast` suffix to activate the fast mode for GPT-series models. That is the whole reason I am configuring a custom model.

> ![1111](https://github.com/user-attachments/assets/f92e3a54-b81e-441a-8b99-5b659bd6108d)

<!-- <img width="2560" height="1222" alt="Image" src="https://github.com/user-attachments/assets/f92e3a54-b81e-441a-8b99-5b659bd6108d" /> -->

---

The specific configuration JSON is as follows:

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

However, an error clearly occurs:

> ![2222](https://github.com/user-attachments/assets/faf59b54-f390-4c15-9e99-8309bbcf2810)

<!-- <img width="1079" height="717" alt="Image" src="https://github.com/user-attachments/assets/faf59b54-f390-4c15-9e99-8309bbcf2810" /> -->

---

The error message is as follows:

```log
API Error: 502 {"error":{"message":"unknown provider for model gpt-5.4-high-fast","type":"server_error","code":"internal_server_error"}}
```

Did I make an obvious configuration mistake somewhere? Or how should I pass the parameters to correctly configure both the GPT model variant and the fast mode?
