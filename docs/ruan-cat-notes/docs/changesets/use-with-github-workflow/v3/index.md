# 使用 `Trusted Publishers (OIDC)` 完成 github workflow 发包

## 动机

被 npm 和 github 都发布了公告，要求我们在 npm 官方镜像源发包的开发者，都必须改换 token 的提供方式。

## 参考资料

### 官方文档

- https://github.blog/changelog/2025-09-29-strengthening-npm-security-important-changes-to-authentication-and-token-management/
- https://github.blog/changelog/2025-07-31-npm-trusted-publishing-with-oidc-is-generally-available/
- https://docs.npmjs.com/trusted-publishers

### 博客文章

- https://www.k8o.me/blog/npm-trusted-publishing-for-npm-packages
- https://socket.dev/blog/npm-trusted-publishing

## 在每个包的信息内，从设置栏内找到 `Trusted Publisher` 选项

![2025-10-31-21-10-58](https://gh-img-store.ruan-cat.com/img/2025-10-31-21-10-58.png)

设置成功后如图所示：

![2025-10-31-21-16-09](https://gh-img-store.ruan-cat.com/img/2025-10-31-21-16-09.png)

曾经发布的每一个依赖包，都要这样去人工设置。工作量较大。

## 大胆尝试，直接试着删除掉之前强依赖的 `NODE_AUTH_TOKEN` 变量

修改效果如下：

<<< ./release-yml-remove-token.diff

### 直接暴毙

出现故障，本质上还是需要 `NODE_AUTH_TOKEN` 变量的。

### 相关思考

阅读[该文章](https://www.k8o.me/blog/npm-trusted-publishing-for-npm-packages)，注意到这一段：

要求使用 `npm@11.5.1` 以上版本。该文章给出的比较脏的解决方案是手动增加 `npm install -g npm@latest` 部分。这样 pnpm 就能够使用 OIPC 来获取 token 进而发包了。

![2025-10-31-23-11-47](https://gh-img-store.ruan-cat.com/img/2025-10-31-23-11-47.png)

难道 pnpm 本体没能力支持 OIPC 么？

### pnpm 也有相关 issue 提及到对 OIPC 的支持

这篇 [issue](https://github.com/pnpm/pnpm/issues/9812) 说明了，pnpm 本身也在逐步支持 OIPC 。

也提及到了要手动增加 `npm install -g npm@latest` ，以便确保 pnpm 使用的是最新的 npm 包。

![2025-10-31-23-14-39](https://gh-img-store.ruan-cat.com/img/2025-10-31-23-14-39.png)

- https://github.com/coveo/ui-kit/pull/6329
- https://github.com/pnpm/pnpm/pull/10092

- https://livingdevops.com/aws/step-by-step-guide-to-setting-oidc-for-github-actions-workflows-with-aws-using-terraform/
