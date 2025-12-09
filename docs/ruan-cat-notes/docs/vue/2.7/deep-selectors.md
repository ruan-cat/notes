# 深度作用选择器

这里专门指 vue2 的写法。推荐写法如下例子：

```scss
.planning-dialog-root /deep/ .el-tabs {
	.el-tabs__content {
		background-color: red;
	}
}
```

约定本组件 `<planning-dialog>`，其根标签选择器为 `.planning-dialog-root`。

比如说，我需要对 element-ui 的 `<el-tabs>` 组件做一些修改，指定选择器 `.el-tabs__content`。这里推荐先加上本组件的根标签选择器，先标注清楚本组件的作用范围。再对 element-ui 组件做修改。

这样的实践是为了明确清楚修改范围。因为本组件也可能成为别人的子组件。为了让某父组件可以准确的作用该组件的内容。使用本写法实现严格的作用域命名。

- vue2 有效

```scss
.planning-dialog-root /deep/ .el-tabs {
	.el-tabs__content {
		background-color: red;
	}
}
```

- vue2 失效

```scss
.planning-dialog-root ::v-deep .el-tabs {
	.el-tabs__content {
		background-color: red;
	}
}
```

目前在特定的项目内，使用 vue2.7 以及 sass，和较高版本的 vue-loader、 scss-lodors 后，上述的 ::v-deep 写法有效了。
