# vscode 报参数格式不正确的错误

我的同事遇到以下故障，如图所示：

::: details

![2025-05-14-23-51-22](https://gh-img-store.ruan-cat.com/img/2025-05-14-23-51-22.png)

:::

报错 `参数格式不正确 - -Command` 。

## 问题关键词

```txt
命令行: …\powershell.exe '-NoLogo -NoExit -Command chcp.com 65001 -Command pnpm run test'
```

## 错误原因

同事的 vscode 多配置了用于处理 cmd 运行命令出现乱码的配置，所以导致运行 node 命令时产生冲突，进而导致失败。

::: details

<<< ./error.json

:::
