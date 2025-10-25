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

### 允许 mock 部分

对于 `NewsCardItem` 类型，里面的字段可以使用 mock 函数来自动生成对应的字段。

### apifox 自定义 mock 脚本语法文档

请你务必全面阅读一下我提供的 apifox 自定义 mock 脚本语法文档，一定要阅读清楚脚本语法文档。根据文档的语法要求，为我编写满足要求的 mock 脚本。

# Mock 脚本

有时，你需要根据请求参数返回对应的 Mock 响应，或者维护不同字段之间的逻辑关系。

例如：

- 当请求用户 ID 为 1001 的信息时，返回的数据应包含该 ID，且值为 1001。
- 当 Mock 数据包含开始时间和结束时间等相关字段时，结束时间应晚于开始时间。

这些逻辑关系可以通过 Mock 脚本来实现。

## 工作原理

Mock 脚本的基本实现原理如下：

1. 使用智能 Mock 或其他 Mock 功能生成初始响应数据，这些数据可能还未满足所有约束条件。
2. 使用 Mock 脚本访问 `$$.mockResponse` 对象或 `$$.mockRequest` 对象。
3. 从这两个对象中获取数据，并编写 JavaScript 实现所需的逻辑。
4. 使用 `$$.mockResponse.setBody` 方法，将修改后的数据写入响应内容。
5. Mock 引擎返回最终的响应数据。

## 使用 Mock 脚本

## 脚本参考

### Mock 脚本示例

```js
// 从智能 Mock 获取 Mock 数据
var responseJson = $$.mockResponse.json();

// 修改 responseJson 中的分页数据
// 1. 把 page 设置为请求参数中的 page
responseJson.page = $$.mockRequest.getParam("page");

// 2. 把 total 设置为 120
responseJson.total = 120;

// 3. 把修改后的 json 写入 $$.mockResponse
$$.mockResponse.setBody(responseJson);
```

这个脚本做了这些事：

1. 先获取一个初始的 Mock 响应（自动生成的）
2. 然后修改这个响应：
   - 把 `page` 值设置为请求中的值
   - 设置一个固定的 `total` 值
3. 最后用这些修改更新 Mock 响应

:::warning[]
Mock 自定义脚本，不能用于前置/后置脚本中。
:::

### `$$.mockRequest` 对象

