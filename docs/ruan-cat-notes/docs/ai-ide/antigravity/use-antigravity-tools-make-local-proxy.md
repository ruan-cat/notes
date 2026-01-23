# 使用 antigravity-tools 制作基于 antigravity 的本地代理

## 购买并准备一个有 pro 资格的谷歌账号

## 用 antigravity-tools 跳过验证，直接登录 antigravity

## 搭建本地代理并在 claude code 内使用

## 利用家庭组方案批量准备可用账号

- 参考资料 `订阅 Google One，一个人交钱六个人用 Gemini Pro` ： https://zhuanlan.zhihu.com/p/1993253572247298825
- 参考资料 `目前最省最强用 Claude ops 4.5 + Gemini 3 Pro 的方案，30 块钱一年` ： https://juejin.cn/post/7596241980869197858

根据参考资料可知，只要我们现在有一个现存的，可用的 gemini pro 账号，就能利用家庭组方案，实现账号裂变。同时拥有多个 gemini pro 账号。

### 教育版账号不能进入家庭组

1. 教育版账号是这样的：

   > ![2026-01-23-01-11-53](https://s2.loli.net/2026/01/23/KuprHGxOsIVe9Ry.png)

2. 其他账号开始邀请本账号进入：

   > ![2026-01-23-01-12-15](https://s2.loli.net/2026/01/23/geRrna75A9wiVZ4.png)

3. 无法正常访问，无权限使用家庭组：
   > ![2026-01-23-01-12-29](https://s2.loli.net/2026/01/23/4w1xBJ39HQd7rcn.png)

### 购买一个干净的美区资格号，作为被邀请的账号

1. 可以直接登录 antigravity，直接验证通过，丝毫不受到任何阻力。

   > ![2026-01-23-01-30-04](https://s2.loli.net/2026/01/23/fXbmoT5rYLGEk9j.png)

2. 可以直接访问 gemini 网页版，并提示可以升级。

   > ![2026-01-23-01-37-36](https://s2.loli.net/2026/01/23/zsxjPAJGfau7B35.png)

### 邀请进入家庭组

1. 收到家庭组邀请：

   > ![2026-01-23-01-41-34](https://s2.loli.net/2026/01/23/dPnLJrUiDs3cp1M.png)

2. 存在地区差异，无法进入：
   > ![2026-01-23-01-42-04](https://s2.loli.net/2026/01/23/7fewRsdXJNH4VIM.png)

### 主号不能通过`关闭付款资料`处理地区差异问题

- 付款信息： https://payments.google.com/gp/w/home/settings

1. 如图，家庭组主号已经有了很多付款信息，这里尝试选择删除掉。

   > ![2026-01-23-01-55-58](https://gh-img-store.ruan-cat.com/img/2026-01-23-01-55-58.png)

2. 不能关闭，如果关闭付款资料了，那么就丢失了 `Google One` 权限，就没有 gemini pro 权限了。我们需要换其他的方案来解决地区问题。

   > ![2026-01-23-01-58-39](https://gh-img-store.ruan-cat.com/img/2026-01-23-01-58-39.png)

### 确定主号的家庭组 ip 地址

- 谷歌支付： https://play.google.com/store/games?device=windows

通过查看谷歌支付的`付款地址`，右下角地址，可以确定位置。这里主号的位置是在英国。

![2026-01-23-11-17-06](https://gh-img-store.ruan-cat.com/img/2026-01-23-11-17-06.png)

### 在强一致的 ip 环境下完成家庭组邀请

- `關於 Google 帳號轉區與加入家庭群組疑難雜症速解`： https://www.jkg.tw/p2436/
- `设置和管理 YouTube 家庭方案`： https://support.google.com/youtube/answer/7507744
- `Google One家庭组地区不匹配解决方案（Gemini pro优惠共享）` ： https://linux.do/t/topic/1206323/18
- `Gemini Pro 家庭组「地区不匹配」完美解决方案`： https://linux.do/t/topic/1420929

注意到这个 `Google One家庭组地区不匹配解决方案（Gemini pro优惠共享）` 和上述参考资料，我作出假设：如果我在强一致的环境下，在英国 ip 内，邀请`地理位置`被识别成英国的账号，进入家庭组，不就满足上述要求了么？

![2026-01-23-11-51-48](https://gh-img-store.ruan-cat.com/img/2026-01-23-11-51-48.png)

1. 开启全局模式。稍后的操作都会在全局模式下缓慢完成。

   > ![2026-01-23-11-57-38](https://gh-img-store.ruan-cat.com/img/2026-01-23-11-57-38.png)

2. 挑选来自英国伦敦的 ip。

   > ![2026-01-23-11-57-04](https://gh-img-store.ruan-cat.com/img/2026-01-23-11-57-04.png)

3. 新建指纹浏览器，确保自己在英国。

   > ![2026-01-23-12-03-21](https://gh-img-store.ruan-cat.com/img/2026-01-23-12-03-21.png)

4. 在指纹浏览器内，分别登录这两个账号。一个主号，一个家庭号。
5. 在指纹浏览器内，发出邀请邮件。然后再被转发的 QQ 邮箱内，收到邮件。

   > ![2026-01-23-12-05-46](https://gh-img-store.ruan-cat.com/img/2026-01-23-12-05-46.png)

6. 手动复制邀请链接，并手动在指纹浏览器内打开。

   > ![2026-01-23-12-07-14](https://gh-img-store.ruan-cat.com/img/2026-01-23-12-07-14.png)

7. 同意，并正式进入家庭组。成功截图如下：

   > ![2026-01-23-12-08-04](https://gh-img-store.ruan-cat.com/img/2026-01-23-12-08-04.png)

8. 子号可以看到自己加入到家庭组了。

   > ![2026-01-23-12-10-31](https://gh-img-store.ruan-cat.com/img/2026-01-23-12-10-31.png)

9. 主号作为家庭管理员，是可以看到成员的。
   > ![2026-01-23-12-11-38](https://gh-img-store.ruan-cat.com/img/2026-01-23-12-11-38.png)

### 检查 pro 权限

1. 在网页版 gemini 内，子号已经是 pro 权限了。

   > ![2026-01-23-12-19-07](https://gh-img-store.ruan-cat.com/img/2026-01-23-12-19-07.png)

2. 在 antigravity-tools 内，子号已经是 pro 权限了。
   > ![2026-01-23-12-20-15](https://gh-img-store.ruan-cat.com/img/2026-01-23-12-20-15.png)

### 家庭组

<!-- ### 尝试更换付款方式的虚拟卡为美国卡
- https://linux.do/t/topic/1206323 -->
