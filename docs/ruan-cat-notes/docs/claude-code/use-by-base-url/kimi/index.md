# 基于 Kimi 官方网站的配置

## 备选的 Kimi 模型

- [模型产品价格](https://platform.moonshot.cn/docs/pricing/chat#产品定价)

kimi 官方是用量计费的，所以用的时候应该价格敏感。

- kimi-k2-thinking
- kimi-k2-turbo-preview
- kimi-k2-thinking-turbo 价格太贵

## 基于官方教程的方案

- 官网博客 [`Claude Code 与 Kimi K2：终极 AI 编程助手组合`](https://kimi-k2.org/zh/blog/07-ai-coding-assistant-zh)
- https://platform.moonshot.ai/docs/guide/agent-support.en-US#windows-1
- https://platform.moonshot.cn/docs/guide/agent-support#配置环境变量
- 获取 key： https://platform.moonshot.cn/console/api-keys

这两个文章讲的事情不是一回事，官网博客说要用到专门的 `claude-code-router` 路由器，而且配置明显的非常复杂，相比于其他常见的 claude code 供应商配置方式，该方案太离谱了，故不考虑。

按照这个官方文档，结合 GLM 的配置写法，Kimi 的写法如下：

```bash
$env:ANTHROPIC_AUTH_TOKEN = "在kimi官网内新建的token";
$env:ANTHROPIC_BASE_URL = "https://api.moonshot.cn/anthropic";
$env:ANTHROPIC_MODEL = "kimi-k2-thinking";
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL = "kimi-k2-thinking";
$env:ANTHROPIC_DEFAULT_SONNET_MODEL = "kimi-k2-thinking";
$env:ANTHROPIC_DEFAULT_OPUS_MODEL = "kimi-k2-thinking";
```

## 基于博客文章的配置方案

- 博客 [`Kimi K2驱动Claude Code终极指南 | Claude国内使用新姿势`](https://aigc.bar/Claude教程/2025/07/12/kimi-k2-claude-code-guide)

本质上是配置由 Kimi 提供的 token 和 baseUrl，模仿上面的配置，如下：

```bash
$env:ANTHROPIC_AUTH_TOKEN = "在kimi官网内新建的token"
$env:ANTHROPIC_BASE_URL = "https://api.moonshot.cn/v1/messages"
```

### 对 ANTHROPIC_BASE_URL 有疑惑

- https://platform.moonshot.cn/docs/guide/agent-support#配置-anthropic-api

该文档称要配置成 `https://api.moonshot.cn/anthropic` 。

## 基于 kimi 会员提供的 key

kimi 提供了会员，其中有一个会员权益叫做 `Kimi For Coding` ，`Kimi For Coding` 权益是可以生成专门的 key，并在 claude code 内使用。使用的是 `kimi-for-coding` 这款模型。

- [砍价守门员](https://www.kimi.com/kimiplus/promo)
- [`你真的会用AI砍价吗？双十一教你把 Kimi K2 Thinking 模型薅秃，一个月0.99元你敢信？（含保姆级教程）`](https://blog.csdn.net/m0_74837192/article/details/154702964)
- [开通 kimi 会员](https://www.kimi.com/membership/pricing)
- [`配置 Kimi For Coding 模型`](https://www.kimi.com/coding/docs/third-party-agents.html)

### 进入到砍价页面

这里我们用谷歌浏览器进入到砍价页面，如下：

![2025-11-13-05-34-43](https://gh-img-store.ruan-cat.com/img/2025-11-13-05-34-43.png)

不能用 360 极速浏览器，否则会提示区域不对，无法访问，被重定向回退到这个界面了：

![2025-11-13-05-35-48](https://gh-img-store.ruan-cat.com/img/2025-11-13-05-35-48.png)

### 砍价提示词与各种砍价方案

- https://blog.csdn.net/m0_74837192/article/details/154702964 失效
- https://zhuanlan.zhihu.com/p/1971628865752373220 失效

### 基于 kimi-for-coding 的配置

```bash
$env:ANTHROPIC_AUTH_TOKEN = "这里填在会员页面生成的 API Key";
$env:ANTHROPIC_BASE_URL = "https://api.kimi.com/coding/";
$env:ANTHROPIC_MODEL = "kimi-for-coding";
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL = "kimi-for-coding";
$env:ANTHROPIC_DEFAULT_SONNET_MODEL = "kimi-for-coding";
$env:ANTHROPIC_DEFAULT_OPUS_MODEL = "kimi-for-coding";
claude --dangerously-skip-permissions
```
