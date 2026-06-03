# sub2api 自建中转站

- 仓库： https://github.com/Wei-Shaw/sub2api
- 视频教程 `第1期：sub2api小白手把手部署教程，把大模型网页会员订阅转化成api，实现token自由`： https://www.bilibili.com/video/BV1aCdSBYEhY/
- 文字教程： https://wu.wubin.cc/171.html

## CentOS 10 安装命令

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

## Debian-12.0 安装命令

```bash
# 1. 更新系统
apt update
apt install -y ca-certificates curl gnupg openssl

# 2. 清理可能冲突的旧 Docker 包；全新系统通常不会有，执行也没关系
apt remove -y docker.io docker-compose docker-doc podman-docker containerd runc || true

# 3. 添加 Docker 官方 GPG key
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# 4. 添加 Docker 官方 Debian 软件源
cat > /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/debian
Suites: $(. /etc/os-release && echo "$VERSION_CODENAME")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

# 5. 刷新软件源
apt update

# 6. 安装 Docker 和 Docker Compose v2 插件
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 7. 启动 Docker 并设置开机自启
systemctl enable --now docker

# 8. 检查 Docker 和 Compose 是否正常
docker --version
docker compose version

# 9. 创建 sub2api 部署目录
mkdir -p ~/sub2api-deploy && cd ~/sub2api-deploy

# 10. 执行 sub2api 官方 Docker 部署准备脚本
curl -sSL https://raw.githubusercontent.com/Wei-Shaw/sub2api/main/deploy/docker-deploy.sh | bash

# 11. 启动 sub2api、PostgreSQL、Redis 等服务
docker compose up -d

# 12. 查看 sub2api 日志
docker compose logs -f sub2api

# 如果你想查看自动生成的管理员密码，用：
cd ~/sub2api-deploy
docker compose logs sub2api | grep -i "admin password"
```

## Debian-12.0 给指定账户授权 admin 权限

```bash
# 先把邮箱换成你要授权的账号：
cd /root/sub2api-deploy 2>/dev/null || cd ~/sub2api-deploy 2>/dev/null || true
TARGET_EMAIL='你的账号邮箱@example.com'

# 直接授权 admin：
docker exec -it sub2api-postgres sh -lc "psql -U \"\${POSTGRES_USER:-sub2api}\" -d \"\${POSTGRES_DB:-sub2api}\" -v ON_ERROR_STOP=1 -P pager=off -c \"UPDATE public.users SET role='admin', status='active', updated_at=NOW() WHERE lower(email)=lower('$TARGET_EMAIL') AND deleted_at IS NULL RETURNING id,email,username,role,status,deleted_at,updated_at;\""

# 测试指定账号是否已经是管理员：
docker exec -it sub2api-postgres sh -lc "psql -U \"\${POSTGRES_USER:-sub2api}\" -d \"\${POSTGRES_DB:-sub2api}\" -P pager=off -c \"SELECT id,email,username,role,status,deleted_at,updated_at FROM public.users WHERE lower(email)=lower('$TARGET_EMAIL') ORDER BY id;\""

# 测试当前所有有效管理员：
docker exec -it sub2api-postgres sh -lc "psql -U \"\${POSTGRES_USER:-sub2api}\" -d \"\${POSTGRES_DB:-sub2api}\" -P pager=off -c \"SELECT id,email,username,role,status,deleted_at FROM public.users WHERE role='admin' AND status='active' AND deleted_at IS NULL ORDER BY id;\""

# 如果授权命令返回 UPDATE 0 或没有 RETURNING 结果，通常是邮箱不存在，或者该用户已经软删除。可以查一下：
docker exec -it sub2api-postgres sh -lc "psql -U \"\${POSTGRES_USER:-sub2api}\" -d \"\${POSTGRES_DB:-sub2api}\" -P pager=off -c \"SELECT id,email,username,role,status,deleted_at FROM public.users WHERE email ILIKE '%$TARGET_EMAIL%' OR username ILIKE '%$TARGET_EMAIL%' ORDER BY id;\""
```

## CPA SUP 格式转换

