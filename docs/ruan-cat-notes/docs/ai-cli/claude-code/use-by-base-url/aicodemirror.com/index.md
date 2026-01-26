# 基于 aicodemirror.com 中转商的配置

- 获取 key： https://www.aicodemirror.com/dashboard/apikeys
- window 环境不生效需要手动删除文件重置： https://www.aicodemirror.com/dashboard/official-installation/windows

```bash
$env:ANTHROPIC_AUTH_TOKEN = "sk-**"
$env:ANTHROPIC_API_KEY = "sk-**"
$env:ANTHROPIC_BASE_URL = "https://api.aicodemirror.com/api/claudecode"
```

## 注意事项

1. 这个供应商提供**免费额度**。
2. 不能使用任何形式的翻墙。这个站点的 baseUrl 都不能翻墙，不能开启任何翻墙，TUN 不能开启，任何节点都不能选取。
3. 需要额外多配置一个 `ANTHROPIC_API_KEY` ，这和其他供应商有所不同。
