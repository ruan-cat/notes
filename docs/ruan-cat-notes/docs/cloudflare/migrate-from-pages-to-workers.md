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

目前 cloudflare worker 用的是默认包管理器和环境都是 bun，被构建页面的项目是 monorepo+pnpm 项目。所以需要初始化 pnpm 管理器。

但实际操作的时候，cloudflare 的云环境是包含有 pnpm 的，所以直接安装依赖即可。

安装完依赖，就直接打包项目。这里是专门在 monorepo 的根包内暴露出一个命令，来构建子包的页面。

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
