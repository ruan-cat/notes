# icon 引入阿里巴巴图标库

## 问题

如何在 vue 项目内引入阿里巴巴图标库？

## 步骤

### 下载

选择图标并下载，下载后的文件夹结构大致是以下形式的

```plain
demo.css
demo_index.html
iconfont.css
iconfont.js
iconfont.json
iconfont.ttf
```

### 引入文件

根据上述的文件结构，我们只需要将`iconfont.ttf`和`iconfont.css`引入至项目即可，其余的均可以直接删除。建议放在项目的`assets`文件夹内。

### 全局样式引入

在`main.js`内引入文件，文件的储存路径可以自己定义。

```js
import "./assets/icons/albb-iconfont-lib/iconfont.css";
```

### 注释掉干扰项

打开`iconfont.css`文件，可以看到我们可以使用图标类名为`icon-chayan`。笔者建议注释掉`font-size: 16px;`字体大小设置，这个设置容易干扰其他的样式。

```css
@font-face {
	font-family: "iconfont";
	src: url("./iconfont.ttf") format("truetype");
}

.iconfont {
	font-family: "iconfont" !important;
	/* font-size: 16px; */
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

.icon-chayan:before {
	content: "\e98c";
}
```

### 使用

在组件内直接使用类名即可。其中，使用前还需要使用字体族的类名。`iconfont.css`文件提供的字体族类名为`iconfont`，未来可以自行更改。

```html
<el-button type="primary" size="mini" icon="iconfont icon-chayan" @click="seeClick(scope)"> 查看信息 </el-button>
```

## 参考资料

- [阿里巴巴图标库](https://www.iconfont.cn/)
- [CSDN.Vue、Element-ui 项目中如何使用 Iconfont(阿里图标库)](https://blog.csdn.net/qq_32113629/article/details/79740949)
