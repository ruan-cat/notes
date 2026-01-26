# gemini cli,AI 编程工具

命令行交互的 AI 编程工具，和 claude code 一样。

- https://github.com/google-gemini/gemini-cli

## 全局安装

```bash
pnpm i -g @google/gemini-cli
```

## 申请 key

新建 Google 项目：

- https://console.cloud.google.com/projectcreate

查看已经有的 Google 项目：

- https://console.cloud.google.com/welcome

获取自己的 `gemini API key`：

- https://aistudio.google.com/apikey

在相关的文章中，都称呼为 `gemini API key`。特指在 `aistudio.google.com/apikey` 内申请的 key。

### 查看 key 的使用额度

如下图所示，在[用量](https://aistudio.google.com/usage)这里查看：

![2025-08-04-15-33-54](https://gh-img-store.ruan-cat.com/img/2025-08-04-15-33-54.png)

### 设置 key 环境变量

```bash
# gemini-cli 的 api key
# https://github.com/google-gemini/gemini-cli#use-a-gemini-api-key
$env:GEMINI_API_KEY="***"
```

## 相关的 vscode 插件

- https://marketplace.visualstudio.com/items?itemName=Google.geminicodeassist
- https://developers.google.com/gemini-code-assist/docs/overview?hl=zh-cn

## 设置 mcp

在全局的用户文件 `C:\Users\pc\.gemini\settings.json` 内设置即可。

## gemini cli 支持 skills 技能文件

- 官方文档： https://geminicli.com/docs/cli/tutorials/skills-getting-started/

## 整体体验

对于 gemini cli 免费提供的 `gemini pro 2.5` 模型，体验如下：

智障、傻逼、废物、八嘎。

1. **gemini cli 阅读文档不完全：** 给他很多提示词，阅读起来缺斤少两，很多细节都有缺失。需要我反复提醒，反复拉扯，才能得到一个勉强的结果。
2. **无法阅读 ide 提供的报错信息：** 无法阅读 ide 提供的 typescript 类型报错信息，导致我无法使用 gemini cli 完成 typescript 类型报错的修复。相反，claude code 在配套的 vscode 插件的帮助下，能够阅读 ide 提供的报错信息，并针对性的修复故障。

## 想办法订阅谷歌的会员

参考资料：

- [`Gemini会员开通攻略：Pro/Ultra订阅方法、充值流程与平台推荐`](https://zhuanlan.zhihu.com/p/1974851569586561940)
- [`Google Gemini Pro 高级会员订阅实战教程`](https://mdnice.com/writing/61a93ff2671e4456bcf3470c8931c86f)

### 套餐购买入口

- https://one.google.com/explore-plan/gemini-advanced

![2025-11-22-12-30-16](https://gh-img-store.ruan-cat.com/img/2025-11-22-12-30-16.png)

谷歌套餐是包含一揽子工具链的：

![2025-11-22-12-30-56](https://gh-img-store.ruan-cat.com/img/2025-11-22-12-30-56.png)

## 获得 Gemini 3 Pro 的免费使用权限

因为添加自己在等待列表内，所以现在拥有了免费的使用权限。

![2025-11-26-05-01-43](https://gh-img-store.ruan-cat.com/img/2025-11-26-05-01-43.png)

### 手动设置 gemini 3 权限

- [`如何将 Gemini 3 Pro 与 Gemini CLI 配合使用`](https://geminicli.com/docs/get-started/gemini-3/#how-to-use-gemini-3-pro-with-gemini-cli)

## 在 gemini 内给账号授权

参考资料

- [`github issue ： Permission 'cloudaicompanion.companions.generateChat' denied`](https://github.com/google-gemini/gemini-cli/issues/1966#issuecomment-3009083556)
- [`谷歌云文档 ： 在 Google Cloud 项目中授予 IAM 角色`](https://docs.cloud.google.com/gemini/docs/discover/set-up-gemini?hl=zh-cn#console_1)
- https://console.cloud.google.com/iam-admin/iam

按照 issue 说明和文档教程，我进入到谷歌云的 iam 设置界面内，设置角色：

![2025-12-06-09-37-42](https://gh-img-store.ruan-cat.com/img/2025-12-06-09-37-42.png)

## 处理 403 错误

- [`API Error 403 CONSUMER_INVALID after setting the GOOGLE_CLOUD_PROJECT`](https://github.com/google-gemini/gemini-cli/issues/1808#issuecomment-3007714343)

我遇到这样的错误：

```log
[API Error: [{
    "error": {
      "code": 403,
      "message": "Permission 'cloudaicompanion.companions.generateChat' denied on resource
  '//cloudaicompanion.googleapis.com/projects/83565277083/locations/global' (or it may not
  exist).",
      "errors": [
        {
          "message": "Permission 'cloudaicompanion.companions.generateChat' denied on
  resource '//cloudaicompanion.googleapis.com/projects/83565277083/locations/global' (or it
  may not exist).",
          "domain": "global",
          "reason": "forbidden"
        }
      ],
      "status": "PERMISSION_DENIED",
      "details": [
        {
          "@type": "type.googleapis.com/google.rpc.ErrorInfo",
          "reason": "IAM_PERMISSION_DENIED",
          "domain": "cloudaicompanion.googleapis.com",
          "metadata": {
            "resource": "projects/83565277083/locations/global",
            "permission": "cloudaicompanion.companions.generateChat"
          }
        }
      ]
    }
  }
  ]]
```

注意到关键的项目 id `83565277083` 。关闭掉我的全局 `$env:GOOGLE_CLOUD_PROJECT` 环境变量即可。

## 处理 `Gemini Code Assist` 登录失败的故障

如图，我在 cursor 内遇到以下故障：

![2026-01-06-00-46-22](https://gh-img-store.ruan-cat.com/img/2026-01-06-00-46-22.png)

报错日志如下：

```log
googleapi: Error 403: The caller does not have permission
Details:
[
  {
    "@type": "type.googleapis.com/google.rpc.ErrorInfo",
    "domain": "iam.googleapis.com",
    "metadata": {
      "permission": "cloudaicompanion.companions.generateCode",
      "resource": "projects/company-odyssey-kfg2z"
    },
    "reason": "IAM_PERMISSION_DENIED"
  }
]
, forbidden
I0105 23:40:31.455626   25584 client.go:270] CompleteCode response from cache (adaptive): {Suggestions:[] TraceID: RequestID: ServerTiming: NetPlusServerTiming:0s FromCache:false Typeover:false TriggerMode:0 ProcessingDetails:{RagStatus: AtlasExperience: PromptID: CompletionMethod: ExperimentDebugStringFingerprint: ModelURI: ChatClientIDHash: MetricMetadata:map[] ModelConfig:{ID: DisplayName: DescriptionText:}} AdaptiveCacheHit:false}
E0105 23:40:31.455626   25584 metrics.go:196] error setting metric metadata since metric event is not set
E0105 23:40:31.455626   25584 metrics.go:196] error setting metric metadata since metric event is not set
E0105 23:40:31.455626   25584 server.go:484] error fulfilling "service/healthcheck" request #28, &
```

在全局用户信息内，查到的 `geminicodeassist.project` 值为：

![2026-01-06-00-47-23](https://gh-img-store.ruan-cat.com/img/2026-01-06-00-47-23.png)

```json
{
	"geminicodeassist.project": "company-odyssey-kfg2z"
}
```

不知道这个值哪里来的。删除即可正常登录。

## 长时间连续运行 gemini cli 的方案

gemini cli 目前（2025-12-10）还没有子代理能力，无法长期运行。但是在 openspec 的任务下，是可以实现长任务运行的。

1. 用 openspec 新建一个长期运行的任务。
2. 用 gemini 以自定义命令的方式，运行 openspec 生成的命令。
3. 连续运行接近 1 小时，用完全部额度。触发限流。要过 22 小时才能恢复。

![2025-12-10-21-13-42](https://gh-img-store.ruan-cat.com/img/2025-12-10-21-13-42.png)

## 去咸鱼买现成的 gemini 号

沟通文本：

你好，我想购买现成的 gemini 号。我有几个问题想先确认一下，然后再考虑购买：

1. 账号种类： 请问是现成的谷歌账号么？
2. 登录验证： 请问登录这些谷歌账号时，是否要用手机验证，还是用辅助邮箱验证？亦或是不需要验证直接就可以登录？
3. 可用产品： 请问可以使用的谷歌产品品类包括大致包括那些？是否可以直接登录 gemini cli 和 Antigravity ？
4. 网络条件： 请问我在登录时，是否强制要求用北美节点？网络条件上是否强制要求要美区？
