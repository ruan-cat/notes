# vue-cli 内使用 babel

## 困境

目前我希望这样使用 babel：我可以通过升级指定依赖包的方式，直接获取到最新版的 JavaScript 语法。包括自动转换成 ES5。目前我想使用指定语法时，需要像下面这样使用：

- 手动安装指定依赖包

![image-20221009182127742](https://gh-img-store.ruan-cat.com/img/image-20221009182127742.png)

- 在 vue-cli 指定推荐的 babel.config.js 内，指定额外插件

![image-20221009182143432](https://gh-img-store.ruan-cat.com/img/image-20221009182143432.png)

## 暂定的解决方案

目前理解不是很充分，给出以下方式来说明：

- 安装依赖
  开发依赖
  - https://www.npmjs.com/package/@vue/cli-plugin-babel
  - https://www.npmjs.com/package/@vue/babel-preset-app

  生产依赖
  - https://www.npmjs.com/package/core-js

- babel.config.js 配置
  ```js
  module.exports = {
  	presets: [
  		// https://github.com/vuejs/vue-cli/tree/master/packages/@vue/babel-preset-app
  		"@vue/cli-plugin-babel/preset",
  	],
  };
  ```

完成。接下来就可以直接在 vue 组件内使用高版本的 js 了，包括可选链运算符、空值合并运算符等。

## 以过时

在 vite + vue3 的开发中，几乎不再接触 babel 了。
