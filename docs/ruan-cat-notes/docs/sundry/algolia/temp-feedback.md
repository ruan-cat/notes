# algolia

<!-- 尝试配置algolia -->

目前我正在使用`@vuepress/plugin-docsearch`来为我的网站提供搜索功能。按照教程要求，我在`algolia`内申请并获取到相应的 `indexName`、`appId` 和 `apiKey`。

在`vuepress2`的`docs/.vuepress/config.ts`配置文件内，我是这样使用这些值的：

```ts
import { defineUserConfig } from "vuepress";
import { docsearchPlugin } from "@vuepress/plugin-docsearch";

export default defineUserConfig({
	plugins: [
		docsearchPlugin({
			// indexName obtained from the mail
			indexName: "ruan-cat",

			// appId obtained from the mail
			appId: "26AGWKLS5F",

			// apiKey obtained from the mail
			apiKey: "56468a67aa27242ac177690073ba0e15",

			// The apiKey is provided from the default crawler configuration, but I'm not sure if it should be used here.
			// apiKey: 'c0121d37470f12e725a3cf2b45dda7e7',
		}),
	],
});
```

在搜索内容时，浏览器控制台报错：

```json
{
	"name": "RetryError",
	"message": "Unreachable hosts - your application id may be incorrect. If the error persists, contact support@algolia.com.",
	"transporterStackTrace": [
		{
			"request": {
				"data": "{\"requests\":[{\"query\":\"drill\",\"indexName\":\"ruan-cat\",\"params\":\"attributesToRetrieve=%5B%22hierarchy.lvl0%22%2C%22hierarchy.lvl1%22%2C%22hierarchy.lvl2%22%2C%22hierarchy.lvl3%22%2C%22hierarchy.lvl4%22%2C%22hierarchy.lvl5%22%2C%22hierarchy.lvl6%22%2C%22content%22%2C%22type%22%2C%22url%22%5D&attributesToSnippet=%5B%22hierarchy.lvl1%3A10%22%2C%22hierarchy.lvl2%3A10%22%2C%22hierarchy.lvl3%3A10%22%2C%22hierarchy.lvl4%3A10%22%2C%22hierarchy.lvl5%3A10%22%2C%22hierarchy.lvl6%3A10%22%2C%22content%3A10%22%5D&snippetEllipsisText=%E2%80%A6&highlightPreTag=%3Cmark%3E&highlightPostTag=%3C%2Fmark%3E&hitsPerPage=20&facetFilters=%5B%22lang%3Azh-CN%22%5D\"}]}",
				"headers": {
					"content-type": "application/x-www-form-urlencoded"
				},
				"method": "POST",
				"url": "https://26AGWKLS5F,-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.8.5)%3B%20Browser%20(lite)%3B%20docsearch%20(3.3.3)%3B%20docsearch-react%20(3.3.3)%3B%20docsearch.js%20(3.3.3)&x-algolia-api-key=56468a67aa27242ac177690073ba0e15&x-algolia-application-id=26AGWKLS5F%2C",
				"connectTimeout": 1,
				"responseTimeout": 2
			},
			"response": {
				"content": "Network request failed",
				"status": 0,
				"isTimedOut": false
			},
			"host": {
				"protocol": "https",
				"url": "26AGWKLS5F,-dsn.algolia.net",
				"accept": 1
			},
			"triesLeft": 3
		},
		{
			"request": {
				"data": "{\"requests\":[{\"query\":\"drill\",\"indexName\":\"ruan-cat\",\"params\":\"attributesToRetrieve=%5B%22hierarchy.lvl0%22%2C%22hierarchy.lvl1%22%2C%22hierarchy.lvl2%22%2C%22hierarchy.lvl3%22%2C%22hierarchy.lvl4%22%2C%22hierarchy.lvl5%22%2C%22hierarchy.lvl6%22%2C%22content%22%2C%22type%22%2C%22url%22%5D&attributesToSnippet=%5B%22hierarchy.lvl1%3A10%22%2C%22hierarchy.lvl2%3A10%22%2C%22hierarchy.lvl3%3A10%22%2C%22hierarchy.lvl4%3A10%22%2C%22hierarchy.lvl5%3A10%22%2C%22hierarchy.lvl6%3A10%22%2C%22content%3A10%22%5D&snippetEllipsisText=%E2%80%A6&highlightPreTag=%3Cmark%3E&highlightPostTag=%3C%2Fmark%3E&hitsPerPage=20&facetFilters=%5B%22lang%3Azh-CN%22%5D\"}]}",
				"headers": {
					"content-type": "application/x-www-form-urlencoded"
				},
				"method": "POST",
				"url": "https://26AGWKLS5F,-1.algolianet.com/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.8.5)%3B%20Browser%20(lite)%3B%20docsearch%20(3.3.3)%3B%20docsearch-react%20(3.3.3)%3B%20docsearch.js%20(3.3.3)&x-algolia-api-key=56468a67aa27242ac177690073ba0e15&x-algolia-application-id=26AGWKLS5F%2C",
				"connectTimeout": 1,
				"responseTimeout": 2
			},
			"response": {
				"content": "Network request failed",
				"status": 0,
				"isTimedOut": false
			},
			"host": {
				"protocol": "https",
				"url": "26AGWKLS5F,-1.algolianet.com",
				"accept": 3
			},
			"triesLeft": 2
		},
		{
			"request": {
				"data": "{\"requests\":[{\"query\":\"drill\",\"indexName\":\"ruan-cat\",\"params\":\"attributesToRetrieve=%5B%22hierarchy.lvl0%22%2C%22hierarchy.lvl1%22%2C%22hierarchy.lvl2%22%2C%22hierarchy.lvl3%22%2C%22hierarchy.lvl4%22%2C%22hierarchy.lvl5%22%2C%22hierarchy.lvl6%22%2C%22content%22%2C%22type%22%2C%22url%22%5D&attributesToSnippet=%5B%22hierarchy.lvl1%3A10%22%2C%22hierarchy.lvl2%3A10%22%2C%22hierarchy.lvl3%3A10%22%2C%22hierarchy.lvl4%3A10%22%2C%22hierarchy.lvl5%3A10%22%2C%22hierarchy.lvl6%3A10%22%2C%22content%3A10%22%5D&snippetEllipsisText=%E2%80%A6&highlightPreTag=%3Cmark%3E&highlightPostTag=%3C%2Fmark%3E&hitsPerPage=20&facetFilters=%5B%22lang%3Azh-CN%22%5D\"}]}",
				"headers": {
					"content-type": "application/x-www-form-urlencoded"
				},
				"method": "POST",
				"url": "https://26AGWKLS5F,-3.algolianet.com/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.8.5)%3B%20Browser%20(lite)%3B%20docsearch%20(3.3.3)%3B%20docsearch-react%20(3.3.3)%3B%20docsearch.js%20(3.3.3)&x-algolia-api-key=56468a67aa27242ac177690073ba0e15&x-algolia-application-id=26AGWKLS5F%2C",
				"connectTimeout": 1,
				"responseTimeout": 2
			},
			"response": {
				"content": "Network request failed",
				"status": 0,
				"isTimedOut": false
			},
			"host": {
				"protocol": "https",
				"url": "26AGWKLS5F,-3.algolianet.com",
				"accept": 3
			},
			"triesLeft": 1
		},
		{
			"request": {
				"data": "{\"requests\":[{\"query\":\"drill\",\"indexName\":\"ruan-cat\",\"params\":\"attributesToRetrieve=%5B%22hierarchy.lvl0%22%2C%22hierarchy.lvl1%22%2C%22hierarchy.lvl2%22%2C%22hierarchy.lvl3%22%2C%22hierarchy.lvl4%22%2C%22hierarchy.lvl5%22%2C%22hierarchy.lvl6%22%2C%22content%22%2C%22type%22%2C%22url%22%5D&attributesToSnippet=%5B%22hierarchy.lvl1%3A10%22%2C%22hierarchy.lvl2%3A10%22%2C%22hierarchy.lvl3%3A10%22%2C%22hierarchy.lvl4%3A10%22%2C%22hierarchy.lvl5%3A10%22%2C%22hierarchy.lvl6%3A10%22%2C%22content%3A10%22%5D&snippetEllipsisText=%E2%80%A6&highlightPreTag=%3Cmark%3E&highlightPostTag=%3C%2Fmark%3E&hitsPerPage=20&facetFilters=%5B%22lang%3Azh-CN%22%5D\"}]}",
				"headers": {
					"content-type": "application/x-www-form-urlencoded"
				},
				"method": "POST",
				"url": "https://26AGWKLS5F,-2.algolianet.com/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.8.5)%3B%20Browser%20(lite)%3B%20docsearch%20(3.3.3)%3B%20docsearch-react%20(3.3.3)%3B%20docsearch.js%20(3.3.3)&x-algolia-api-key=56468a67aa27242ac177690073ba0e15&x-algolia-application-id=26AGWKLS5F%2C",
				"connectTimeout": 1,
				"responseTimeout": 2
			},
			"response": {
				"content": "Network request failed",
				"status": 0,
				"isTimedOut": false
			},
			"host": {
				"protocol": "https",
				"url": "26AGWKLS5F,-2.algolianet.com",
				"accept": 3
			},
			"triesLeft": 0
		}
	]
}
```

报错内容称我的`appId`是错误的。截至目前，我的爬虫是可以每天获取新的数据的，但是实际使用的时候，这个插件在请求网络接口时就报错。

问题主要集中在这一组参数配置：

```json
{
	"indexName": "ruan-cat",
	"appId": "26AGWKLS5F",
	"apiKey": "56468a67aa27242ac177690073ba0e15"
}
```

我现在完全不清楚这一组配置在哪里出错了？由于 `algolia` 的相关网站都是英文的，并没有中文的，我在使用的时候比较困难。你们可以帮我找一下在 `appId` 为 `26AGWKLS5F` 时，相应的 `indexName` 和 `apiKey` 应该是多少么？

## 已作废

目前不需要了。目前文档已经使用客户端搜索，暂时不需要云搜索。
