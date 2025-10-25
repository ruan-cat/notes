# 生成 degit 命令拼接组件

用 element-plus 实现一个简单的输入栏组件，功能如下：

## 拼接生成特定格式的字符串

字符串的模板为 `$env:NODE_TLS_REJECT_UNAUTHORIZED=0; degit *`

比如用户在输入栏内输入 github 的 url 地址，或者是其他能够被 degit 识别的地址，例如 `https://github.com/1024-lab/smart-admin` 这个地址。

那么应该给我返回 `$env:NODE_TLS_REJECT_UNAUTHORIZED=0; degit https://github.com/1024-lab/smart-admin` 字符串。

## 全局提示用户

使用 element-plus 的 message 组件，实现全局消息提醒，提醒用户生成成功。提示文本模板为：

`degit命令生成成功！命令为***，已经默认复制到你的剪贴板内`

请动态显示出拼接出来的命令。

## 设置剪贴板

生成出来的字符串，请默认填充到用户当前的剪贴板内。

## 按下回车时即可确定输入

用户在按下回车键时，相当于确定输入了。请执行上述的 `全局提示用户` 和 `设置剪贴板` 这两个任务。
