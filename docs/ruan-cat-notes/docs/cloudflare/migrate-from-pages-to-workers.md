# 从 cloudflare pages 迁移到 cloudflare worker

这个过程很折腾，之前已经有了 cloudflare page 服务，现在（2025-6-17）新建一个 page 时，必须要以 worker 的形式新建了。

- [官方迁移文档](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)

## 在 monorepo 内部署一个简单的 page 页面

迁移注意事项：

- 初始化包管理器 pnpm
- 设置部署目录
- 设置 wrangler 的其他配置

### 构建命令

```bash
pnpm i && pnpm run build:docs:01star
```

1. 生成 `pnpm-lock.yaml` 依赖锁文件：
   > 用指定的 `pnpm i` 命令，主动安装依赖，这样就可以在服务器环境内生成显性的 `pnpm-lock.yaml` 依赖锁文件，就可以在后续使用 pnpm 包管理器了。在 cloudflare worker 内，必须要识别到准确的 `pnpm-lock.yaml` 文件才能使用 pnpm。
2. cloudflare worker 默认的包管理器和环境：
   > 都是 `bun` 。
3. 为什么可以直接使用 `pnpm i` 来安装依赖？
   > cloudflare 的云环境是包含有 pnpm 的。
4. 为什么一定要初始化 pnpm？
   > 被构建页面的项目是 monorepo+pnpm 架构的项目，所以需要初始化 pnpm 管理器。否则后续子包无法在服务器内使用正确的包管理器构建。

### 部署命令

```bash
npx wrangler deploy --assets=./docs/docs-01-star/docs/.vitepress/dist --compatibility-date 2025-06-15
```

- 必须设置 `--assets` 参数：设置好部署的静态资产位置，在部署 `page` 时，需要指定静态文件的位置，故需要设置 `--assets` 参数。
- `--assets` 参数允许写等于号： 经过实验，在 `wrangler deploy` 部署命令内，`--assets` 参数允许写等于号。
- 必须设置 `--compatibility-date` 参数： wrangler 还要求必填 `--compatibility-date` 参数。这是语法决定的。
- `--compatibility-date` 参数**不能**写等于号： 经过实验，不能写等于号来传参。

这些配置也可以在 wrangler 配置文件内编写。但是目前在 monorepo 内，不好实现 page 项目的分治处理，故不打算配置
wrangler.toml。就和之前给 monorepo 配置 vercel.json 一样。

### 构建监视路径

```txt
docs/docs-01-star/*
```

在 monorepo 内，为了避免重复构建，实现有针对性的构建，这里配置目标的文件夹目录。

注意，这里并不是写 glob 语法。

### cloudflare worker 配置总览

大致效果如下图所示：

![2025-10-08-17-12-18](https://gh-img-store.ruan-cat.com/img/2025-10-08-17-12-18.png)

## 在 monorepo 内部署一个 nuxt/nitro 格式的 worker

大体的做法和上面差不多。配置如下：

![2025-12-07-22-48-28](https://gh-img-store.ruan-cat.com/img/2025-12-07-22-48-28.png)

### 构建命令

```bash
pnpm i && pnpm run build:cloudflare:admin
```

### 部署命令

按照 nitro 构建后的日志，编写该配置写法：

```bash
npx wrangler --cwd=./apps/admin/.output deploy
```
