---
juejin: 。。。
desc: TODO 请编写摘要
---

# 在 vercel 平台部署 monorepo 架构下的 nitro 接口

> **摘要**：
>
> 在 Vercel 平台部署基于 PNPM Workspace 的 Monorepo 项目时，遇到了构建目标子包依赖本地 Workspace 子包无法被识别的情况，和 Serverless 产物目录无法被 Vercel 识别的双输局面。

> **AI 辅助总结的文章**：
>
> 本文并不是完全由作者编写，大部分整理好的内容为 AI 辅助生成。内容均经过作者审核。

## 问题起因

如果是简单架构的 node 项目，那么直接在 vercel 平台内选择项目架构为 nitro 就行了。如果是正统的 monorepo 项目呢？且实现内部子包相互依赖的 monorepo 项目呢？又该如何在 vercel 平台内完成部署呢？

### 不同的路径配置导致相互冲突矛盾的情况

vercel 平台提供 `Output Directory（输出目录）` 和 `Root Directory（根目录）`，但是在 monorepo 场景内，配置就遇到困难了。

一方面单独设置 `output 输出目录` 就始终不能让 vercel 平台正确的识别一个完整的 nitro 项目并识别出 serverless 接口。构建虽然成功了，但是部署出来的产物完全不是一个 nitro 接口，无法使用。

另一面单独设置 `root 根目录` 为子包目录，即 `apps/admin` ，又导致不能识别出 monorepo 项目内的其他子包，最后无法完成构建。

## 原因分析

Vercel 的部署机制存在两个刚性约束，在 Monorepo 场景下产生冲突：

1. **依赖安装约束**：PNPM Workspace 必须在项目根目录运行 `install` 才能正确建立软链（Symlink），否则无法解析 `workspace:*` 协议的依赖。
2. **Serverless 产物约束**：Vercel 的 Build Output API 默认在其设定的 "Root Directory" 下寻找 `.vercel/output` 目录。Nitro 构建默认将产物输出在子项目目录内，导致两者路径不匹配。

## 区分输出目录与根目录的差异

最核心的概念是要去区分 vercel 平台的 `Output Directory（输出目录）` 和 `Root Directory（根目录）` 的差异。

这张表格能非常直观地理清 Vercel 部署中这两个核心配置的区别。特别针对 **Monorepo + Nitro** 场景进行了详细填充：

| 对比项             | Output Directory（输出目录）                                                                          | Root Directory（根目录）                                                                                                                                            |
| ------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **核心概念差异**   | **“终点”**：Vercel 最终要去哪里拿构建好的网站文件发布上线。                                           | **“起点”**：Vercel 也就是服务器进入项目的第一站，所有的命令（安装、构建）都在这个目录下执行。                                                                       |
| **安装 node 依赖** | **无影响**：此设置不影响依赖安装。                                                                    | **决定性影响**：`pnpm install` 会在此目录下运行。**Monorepo 必须设为项目根目录**，否则无法读取 `pnpm-workspace.yaml`，导致找不到本地子包（如 `@01s-11comm/type`）。 |
| **构建产物**       | **寻找目标**：构建结束后，Vercel 会死板地去这个目录找 `.vercel/output` 文件夹。如果找不到，部署失败。 | **生成位置**：Nitro 构建通常会在子项目里生成产物（如 `apps/admin/.vercel/output`），而不是直接生成在 Root Directory 下。                                            |
| **二者配置矛盾点** | Vercel 在根目录找产物，但构建产物生成在子目录里，导致 **“找不到部署文件”**。                          | 设为根目录虽然能装好依赖，但导致 Vercel 在错误的位置（根目录）寻找子项目的产物。                                                                                    |
| **最佳实践配置**   | **覆盖 (Override)** 为 `.vercel/output`                                                               | **保持默认 (空)**                                                                                                                                                   |

## 解决方案

