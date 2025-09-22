# claude code，AI 编程工具

命令行交互的 AI 编程工具。相比于 cursor，用起来有点古怪。

## 全局安装 claude code

```bash
pnpm i -g @anthropic-ai/claude-code
```

### 校验是否安装成功

```bash
claude -v
```

输出版本号即说明安装成功。

## 思考

看到过一个 B 站视频，讲的是用 claude code 调用 gemini cli，这样可以让 gemini 去完成那些低水准的，简单的，重复性强的，上下文 token 消耗大的任务。让 claude code 专注于任务调度即可。

## cc-statusline

- 仓库： https://github.com/chongdashu/cc-statusline

想实现自定义的状态栏。实时看到自己的 api 开销。

在当前项目内初始化配置文件：

```bash
npx @chongdashu/cc-statusline@latest init
```

预览效果：（暂时无效）

```bash
cc-statusline preview .claude/statusline.sh
```

### 参考资料

- https://jishuzhan.net/article/1965652624688594945
- https://hrefgo.com/blog/claude-code-statusline-complete-guide

## 拓展待办

1. 阅读官方文档、掌握核心概念： https://docs.anthropic.com/zh-CN/home
