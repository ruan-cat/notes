# .nvmrc nvm 的配置文件

## 自动生成基于项目的 .nvmrc 文件

- https://zhuanlan.zhihu.com/p/369253314

在对应的 node 项目根目录下面直接运行此命令，即可快速生成该文件。不再需要手动创建。这行命令运用的是 window 命令行写入文件的方式实现的。

```bash
node -v > .nvmrc
```

## 指定定版本的最后一个 LTS 版本

```bash
echo "lts/*" > .nvmrc
```
