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
  > https://gtxx3600.github.io/GPTSession2CPAandSub2API/
  > https://json.chatai.codes/
- 转换器： https://flowpilot.qlhazycoder.top/converter/

- `GPT 手搓plus账号 质保首登 长效邮箱`： https://pay.ldxp.cn/item/wuu9fh

### 001 成品 codex plus，json 格式

- 店铺： https://pay.ldxp.cn/shop/C1V67W46
- 教程： https://www.bilibili.com/video/BV1o7dFBKESs/
- 转换器： https://codex.kedaya.xyz/

### 002 成品 codex plus，json 格式

- 教程： https://www.bilibili.com/video/BV1aYLg6sERd/
- 解码器： https://boji1334.github.io/mailboxhub-online/
- 店铺： https://pay.ldxp.cn/shop/FLTH3TZ2
- 店铺： https://pay.ldxp.cn/shop/TH52WUW7

### 003 成品 codex plus，json 格式

- 店铺： https://pay.ldxp.cn/item/psshgu
- 转换器： https://codex.kedaya.xyz/

### 004 成品 codex plus

- 店铺： https://pay.ldxp.cn/item/gd1v84
- 免费接码： https://sms.nloop.cc/
- 邮件取件助手地址： https://email.nloop.cc/

### 005 QQ 2873239070

- QQ： 2873239070
- 备注： Puls60 元质保 1 一个月可充老号带 codex

### 006 QQ 546200350

- QQ： 546200350
- 备注： 5r

### 007 QQ 476025865

- QQ： 476025865
- 备注： 4r

---

## 2026-5-25 02 | `wx:lq-_0922`

```txt
AbrilLadin54369@outlook.com----aqockb88141----9e5f94bc-e8a4-4e73-b8be-63364c29d753----M.C558_BAY.0.U.-Cjj0lNzUfUS0dPkDf5e5f89XRNwozP2EEY2BKi2fA5OnmX7UKCT01aC48YURRywZZMfaPEqyW9aIaZthoNX3z9AwmHBJwV**uZCmhq9fwF94cXNGswoVJBswQuumUl*Hjt5nacHH5QcDyAzhDCiWaH4!8PBvSENRDmU3qITmhviNgIESTvcSbMuQMCUDCBGU7eHzAWEXnj8wqKMMowOqhs1jtIuZuB0AQjbZb6OQTA*FpbzHfIyF*5lCGnvo8nIkQSXopTbd1!0Ubwdu6vv2SQ!!pNVBajt1EjVjUAJfXZY4*d77B5419Eug9Q73uCKxQgvKi6EQFVsj0gEX9gcAmlb2F4Za2zUIYuPxREv*G9BoWcYqmYPJc2izo7*0EqxGLUb43pFTQarkcjgKxmW3abHaCiU7Fr4npcPSDp!iAW7c5dcym*lcRbIfTxKiE!4oHw$$
```

```txt
AloysKronz50079@outlook.com----iqyysr772199----9e5f94bc-e8a4-4e73-b8be-63364c29d753----M.C545_SN1.0.U.-CghUlw0bGHUkukS8yeV9M6zyVuBqPmd8cvrPTGBHqYRAnQBwPXVL7D3Ef*vVSJtNDaP9lr15f0eCdn!jKzw!O4dZ*F*feNOZ5PuJthzjr1778L9Zlgn61h*Es0REitkqc35RWEoFDCHykr8W*CbsjLL6D9kTZgiCUcRU*hE9LYCVfMlYSdM7mvyJxhbqArF4jPlvPt6nZLgbtzMqjwJ1NMxtjJPyxJGxR5Eq6rFy0w9bzEXf5D6MtHOZP28MA05Lm9IGyOzjmFgZsJ46GCZfxdMZtx1LWlPuMgfOP6xk9BLI2MemtLlCy59!rQ!9QNC2KnhrOCEv90AZCY5EigJBHr1!6MIwi6CL5RRMI1aeTbdZmMWjC2yQWmJ7I6l*Xdr8xguPY2x1CfRkqcN2BsMili8vLF8PMW3aE6h5SAL53AShfqmpMcodT5S*LMYx2otNww$$
```

## 2026-5-26 02

- shop: https://pay.ldxp.cn/shop/ZYGCPJD7
- wx: YU2061150

```txt
A9TwyRt5dk@outlook.com===rTK2ol90@f1Q47NE===http://ms.outlook007.cc/api/open/email/latest?api_key=0lQpMJYvnN3gWOd6wARKLlzeRKtdQskx&pt=aU9MKL&email=A9TwyRt5dk@outlook.com
```
