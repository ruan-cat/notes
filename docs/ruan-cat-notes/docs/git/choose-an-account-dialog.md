# 提示选择 git 用户弹框

如下所示：

![2025-09-11-04-12-35](https://gh-img-store.ruan-cat.com/img/2025-09-11-04-12-35.png)

每次提交的时候都出现这样的提示，很烦人。

## 解决方案

### 1 去 windows 凭证管理器内删除多余的账号

- https://tips.pfrlju.com/tech/jacki/3-ways-to-open-credential-manager-in-windows-11-10.html

1. win + r
2. 运行命令 `control.exe keymgr.dll`

### 2 去 git 内删除储存账户凭证

```bash
git config --system --unset credential.helper
```
