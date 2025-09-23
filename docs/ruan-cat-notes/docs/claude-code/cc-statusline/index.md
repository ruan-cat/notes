# cc-statusline ，设置 statusline 状态栏

想实现自定义的状态栏。实时看到自己的 api 开销。

- 仓库： https://github.com/chongdashu/cc-statusline

## 在项目内设置

在当前项目内初始化配置文件：

```bash
npx @chongdashu/cc-statusline@latest init
```

预览效果：（暂时无效）

```bash
cc-statusline preview .claude/statusline.sh
```

## 忽略日志文件

在 .gitignore 内设置忽略日志文件。

```bash
# 忽略 claude 的 statusline 日志文件
.claude/statusline.log
```

## 参考资料

- https://jishuzhan.net/article/1965652624688594945
- https://hrefgo.com/blog/claude-code-statusline-complete-guide
