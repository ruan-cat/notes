# 更改 git 用户名

我们需要根据不同的项目场景，设置 git 的用户名。

## 根据项目设置用户名

比如在某个项目内，我需要设置用户名为别的值，比如 `f1-阮喵喵`，我们可以这样做：

```bash
git config --local user.name f1-阮喵喵
```

- 设置前：
  > ![2024-05-12-22-47-15](https://gh-img-store.ruan-cat.com/img/2024-05-12-22-47-15.png)
- 设置后：
  > ![2024-05-12-22-47-33](https://gh-img-store.ruan-cat.com/img/2024-05-12-22-47-33.png)
- 全局配置不受影响：
  > ![2024-05-12-22-48-01](https://gh-img-store.ruan-cat.com/img/2024-05-12-22-48-01.png)
- 本地配置受到影响：
  > ![2024-05-12-22-48-21](https://gh-img-store.ruan-cat.com/img/2024-05-12-22-48-21.png)
- 其他项目不受影响：
  > ![2024-05-12-22-48-57](https://gh-img-store.ruan-cat.com/img/2024-05-12-22-48-57.png)

## 设置本机的用户名

```bash
git config --global user.name ruan-cat
```

## 不推荐使用 git graph 插件来修改用户名了

[git graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph) 插件修改的用户名，是**本机的全体用户名**，而不是**当前仓库的用户名**。二者的作用域范围是不一样的。

这导致我另一个项目的提交记录，其用户名都是不对的。受到污染的。

::: details 用户名出现明显的对不上

![2025-05-23-01-49-29](https://s2.loli.net/2025/05/23/aFViHwrt8ZJ2bAu.png)

:::

我们应该使用具体的命令来实现当前 git 项目改名。
