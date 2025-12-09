---
order: 0
---

# git

重要的版本控制软件。和 svn 类似。他们统称为 VCS。

## 入门教程

- https://learngitbranching.js.org/?locale=zh_CN

## 学习待办

- https://www.zhihu.com/question/594294987/answer/3024615944

## 常用的全局配置

```bash
git config --global core.fileMode false
git config --global user.name "ruan-cat"
git config --global user.email "1219043956@qq.com"
git config --global http.sslVerify false
```

## 清空缓存

### way1

https://www.cnblogs.com/Renyi-Fan/p/13785622.html

git rm --cached "文件路径"，不删除物理文件，仅将该文件从缓存中删除；
git rm --f "文件路径"，不仅将该文件从缓存中删除，还会将物理文件删除（不会回收到垃圾桶）；

### way2

```bash
git clean -df
```

### way3

https://juejin.cn/post/7089249145252216862

git rm -r --cached .

## 快速更新远程分支

内容太多了，拆分到一个专门的页面讨论了

- [快速更新远程分支](快速更新远程分支.md)

## 删除远程分支

常用的删除远程分支命令：

```bash
git push origin -d your-branch-name
```

## 删除全部储存的内容

删除当前 git 全部储存的内容 准备重新提交一次。目前不清楚在哪里找到的此方案。

```bash
git rm -r --cached .
```

## 查看 git 配置

- 查看系统配置

```bash
git config --system --list
```

- 查看全局配置

```bash
git config --global --list
```

- 查看本地配置

```bash
git config --local --list
```

## 认证失败

参考资料 https://blog.csdn.net/weixin_44014995/article/details/109900149

```plain
> git pull --tags origin hope
> fatal: unable to access 'https://github.com/ruan-cat/notes.git/': SSL certificate problem: unable to get local issuer certificate
```

## 更改本机全局的默认主分支名称

现在希望本地新建的 git 仓库的默认主分支名称为 main，而不是之前常见的 master。主要是希望 rebase 变基分支时可以少输入一些字母。

用以下的系统级命令查看到要修改的 init.defaultBranch 配置。

```sh
git config --system --list
```

如下图所示，在 system 级下看到本机默认的 init.defaultBranch 配置，这里默认命名为 master 分支

![2023-05-08-09-46-25](https://gh-img-store.ruan-cat.com/img/2023-05-08-09-46-25.png)

使用以下命令修改分支命名。

```sh
git config --global init.defaultBranch main
```

值得注意的是，这里修改的是 global 级全局配置，而不是 system 级的系统配置。

![2023-05-08-10-00-41](https://gh-img-store.ruan-cat.com/img/2023-05-08-10-00-41.png)

### 本地测试

本地初始化 git 仓库，可以看到新创建的 git 仓库，其主分支的默认命名更改为 main 而不是 master。

![2023-05-08-10-05-02](https://gh-img-store.ruan-cat.com/img/2023-05-08-10-05-02.png)

### 参考资料

- [快速设置 Git 默认分支名称 由 master 变为 main](https://juejin.cn/post/6942750082999517221)

## 重新命名远程分支

对远程分支的名称不爽，想改名。基本步骤如下：

```sh
git branch -m oldName newName
git push -d origin oldName
git push -u origin newName
```

上述命令的参考资料：

- [Git ：如何修改远程分支名称](https://blog.csdn.net/Lakers2015/article/details/129180899)

### 具体演示

这里仅仅演示重命名`非默认`的远程分支。如果是为了删除主分支（远程仓库认定的默认分支），则需要其他的步骤来完成删除以及重命名操作。

#### 初始化例子

这里打算重命名 dev 分支为 fuck-dev 分支。暂时不考虑主分支的重命名。

![2023-05-08-11-18-59](https://gh-img-store.ruan-cat.com/img/2023-05-08-11-18-59.png)

#### 重命名本地分支

```sh
git branch -m dev fuck-dev
```

![2023-05-08-11-20-42](https://gh-img-store.ruan-cat.com/img/2023-05-08-11-20-42.png)

#### 删除远程分支

```sh
git push -d origin dev
```

![2023-05-08-11-22-24](https://gh-img-store.ruan-cat.com/img/2023-05-08-11-22-24.png)

#### 推送本地分支并关联远程分支

```sh
git push -u origin fuck-dev
```

![2023-05-08-11-23-42](https://gh-img-store.ruan-cat.com/img/2023-05-08-11-23-42.png)

至此已完成重命名远程分支的需求。

### -u 是什么命令？

本地分支和远程分支关联的命令。

https://blog.csdn.net/Lakers2015/article/details/111318801

### receive.denyDeleteCurrent

删除分支时被拒绝。修改全局配置。

```sh
git config --global receive.denyDeleteCurrent warn
```

https://juejin.cn/post/6981733889664368677

### 重设远程默认分支

https://blog.csdn.net/wujj200884/article/details/84999006

## TODO: git 文件名大小写配置？

## FIXME: git 报错

![2024-02-25-20-38-37](https://gh-img-store.ruan-cat.com/img/2024-02-25-20-38-37.png)

```text
fatal: detected dubious ownership in repository at 'E:/code/rzn/test-2024-0224/test'
'E:/code/rzn/test-2024-0224/test' is owned by:
        'S-1-5-32-544'
but the current user is:
        'S-1-5-21-881890984-3381581715-1393588594-1001'
To add an exception for this directory, call:

        git config --global --add safe.directory E:/code/rzn/test-2024-0224/test
```

我用 vscode 打开一个新创建的 git 项目一点问题都没有。但是用 jetbrains 的 idea 打开就有问题，直接给我报这个错误。

除了按照提示增加安全目录以外，还有什么标本兼治的方式么？比如全局设置 jetbrains 公司的产品不再对 git 仓库做任何安全检查？

## 退出 git bash

- https://blog.csdn.net/weixin_41287260/article/details/89813851

按 Esc 键退出编辑模式，大写英文模式下输入 ZZ ，然后回车。

## clone 项目时，总是要输入用户名和密码

- https://blog.csdn.net/lemonzjk/article/details/135330630

设置 git 保存凭证即可。

```bash
git config --global credential.helper store
```
