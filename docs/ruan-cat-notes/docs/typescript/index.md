# typescript

## 网站

[**《tslang》**](https://www.tslang.cn/)
[点此进入对应仓库](https://github.com/zhongsp/TypeScript)

[**《TypeScript 入门教程》**](https://ts.xcatliu.com/)
[点此进入对应仓库](https://github.com/xcatliu/typescript-tutorial)

[**《TypeScript 使用指南手册》**](http://www.patrickzhong.com/TypeScript/)
[点此进入对应仓库](https://github.com/zhongsp/TypeScript)

## 疑惑？

import 语句导入时，会在本地构建一个浅拷贝还是一个深拷贝？

import 导入的模块可以被修改么？

## 编译成 es6 模块格式的 js 文件

- https://blog.csdn.net/weixin_44228042/article/details/110082980

```bash
npx tsc --target es6 --module es6 src\hooks\useEarlyWarningMapData\useEarlyWarningMapData.ts
```

有疑惑

在实际的项目内，位于根目录下的 tsconfig.json 文件没有被识别出来。其内部的配置没有被识别出来。

## 学习待办

### tsc 命令配置

通过 tsc 的文件配置，实现打包编译文件，让指定文件压缩成一个单个的 js 文件，而不是直接生成多份 js 文件。目前并没有找到合适的技术实现这样的配置。

## 项目内的.d.ts 配置

目前的痛点是，自己会经常的设计出一些就较为复杂的配置对象，而这些配置对象本身没有更多的类型提醒，开发效率很低。

希望可以实现自定义的类型配置。实现对某些类复杂参数的自定义类型定义，并且让 vscode 实现识别。
比如说在 vue-cli 内，定义了一个配置类对象：

```js
const formRenderConfDemo = {
	layout: "single",
	form: {
		vModel: "user",
		props: "user",
	},
	elFormItem: {
		props: "user",
		rules: {},
	},
};
class FormRenderConfClass {
	constructor({ layout, form, elFormItem } = formRenderConfDemo) {
		this.layout = layout;
		this.form = form;
		this.elFormItem = elFormItem;
	}
}
```

然后实际使用的情况如下：

```js
const myLocalConf = new FormRenderConfClass({
	/* 具体的业务配置对象，希望此处实现类型校验 */
});
```

如上图，希望在新建`FormRenderConfClass`对象时，对其构造函数的形参实现类型提示。目前不太懂如何编写能够被`vscode`识别的`d.ts`。

### 解决方案

直接换成 typescript 项目，避免为了 javascript 而写 .d.ts 文件。很低效。

## 自己写一个 Pick，返回的类型是你传进去的泛型类型和 null

遇到一个问题，我定义了一个类型，定义了后端返回的数据。这些字段可能取值为 null，我该用什么写法来让这些字段适应取值可能为 null 的情况呢？

- 联合类型
- 自己写一个 Pick，返回的类型是你传进去的泛型类型和 null

## 如何拓展外部第三方的类型声明？

参考资料

- https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation

动态添加的属性声明：

- https://juejin.cn/post/6844903925338865678#heading-17

声明合并（扩展 Vue 声明）：

- https://juejin.cn/post/6844903925338865678#heading-20

扩展 Npm 包类型：

- https://zhuanlan.zhihu.com/p/542379032

typescript 扩展第三方库类型，添加属性成员

- https://blog.csdn.net/palmer_kai/article/details/107687717
