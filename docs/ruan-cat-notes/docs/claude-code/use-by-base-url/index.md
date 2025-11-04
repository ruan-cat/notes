# 通过配置 baseUrl 的方式来使用 claude code

## 性能基于供应商的 url

经过这段时间的使用，使用 baseUrl 方式的 claude code，其性能主要取决于中转商提供的 url 性能。不同的中转商，提供的性能和额度都各不相同。

## 全局配置 window powershell 的环境变量

以下的方案，都需要在 window 的 powershell 内配置全局的环境变量，使用以下命令设置当前电脑的全局环境变量。

```bash
code $profile
```

将在 `C:\Users\你的用户名\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1` 内新建配置文件，在此处填写各个供应商提供的环境变量即可。

### 环境变量必须设置成 $env: 的形式

如果设置成 `$path:` 形式的环境变量，那么每次启动 powershell 时，都会出现以下报错：

<<< ./error.log

设置成 `$env:` 环境变量就不出错了。[参考资料](https://zhuanlan.zhihu.com/p/677577008)。

## 相关的 vscode 插件

可以通过安装 vscode 插件来实现快速启动 claude code。

- https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code
- https://docs.anthropic.com/en/docs/claude-code/ide-integrations

## 因为重装 git 而导致 powershell 无法启动 claude code

我不知道为什么，重新安装 git 就导致 claude code 无法启动了。出现以下报错：

<<< ./error-No_suitable_shell_found.log

根据以下参考资料：

- https://linux.do/t/topic/726007
- https://note.com/syogaku/n/n2fb778a1c7d9
- 官方教程： https://docs.anthropic.com/zh-CN/docs/claude-code/setup#windows-设置

总结出我需要额外配置面向 powershell 的环境变量。考虑到不想在全局的环境变量内写入太多的变量，增加心智负担，故考虑用 `code $profile` 的方式设置全局的 powershell 环境变量。

多设置的环境变量如下：

```bash
$env:SHELL = "D:\dev-evn\git\bin\bash.exe"
$env:CLAUDE_CODE_GIT_BASH_PATH = "D:\dev-evn\git\bin\bash.exe"
```

手动指定 git bash 的路径即可。

## 参考资料

其他类似思路的参考资料：

- https://www.bilibili.com/video/BV17ZuqzrE7E/
- https://www.xmsumi.com/detail/1190
