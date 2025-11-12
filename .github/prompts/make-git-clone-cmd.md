<!--
	一次性提示词
 -->

# 生成 git clone 命令拼接组件

用 element-plus 实现一个简单的输入栏组件，功能如下：

## 1. 生成特定格式的字符串

字符串的模板为 `git clone --depth=1 https://github.com/{user}/{repo} {repo}__{user}`

比如用户在输入栏内输入 github 的 url 地址，或者是其他能够被 git clone 识别的地址，例如 `https://github.com/1024-lab/smart-admin` 这个地址。

那么应该给我返回 `git clone --depth=1 https://github.com/1024-lab/smart-admin smart-admin__1024-lab` 字符串。

### 1.1 参数说明

1. user ： 即 github 发布者。
2. repo ： 即 github 仓库名称。
3. `{repo}__{user}` ： 即 git clone 克隆后存放的目录文件夹，该文件夹的命名风格为 `{repo}__{user}` ，中间是两个下划线。

## 2. 全局提示用户

使用 element-plus 的 message 组件，实现全局消息提醒，提醒用户生成成功。提示文本模板为：

`git浅克隆命令生成成功！命令为***，已经默认复制到你的剪贴板内`

请动态显示出拼接出来的命令。

## 3. 设置剪贴板

生成出来的字符串，请默认填充到用户当前的剪贴板内。

## 4. 按下回车时即可确定输入

用户在按下回车键时，相当于确定输入了。请执行上述的 `全局提示用户` 和 `设置剪贴板` 这两个任务。

## 5. 可参考的现成组件

1. 请你参考 `docs\ruan-cat-notes\docs\git\git-like\degit\dynamic-splicing-degit-cmd.vue` 组件的实现方式。
2. 在 `docs\ruan-cat-notes\docs\git\shallow-clone` 目录内编写名为 `make-git-clone-cmd.vue` 组件。
