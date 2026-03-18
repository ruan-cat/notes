# <!-- 已完成 --> 新建本地模式下分页表格组件

新建 `docs\ruan-cat-notes\docs\cloudflare\domain-mail\routing-email-list.vue` 这款使用本地数据的，分页表格组件。

## 使用的本地数据

`docs\ruan-cat-notes\docs\cloudflare\domain-mail\routing-email.ts`

## 涉及到库的技术选型

- element-plus
- pinia
- pinia-plugin-persistedstate

## 组件的功能

1. 提供一个表格组件。且底部自带一个分页栏组件。
2. 对来自本地的 `docs\ruan-cat-notes\docs\cloudflare\domain-mail\routing-email.ts` 数据做前端层面的分页，并展示数据。
3. 表格组件需要实现动态表格列的切换功能。提供一个按钮，点击按钮可以勾选那些表格列字段需要显示出来，那些不需要。
4. 动态表格列的配置数据，需要使用 pinia 和 pinia-plugin-persistedstate 来实现`长期存储`，存储在浏览器内。使用默认的 localstore 存储被勾选默认显示的表格列，便于下一次访问整个文档站点时，仍旧默认记忆上一次勾选的表格列字段。
5. 组件默认显示 10 条数据。
6. 固定表头。
7. 表格实现鼠标移动到表格块后，实现当前行和当前列的背景高亮效果。高亮的颜色是当前 vitepress/element-plus 提供的主题色。
8. 表格每一个表格块，鼠标双击后，可以实现复制粘贴文本到用户的剪贴板内。
9. 实现自定义表头。表头增加满足表格字段的语义化 iconify 图标。并渲染 iconify 图标。
10. 参与筛选表格字段的弹框，其每一个筛选项也都需要增加 iconify 图标。
11. 能够识别到本 vitepress 项目提供的样式上下文。能够跟随 vitepress 主题的变化，而变化组件的前端样式。包括：

- 暗黑模式的同步切换。
- 主题色的同步切换。

## 注意事项

1. 实现表格列切换时，注意确保组件能够恰当的实现渲染。避免出现切换表格列时，组件的表格列出现剧烈的抖动。可以考虑用 doLayout 函数解决。
2. 确保 `docs\ruan-cat-notes\package.json` 这款 vitepress 文档内，能够介入 iconify 的 vue 组件配置，并安装对应的 iconify 图标插件，确保 iconify 能够正常渲染。

## 验证调试方式

1. 用谷歌浏览器 MCP，运行 `docs\ruan-cat-notes\package.json` 的 docs:dev 命令，在 `cloudflare\domain-mail` 路由内，进入到页面并在本地开发模式下联调数据。
2. 允许在 `docs\ruan-cat-notes\docs\cloudflare\domain-mail` 目录内新建一个临时的假数据文件，填充足够多的数据，测试组件的效果。

## 其他参考资料

1. `docs\ruan-cat-notes\docs` 目录内其他在 markdown 文档内使用的 vue 组件。
2. element-plus 的官方文档。
   - https://element-plus.org/zh-CN/component/table
