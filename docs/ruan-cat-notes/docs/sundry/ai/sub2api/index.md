# sub2api 自建中转站

- 仓库： https://github.com/Wei-Shaw/sub2api
- 视频教程 `第1期：sub2api小白手把手部署教程，把大模型网页会员订阅转化成api，实现token自由`： https://www.bilibili.com/video/BV1aCdSBYEhY/
- 文字教程： https://wu.wubin.cc/171.html

进入 linux 服务器。我的系统是 `CentOS 10` ，以下命令经过 AI 调整：

1. 安装官方工具箱。

```bash
dnf install -y dnf-plugins-core
```

2. 添加 Docker 官方下载源

```bash
dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

3. 刷新系统缓存

```bash
dnf makecache
```

4. 正式安装 Docker 核心程序（复制后按回车，这一步下载需要一点时间，请耐心等待它打印出 Complete

```bash
dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

5. 启动 Docker 并设置开机自启

```bash
systemctl enable --now docker
```

6. 安装 sub2api

```bash
mkdir -p sub2api-deploy && cd sub2api-deploy
curl -sSL https://raw.githubusercontent.com/Wei-Shaw/sub2api/main/deploy/docker-deploy.sh | bash
docker compose up -d
docker compose logs -f sub2api
```

7. 生成密码：

```bash
cd ~/sub2api-deploy
docker compose logs sub2api | grep -i admin
```

## CPA SUP 格式转换

导入到 sub2api 平台，或者是 cpa 平台时，要注意 openai 账号的格式。每个平台有特定的格式。可以批量导入 json 格式的账号数据，实现号池搭建。

- ChatGPT Session 转换成中转站常用格式：
  > https://gtxx3600.github.io/GPTSession2CPAandSub2API/ > https://json.chatai.codes/
- 转换器： https://flowpilot.qlhazycoder.top/converter/

- `GPT 手搓plus账号 质保首登 长效邮箱`： https://pay.ldxp.cn/item/wuu9fh

### 渠道 1： 成品 codex plus，json 格式

- 店铺： https://pay.ldxp.cn/shop/C1V67W46
- 教程： https://www.bilibili.com/video/BV1o7dFBKESs/
- 转换器： https://codex.kedaya.xyz/

### 渠道 2： 成品 codex plus，json 格式

- 教程： https://www.bilibili.com/video/BV1aYLg6sERd/
- 解码器： https://boji1334.github.io/mailboxhub-online/
- 店铺： https://pay.ldxp.cn/shop/FLTH3TZ2
- 店铺： https://pay.ldxp.cn/shop/TH52WUW7

### 渠道 3： 成品 codex plus，json 格式

- 店铺： https://pay.ldxp.cn/item/psshgu
- 转换器： https://codex.kedaya.xyz/

### 渠道 4： 成品 codex plus

- 店铺： https://pay.ldxp.cn/item/gd1v84
- 免费接码： https://sms.nloop.cc/
- 邮件取件助手地址： https://email.nloop.cc/
