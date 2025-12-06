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

## 环境变量

```bash
# gemini-cli 的 api key
# https://github.com/google-gemini/gemini-cli#use-a-gemini-api-key
$env:GEMINI_API_KEY="***"
```

## 相关的 vscode 插件

- https://marketplace.visualstudio.com/items?itemName=Google.geminicodeassist
- https://developers.google.com/gemini-code-assist/docs/overview?hl=zh-cn

## 整体体验

对于 gemini cli 免费提供的 `gemini pro 2.5` 模型，体验如下：

智障、傻逼、废物、八嘎。

1. **gemini cli 阅读文档不完全：** 给他很多提示词，阅读起来缺斤少两，很多细节都有缺失。需要我反复提醒，反复拉扯，才能得到一个勉强的结果。
2. **无法阅读 ide 提供的报错信息：** 无法阅读 ide 提供的 typescript 类型报错信息，导致我无法使用 gemini cli 完成 typescript 类型报错的修复。相反，claude code 在配套的 vscode 插件的帮助下，能够阅读 ide 提供的报错信息，并针对性的修复故障。

<!-- TODO: gemini 3 最近很火 看看如何自己订阅？ -->

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

按照 issue 说明和文档教程，我进入到谷歌云的 iam 设置界面内，设置角色：

![2025-12-06-09-37-42](https://gh-img-store.ruan-cat.com/img/2025-12-06-09-37-42.png)
