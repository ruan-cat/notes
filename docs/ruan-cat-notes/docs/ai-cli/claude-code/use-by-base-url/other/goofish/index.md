# 基于咸鱼卖家自主封装的 newapi 按量计费的配置

## 001 `http://1.95.142.151:3000`

兰姨

- 买家地址： https://www.goofish.com/item?spm=a21ybx.personal.feeds.1.57636ac2cRGAvR&id=1012562326368
- 管理后台： http://1.95.142.151:3000
- 额度兑换比例： 10 元 -> 10 美元
- 人民币购买力： 1.00 美元/元

花了 10 块钱买的额度。计费价格按照官网半价计费，太贵了。

::: warning 关于 token 安全

钱快被我用完了，暴露 token 无所谓了。

:::

```bash
$env:ANTHROPIC_AUTH_TOKEN = "sk-8mtAfS33Jo3eBxvNnX9OR9bzxYHd6eBQsuulSJduMOR9Uz04";
$env:ANTHROPIC_BASE_URL = "http://1.95.142.151:3000";
$env:ANTHROPIC_MODEL = "claude-opus-4-6";
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL = "claude-haiku-4-5-20251001";
$env:ANTHROPIC_DEFAULT_SONNET_MODEL = "claude-sonnet-4.6";
$env:ANTHROPIC_DEFAULT_OPUS_MODEL = "claude-opus-4-6";
claude --dangerously-skip-permissions
```

## 002 `http://47.119.122.61:4000/`

- 卖家地址： https://www.goofish.com/item?spm=a21ybx.item.itemCnxh.7.10e84286OM2sG5&id=1025479244660
- 使用文档： https://www.yuque.com/u52179012/gsqq4g/ihkhwllgcp4qlhsz?singleDoc
- 额度兑换比例： 23 元 -> 200 美元
- 人民币购买力： 8.70 美元/元
- 管理后台： http://47.119.122.61:4000/

- 你的兑换码为： ad2a66a8e71d4386a0f44adeb0221a02

::: warning 关于 token 安全

钱快被我用完了，暴露 token 无所谓了。

:::

<!--
$env:ANTHROPIC_MODEL = "claude-opus-4-6";
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL = "claude-haiku-4-5-20251001";
$env:ANTHROPIC_DEFAULT_SONNET_MODEL = "claude-sonnet-4-6";
$env:ANTHROPIC_DEFAULT_OPUS_MODEL = "claude-opus-4-6";
-->

```bash
$env:ANTHROPIC_AUTH_TOKEN = "sk-GnRj9ouIecvHWOBhc0UofN5eW8FIZgB0LS6gcjuQYJaSOyvF";
$env:ANTHROPIC_BASE_URL = "http://47.119.122.61:4000";
$env:CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS = "1";
claude --dangerously-skip-permissions
```

## 003 `https://www.codetab.cc/`

- 卖家地址： https://www.goofish.com/item?spm=a21ybx.item.itemCnxh.16.519b3da6mKlCby&id=1025497550445
- 使用文档： https://xcnfo191obv4.feishu.cn/wiki/Z3zaw2q6viC1Gnk9R6yc58p1neb
- 额度兑换比例： 156 元 -> 2000 美元
- 人民币购买力： 12.82 美元/元
- 管理后台： https://www.codetab.cc/

<!--
$env:ANTHROPIC_AUTH_TOKEN = "sk-be08aa56e195e417ec4d0af3d89758b0e175677f617c34c3379da3ca57c1d12a";
$env:ANTHROPIC_BASE_URL = "https://www.codetab.cc/";
$env:CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS = "1";
claude --dangerously-skip-permissions
-->

```bash
$env:ANTHROPIC_AUTH_TOKEN = "sk-xxxx";
$env:ANTHROPIC_BASE_URL = "https://www.codetab.cc/";
$env:CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS = "1";
claude --dangerously-skip-permissions
```
