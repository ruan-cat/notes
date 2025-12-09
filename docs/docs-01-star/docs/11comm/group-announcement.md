# 群公告

项目群的群公告文本长度有严格限额，故在此处专项罗列群公告。

## 群名片格式

f1-XXX

::: danger 游客有专属的群马甲

对于以游客身份入群的同学来说，请你阅读[游客须知](#游客须知)，根据规定设置专用的群名片。

:::

## 腾讯会议

- 会议室：01s-11 智慧社区-f1 小组会议室
- 会议号：793 330 9962

::: tip

组长阮喵喵已经花钱买了腾讯会议的会员。每次会议长度不再被限制为每次 40 分钟，会议中途不会再中途退出并续期。

:::

::: details 腾讯会议邀请信息

[点击链接](https://meeting.tencent.com/p/7933309962)直接加入会议： https://meeting.tencent.com/p/7933309962

```txt
阮喵喵 邀请您加入01s-11智慧社区-f1小组会议室

点击链接直接加入会议：
https://meeting.tencent.com/p/7933309962

#腾讯会议：793-330-9962

复制该信息，打开手机腾讯会议即可参与
```

:::

::: warning 腾讯会议会员过期

从 6 月 11 号开始，阮喵喵的腾讯会议过期了。后续会议都是 40min 以内的。

:::

## 每日例会时间

每天晚上 8 点 20 分开始例会。

::: tip

可以提前进入会议室等待。

:::

## 项目生产环境地址

项目有不同的部署流水线，故提供两种不同域名下的访问地址：

### 高频部署更新

- https://01s-11comm.ruan-cat.com
- https://01s-11.ruan-cat.com

::: tip 推荐访问

从 2025-6-30 开始，前端项目从云效内迁移到[此仓库](https://github.com/ruan-cat/11comm/tree/dev)，且部署流水线从云效流水线换成了 cloudflare worker 流水线，故使用的域名也有变更。

该域名预期在每次 github 仓库的 dev 分支有提交时，都会触发一次部署。

:::

### 低频部署更新

- https://01s-11comm.ruancat6312.top
- https://01s-11.ruancat6312.top

::: warning 不推荐访问

该域名下的项目更新触发方式如下：

- 手动运行部署命令。
- 基于 main 分支的 github workflow 流水线文件。
- 基于 master 分支的云效仓库代码提交。

上述触发条件比较苛刻，触发部署的次数很低。故不推荐大家访问。

:::

## 腾讯文档

- 小组信息总表：https://docs.qq.com/sheet/DTURndGZLenZzV05h

## 项目原型

- 原型地址：http://demo.homecommunity.cn/user.html#/pages/frame/login
- 运营账号：admin/admin
- 物业账号：wuxw/admin

## 项目框架

- 仓库： https://github.com/pure-admin/vue-pure-admin
- 在线地址： https://pure-admin.github.io/vue-pure-admin/
- 教程文档： https://pure-admin.cn/
- 面向业务的二次封装组件库： https://github.com/plus-pro-components/plus-pro-components

## 小组公共文档

- 会议材料：https://docs-01-star.ruancat6312.top/11/meeting-minutes/
- [cloudflare 部署版本](https://docs-01-star.ruan-cat.com/11/meeting-minutes/)
- [github workflow 部署版本](https://docs-01-star.ruancat6312.top/11/meeting-minutes/)

::: warning 更新内容有延迟

[github workflow 部署版本](https://docs-01-star.ruancat6312.top/11/meeting-minutes/)，由于需要主分支的提交才能触发部署，故更新缓慢，内容不及时。经常会落后很多个版本。

建议大家阅读[cloudflare 部署版本](https://docs-01-star.ruan-cat.com/11/meeting-minutes/)的文档。

cloudflare 版本的文档最快在 90 秒（1 分 30 秒）内完成自动部署，最慢 120 秒。

:::

::: tip 强制重新加载页面

页面内容可能不是最新的。请使用 `Ctrl+F5` 的快捷键，强制浏览器重新从服务器内加载最新内容。

:::

## 阿里云效地址

- 工作台 https://devops.aliyun.com/
- 代码仓库 https://codeup.aliyun.com/zero-one-star/zero-awei/zero-one-11community
- 需求工单 https://devops.aliyun.com/projex/project/980bfa8a86624703565bf3d1e1

## 历史项目入门教程

- [10wms 项目教程](https://01s-10wms-frontend-docs.ruancat6312.top/)

## apifox 文档地址

- https://01s-11.apifox.cn/

## 游客守则

本次项目组 QQ 群采取半开放式的方式，允许部分 01 星球内的成员加入本前端组。

务必遵守以下规范：

### 游客须知

1. **严格群马甲**：你在*任何平台*内的马甲仅为 `游客-XXX` 格式，进群后，请你主动更改群马甲。后续你也可以自己更改群马甲，但是必须满足群马甲格式。
2. **腾讯会议**：你可以参加腾讯会议，以旁听的身份学习技术。但是你的名片必须满足上述格式。否则我会在本次会议内踢掉你，甚至是直接在本群内踢掉你。
3. **严格闭麦**：你可以在我们开会的时候旁观学习。但是你的个人用户名必须改成 `游客-XXX` 格式，否者会影响正常的组内工作。另外请自觉的*关闭麦克风*和*视频*。
4. **仅阅读文档**：你不应该更改任何腾讯文档的内容。你可以阅读。组长目前将不会设置严格的腾讯文档编辑权限。
5. **长期禁言**：你进群后，由群主设置禁言时间 5 月 11 号 ~ 6 月 11 号。即为整个大项目的运行周期。
6. **禁止私聊**：你不应该私聊本项目组的其他成员。请不要打扰他们的工作节奏。如果我收到明确的投诉，我会踢掉对应的游客。
7. **禁止广告**：你不可以打广告，否则会被立刻除名。

### 加群方式

作为游客，你可以用以下的方式进入本群。

1. **被动入群**：请先添加阮喵喵的 QQ 好友，与阮喵喵取得联系后，由阮喵喵手动邀请你入群。
2. **主动进群**：你可以通过回答群问题的方式，进入本群。
3. **推荐入群**：你可以推荐其他 01 星球通知群内的成员，加入本群。但请不要私自邀请他人进群。

### 你的权利

你享受的权利：

1. 群公告公开显示的链接，都可以正常访问。
2. 群文件都可以正常的访问。