`$$.mockRequest` 对象代表 Mock 脚本中的传入请求，类似于 Postman 的 [`pm.request`](https://docs.apifox.com/postman-script-api#pmrequest) 对象，但它提供了一些额外功能。

1. **`getParam(key: string)` 方法**：获取请求中的参数，无论参数位于 _（Query、Body 等）_ 哪个位置。

2. **访问 Cookies**：允许你获取请求中的 cookie 值。

脚本参考：

```javascript
// 获取请求参数
var userId = $$.mockRequest.getParam("userId");

// 获取请求头
var headerUserId = $$.mockRequest.headers.get("userId");

// 获取请求 cookies
var cookieUserId = $$.mockRequest.cookies.get("userId");

// 获取请求体中的 JSON 数据
var requestJsonData = $$.mockRequest.body.toJSON();

// 获取请求体中的字符串数据
var requestStringData = $$.mockRequest.body.toString();

// 获取请求体中的 form-data
var formDataUserId = $$.mockRequest.formdata.get("userId");

// 获取请求体中的 urlencoded 数据
var urlencodedUserId = $$.mockRequest.urlencoded.get("userId");
```

### $$.mockResponse 对象

`$$.mockResponse` 是 Apifox 提供的一个 Mock 响应对象，用于动态控制接口返回的数据。它不仅可以获取响应信息，还可以针对每个字段灵活设置想要的返回数据。

它类似于 Postman 的 [`pm.response`](https://docs.apifox.com/postman-script-api#pmresponse) 对象，但提供了更多控制 Mock 响应的方法。

- **`setBody(body: any)` 方法**：设置响应体。
- **`setCode(code: number)` 方法**：设置响应的 HTTP 状态码。
- **`setDelay(duration: number)` 方法**：为 Mock 响应添加延迟，模拟网络延迟。

脚本参考：

```javascript
// 获取系统自动生成的 JSON 格式响应数据
var responseJsonData = $$.mockResponse.json();

// 设置接口返回 JSON 格式 Body
$$.mockResponse.setBody({ id: "1", name: "Apple" });

// 设置接口返回 string 格式 Body
$$.mockResponse.setBody("Hello World!");

// 设置接口返回的 HTTP 状态码
$$.mockResponse.setCode(200);

// 设置 Mock 响应延时，单位为毫秒
$$.mockResponse.setDelay(3000);

// 获取 HTTP 状态码
var statusCode = $$.mockResponse.code;

// 获取 HTTP header
var myHeader = $$.mockResponse.headers.get("X-My-Header");

// 删除当前请求里 key 为 X-My-Header 的 header
$$.mockResponse.headers.remove("X-My-Header");

// 给当前请求添加一个 key 为 X-My-Header 的 header。
$$.mockResponse.headers.add({ key: "X-My-Header", value: "hello" });

// upsert key 为 X-My-Header 的 header（如不存在则新增，如已存在则修改）。
$$.mockResponse.headers.upsert({ key: "X-My-Header", value: "hello" });
```

### 其它示例

模拟分页：

```js
var MockJs = require("mockjs");

// 总数据
var total = 120;

// 当前页（从请求参数中获取）
// var pageNumber = $$.mockRequest.getParam('pageNumber');
var pageNumber = 1;

// 页容量（从请求参数中获取）
// var pageSize = $$.mockRequest.getParam('pageSize');
var pageSize = 10;

// 设置分页数据
function pageList(pageNumber, pageSize, total) {
	const list = [];
	// 计算起始索引
	const startIndex = (pageNumber - 1) * pageSize;

	for (let i = startIndex; i < startIndex + pageSize && i < total; i++) {
		const id = i + 1;
		// 生成姓名
		const name = MockJs.mock("@cname");
		// 引用姓名作为图片名
		const photoUrls = MockJs.mock(`@image('200x100', @color, ${name})`);
		list.push({
			id,
			name,
			photoUrls,
			status: MockJs.Random.boolean(),
		});
	}

	return {
		code: 0,
		message: "ok",
		data: {
			list,
			pageNumber,
			pageSize: list.length,
			total,
		},
	};
}

// 返回分页数据
$$.mockResponse.setBody(pageList(pageNumber, pageSize, total));
```

更多示例参考：

```js
var MockJs = require("mockjs");

// 获取“智能 Mock”自动生成的 json
var responseJson = $$.mockResponse.json();

// 根据请求参数（包括 query、body、path）修改响应值
if ($$.mockRequest.getParam("id") === "123") {
	responseJson.data = null;
	responseJson.code = 400104;
	responseJson.errorMessage = "数据不存在";
	$$.mockResponse.setBody(responseJson);
	$$.mockResponse.setCode(404);
}

// 根据请求的 header 修改响应值
if (!$$.mockRequest.headers.get("token")) {
	responseJson.data = null;
	responseJson.code = 400103;
	responseJson.errorMessage = "没有权限";
	$$.mockResponse.setBody(responseJson);
	$$.mockResponse.setCode(403);
}

// 根据请求的 cookie 修改响应值
if ($$.mockRequest.cookies.get("projectId") === "123") {
	var idList = [1, 2, 3, 4, 5, 6, 7, 8];
	$$.mockResponse.setBody({
		code: 0,
		data: idList.map(function (id) {
			return {
				id: id,
				name: MockJs.mock("@cname"),
				email: MockJs.mock("@email"),
				city: MockJs.mock("@city"),
			};
		}),
	});
}

// 设置返回延迟
$$.mockResponse.setDelay(500);

// 添加 header
$$.mockResponse.headers.add({
	key: "X-Token",
	value: "<token>",
});

// 添加或修改 header
$$.mockResponse.headers.upsert({
	key: "X-Token",
	value: "<token>",
});
```
