# Showcase your Open Source Contributions

Create a website with an RSS feed of your recent GitHub pull requests across the Open Source projects you contribute to.

![atinux-pull-requests](https://github.com/user-attachments/assets/cfa82cc2-51af-4fd4-9012-1f8517dd370f)

Demo: https://prs.atinux.com

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fatinux%2Fmy-pull-requests&env=NUXT_GITHUB_TOKEN&envDescription=Create%20a%20GitHub%20token%20with%20no%20special%20scope.&envLink=https%3A%2F%2Fgithub.com%2Fsettings%2Fpersonal-access-tokens%2Fnew&project-name=my-pull-requests&demo-title=My%20Pull%20Requests&demo-description=Create%20a%20website%20with%20an%20RSS%20feed%20of%20your%20recent%20GitHub%20pull%20requests%20across%20the%20Open%20Source%20projects%20you%20contribute%20to.&demo-url=https%3A%2F%2Fprs.atinux.com&demo-image=https%3A%2F%2Fprs.atinux.com%2Fog.png)

## 1. Features

- List the 50 most recent pull requests you've contributed to.
- RSS feed
- Only add your GitHub token to get started

## 2. Setup

Make sure to install the dependencies with [pnpm](https://pnpm.io/installation#using-corepack):

```bash
pnpm install
```

Copy the `.env.example` file to `.env` and fill in your GitHub token:

```bash
cp .env.example .env
```

Create a GitHub token with no special scope on [GitHub](https://github.com/settings/personal-access-tokens/new) and set it in the `.env` file:

```bash
NUXT_GITHUB_TOKEN=your-github-token
```

## 3. Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## 4. Production

Build the application for production:

```bash
pnpm build
```

## 5. Credits

This project is inspired by [Anthony Fu](https://github.com/antfu)'s [releases.antfu.me](https://github.com/antfu/releases.antfu.me) project.

## 6. License

[MIT](./LICENSE)

## 7. 经验教训

- `build:vercel` 在 Windows 本地构建失败时，不要第一时间只继续增大 `NODE_OPTIONS`。之前的首个问题并不是单纯内存不够，而是 `@nuxt/icon` 在 monorepo 根目录发现了整包 `@iconify/json`，导致 Nitro server bundle 把过大的 icon collection 一起打包，最终触发 OOM。
- 如果项目实际只使用少量图标集，应该在 `nuxt.config.ts` 里显式限制 `icon.serverBundle.collections`。本项目实际只用到了 `lucide` 和 `simple-icons`，限制后构建内存占用明显下降，Nitro 阶段不再因为图标集合过大而崩溃。
- 在 Windows 下使用 `nuxi build --preset vercel` 时，要特别关注 `payloadExtraction` 生成的 `_payload.json` 路由。之前的问题里，ISR 自动派生出的 `//_payload.json` 路由会在 Vercel preset 下触发错误的本地路径解析，进而出现 `EPERM: mkdir 'D:\\'`。
- 这类问题不能只看最终报错，必须把构建过程分阶段看清楚：先区分是 client build、SSR server build，还是 Nitro/Vercel preset 收尾阶段失败。只有先定位到具体阶段，后续修复才不会偏离方向。
- 对于 monorepo 内的 Nuxt 子项目，根目录依赖会直接影响子项目构建行为。以后只要根目录安装了像 `@iconify/json` 这类“大而全”的依赖，就要主动评估它是否会被子项目的构建工具自动发现并卷入产物。
- 这次还证明了一个更关键的问题：`build:vercel` 通过，不代表生产环境一定可用。首页虽然能构建成功，但在 `/api/contributions` 失败时仍然会因为页面直接依赖空数据而进入 500 页面，所以必须把“可访问性”单独当成一层验收标准。
- 对依赖远程接口的 SSR 页面，不能默认接口总会成功。`useFetch("/api/contributions")` 这类请求必须准备错误态、加载态和可空数据分支，避免因为 GitHub token 缺失、失效或接口异常，直接让首页 SSR 抛错。
- 生产优先级高于缓存策略。像 ISR 这类配置一旦让排障链路变复杂，应该先回退到最朴素、最稳定的方案，先保证线上能正常访问，再回头评估缓存和增量更新策略是否值得重新引入。
- Nuxt 项目的类型检查不能只看 `vue-tsc`。这次 `vue-tsc` 已通过，但 `nuxi typecheck` 仍然能抓出 `useSeoMeta` 写法、模板内直接访问 `window`、以及模板中直接调用 `useTimeAgo` 这类 Nuxt 上下文相关错误，所以发布前应至少执行一次 `pnpm exec nuxi typecheck`。
- 后续新增 ISR、payload、图标或 SSR 容错相关配置时，建议优先在 Windows 本地执行一次完整的 `pnpm run build:vercel`，并额外验证“无 token / 错 token / 接口失败”时首页是否仍能正常打开，而不是只跑 `nuxi dev` 或普通 `build`。
