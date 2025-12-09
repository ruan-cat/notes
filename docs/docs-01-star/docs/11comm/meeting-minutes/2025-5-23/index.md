# 5-23 套模板生成搜索栏

本次会议以培训为主。

以下内容仅为大纲，不会提供过于详细的内容。

本次培训的重点是：

1. i18n 分治策略以及各个组件对 i18n 的配置。
2. git 操作。
3. 表格搜索栏。

## 参考例子

以 `apps\admin\src\pages\property-manage\community-manage\house-decoration\index.vue` 为例子。

## 表格搜索栏

- https://pure-admin.github.io/vue-pure-admin/#/form/index
- https://plus-pro-components.com/components/config.html#valuetype-可选的表单值

### 动态变化的 i18n 文本

- https://github.com/plus-pro-components/plus-pro-components/issues/184

## 表格组件

针对 i18n 功能，表格组件要做出改动。

### 全局组件注册时，应该同步注册 i18n 实例

- https://github.com/pure-admin/vue-pure-admin/issues/926
- https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/main.ts#L17-L19

### 动态的表格表头要用`headerRenderer`而不是`label`

使用响应式的语法实现动态变化的 i18n 文本。

- https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36

## 全新的 i18n 文件分治策略

## 不推荐使用 git graph 插件来修改用户名了

git graph 插件修改的用户名，是本机的全体用户名，而不是当前仓库的用户名。二者的作用域范围是不一样的。

这导致我另一个项目的提交记录，其用户名都是不对的。受到污染的。

::: details 用户名出现明显的对不上

![2025-05-23-01-49-29](https://s2.loli.net/2025/05/23/aFViHwrt8ZJ2bAu.png)

:::

我们应该使用具体的命令来实现当前 git 项目改名。

```bash
git config --local user.name f1-阮喵喵
```

- https://notes.ruan-cat.com/git/git-change-username.html

## 学会阅读约定式提交的破坏性变更标记

## 学会使用时间线来阅读代码负责人
