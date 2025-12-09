# vscode-tools 一揽子一站式的 drill 小工具

我想了一下 rm 插件的推送工作流。

之前我提出的一个方案是要求用户和开发者均使用 npm，现在我想的是能不能直接 vscode 插件实现？

现在我有三种可能的方案实现 rm 插件更新

- github raw 远程文件的文件直连
- node 的 npm
- vscode 的插件

我觉得你的那些小工具，都可以用前端的方式做出来，做成一个 vscode 插件。用户可以快速下载。升级等。

大概设计如下

## 整合全部的小工具

钻头有很多[小工具](https://github.com/DrillUp)，他们都是文件管理的。可以做一个 vscode 插件，调用 node 提供的 api，实现对当前 vscode 工作区文件的扫描，管理，文件添加，替换等操作。

该插件暂定命名为 drill-mv-plugins-tools。`dmpt`。

## 扫描当前工作区目录并读取生成灵感

将灵感生成器的功能迁移至 dmpt。让 dmpt 调用 node 接口做相关的文件处理，生成的结果总是临时的显示在 vscode 内。

## 文件定版本升级

调用特定的 github clone 接口，根据 github 仓库提供的 tags 标签组来实现用户手动指定版本。

由 dmpt 提供 UI 界面，dmpt 调用 github 的相关 API 获取数据，用户在 vscode 的侧边栏内单选版本，本实现 git clone 和文件替换功能。
