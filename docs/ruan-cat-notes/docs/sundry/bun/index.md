# bun，类似于 node 的运行时

## 安装环境

这里我选择的是用 node 来安装，用 pnpm 作为包管理器。

```bash
pnpm i -g bun
```

![2025-08-06-12-05-04](https://gh-img-store.ruan-cat.com/img/2025-08-06-12-05-04.png)

## 设置镜像

如图：

![2025-08-06-12-19-26](https://gh-img-store.ruan-cat.com/img/2025-08-06-12-19-26.png)

- https://blog.csdn.net/qq_37214567/article/details/138277757

```toml
# 设置镜像源
# https://blog.csdn.net/qq_37214567/article/details/138277757
[install]
registry = "https://registry.npmmirror.com/"
```
