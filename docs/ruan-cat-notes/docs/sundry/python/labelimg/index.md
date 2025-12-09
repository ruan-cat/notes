# labelimg

一款图像标注工具。用于给图像训练。

## 安装？

- [官方 github](https://github.com/heartexlabs/labelImg/blob/master/readme/README.zh.rst)
- [Anaconda 安装 labelimg](https://www.bilibili.com/video/BV1XL4y1u7Tb/)

### github ？

github 文件？本地编译？本地运行？

- [3.安装 labelImg](https://www.bilibili.com/video/BV14R4y1A7jx/)

## AutoLabelImg ？

https://github.com/wufan-tb/AutoLabelImg/blob/master/readme_CN.md

## 当前进度

考虑用 label-studio 来实现打标了。而不是 labelimg。这个太容易出错，而且没有完善的文档。

## 安装

- [官方 github Windows + Anaconda](https://github.com/heartexlabs/labelImg/blob/master/readme/README.zh.rst#windows--anaconda)

这里的安装步骤如下：

- 直接仓库克隆项目。克隆不下来就 zip 下载主分支内容。
- 用 pycharm 打开项目，专门新建一个 anaconda 环境来存储依赖包。

中文效果如下：

![2023-06-14-10-44-43](https://gh-img-store.ruan-cat.com/img/2023-06-14-10-44-43.png)

## 打开方式

- 用 pycharm 进入项目
- 运行命令

```bash
python labelImg.py
```

## 闪退

- [labelimg 安装过程中遇到的问题及解决方法](https://blog.csdn.net/qq_43251723/article/details/130220192)

## labelimg 常用快捷键

- https://blog.csdn.net/wangmj_hdu/article/details/116992986

Ctrl + u 选择要标注的文件目录；

Ctrl + r 选择标注好的标签存放的目录；

Ctrl + s 保存标注好的标签（自动保存模式下会自动保存）；

Ctrl + d 复制当前标签和矩形框；

Ctrl + Shift + d 删除当前图片；

Space 将当前图像标记为已验证；

w 开始创建矩形框；

d 切换到下一张图；

a 切换到上一张图；

del 删除选中的标注矩形框；

Ctrl++ 放大图片；

Ctrl-- 缩小图片；

↑→↓← 移动选中的矩形框的位置；
