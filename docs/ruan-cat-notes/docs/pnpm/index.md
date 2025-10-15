# pnpm

## 常用命令

### 查看全局配置

- https://pnpm.io/zh/cli/config

```bash
# 长命令
pnpm config list --global

# 短命令 失败 未识别出来 可能是和pnpm v7 v8 的cli区别。
pnpm c ls -g

# 失败
pnpm config ls -g

# 有效
pnpm config list -g
```

## 存储在 C 盘的内容并迁移清理

发现 `C:\Users\ruanzhongnan\AppData\Local` 文件夹里面存在 `pnpm-state` 和 `pnpm-cache` 两个文件夹。如下图所示：

![2023-06-25-13-45-28](https://gh-img-store.ruan-cat.com/img/2023-06-25-13-45-28.png)

同时发现这三个文件夹，在文档内有涉及到配置：

![2023-06-25-13-47-34](https://gh-img-store.ruan-cat.com/img/2023-06-25-13-47-34.png)

相关文档如下：

- [global-bin-dir](https://pnpm.io/zh/npmrc#global-bin-dir)
- [state-dir](https://pnpm.io/zh/npmrc#state-dir)
- [cache-dir](https://pnpm.io/zh/npmrc#cache-dir)

### 准备迁移目录

先全局查询配置：

```bash
pnpm config list -g
```

结果如下：

```bash
HOME=D:\dev-evn\pnpm
cache=D:\dev-evn\node-store\node_cache
disturl=https://npm.taobao.org/dist
global=true
https-proxy=null
prefix=D:\dev-evn\node-store\node_global
proxy=null
registry=https://registry.npm.taobao.org/
store-dir=D:\.pnpm-store
user-agent=pnpm/8.2.0 npm/? node/v16.19.0 win32 x64
```

![2023-06-25-13-57-56](https://gh-img-store.ruan-cat.com/img/2023-06-25-13-57-56.png)

打算按照以下命令来统一设置 global-dir、global-bin-dir、state-dir、cache-dir 这 4 个目录：

```bash
pnpm config set global-dir D:\store\pnpm\global-dir -g
pnpm config set global-bin-dir D:\store\pnpm\global-bin-dir -g
pnpm config set state-dir D:\store\pnpm\state-dir -g
pnpm config set cache-dir D:\store\pnpm\cache-dir -g
```

### ERROR The configured global bin directory XXX is not in PATH

出现预期之外的错误：

```bash
ERROR  The configured global bin directory "D:\store\pnpm\global-bin-dir" is not in PATH
```

![2023-06-25-14-06-14](https://gh-img-store.ruan-cat.com/img/2023-06-25-14-06-14.png)

通过检查 `C:\Users\ruanzhongnan\AppData\Local\pnpm\config\rc` 的文件，发现仅有两条被配置了。

![2023-06-25-14-07-51](https://gh-img-store.ruan-cat.com/img/2023-06-25-14-07-51.png)

运行命令 `pnpm config list -g` 之后，还是出现该错误。

### 尝试处理

- https://juejin.cn/post/7134978421611823134

尝试按照以下方案：

- 检查 `~/AppData/Local/pnpm/config/rc` 文件，手动移除掉内容的全部配置。
- 路径增加双引号。
- 故意去除某个命令。

```bash
pnpm config set global-dir "D:\store\pnpm\global-dir" -g
# 故意跳过此命令 不手动设置
pnpm config set global-bin-dir "D:\store\pnpm\global-bin-dir" -g
pnpm config set state-dir "D:\store\pnpm\state-dir" -g
pnpm config set cache-dir "D:\store\pnpm\cache-dir" -g
```

再次查看全局配置，可以看到已经被配置的目录。然后手动迁移文件。

### ERR_PNPM_UNEXPECTED_STORE Unexpected store location

尝试运行以下命令，检查全局依赖包是否可用：

```bash
pnpm i -g typescript ts-node
```

报错如下：

```bash
PS C:\Windows\system32> pnpm i -g typescript ts-node
 ERR_PNPM_UNEXPECTED_STORE  Unexpected store location

The dependencies at "D:\store\pnpm\global-dir\5\node_modules" are currently linked from the store at "C:\Users\ruanzhongnan\AppData\Local\pnpm\store\v3".

pnpm now wants to use the store at "D:\.pnpm-store\v3" to link dependencies.

If you want to use the new store location, reinstall your dependencies with "pnpm install".

You may change the global store location by running "pnpm config set store-dir <dir> --global".
(This error may happen if the node_modules was installed with a different major version of pnpm)
```

### 尝试处理

运行 `pnpm install -g` 重新使用依赖存储位置。

![2023-06-25-16-02-43](https://gh-img-store.ruan-cat.com/img/2023-06-25-16-02-43.png)

重新安装：

```bash
C:\Windows\system32>\store\pnpm\global-dir\5\node_modules\pnpm\bin\pnpm.cjs" i -g typescript ts-node
系统找不到指定的路径。
```

![2023-06-25-16-10-27](https://gh-img-store.ruan-cat.com/img/2023-06-25-16-10-27.png)

最后经过检查，可以安装并看到全局依赖。

## 管理全局依赖

先用 `pnpm i -g typescript ts-node` 安装全局依赖
再用 `pnpm ls -g` 查看全局依赖
最后 `pnpm up -g` 升级本机的全局依赖

## 安装后无法被识别到

```bash
PS E:\code\rzn\personal-proj\notes> pnpm -v
pnpm : 无法将“pnpm”项识别为 cmdlet、函数、脚本文件或可运行程序的名称。请检查名称的拼写，如果包括路径，请确保路径正确，然后再试一次。
所在位置 行:1 字符: 1
+ pnpm -v
+ ~~~~
    + CategoryInfo          : ObjectNotFound: (pnpm:String) [], CommandNotFoundException
    + FullyQualifiedErrorId : CommandNotFoundException
```

- https://juejin.cn/post/7189174073899876409

## cmd 无权限

```bash
PS C:\Windows\system32> pnpm -v
pnpm : 无法加载文件 E:\dev-evn\node-store\node_global\pnpm.ps1，因为在此系统上禁止运行脚本。有关详细信息，请参阅 https:
/go.microsoft.com/fwlink/?LinkID=135170 中的 about_Execution_Policies。
所在位置 行:1 字符: 1
+ pnpm -v
+ ~~~~
    + CategoryInfo          : SecurityError: (:) []，PSSecurityException
    + FullyQualifiedErrorId : UnauthorizedAccess
```

- https://blog.csdn.net/weixin_46212682/article/details/121784020

## 在 vscode 终端内运行失败

- vscode 设置为管理员权限运行： https://blog.csdn.net/qq_41701363/article/details/113992144
- 综合解决方案： https://blog.csdn.net/weixin_41563986/article/details/121183842

## override.newPref.startsWith is not a function

如下图所示，这里的 pnpm 想要实现全局依赖管理，就要先切换到 node16。在 node14 下是找不到全局依赖的。

![2023-06-12-14-52-45](https://gh-img-store.ruan-cat.com/img/2023-06-12-14-52-45.png)

## 使用 corepack 安装

以下内容已经过时失效，点此阅读最新的 [corepack 安装 pnpm](../corepack/index.md) 的方案。

::: details 目前失效的配置

- https://pnpm.io/zh/installation#使用-npm-安装

```bash
corepack use pnpm@latest
```

这里会给 package.json 加上 packageManager。

:::

## 升级 pnpm

以下方案存在 bug，最新的，保守的解决方案[点此链接进入](../corepack/index.md)。

::: details

之前的升级方式是，pnpm 原地升级。

```bash
pnpm up -g pnpm@latest
```

现在的升级方式改了，变成要依赖于 corepack 的升级方式了。

```bash
corepack install -g pnpm@latest
```

经过实验，直接使用 corepack install 安装全局版本的 pnpm 有点问题，目前比较稳妥的全局安装和切换版本的命令如下：

```bash
corepack prepare pnpm@9.7.0 --activate
```

:::

### 基于 `pnpm self-update` 命令完成全局升级

我真搞不懂了，用 corepack 不能实现全局 pnpm 升级了。在 pnpm9 版本内，现在（2025-7-21）要用这个命令才能实现全局升级：

```bash
pnpm self-update
```

## pnpm init

快速生成 package.json 文件。快速初始化一个 node 项目

::: details

![2025-02-07-18-38-38](https://gh-img-store.ruan-cat.com/img/2025-02-07-18-38-38.png)

:::
