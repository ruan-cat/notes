# dotenvx 环境变量提供工具

- https://github.com/dotenvx/dotenvx

```bash
pnpm i -D @dotenvx/dotenvx
```

## 在 node 命令行内提供多份环境变量文件

- https://dotenvx.com/docs/advanced/run-f

```json
{
	"deploy": "dotenvx run -f apps/admin/.env.production -f .env -- tsx ./scripts/deploy.ts"
}
```
