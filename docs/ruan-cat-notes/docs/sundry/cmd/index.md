# 常用的 cmd 命令

这里的命令主要是在 powershell 内使用。

## 全局配置 window powershell 的环境变量

设置当前电脑的全局环境变量。

::: tip AI cli 场景下高频使用

该命令主要是在使用 claude code 或者是其他 AI cli 工具时，频繁地手动切换模型供应商的时候使用。

:::

```bash
code $profile
```

## set-ExecutionPolicy RemoteSigned

https://blog.csdn.net/qq_31319235/article/details/119725835
在 powershell.exe 内设置命令行的权限。即可在 vscode 内使用各类命令。如 vue cli 的命令。

## tree

树状图输出命令

- https://blog.csdn.net/weixin_43900833/article/details/86565085

常用命令

```bash
tree /f > list.md
```

输出全部的文件和文件夹，并将结果保存输出到`list.md`文件内。

还可以写成：

```bash
tree /f >list.md
```

```sh
tree /F
```

## 写入文件

比如，将 npm 管理的全局依赖，按照 json 格式导出，并写入到指定位置的文件中

```bash
npm ls -g --json=true >D:\common-dev-workspace\test.json
```

## 打开文件

用 start 命令。这里做的是生成文件，然后打开文件。串行任务的命令写法各有不同。

```bash
# cmd 中的版本
npm ls -g --json=true >D:\common-dev-workspace\test.json && start D:\common-dev-workspace\test.json

# PowerShell 中的版本
npm ls -g --json=true >D:\common-dev-workspace\test.json ; start D:\common-dev-workspace\test.json
```

## del

批量删除文件命令

- https://zhuanlan.zhihu.com/p/139746369

```bash
del /S *.png
```
