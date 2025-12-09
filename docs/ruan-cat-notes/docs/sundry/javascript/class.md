# class 的继承写法

这里列出几种写法。以展示开发时遇到的困难。

## 有问题的，无法有效初始化的写法

```js
class ColConf {
	constructor(name = "默认配置名称") {
		this.name = name;
	}
}
class P {
	constructor(colConfList = []) {
		this.colConfList = colConfList;
		this.addedColConfList = [];
		this.addedItem();
	}
	addedItem() {
		this.addedColConfList = [...this.colConfList, new ColConf("操作栏")];
	}
}
class C extends P {
	constructor(colConfList = [], keyname = "") {
		super(colConfList);
		this.keyname = keyname;
	}
	/** 这里是有问题的：
	 * 要么在运行此函数时 新的属性值keyname不存在，为undefined
	 * 要么传递形参时很麻烦，需要完全复制更多的形参
	 */
	addedItem(keyname = "None Set Keyname In addedItem Func") {
		super.addedItem();
		this.addedColConfList.push(new ColConf(this.keyname));
		// this.addedColConfList.push(new ColConf(keyname));
	}
}
const list = [new ColConf()];
console.log(" ?  ", new C(list, "/myFuckerLink"));
```

## 最有效，最优雅的写法

```js
class ColConf {
	constructor(name = "默认配置名称") {
		this.name = name;
	}
}
class P {
	constructor(colConfList = []) {
		this.colConfList = colConfList;
		this.addedColConfList = [];
	}
	init() {
		this.addedColConfList = [...this.colConfList, new ColConf("操作栏")];
	}
}
class C extends P {
	constructor(colConfList = [], keyname = "") {
		super(colConfList);
		this.keyname = keyname;
	}
	init() {
		super.init();
		this.addedColConfList.push(new ColConf(this.keyname));
	}
}
const list = [new ColConf()];
const obj = new C(list, "/myFuckerLink");
/**
 * 与其他的内容不同的是，这里将初始化的函数迁移到外部，要求主动地完成一次变量的重设与初始化
 * 构造函数被设计成干净整洁写法，不会主动调用其他的从初始化函数
 * 这是目前最合适的写法。只要不让初始化的函数内嵌入构造函数内，实现方式就没有那么拧巴
 */
obj.init();
console.log(" ?  ", obj);
```

## 不得已需要至少执行两次的写法

```js
class ColConf {
	constructor(name = "默认配置名称") {
		this.name = name;
	}
}

class P {
	constructor(colConfList = []) {
		this.initProperty(colConfList);
		this.init();
	}

	initProperty(colConfList) {
		this.colConfList = colConfList;
		this.addedColConfList = [];
	}

	init() {
		this.addedColConfList = [...this.colConfList, new ColConf("操作栏")];
	}
}

class C extends P {
	constructor(colConfList = [], keyname = "") {
		super(colConfList);
		/**
		 * 这种写法的特点类似于rmmv，将属性交由另外的函数构造
		 * 缺点是一部分的函数会执行两次，只有最后的函数，即下面的两个函数
		 * 才能实现有意义的构造与初始化
		 */
		this.initProperty(colConfList, keyname);
		this.init();
	}

	initProperty(colConfList = [], keyname = "") {
		super.initProperty(colConfList);
		this.keyname = keyname;
	}

	init() {
		super.init();
		this.addedColConfList.push(new ColConf(this.keyname));
	}
}
const list = [new ColConf()];
const obj = new C(list, "/myFuckerLink");
console.log(" ?  ", obj);
```
