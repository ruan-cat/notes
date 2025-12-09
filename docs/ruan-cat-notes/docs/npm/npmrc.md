# .npmrc ，npm 包管理器的配置文件

`.npmrc` 是 node 项目针对于 npm 包管理器的配置文件，可以配置 npm 命令行的一些变量，也可以配置依赖包下载的镜像。

## 打开 window 电脑内的全局 `.npmrc`

在文件资源管理器，地址栏输入以下文件地址即可。

```bash
%USERPROFILE%/.npmrc
```

通常是类似于 `C:\Users\pc\.npmrc` 的文件路径。

## 淘宝镜像

淘宝镜像变了，值得注意：

- https://github.com/xlei1123/please-update-cnpm#please-update-cnpm

npm 太慢， 淘宝 npm 镜像使用方法

- https://blog.csdn.net/quuqu/article/details/64121812
- https://npmmirror.com/

## nw 的淘宝镜像

- https://registry.npmmirror.com/binary.html?path=nwjs/

## .npmrc 常见配置

```bash
# npm代理配置，用于实现依赖包的快速安装 这里默认总是从淘宝镜像安装
registry=https://registry.npm.taobao.org/

hoist=true

sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
phantomjs_cdnurl=http://cnpmjs.org/downloads/

electron_mirror=https://mirrors.huaweicloud.com/electron/
sqlite3_binary_host_mirror=https://foxgis.oss-cn-shanghai.aliyuncs.com/
profiler_binary_host_mirror=https://npm.taobao.org/mirrors/node-inspector/
chromedriver_cdnurl=https://cdn.npm.taobao.org/dist/chromedriver/
```

## better-sqlite3 的下载配置

::: details 配置

```bash
# 作者：zhangjr0575
# 链接：https://juejin.cn/post/7159085517487734798
# 来源：稀土掘金
# 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
better_sqlite3_binary_host=https://registry.npmmirror.com/-/binary/better-sqlite3
better_sqlite3_binary_host_mirror=https://registry.npmmirror.com/-/binary/better-sqlite3
better-sqlite3_binary_host=https://registry.npmmirror.com/-/binary/better-sqlite3
better-sqlite3_binary_host_mirror=https://registry.npmmirror.com/-/binary/better-sqlite3
```

:::

## 面向 electron、electron-builder 和 better-sqlite3 的常见镜像源配置

- https://juejin.cn/post/7356214996760461323

下载的都是是二进制文件。

```bash
electron_mirror=https://registry.npmmirror.com/-/binary/electron/
electron_builder_binaries_mirror=https://registry.npmmirror.com/-/binary/electron-builder-binaries/
better_sqlite3_binary_host=https://registry.npmmirror.com/-/binary/better-sqlite3
```

## 代理问题

安装其他依赖时，称存在代理问题。

- https://github.com/nuxt/cli/issues/159
- https://github.com/unjs/giget/issues/120
- https://github.com/unjs/giget/issues/23

```bash
https-proxy=http://127.0.0.1:10809
proxy=http://127.0.0.1:10809

http-proxy=http://127.0.0.1:10809
```

<!-- FORCE_NODE_FETCH=1 -->

## 严格引擎判断

可以用以下的配置：

```bash
engine-strict=true
```

但是不推荐，因为这个配置很容易导致 github action 的工作流被迫中断。

比如这样的工作流配置：

```yaml
jobs:
  Deploy-Production:
    runs-on: ubuntu-latest
    steps:
      - name: 检出分支
        uses: actions/checkout@v4

      - name: 安装pnpm
        uses: pnpm/action-setup@v4
        with:
          run_install: |
            - recursive: true
            - args: [--global, "vercel", "@dotenvx/dotenvx", "tsx"]

      - name: 安装node
        uses: actions/setup-node@v4
        with:
          node-version: 20.15.1
          cache: pnpm
```

是先安装 pnpm，然后才是安装 node，缓存 pnpm 的。

在第一个安装 pnpm 的任务内，就因为严格引擎判断，而强制结束掉整个工作流了。

## 指定某个依赖包的安装源

- https://segmentfault.com/a/1190000043035933#item-3

比如说我自己开发的依赖包，我刚刚发布完就想使用。来不及等待淘宝镜像时，可以直接从官方镜像源内安装。可以直接约束包名满足指定规则的依赖，约束其镜像源。

比如下面，我指定凡是以 `@ruan-cat` 开头的子包，均使用官方镜像源。

```bash
@ruan-cat:registry=https://registry.npmjs.org/
```

## node25 即将不允许 npmrc 提供镜像源配置
