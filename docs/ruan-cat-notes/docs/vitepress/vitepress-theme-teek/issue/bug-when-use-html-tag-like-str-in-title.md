# 在标题内使用引号包裹的类 html 标签的字符串，会导致开发环境无法看到其他的页面

在 markdown 文档的一级标题内，使用引号包裹的类似 html 标签的字符串，会导致在开发环境内无法看到其他页面。

## 最小复现案例

- github 仓库： https://github.com/ruan-cat/bug-teek-title
- stackblitz 在线演示地址： https://stackblitz.com/~/github.com/ruan-cat/bug-teek-title?file=package.json&view=editor

## 页面结构

1. 某个页面使用了被反引号包裹的 html 标签，即 `<global-ku-root>` 。
2. 其他页面正常编写。

如下图所示：

![2025-10-12-06-54-26](https://gh-img-store.ruan-cat.com/img/2025-10-12-06-54-26.png)

## 在本地环境运行的结果

出现了明显的控制台故障。

本地运行环境清单：

- node： 22.14.0
- 包管理器： pnpm@10.18.2
- 操作系统： win10 专业版

1. 首页运行正常，没有控制台报错。

![2025-10-12-06-56-25](https://gh-img-store.ruan-cat.com/img/2025-10-12-06-56-25.png)

2. 其他页面访问失败。称首页页面的标题有故障，所以导致本页面渲染失败。

![2025-10-12-06-57-11](https://gh-img-store.ruan-cat.com/img/2025-10-12-06-57-11.png)

完整控制台报错如下：

```txt
runtime-core.esm-bundler.js:51 [Vue warn]: Unhandled error during execution of render function
  at <ArticleTitle post= {url: '/', relativePath: '/', frontmatter: {…}, title: '首页 `<global-ku-root>`', date: '2025-10-11 20:52:41', …}capture: "首页"date: "2025-10-11 20:52:41"frontmatter: [[Prototype]]: Objectconstructor: ƒ Object()hasOwnProperty: ƒ hasOwnProperty()isPrototypeOf: ƒ isPrototypeOf()propertyIsEnumerable: ƒ propertyIsEnumerable()toLocaleString: ƒ toLocaleString()toString: ƒ toString()valueOf: ƒ valueOf()__defineGetter__: ƒ __defineGetter__()__defineSetter__: ƒ __defineSetter__()__lookupGetter__: ƒ __lookupGetter__()__lookupSetter__: ƒ __lookupSetter__()__proto__: (...)get __proto__: ƒ __proto__()set __proto__: ƒ __proto__()relativePath: "/"title: "首页 `<global-ku-root>`"url: "/"[[Prototype]]: Object title-tag-props= {position: 'right', size: 'small'}position: "right"size: "small"[[Prototype]]: Object >
  at <ArticleUpdate>
  at <VPDoc key=4 >
  at <VPContent>
  at <Layout class="tk-layout" >
  at <TeekLayout>
  at <TeekConfigProvider>
  at <VitePressApp>
```

## 在 stackblitz 云端环境的运行结果

在云环境内，也出现同样的故障。

stackblitz 云，运行环境清单：

- node： 20.19.1
- 包管理器： pnpm@8.15.6
- 操作系统： linux

云环境的版本号如下：

![2025-10-12-07-05-26](https://gh-img-store.ruan-cat.com/img/2025-10-12-07-05-26.png)

如下图所示，按照以下步骤在云端开发环境运行项目后，在独立的页面内，其控制台也出现相同的错误。

![2025-10-12-07-03-31](https://gh-img-store.ruan-cat.com/img/2025-10-12-07-03-31.png)

## 在 vercel 生产环境部署后的结果

- vercel 生产环境地址： https://bug-teek-title.vercel.app

如下图所示，生产环境能看到页面，但是控制台仍旧有报错。

![2025-10-12-07-11-51](https://gh-img-store.ruan-cat.com/img/2025-10-12-07-11-51.png)

## 是否愿意 pr？

我没看 teek 主题的源码实现，故不清楚怎么 pr 解决。
