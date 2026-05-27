# 服务器运维面板

## CentOS 10 安装命令

固定 1Panel 面板端口为 8000，建议按下面执行

```bash
# 0. 切换 root
sudo -i

# 1. 确认 8000 端口未被占用
ss -lntp | grep ':8000 ' || echo "8000 端口当前未被占用，可以继续"

# 2. 更新系统并安装基础工具
dnf update -y
dnf install -y curl wget tar firewalld

# 3. 启动防火墙
systemctl enable --now firewalld

# 4. 先放行 8000 端口
firewall-cmd --zone=public --add-port=8000/tcp --permanent
firewall-cmd --reload
firewall-cmd --list-ports

# 5. 执行 1Panel 官方 v2 在线安装脚本
bash -c "$(curl -sSL https://resource.fit2cloud.com/1panel/package/v2/quick_start.sh)"

# 6. 安装完成后，把 1Panel 面板端口修改为 8000
1pctl update port 8000

# 7. 重启 1Panel
1pctl restart

# 8. 查看面板访问地址、账号、密码、安全入口
1pctl user-info
```

## Debian-12.0 安装命令

<!-- TODO: -->
