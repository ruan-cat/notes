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

- 格式转换器，且可以做 401 测活： https://convert.13916454.xyz/
- ChatGPT Session 转换成中转站常用格式：
  > https://gtxx3600.github.io/GPTSession2CPAandSub2API/
  > https://json.chatai.codes/
- 转换器： https://flowpilot.qlhazycoder.top/converter/
- CPA 转换成 sub2api 格式： https://gtxx3600.github.io/CPA2sub2API/

- `GPT 手搓plus账号 质保首登 长效邮箱`： https://pay.ldxp.cn/item/wuu9fh