导入到 sub2api 平台，或者是 cpa 平台时，要注意 openai 账号的格式。每个平台有特定的格式。可以批量导入 json 格式的账号数据，实现号池搭建。

- ChatGPT Session 转换成中转站常用格式：
  > https://gtxx3600.github.io/GPTSession2CPAandSub2API/
  > https://json.chatai.codes/
- 转换器： https://flowpilot.qlhazycoder.top/converter/
- CPA 转换成 sub2api 格式： https://gtxx3600.github.io/CPA2sub2API/

- `GPT 手搓plus账号 质保首登 长效邮箱`： https://pay.ldxp.cn/item/wuu9fh

## 卖家

需要买账号来补充 sub2api 号池。

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

## QQ 直接联系的号商

|     QQ     |   价格    |                                              备注                                              |
| :--------: | :-------: | :--------------------------------------------------------------------------------------------: |
| 2873239070 |    60     |                             Puls60 元质保 1 一个月可充老号带 codex                             |
| 546200350  |     5     |                                                                                                |
| 476025865  |     4     |                                                                                                |
| 3570569707 |     6     |                                                                                                |
|  5718423   | 2.5/2/1.5 |                        100 起 2.5R 1000 起 2R 2K 起 1.5R 非时抛 和日抛                         |
| 3153692204 |   4/6.5   | 4r 一个成品号，接过码的带 rt 的 6.5r <br /> 大量出纯手搓有卡的 PLUS 成品号，土区代充质保三十天 |

---

## 2026-5-25 02 | `wx:lq-_0922`

```txt
已经被封号
AbrilLadin54369@outlook.com----aqockb88141----9e5f94bc-e8a4-4e73-b8be-63364c29d753----M.C558_BAY.0.U.-Cjj0lNzUfUS0dPkDf5e5f89XRNwozP2EEY2BKi2fA5OnmX7UKCT01aC48YURRywZZMfaPEqyW9aIaZthoNX3z9AwmHBJwV**uZCmhq9fwF94cXNGswoVJBswQuumUl*Hjt5nacHH5QcDyAzhDCiWaH4!8PBvSENRDmU3qITmhviNgIESTvcSbMuQMCUDCBGU7eHzAWEXnj8wqKMMowOqhs1jtIuZuB0AQjbZb6OQTA*FpbzHfIyF*5lCGnvo8nIkQSXopTbd1!0Ubwdu6vv2SQ!!pNVBajt1EjVjUAJfXZY4*d77B5419Eug9Q73uCKxQgvKi6EQFVsj0gEX9gcAmlb2F4Za2zUIYuPxREv*G9BoWcYqmYPJc2izo7*0EqxGLUb43pFTQarkcjgKxmW3abHaCiU7Fr4npcPSDp!iAW7c5dcym*lcRbIfTxKiE!4oHw$$
```

```txt
已经被封号
AloysKronz50079@outlook.com----iqyysr772199----9e5f94bc-e8a4-4e73-b8be-63364c29d753----M.C545_SN1.0.U.-CghUlw0bGHUkukS8yeV9M6zyVuBqPmd8cvrPTGBHqYRAnQBwPXVL7D3Ef*vVSJtNDaP9lr15f0eCdn!jKzw!O4dZ*F*feNOZ5PuJthzjr1778L9Zlgn61h*Es0REitkqc35RWEoFDCHykr8W*CbsjLL6D9kTZgiCUcRU*hE9LYCVfMlYSdM7mvyJxhbqArF4jPlvPt6nZLgbtzMqjwJ1NMxtjJPyxJGxR5Eq6rFy0w9bzEXf5D6MtHOZP28MA05Lm9IGyOzjmFgZsJ46GCZfxdMZtx1LWlPuMgfOP6xk9BLI2MemtLlCy59!rQ!9QNC2KnhrOCEv90AZCY5EigJBHr1!6MIwi6CL5RRMI1aeTbdZmMWjC2yQWmJ7I6l*Xdr8xguPY2x1CfRkqcN2BsMili8vLF8PMW3aE6h5SAL53AShfqmpMcodT5S*LMYx2otNww$$
```

## 2026-5-26 02

