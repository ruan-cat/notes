# giget 无法下载，给项目安装依赖报错

我想阅读[别人的仓库](https://github.com/unjs/magicast)，安装依赖就报错了。

## 现象

```bash
Error: Failed to download https://api.github.com/repos/benjamn/recast/tarball/v0.23.4: TypeError: fetch failed
```

::: details 报错截图

![2024-10-23-00-00-34](https://gh-img-store.ruan-cat.com/img/2024-10-23-00-00-34.png)

:::

似乎是这个地址 `https://api.github.com/repos/benjamn/recast/tarball/v0.23.4` 不行。事实上这个地址是有效的，问题出在我们这里。

## 解决方案

处理 [api.github.com](../../sundry/Watt-Toolkit/index.md#apigithubcom) 的问题即可。
