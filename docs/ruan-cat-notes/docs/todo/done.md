# 已完成的学习任务

## 让 github action + vercel 实现有意义的 pnpm 单仓部署

目前是不能实现有意义的单仓部署的。因为 vercel 工作流要求用指定工作路径实现单仓划分。这个很不合理。

已完成。不知道什么时候完成的，已经完成很久了。

## screen to gif

一款录制工具。需要检查。看看和 LICEcap 之间的差异？

不检查了。现在的 gif 录制用的是 [PixPin](https://pixpin.cn/) 。

## 全面替换这个过时的 cdn 代理商

- https://cdn.jsdelivr.net/gh/ruan-cat/img-store/img
- [参考资料](../sundry/jsdelivr/index.md)

已完成替换，换成：

- https://gh-img-store.ruan-cat.com/img

## 给 awesome-yami 写一个 pr

1. 搞清楚脚本的工作逻辑，问 AI 搞清楚对方的打包逻辑在做什么。
2. 编撰好具体的 issue 缘由，表明代码有什么问题，我想怎么优化处理。
3. 在自己已经 fork 的 repo 内，开始编写优化代码。
4. 提交 pr。
5. 编写一个掘金文章，讲述自己的思考。以及对 tsx 的应用。以文章的方式多讲自己的思考和实践步骤。
6. 写在简历内，便于求职的时候有话术可以谈。

### 劝说注意点

1. 降低复杂度。
2. 核心业务重构，业务安全。
3. 没有引入新的问题。

### 已完成

- [pr](https://github.com/Open-Yami-Community/awesome-yami/pull/3)
- [掘金文章](https://juejin.cn/post/7546565160363507739)

## 制作便于查询 stars 的网站

1. https://github.com/ruan-cat/stars-list 拿到数据，制作网站。
2. 搞清楚 github pages 的工作流，打包然后直接走工作流，先部署到 github pages 内。

### 已完成

- https://ruan-cat.github.io/stars-list

## 本站首页改成允许增加 SiteInfo 的页面

<!-- <SiteInfo
  v-for="item in $frontmatter.projects"
  :key="item.link"
  v-bind="item"
/> -->

寻找新的文件写入算法，根据标识符，写入文件。看看 automd 有没有特定的标识符，可以实现自主导入特定文本段的功能。

或者其他按照标记符导入文本段的 node 库。

预期导入 domain 包的信息。

同时需要拓展 domain 包，让该依赖包有能力自主输出项目信息和描述。

### 已放弃

本站不作为本人的项目集合展示平台。不展示作品了。

有另外的域名专门展示可以访问的作品集。[点此访问](https://dm.ruan-cat.com/)。

## Task Master

据说是一个 mcp，能完成 AI 的任务调度。但是看了官网文档，发现这个包既可以作为 mcp 工具，又可以作为 cli 命令行工具。

- https://github.com/eyaltoledano/claude-task-master
- https://docs.task-master.dev/getting-started/quick-start/quick-start

### 已放弃

注意到官网里面说，需要供应商提供 key 才行。现在（2025-7-29）我没办法去获得有意义的 key，这个就不做了。

## 配置 deepwiki 的 badge 实现每周自动重新索引 AI 阅读报告

- https://deepwiki.com/badge-maker

### 已完成

## 制作简单的 cli 命令行工具

用的 node 工具越来越多了，写的 node 批处理脚本也变多了，现在期望做一个全局的命令行工具，实现批处理文件。

### 技术选型 rollup

因为看到的第一个教程用的是 rollup，所以先用了 rollup。

### 参考资料

- https://www.cnblogs.com/JasonLong/p/14075724.html

### 关于 rollup 的一些文章

- https://segmentfault.com/a/1190000010628352
- https://segmentfault.com/a/1190000012515648
- https://jiaozitang.github.io/blog/2022/09/19/rollup
- https://jonny-wei.github.io/blog/devops/vite/rollup.html

### 已完成

时过境迁。现在用 AI 工具可以轻松的实现开发 cli 命令行工具了。

## 安装基于 Python 的 docx 文档阅读工具

- https://github.com/GongRzhe/Office-Word-MCP-Server
- docx-mcp

### 已完成
