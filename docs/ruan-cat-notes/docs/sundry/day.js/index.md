# 日期库

## typescript 项目内导入

- https://day.js.org/docs/zh-CN/installation/typescript#导入-dayjs-遇到了问题

## 格式化日期的小问题

- https://day.js.org/docs/en/display/format#list-of-all-available-formats
- https://moment.nodejs.cn/docs/#/displaying/format/

```js
moment().format("yyyy-MM");
dayjs().format("YYYY-MM");
```

moment 和 dayjs 的日期格式化是不一样的。moment 和 dayjs 都共用 YYYY 格式。但是 moment 可以识别 yyyy，而 dayjs 不行。这导致了 bug。
