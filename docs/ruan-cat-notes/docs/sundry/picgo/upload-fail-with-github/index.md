# 用 github 上传图片失败

打开本地的 `C:\Users\pc\.picgo\picgo.log` 文件。（举例说明）

::: details 报错日志

<<< ./error-moved-permanently.log

:::

## 情况分析

注意到 `Moved Permanently` 字样，是 [301 永久重定向](https://blog.csdn.net/taipoucha5799/article/details/109490041)。

怀疑是 github 用户重命名，导致部分接口请求失败。我之前改过一次用户名。

## 更新账号

::: details 及时更新 github 用户名

![及时更新github用户名](https://gh-img-store.ruan-cat.com/img/2024-10-23-00-11-45.png)

:::

更新后可以正常上传了。
