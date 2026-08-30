# ISP,静态住宅 ip

这里记录静态住宅 ip 的购买与配置

## 尝试配置静态住宅 ip 给 Clash Verge

如果我购买了静态住宅 ip，怎么在 clash verge 配置啊？
链式 让 ai 给你配 clash verge 在订阅内的全局扩展脚本内加代码就行了
但他的内核和 clash verge 一样 我就拿网上找的帖子分享的那个代码喂给他改一下后就好了

- 配置教程： https://www.youtube.com/watch?v=ZH6PKvw3LvU

## 2026-8-30 购买并尝试配置

- 购买店家： https://console.zooproxy.com/static-isp
- 日本原生 ip
- 参考资料： https://www.youtube.com/watch?v=ZH6PKvw3LvU

### 设置提取格式并提取 ip

购买到 ip 后，设置提取格式，这里设置为 socks 格式。

> ![2026-08-30-20-51-15](https://gh-img-store.ruan-cat.com/img/2026-08-30-20-51-15.png)

查看已经提取出来的 ip 信息：

<!--
警告 敏感信息
ip地址地址：	103.23.131.15:443
用户名:密码格式： RkhspUYNXaje:nTOQKGRa6M
完整地址格式： socks5://RkhspUYNXaje:nTOQKGRa6M@103.23.131.15:443
-->

> ![2026-08-30-20-52-52](https://gh-img-store.ruan-cat.com/img/2026-08-30-20-52-52.png)

可以对单独的 ip 做续费，90 天 13 美元，折合人民币 87.44 元。

> ![2026-08-30-20-54-43](https://gh-img-store.ruan-cat.com/img/2026-08-30-20-54-43.png)

### 编辑 Clash Verge 订阅，增加节点

右键点击具体的订阅，编辑节点

> ![2026-08-30-20-57-48](https://gh-img-store.ruan-cat.com/img/2026-08-30-20-57-48.png)

增加一款节点。已遮盖敏感的用户名和密码。

> ![2026-08-30-20-59-25](https://gh-img-store.ruan-cat.com/img/2026-08-30-20-59-25.png)

添加为前置代理节点，然后保存。

> ![2026-08-30-21-00-50](https://gh-img-store.ruan-cat.com/img/2026-08-30-21-00-50.png)

将 Clash Verge 更新，更新到 `v2.5.2` 版本后就看得到订阅内的代理节点了。在 `v2.4.4` 版本内没看到。估计是 bug。

> ![2026-08-30-21-07-58](https://gh-img-store.ruan-cat.com/img/2026-08-30-21-07-58.png)

### 添加链式代理

在具体的代理页面，点击链式代理按钮，开始添加。

![2026-08-30-21-10-47](https://gh-img-store.ruan-cat.com/img/2026-08-30-21-10-47.png)

按照顺序点击，第一个点击目标 ip，第二个点击我们的静态住宅代理 ip。然后点击链接按钮。

![2026-08-30-21-11-41](https://gh-img-store.ruan-cat.com/img/2026-08-30-21-11-41.png)

### 测试 ip 纯净度

- https://scamalytics.com/ip/103.23.131.15
  > ![2026-08-30-21-16-02](https://gh-img-store.ruan-cat.com/img/2026-08-30-21-16-02.png)
- https://ping0.cc/ip/103.23.131.15
  > ![2026-08-30-21-18-32](https://gh-img-store.ruan-cat.com/img/2026-08-30-21-18-32.png)
- https://www.whatismyiplookup.com/
  > ![2026-08-30-21-19-12](https://gh-img-store.ruan-cat.com/img/2026-08-30-21-19-12.png)
