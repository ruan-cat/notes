# 本文档项目通用的杂项提示词

## 01 <!-- 有专门的页面说明如何使用了 --> 调研 antfu 仓库的发包发版方案

github 用户 antfu 是前端开发领域重要的开发者。请你帮我调研他发布的依赖包，维护的 github 项目，帮我研究一下以下几个问题：

1. 他是用怎么样的方案来发布依赖包的？
2. 他是怎么实现依赖包版本升级的？
3. 他是怎么确保更新日志能够写入到 github release 内的？
4. 他是怎么在 github workflow 内配置 github 工作流的？是怎么触发发版的？
5. 是什么配置实现了 node 包的打包，并推送到 npm 的？
6. 他的依赖包在 monorepo 架构的仓库内，版本号是各自独立发布的？还是统一单一的版本号？

请你用以下格式给出报告：

1. 为我编写一个完整全面的报告，说明清楚 antfu 的发包流程。
2. 用 mermaid 图绘制 antfu 的发包流程。
3. 请用严谨的 markdown 格式来编写报告，务必增加清晰的标题项。

## 02 编写 apifox 自定义 mock 接口

请你为我编写一个在 apifox 内能够使用的 mock 脚本。

### 接口功能与参数

目标接口`获取当日的新闻`，get 接口，以 query 形式传参，一定会提供两个必填参数：

- `date` 日期。string 类型。传参为 YYYY-MM-DD 。获取当日的新闻。
- `limit` 新闻数目。number 类型。获取指定数量的新闻数目。

该接口的功能是，根据日期，返回当日指定条数的新闻。比如接口传递 limit=4 和 date=2025-10-10 ，那么该接口就返回 2025-10-10 当天的 5 条新闻。

### 接口返回格式

接口返回的新闻数据格式如下：

```ts
// 新闻类别
export type NewsCategory =
	| "politics" // 政治 - 政策动态、时政新闻
	| "economy" // 经济 - 金融市场、商业资讯
	| "technology" // 科技 - 技术创新、产品发布
	| "sports" // 体育 - 赛事报道、运动资讯
	| "entertainment" // 娱乐 - 影视娱乐、文化活动
	| "health" // 健康 - 医疗健康、养生科普
	| "science" // 科学 - 科研发现、学术成果
	| "world"; // 国际 - 国际新闻、全球动态

// 新闻项
export interface NewsCardItem {
	title: string; // 新闻标题
	summary: string; // 卡片的简短摘要（50-80字）
	imageUrl: string; // 封面图 URL
	publishedAt: string; // 发布时间（ISO 格式）
	category: NewsCategory; // 归属的分类（用于筛选和样式）
	cursor: string; // 游标（分页用，例如 timestamp+id）
}
```

### apifox 自定义 mock 脚本语法文档

请你务必全面阅读我提供的 apifox 自定义 mock 脚本语法文档，一定要阅读清楚脚本语法文档。根据文档的语法要求，为我编写

- https://docs.apifox.com/mock-scripts

### 允许 mock 部分

对于 `NewsCardItem` 类型，里面的字段可以使用 mock 函数来自动生成对应的字段。
