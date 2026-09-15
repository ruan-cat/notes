# 不要为了 pnpm12 而继续使用 corepack，正式准备淘汰 corepack 的使用

2026-08-26 pnpm 12 正式发布——Rust 重写，原生可执行文件，安装速度直接砍半。但这次升级最大的坑不是 pnpm 本身，而是我们用了很多年的「环境准备标配」：

```bash
corepack enable && corepack install
```

这两行命令，在 pnpm 12 面前已经彻底失效了。

## 为什么不再用 corepack 准备环境？

一句话：**corepack 从机制上就装不了 pnpm 12**，不是版本没跟上，是永远跟不上。

pnpm 12 的 npm 分发包里不再有 `bin/pnpm.mjs` 这个 JS 入口，取而代之的是一个 postinstall 钩子，从平台子包（`@pnpm/exe.<platform>-<arch>`）里链接预编译的 Rust 二进制。而 corepack 的设计恰好卡死在这条路上：

- corepack **不安装 optional dependencies**（平台子包就是 optional dep）；
- corepack **不执行 postinstall 钩子**；
- 它期望拿到一个下载即可运行的 JS 文件——pnpm 12 恰恰不再提供。

pnpm 维护者的原话是「用 Rust 重写 pnpm 比迁移到 ESM 更快」，所以他们拒绝为 corepack 提供向后兼容的 JS shim——加了 shim，原生启动的速度优势就没了。这条兼容路线在官方层面已经关闭（pnpm/pnpm#13018）。

雪上加霜的是：corepack 的 pnpm 版本上限停在 **11.26.0**，Node.js 25 起也不再随发行版内置 corepack，pnpm 官方文档已经把 corepack 从安装页和 CI 示例里全部移除。信号非常明确：**对 pnpm 用户来说，corepack 进入退役流程了**。

## 它还埋了一个更隐蔽的雷

`corepack enable` 的行为是把 shim 写到 corepack 二进制所在的目录。在我的机器上就是 `~\.nvmd\bin`——NVM Desktop 管理 node 的地方。

我升级完 pnpm 12 后删掉了这里的旧 shim，第二天它复活了，而且指向的还是 pnpm 10。排查发现，是几个老仓库的 `preinstall` 钩子在每次 install 时执行 `corepack enable`，把 shim 悄悄写了回去。

这带来一种「版本精神分裂」：PATH 优先级让裸命令 `pnpm` 是 12.4.1，但按绝对路径调用的工具（比如 turbo 探测到的 pnpm.CMD）拿到的是 10.34.5。两个版本 lockfile 格式相同、互不报错，行为差异全部静默发生——这种 bug 比直接报错难查十倍。

所以淘汰 corepack 不只是「换个安装方式」，而是要**把散落在 workflow 和 preinstall 钩子里的 `corepack enable` 一起清干净**，否则它会以各种方式还魂。

## GitHub workflow 以后要怎么准备 pnpm 12？

两种官方姿势，共同点都是**不写版本号，让 `packageManager` 字段做唯一事实源**。

### 姿势一：`pnpm/action-setup`（迁移成本最低）

不传 `version` 输入时自动读取 `package.json` 的 `packageManager` 字段：

```yaml
steps:
  - uses: actions/checkout@v6
  - uses: pnpm/action-setup@v6 # 不写 version，自动跟随 packageManager
  - uses: actions/setup-node@v6
    with:
      node-version: 24
      cache: pnpm
```

注意一个坑：如果 action-setup 传了 `version`、而 `packageManager` 字段也存在且两者不一致，会直接报 `Multiple versions of pnpm specified`——迁移时把旧的 `version: 10.x` 输入删干净，别留着打架。

### 姿势二：`pnpm/setup`（官方新 action，一步到位）

```yaml
steps:
  - uses: actions/checkout@v6
  - uses: pnpm/setup@c9883cc79df532ad1a7b81bf9ab944ceb090d65c # v2.0.0
    with:
      runtime: node@24
      cache: true
      install: false # 需要自定义 install 步骤时关掉自动安装
```

它连 Node 都帮你装了（`runtime` 输入），替代 `actions/setup-node`，还顺手缓存 pnpm store。新仓库建议直接用它。

### 顺手要清的旧代码

仓库里凡是 `corepack enable && corepack install` 的步骤、以及 `preinstall` 钩子里的 `corepack:pnpm`，现在都是死代码 + 定时炸弹（corepack install 遇到 pnpm@12 的 pin 会直接失败），见到就删。包管理器约束想保留的话，`preinstall` 里留 `npx only-allow pnpm` 就够了。

## Vercel 侧的彩蛋

Vercel 构建镜像已经原生支持 pnpm 12：设置 `ENABLE_EXPERIMENTAL_COREPACK=1` 后，构建日志会打出 `Detected ... "pnpm@12.4.1" in packageManager`，然后老老实实用 12.4.1 完成安装部署。这是 Vercel 自研的检测路径，和仓库里有没有 corepack 脚本无关——云端不用操心。

## 迁移清单（实操版）

1. 全局：`pnpm self-update` 或从 GitHub Release 下载原生二进制放进 `PNPM_HOME`（corepack 路线走不通）。
2. workflow：action-setup 删掉 `version` 输入，或换 `pnpm/setup`；删除一切 `corepack enable` 步骤。
3. preinstall 钩子：删 `corepack:pnpm`，保留 `npx only-allow pnpm`。
4. 自检一条命令：`where.exe pnpm`——只允许出现 PNPM_HOME 一处，出现 `.nvmd\bin` 就是 shim 复活，删之。

一次迁移，四步收干净。之后升级 pnpm 只改 `packageManager` 一个字段，CI 和云端自动跟随——这才是 packageManager 字段该有的样子。
