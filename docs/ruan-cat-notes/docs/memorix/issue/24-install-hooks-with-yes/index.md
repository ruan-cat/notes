<!-- https://github.com/AVIDS2/memorix/issues/24 -->

# 避免安装 hooks 时，出现交互式界面，直接完成指定的客户端安装即可

目前的情况如下，运行 `memorix hooks install --agent cursor` 命令完成对指定项目的局部配置安装。但是会进入到交互界面。

> ![2026-03-27-12-33-06](https://gh-img-store.ruan-cat.com/img/2026-03-27-12-33-06.png)

---

我不想进入到这个交互，我已经准备好了一揽子的 hooks 安装命令了，如下：

```bash
memorix hooks install --agent cursor
memorix hooks install --agent kiro
memorix hooks install --agent claude
memorix hooks install --agent codex
memorix hooks install --agent antigravity
```

但是每次都会进入到 cli 的交互页面。我的需求就是直接安装 memorix 提供的一揽子 AI 客户端需要的配置，包括对现有项目的配置维护，或全新项目的初始化。反复进入到 cli 交互页面，很影响我开发。不利于我用 AI 批量完成命令和安装，毕竟 AI 会卡死在交互 cli 内。

我想跳过这个交互流程。

## 设计一个 `--yes` 参数来表示用户就是直接完成配置，不做额外处理

我推荐是这样：

```bash
memorix hooks install --agent cursor --yes
```

我直接编写提供一个 `--yes` 参数，直接认定是不需要 cli 交互，直接完成配置文件生成。
