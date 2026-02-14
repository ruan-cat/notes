# 通过邮箱注册 kiro 账号

## 利用 cloudflare 域名邮箱注册账号，并白嫖试用期

该方案在我继续使用同一个浏览器时，失效。目前我用域名邮箱注册的 github 账号，均被标记风控。

![2026-01-09-18-29-02](https://gh-img-store.ruan-cat.com/img/2026-01-09-18-29-02.png)

```txt
This account is flagged, and therefore cannot authorize a third party application.
```

被标记风控的 github 账号，无法 fork、无法链接第三方应用。比如 kiro。

### 创建新的域名邮箱

![2025-12-15-18-13-06](https://gh-img-store.ruan-cat.com/img/2025-12-15-18-13-06.png)

### 注册 github 账号

![2025-12-15-18-13-35](https://gh-img-store.ruan-cat.com/img/2025-12-15-18-13-35.png)

### 输入验证码

![2025-12-15-18-14-03](https://gh-img-store.ruan-cat.com/img/2025-12-15-18-14-03.png)

### 在重定向的邮箱内接收验证码

![2025-12-15-18-15-25](https://gh-img-store.ruan-cat.com/img/2025-12-15-18-15-25.png)

### 成功注册 github 账号

![2025-12-15-18-14-24](https://gh-img-store.ruan-cat.com/img/2025-12-15-18-14-24.png)

### 进入 kiro

![2025-12-15-18-16-09](https://gh-img-store.ruan-cat.com/img/2025-12-15-18-16-09.png)

### github 授权

![2025-12-15-18-16-46](https://gh-img-store.ruan-cat.com/img/2025-12-15-18-16-46.png)

### 立刻获得 31 天的试用期

![2025-12-15-18-17-24](https://gh-img-store.ruan-cat.com/img/2025-12-15-18-17-24.png)

## 用网易邮箱来注册 github 账号

1. 指纹浏览器、全局 TUN 模式、新加坡、网易邮箱 `use_kiro_001@163.com`。没有遇到严格的验证，一次过。

![2026-01-09-18-32-30](https://gh-img-store.ruan-cat.com/img/2026-01-09-18-32-30.png)

2. 可以正常的 fork 项目

![2026-01-09-18-32-44](https://gh-img-store.ruan-cat.com/img/2026-01-09-18-32-44.png)

3. 无法直接跳转验证

![2026-01-09-18-33-03](https://gh-img-store.ruan-cat.com/img/2026-01-09-18-33-03.png)

4. 重启电脑后，保持新加坡节点，登录成功。

![2026-01-09-18-33-17](https://gh-img-store.ruan-cat.com/img/2026-01-09-18-33-17.png)

## 继续用 cloudflare 域名邮箱，注册 github 账号

1. 预备稍长一点点的邮箱 `use-kiro-006-my-lover@ruan-cat.com`

![2026-01-09-19-49-23](https://gh-img-store.ruan-cat.com/img/2026-01-09-19-49-23.png)

2. 开启和刚才相同的指纹浏览器。使用相同新加坡节点的指纹浏览器。

![2026-01-09-19-50-22](https://gh-img-store.ruan-cat.com/img/2026-01-09-19-50-22.png)

3. 和刚才不同，出现了验证过程。需要验证。

![2026-01-09-19-50-44](https://gh-img-store.ruan-cat.com/img/2026-01-09-19-50-44.png)

4. 验证流程非常长。总共有 6 项。

![2026-01-09-19-51-31](https://gh-img-store.ruan-cat.com/img/2026-01-09-19-51-31.png)

5. 可以正常完成 fork 仓库。

![2026-01-09-19-51-45](https://gh-img-store.ruan-cat.com/img/2026-01-09-19-51-45.png)

6. 卡在登录验证这一块，无法选择新的账户来登录 kiro。github 重定向总是默认选择了刚才成功的`use_kiro_001@163.com`账户。应该是浏览器缓存的问题。

![2026-01-09-19-52-07](https://gh-img-store.ruan-cat.com/img/2026-01-09-19-52-07.png)

## 继续使用 cloudflare 域名邮箱的 catch all 规则来自定义域名邮箱

1. 用 catch all 规则编写全新的邮箱 `MyLoverDrill007Tem@ruan-cat.com` ，继续注册 github 账号。相同的指纹浏览器，出现验证流程：

![2026-01-09-19-55-10](https://gh-img-store.ruan-cat.com/img/2026-01-09-19-55-10.png)

2. 流程非常长，10 项，还剩下 9 项。

![2026-01-09-19-55-25](https://gh-img-store.ruan-cat.com/img/2026-01-09-19-55-25.png)

3. 新号可以正常 fork。

![2026-01-09-19-55-40](https://gh-img-store.ruan-cat.com/img/2026-01-09-19-55-40.png)

4. 是 `kiro-prod-us-east-1.auth.us-east-1.amazoncognito.com` 重定向站点，本身存储了上一个验证用户的 cookie，才导致无法主动选择切换 github 账户。如果遇到无法自主选择 github 账号来连接 kiro 应用时，应该主动清空浏览器对 `kiro-prod-us-east-1.auth.us-east-1.amazoncognito.com` 的 cookie。

![2026-01-09-19-57-05](https://gh-img-store.ruan-cat.com/img/2026-01-09-19-57-05.png)

5. 删除以后，新的用户可以主动链接了。

![2026-01-09-19-57-25](https://gh-img-store.ruan-cat.com/img/2026-01-09-19-57-25.png)

6. 成功。新用户`MyLoverDrill007Tem@ruan-cat.com`可以正常获取额度了。

![2026-01-09-19-58-00](https://gh-img-store.ruan-cat.com/img/2026-01-09-19-58-00.png)