既然我们清楚了固定读取 `.vercel/output` 的机制，那么就采用 **“根目录构建 + 产物搬运”** 策略：在项目根目录内完成构建，确保能够识别子包，构建完成后再手动移动构建产物到根目录且符合 `.vercel/output` 目录结构的地方即可。

1. **Vercel 设置**：保持 Root Directory 为项目根目录（确保依赖安装正常）。
2. **构建脚本改造**：
   - 使用 `turbo` 或 `pnpm --filter` 在根目录触发子项目构建。
   - 构建完成后，使用脚本（`cp` 或 `shx`）将子项目的 `.vercel/output` 文件夹完整复制到根目录。
3. **兼容性优化**：引入 `shx` 库解决 Windows 环境下 `cp` 和 `mkdir` 命令不兼容的问题。

最终生效命令

```bash
turbo run build --filter=admin && npx shx rm -rf .vercel/output && npx shx mkdir -p .vercel && npx shx cp -r apps/admin/.vercel/output .vercel/
```

## 更改 vercel 配置

1. 输出目录写死 `.vercel/output` 即可。
2. 根目录不做配置，留空。

![2026-02-26-18-01-43](https://gh-img-store.ruan-cat.com/img/2026-02-26-18-01-43.png)

## 🚨 Vercel 部署 Monorepo 路径冲突复盘分析表

| ❌ 尝试方案                    | **A. 仅关注依赖完整性**                                                                                    | **B. 仅关注部署识别**                                                                              | ✅ 最终解决方案                                                          |
| :----------------------------- | :--------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------- |
| **Vercel Root Directory 设置** | **项目根目录 (Root)**<br>`/`                                                                               | **子应用目录**<br>`apps/admin`                                                                     | **项目根目录 (Root)**<br>`/`                                             |
| **PNPM Workspace 行为**        | ✅ **正常**<br>能读取根目录 `pnpm-workspace.yaml`，正确链接本地子包 `@01s-11comm/type`。                   | ❌ **失败**<br>在子目录运行 install，无法感知 Workspace 上下文，导致找不到 `@01s-11comm/type` 包。 | ✅ **正常**<br>在根目录执行 install，依赖关系完整。                      |
| **Nitro 构建产物位置**         | 生成在子目录下：<br>`apps/admin/.vercel/output`                                                            | 生成在当前目录下：<br>`apps/admin/.vercel/output`                                                  | 生成在子目录下：<br>`apps/admin/.vercel/output`                          |
| **Vercel Output 寻找路径**     | Vercel 在根目录寻找：<br>`/.vercel/output`                                                                 | Vercel 在子目录寻找：<br>`apps/admin/.vercel/output`                                               | Vercel 在根目录寻找：<br>`/.vercel/output`                               |
| **部署结果**                   | ❌ **部署失败 (404/Invalid)**<br>Vercel 在根目录找不到 Output 文件夹，认为不是 Serverless 项目或构建为空。 | ❌ **构建失败 (Build Error)**<br>在 `install` 阶段直接报错：`ERR_PNPM_WORKSPACE_PKG_NOT_FOUND`。   | ✅ **部署成功**<br>通过脚本将产物手动“搬运”到 Vercel 预期的位置。        |
| **核心矛盾点**                 | **“有环境，没产物”**<br>依赖装好了，但 Vercel 找错地方了。                                                 | **“有位置，没环境”**<br>位置对上了，但依赖装不上了。                                               | **“环境位置解耦”**<br>在根目录装依赖（保环境），手动复制产物（保位置）。 |

---

## 总结核心逻辑

1. **Root Directory 管“生”**：必须是整个项目根目录，这样“生”出来的环境（依赖）才是完整的。
2. **Output Directory 管“拿”**：Vercel 伸手去拿结果的地方。
3. **中间的桥梁（构建命令）**：因为“生”的地方（子目录）和“拿”的地方（根目录）不在一起，所以我们需要在 `Build Command` 里做一个**搬运工**的操作（`cp -r ...`），把生出来的东西搬到 Vercel 想拿的地方去。
