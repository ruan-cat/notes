# node-sass

这里专门记录 node-sass 疑难杂症。

## 用 dart-sass 去替换 node-sass

不应该再使用落后的 node-sass，现在有方案来实现 node-sass 的替换了。相关文档看其他内容，不再本页说明。

## win32-x64-72_binding.node 文件的下载错误问题

- https://blog.csdn.net/mmm333zzz/article/details/103251155
- https://blog.csdn.net/y_k_y/article/details/86535268
- https://blog.csdn.net/sinat_36227086/article/details/107412317
- https://github.com/pnp/sp-dev-fx-webparts/issues/501

### 本地下载

去 node-sass 的发行版内，下载安装 win32-x64-72_binding.node 文件，手动下载到本地。一般就下载到本地的 node 仓库内。

### 配制命令

模仿这个命令做配置

```bash
npm i node-sass@3.13.1 --sass_binary_path=C:\Users\<username>\Downloads\win32-x64-57_binding.node
```

## 已废弃

这个库几乎不用了。现在直接用 sass 就行了。在 vite 项目内使用 sass 很容易，不需要在这个库上面纠结了。
