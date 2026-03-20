# .gitattributes

## 文件损坏

全部的 png 文件全部都出错了。打不开。

经过检查，发现情况如下：

- 先用笔记本电脑上传图片文件资源
- 然后用台式机 git 仓库同步
- 发现在台式机内的 git 仓库，图片文件全部损坏

紧接着又发现有这样的现象：

- 在台式机新增图片文件
- 在笔记本内拉取代码
- 发现笔记本内，发现刚才上传的两份图片文件，全部损坏

可以总结出这样的情形：

- A 机器上传图片文件
- B 机器 git 同步
- 在 A 机器上的 git 项目可以正常预览图片文件
- 在 B 机器上的 git 项目图片文件损坏

## 对文件损坏现象的总结

对于二进制文件，警惕行尾配置。默认应该标记为二进制文件。忽略掉行尾配置。

## 参考资料

- https://www.coder.work/article/187908
- https://stackoverflow.com/questions/19411981/images-corrupt-after-git-push
- https://juejin.cn/post/7084885453920272398

## 配置最佳实践

只要是 git 管理的项目，就能直接用以下配置。该配置会持续更新迭代。目前配置的最佳实践：

```text
* text=auto

# Force the following filetypes to have unix eols, so Windows does not break them
*.* text eol=lf

*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.mov binary
*.mp4 binary
*.mp3 binary
*.flv binary
*.fla binary
*.swf binary
*.gz binary
*.zip binary
*.7z binary
*.ttf binary
*.eot binary
*.woff binary
*.pyc binary
*.pdf binary

# 增加办公常用文件的二进制配置
*.xls binary
*.wps binary
*.doc binary

*.docx binary
*.xlsx binary
*.pptx binary
```

## 配置更新策略

现在其实不太敢去更新配置。因为图片资源发生损坏时，不好去统一管控，并保证上线稳定。

## 尝试生成 bash 命令行

TODO: 尝试生成命令行，一次性运行并生成运行结果，但是我不会写。

```bash
echo "* text=auto

# Force the following filetypes to have unix eols, so Windows does not break them
*.* text eol=lf" > .gitattributes_test
```

```bash
echo -e "* text=auto\n\n# Force the following filetypes to have unix eols, so Windows does not break them\n*.* text eol=lf" > .gitattributes_test
```

## 编写 .gitattributes 之后应该及时运行 `git add --renormalize` 来应用更改

详情见[掘金文章](../bug/025-gitattributes-must-use-renormalize/index.md)。
