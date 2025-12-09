# pnpm 在 window 内超出文件夹名称长度限制的 bug

观察一下报错日志

::: details

<<< ./error.log

:::

提取出来的核心报错如下：

```bash
vite-plugin-vue-inspector
Did you mean to import "@babel/plugin-transform-typescript/lib/index.js"?
```

出现此问题的本质是 window 系统内所支持的文件名长度最大限制很小，不够 pnpm 使用。比如这个 [issue](https://github.com/pnpm/pnpm/issues/7355#issuecomment-2068016758) 就已经提到要求我们在 window 系统内做配置。

window 系统的配置，参考资料如下：

- [vite Pre-transform error: Cannot find package pnpm 路径过长导致运行报错](https://blog.csdn.net/qq_25996219/article/details/140328092)
- [解除 Windows 系统中文件名和目录路径的最大长度限制](https://blog.csdn.net/m0_66674794/article/details/140330611)

## 有疑惑

win 家庭版无法配置 win32 文件名长度配置么？
