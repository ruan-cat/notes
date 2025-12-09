# cdn 代理供应商

目前就是想用 jsdelivr 代理 github 图床，但是超限了。

```text
cdn.jsdelivr.net Package size exceeded the configured limit of 50 MB.
```

- https://cdn.jsdelivr.net/gh/ruan-cat/img-store/img/2024-06-27-14-34-20.png
- https://cdn.jsdelivr.net/gh/ruan-cat/img-store@main/img/2024-06-27-14-34-20.png

## 50M 额度超限

针对仓库：

- https://github.com/ruan-cat/img-store

本仓库被当做是我的图床，为了高效率访问里面的文件，我用的是 cdn.jsdelivr.net 代理的方案。该方案现在遇到了 50M 超限的情况。
比如该图片：

- https://cdn.jsdelivr.net/gh/ruan-cat/img-store/img/2024-06-27-14-34-20.png

目前查到一个方案是增加 branch 分支名，继续蹭 50M 的额度。

- https://weilining.github.io/119.html
- https://blog.csdn.net/q906270629/article/details/115394248

增加显性的分支名后，确实可以访问：

- https://cdn.jsdelivr.net/gh/ruan-cat/img-store@main/img/2024-06-27-14-34-20.png

但是该方案确实给我带来焦虑，就是我不确定到底有多少图片的 url 需要增加分支名，维护起来不优雅，一旦再次超限，受影响的图片就很多。一大堆的文件都会受影响。

## 尝试寻找新的代理方案

- https://zhpengfei.com/ast-access-github-china-cloudflare-worker/

该方案有效。

## 配置自己的 worker 代理脚本

上述的教程讲的是用 cloudflare 代理特定目标的地址。代理了 github。

我的核心需求是这样的：

必定可用的地址如下：

- https://gh-img-store.ruan-cat.com/img/image-20220925204706126.png

期望未来能用的地址如下：

- https://gh-img-store.ruan-cat.com/img/image-20220925204706126.png

地址 `gh-img-store.ruan-cat.com` 去代理 `raw.githubusercontent.com/ruan-cat/img-store/main` 地址。

根据此需求，改写教程提供的 worker 代码，最终生效的 worker 如下：

::: details worker 代码

<<< ./cloudflare-worker-for-github-img-store.js#snipaste{js twoslash}

:::
