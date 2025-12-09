# jetbrains 产品的设置、缓存、插件和日志等内容的目录存储

jetbrains 公司的产品，更多东西都存储在 C 盘。需要变更存储位置。

## 参考资料

核心文章。称在 2020.1 版本之后，jetbrains 公司的产品都开始变更了文件存储路径：

- https://intellij-support.jetbrains.com/hc/en-us/articles/206544519-Directories-used-by-the-IDE-to-store-settings-caches-plugins-and-logs

以 webstorm 为例子，具体做法如下

- https://www.jetbrains.com/help/webstorm/directories-used-by-the-ide-to-store-settings-caches-plugins-and-logs.html#change-ide-dirs

## webstorm

修改文件 idea.properties

```txt
idea.config.path=D:\store\jetbrains\WebStorm\idea.config.path
idea.system.path=D:\store\jetbrains\WebStorm\idea.system.path
idea.plugins.path=D:\store\jetbrains\WebStorm\idea.plugins.path
idea.log.path=D:\store\jetbrains\WebStorm\idea.log.path
```

### 原来的存储位置

- idea.config.path
  C:\Users\ruanzhongnan\AppData\Roaming\JetBrains\WebStorm2023.1

- idea.system.path
  C:\Users\ruanzhongnan\AppData\Local\JetBrains\WebStorm2023.1

- idea.plugins.path
  C:\Users\ruanzhongnan\AppData\Roaming\JetBrains\WebStorm2023.1\plugins

- idea.log.path
  C:\Users\ruanzhongnan\AppData\Local\JetBrains\WebStorm2023.1\log

### 执行步骤

1. 修改文件
2. idea.log.path
3. idea.plugins.path
4. idea.system.path （失败 卡死）
5. idea.config.path
6. 重启 webstorm 并检查插件是否生效？

### 结果

效果不好，webstorm 没有重新识别出插件。可以说整个 jetbrains 产品都烂掉了。

应该全部重装一次 jetbrains 的全部产品。然后手动的移除掉 C 盘的数据。

再重头开始，看看文件存储方案。

1. 删掉 D:\store\jetbrains\WebStorm 内全部手动新建的东西
2. 手动移除 C 盘关于 jetbrains 的全部配置。
3. 阅读一些文章。
4. 重新安装。
