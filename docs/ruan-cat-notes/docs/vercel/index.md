# vercel

我是 vercel 的重度使用用户，这里记录着关于 vercel 部署的一些实践。

## vercel.json ？

## vercel 被墙的 cname 配置

- https://www.cnblogs.com/cubeyu/articles/17451621.html

## 额度

- https://github.com/ruan-cat/notes/actions/runs/9976519939/job/27569258838
- https://github.com/vercel/vercel/discussions/6617
- https://vercel.com/docs/limits/overview#deployments-per-day-(free)

简单来说，就是当天部署的额度用完了。

![2024-07-17-23-19-29](https://gh-img-store.ruan-cat.com/img/2024-07-17-23-19-29.png)

在 usage 内，查询请求报告。可得知，当天用的很多。

![2024-07-17-23-38-29](https://gh-img-store.ruan-cat.com/img/2024-07-17-23-38-29.png)

![2024-07-17-23-40-03](https://gh-img-store.ruan-cat.com/img/2024-07-17-23-40-03.png)

## token 过期导致的故障

```log
Error: An unexpected error occurred in link: TypeError: Cannot read properties of undefined (reading 'value')
Error: An unexpected error occurred in build: TypeError: Cannot read properties of undefined (reading 'value')
```

部署项目时，出现莫名其妙的错误。经过检查发现是 token 过期了。
