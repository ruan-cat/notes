# 文件重构提示词

这里仅仅是把重构文件时用的提示词保存备份。

请深度思考。

请重构 `docs\ruan-cat-notes\docs\bug` 的 md 文件。

1. 请模仿 `docs\ruan-cat-notes\docs\bug\008-axios-proxy-in-node` 的文件组织方式。这里以 `docs\ruan-cat-notes\docs\bug\009-github-workflow-NODE_AUTH_TOKEN.md` 这个文档的重构案例为例子说明。
2. 根据文件名，新建文件夹：你应该新建 `docs\ruan-cat-notes\docs\bug\009-github-workflow-NODE_AUTH_TOKEN` 文件夹。
3. 移动文档文件：文件迁移，将 `docs\ruan-cat-notes\docs\bug\009-github-workflow-NODE_AUTH_TOKEN.md` 文档，迁移并重命名为 `docs\ruan-cat-notes\docs\bug\009-github-workflow-NODE_AUTH_TOKEN\index.md` 文档。文件重命名为 `index.md`。
4. 移动 code 引用文件：同时检查 `docs\ruan-cat-notes\docs\bug\code` 文件夹，如果存在名为 `009` 的文件夹，就将 `docs\ruan-cat-notes\docs\bug\code\009` 文件夹的文件，移动到 `docs\ruan-cat-notes\docs\bug\009-github-workflow-NODE_AUTH_TOKEN` 文件夹内。
5. 更新文件路径引用：检查已经移动到新位置下的 md 文件，即 `docs\ruan-cat-notes\docs\bug\009-github-workflow-NODE_AUTH_TOKEN\index.md` 文档，修改更新代码块的导入语句。比如，将 `<<< ./code/009/error.log` 写法，改成 `<<< ./error.log` 写法。
6. 删除多余的 order 排序配置：检查文档是否存在 order 配置，若存在，就删除。只删除 order 配置即可，其他配置保留。比如在文档顶部看到了其他的配置，诸如 `juejin` 和 `desc` 时，就不要删改这些配置项。
7. 请你按照上述例子，重构，调整全部 `docs\ruan-cat-notes\docs\bug` 文件夹下面的 markdown 文档。
