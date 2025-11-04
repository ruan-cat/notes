# 基于 anyrouter.top 中转商的配置

- 注册账号并获得 key： https://anyrouter.top/register?aff=a5MW

```bash
$env:ANTHROPIC_AUTH_TOKEN = "在anyrouter内新建的token"
$env:ANTHROPIC_BASE_URL = "https://anyrouter.top"
```

## 注意事项

1. **ANTHROPIC_BASE_URL 不能设置成国内镜像**： anyrouter 的官网成可以设置成国内镜像 `https://pmpjfbhq.cn-nb1.rainapp.top` ，但是实测下来这个无法使用。
