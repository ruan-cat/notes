# 基于 GLM 模型的配置

- 获取 key： https://bigmodel.cn/usercenter/proj-mgmt/apikeys
- 文档： https://docs.bigmodel.cn/cn/guide/develop/claude
- 月度订阅套餐购买： https://bigmodel.cn/claude-code
- 类似于流量包的套餐： https://bigmodel.cn/special_area

```bash
$env:ANTHROPIC_AUTH_TOKEN = "**"
$env:ANTHROPIC_BASE_URL = "https://open.bigmodel.cn/api/anthropic"
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL = "glm-4.5-air"
$env:ANTHROPIC_DEFAULT_SONNET_MODEL = "glm-4.6"
$env:ANTHROPIC_DEFAULT_OPUS_MODEL = "glm-4.6"
```

::: tip GLM 的 ANTHROPIC_AUTH_TOKEN 没有 sk- 开头

智谱 GLM 提供的 key 是不提供 `sk-` 开头的。这一点要注意。

:::

## 使用体验

### 提示词没有 `ultrathink` 标记时

::: details `claude code` + `智谱 GLM 模型` 的使用体验，很糟糕

1. 很容易修改无关的代码。要注意说明作用范围。不要让 ai 去做函数名和变量名的取名检查。
2. 调用子代理折腾半天没改对文件，自己跑去新建文件了。
3. 幻觉严重，面对业务类型时，会自己发挥想象力胡乱增加全新的，完全没有依据的新字段。
4. 同时使用多个子代理时，会出现某些子代理完全没有正常工作的情况。完全没有按照要求做的情况都有。
5. 即使提供了上下文，也不会学会主动模仿代码风格。不会模仿代码风格，必须要在提示词内事无巨细的写清楚各种细节，才能够正常的套模板。不是用模仿能力去套模板，而是根据过于细节的实施步骤和代码写法教程来套模板。不够智能。
6. 不会主动根据 glob 语法，去查找文件并执行修改。
7. 使用谷歌浏览器 MCP 时，工具调用能力极差，不懂得变通的调用工具，每次都把自己的上下文窗口耗尽。

:::

### 提示词包含 `ultrathink` 标记时

::: tip 出乎意料的好

主动控制 claude code 的思考预算，利用 GLM 模型 token 廉价的特性，主动要求 AI 使用大量的 token 积极思考，产出效果相比于 Anthropic 原版模型，往往是不相伯仲。

:::

## 参考资料

- [`零基础学会安装Claude Code+GLM 4.6`](https://www.bilibili.com/video/BV1GE4yzAEq3)
