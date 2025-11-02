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

对于 gemini cli，有以下的体验：

智障、傻逼、废物、八嘎。

1. **gemini cli 阅读文档不完全：** 给他很多提示词，阅读起来缺斤少两，很多细节都有缺失。需要我反复提醒，反复拉扯，才能得到一个勉强的结果。
2. **无法阅读 ide 提供的报错信息：** 无法阅读 ide 提供的 typescript 类型报错信息，导致我无法使用 gemini cli 完成 typescript 类型报错的修复。相反，claude code 在配套的 vscode 插件的帮助下，能够阅读 ide 提供的报错信息，并针对性的修复故障。
