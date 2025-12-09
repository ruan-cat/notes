# 5-13 前端项目初始化内训

## 汇报进度

1. 共享屏幕，在线运行 monorepo 架构下面的子项目。
   - 安装正确的 vscode 插件
   - 选择正确的根目录安装依赖
2. 展示自己本地克隆的云效代码仓库。
   - 展示自己单独复制粘贴出来的 `版本计划.emmx` 文件。

::: warning 汇报

汇报延迟到[明天](../2025-5-14/index.md)。

:::

## 阅读群公告的`历史项目入门教程`

认真阅读上一次项目的[入门教程](../../group-announcement.md#历史项目入门教程)，了解清楚项目如何启动，如何选择正确的目录等。

## 培训使用云效工单

1. 在邮件内收到云效的通知。及时做出评论。
2. 及时更改状态为`处理中`。
3. 完成任务后，更改状态为`已完成`。

## 基础技能培训

以之前的[10wms](https://github.com/ruan-cat/10wms)项目为例子，学习必要的开发技能。

### vscode 设置成管理员权限

- https://01s-10wms-frontend-docs.ruancat6312.top/#赋予-vscode-管理员运行权限

### 更改 git 用户名

- https://docs-01-star.ruan-cat.com/attention/change-git-user-name.html

### 拉取远程仓库的代码

```bash
git fetch -p
```

### 合并来自主分支的代码

1. 先进入到你自己所在的业务分支。
2. 合并远程分支的代码

```bash
git merge origin/f1
```

### 明确 git 操作规范

未来开发时，每一个人必须遵守以下操作规范，否则会导致 git 提交不同步。

1. 先拉取远程代码。
2. 将主分支的代码合并到自己分支内。
3. 及时的提交代码到远程仓库。

### 学习 vscode 插件`git graph`

插件 id： `mhutchie.git-graph`

学会使用合适的 git 历史记录查看工具，查看当前项目的提交记录。

### 了解 git 忽略配置

### 认识.vscode 目录下的配置文件

### 学会 vscode 常用的命令

调用命令的快捷键： `Ctrl+Shift+P`

1. **重启 vscode**： `reloadwindow`
2. **打开个人用户全局配置**： `openusersetjson`

### vscode 登录 github 账户，全局同步个人配置

### 在 monorepo 内选择正确的根目录终端

### 安装依赖

```bash
pnpm i
```

### 运行生成工作区文件的命令

create-code-workspace 命令。

### 认识 vscode 工作区文件

`*.code-workspace`

打开工作区文件，以工作区的形式打开项目。

### 学会使用 cz 命令编写满足规范的 git commit

在工作区根目录内进入终端。

```bash
# 保存当前全部文件 进入git暂存区
git add .
# 使用全局依赖 commitizen 和 cz-git ，开始编写git commit
cz
```

务必编写有意义的，内容清晰明确的 git commit 提交记录。

### 学会使用 vscode 集成的 npm 脚本菜单

### 运行项目

dev 命令。

### 打包项目

build 命令。

### 删除依赖

clear:deps 命令。

## 观看群文件的翻墙教学视频

根据自己的翻墙情况，观看教学视频。

::: tip

如果你已经有能力翻墙，那么可以忽略此教程。

:::

## 针对性的阅读技术文档

这里[列举](../../technical-doc.md)必须要学会的技术。

请各位自己酌情安排时间，务必掌握该表内列举的技术。

## git 操作推荐视频

- [和傻子一起写代码](https://www.bilibili.com/video/BV1udEuzrEa7/)
