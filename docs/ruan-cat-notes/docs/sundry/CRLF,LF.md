# CRLF,LF 文件的行尾换行

这个东西会影响 svn 和 git 的文件提交。有时候会出现文本相同但是文件不匹配的情况，目前我的项目是 svn 和 git 共同使用的，所以经常会出现类似的提交问题。git 切换分支并修改后，会导致大部分文件出现重复修改的情况，进而导致每次 svn 的提交都会要求提交过多无意义的内容。

经过检查和排查，目前发现引起这一类现象的原因是文件的 CRLF 和 LF 之间的差异。

## git 对 CRLF 差异的配置

- https://blog.csdn.net/qq_36587420/article/details/114380288
- https://docs.github.com/zh/get-started/getting-started-with-git/configuring-git-to-handle-line-endings

目前没有查询到更多相关的配置。猜测很多东西都可以配置 CRLF 和 LF。

## 用 editorconfig 来配置

- https://editorconfig.org/#example-file

在项目根目录下配置.editorconfig 文件。目前暂时不使用，因为配置该例子后，prettier 的格式化似乎受到影响。就会使用双引号而不是期望的单引号。

## 现象记录

目前发现，笔记本电脑和台式电脑对文件的格式差异不同。笔记本是 LF，而台式机是 CRLF。台式机未能够应用本地的 editorconfig 配置文件。

有空需要多观察一下这个细节。

- 目前发现台式机都是 crlf。
- 目前发现笔记本都是 lf。

## vscode 本身的配置

在首选项内搜索 eol 来配置。

## 截止目前的综合笔记

`CRLF` 和 `LF` 应该被统称为 `eol` 配置问题，即 `endOfLine`，行尾。

能够配置该 `eol` 的方式目前有

- eslint
- prettier
- vscode 的 settings.json
- .gitattributes
- .editorconfig

目前设置的暂定策略是：

- 关于编辑器本身的行为规范，用`.editorconfig`去规定。
- `git` 提交时的行尾配置用`.gitattributes`，专门解决 `git` 和 `svn` 文件系统提交时的差异问题。
- `prettier` 及其任意插件都默认使用`.editorconfig`的配置

参考资料：

- https://blog.csdn.net/u010730126/article/details/107968355
