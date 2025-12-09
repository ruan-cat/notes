# QQ-nt 的增强插件 LiteLoaderQQNT

## 官方链接

- https://liteloaderqqnt.github.io/
- https://github.com/LiteLoaderQQNT

## 安装

- https://github.com/Mzdyl/LiteLoaderQQNT_Install/

![2024-03-02-18-38-08](https://gh-img-store.ruan-cat.com/img/2024-03-02-18-38-08.png)

## 对这些插件生态的理解

插件的插件的插件。

1. QQ-nt 的 LiteLoaderQQNT 插件

   > - https://github.com/LiteLoaderQQNT

2. LiteLoaderQQNT 的 LiteLoaderQQNT-Plugin-Plugin-Store 插件

   > - https://github.com/Night-stars-1/LiteLoaderQQNT-Plugin-Plugin-Store

3. LiteLoaderQQNT-Plugin-Plugin-Store 拓展了与其并列同级的 transitio 插件

   > - https://github.com/Night-stars-1/LiteLoaderQQNT-Plugin-Plugin-Store?tab=readme-ov-file#第三方商店侧载
   > - [github](https://github.com/PRO-2684/transitio/blob/main/store.json)
   > - [github.dev](https://github.dev/PRO-2684/transitio/blob/main/store.json)
   > - [vscode.dev](https://vscode.dev/github/PRO-2684/transitio/blob/main/store.json)

4. transitio 本身的插件仓库在 Transitio-user-css 内定义

   > - https://github.com/PRO-2684/Transitio-user-css

这样的插件组织关系很厉害。

## 预备 pr

目前有自己写简单的全局覆盖 css。

应该这样处理：

1. 创建一个仓库，用于存放自定义的 css
2. pr。填写专用仓库地址。

- https://github.com/PRO-2684/transitio/blob/main/store.json

## transitio 可能的 bug

我的样式不能正常生效。特别是 has 写法的背景阴影样式，毫无作用。点击了不生效。要我点击本地文件监听才生效。

## 不继续跟进

QQ 更新后，很容易导致该工具失效，反复更新意义不大。没必要深度优化 QQ 的使用体验。差不多得了。
