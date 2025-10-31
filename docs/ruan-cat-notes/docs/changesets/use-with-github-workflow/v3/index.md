# 使用 `Trusted Publishers (OIDC)` 完成 github workflow 发包

## 动机

被 npm 和 github 都发布了公告，要求我们在 npm 官方镜像源发包的开发者，都必须改换 token 的提供方式。

## 参考资料

### 官方文档

- https://github.blog/changelog/2025-09-29-strengthening-npm-security-important-changes-to-authentication-and-token-management/
- https://docs.npmjs.com/trusted-publishers

### 博客文章

- https://socket.dev/blog/npm-trusted-publishing

## 在每个包的信息内，从设置栏内找到 `Trusted Publisher` 选项

![2025-10-31-21-10-58](https://gh-img-store.ruan-cat.com/img/2025-10-31-21-10-58.png)