- shop: https://pay.ldxp.cn/shop/ZYGCPJD7
- wx: YU2061150
- 于 2026-5-29 无法继续用网页版认证，强制要求二次验证手机号，且无法收到验证码。

```txt
A9TwyRt5dk@outlook.com===rTK2ol90@f1Q47NE===http://ms.outlook007.cc/api/open/email/latest?api_key=0lQpMJYvnN3gWOd6wARKLlzeRKtdQskx&pt=aU9MKL&email=A9TwyRt5dk@outlook.com
```

## 2026-5-27 01

- 店铺： https://pay.ldxp.cn/shop/RO6Q3C9F
- 店铺： https://pay.ldxp.cn/item/bwbgbg
- 接码、转换格式，自助工具： https://ai.cdns.ccwu.cc/
- QQ： 2732744559

```txt
SharonRay069894@hotmail.com----$BJmTYYK9DVcZLG3----0511cbaf-db8e-4f04-b509-b29f76345c8e----v1.eyJhY2NvdW50X2lkIjoxMzk2NiwiZW1haWwiOiJzaGFyb25yYXkwNjk4OTRAaG90bWFpbC5jb20iLCJ2IjoidjEifQ.MJhhkOlma9S9FjtGvq41Z-7fvuDd6dcMOvpjbrlCvBY
HenryHughes502015@hotmail.com----VBKMqSVVYTizCjLk----6ef9c868-957f-4226-b033-890d2ce0619b----v1.eyJhY2NvdW50X2lkIjoxMzk2NSwiZW1haWwiOiJoZW5yeWh1Z2hlczUwMjAxNUBob3RtYWlsLmNvbSIsInYiOiJ2MSJ9.moWf_81sOpXDD1NEmtmmHY7RwYUwZGlKaF9x44_Hqc0
ChristopherMorris85273@hotmail.com----VtILzVMgRh2I@Wt7----0d910841-6b81-44f0-a3c9-75d911040163----v1.eyJhY2NvdW50X2lkIjoxMzk2NCwiZW1haWwiOiJjaHJpc3RvcGhlcm1vcnJpczg1MjczQGhvdG1haWwuY29tIiwidiI6InYxIn0.n9edPy1eB-rH-7Ypt7ZLIyGpYoTzr0-JjVuEVG97ccM
```

## 2026-6-3 01

- 账号店铺： https://sp.az0.cn/
- 邮箱接码（根本无法接收任何验证码）： https://mail.chatai.codes/
- 价格： 5.26 元

- ChatGPT 与 outlook 账号： `zlbgjuyskqa@outlook.com`
- ChatGPT 与 outlook 密码： `sgcjpelwrbb82`

<!-- 2026-6-3-01-plus-rt-5.26r-sp.az0.cn|zlbgjuyskqa@outlook.com 未实现接码 未实现中转站的导入 -->

```txt
zlbgjuyskqa@outlook.com----sgcjpelwrbb82----9e5f94bc-e8a4-4e73-b8be-63364c29d753----M.C561_BAY.0.U.-CjoC2VTANaRn3HU8V66RS7TnS3XFdR9Ensy2T7c*1sDKm6*87PUEkA5svNcrpijFInQw!Kr382pKKtRthzU!gQ2MXoV53!QtQBO0c*x1UrLpfA6gu4ZfgNEvv81VwYTW0JPPxCKH2QX!gKADBZkV3CPj!CzGJfb!j96mMl2k2*JUT8j3!fsXKAGmPNAklPR*QdTs3lvjQKg8EHMfT4DFyzNy9rI0lVMVBndwMPTgzPdzR6bffbDh66qp1yd6emnRen93ih0J24kFnheFYuIpelExEuY!oucc5SmXH4dIGJF*7hB!WXuHB1RHwS25VkPTQkngjUv!hm23Wqa2*0zM8xH3keutLcixJyyx7NXFoe79
```

- 手机号接码店铺： https://pay.ldxp.cn/shop/66666SMS
- 手机号接码站点： https://admin-running.top/sms-usthree/
- 长效接码卡密： CDK-JMAD-RTOJ-XSWJ
- 美区手机号： +15163478326
- （无法接码）
