# .gitignore git 的文件忽略配置

- https://deepinout.com/git/git-questions/823_git_gitignore_ignore_file_starting_with.html

遍历查看常见的 git 忽略配置。看看之前维护项目内，有没有待整理的配置技巧。

不需要，按需配置即可，无需考虑集中统一配置。

## 忽略掉常用 office 办公文件生成的缓存文件

```bash
# 忽略掉常用office办公文件生成的缓存文件
~$*
```

## 根据文件名特点匹配文件

匹配文件名称开头为 tsconfig 的文件、且后缀名为.json 的文件。

![2024-05-10-19-10-34](https://gh-img-store.ruan-cat.com/img/2024-05-10-19-10-34.png)

参考资料

- https://blog.csdn.net/w8y56f/article/details/103263924
- https://www.freecodecamp.org/chinese/news/gitignore-file-how-to-ignore-files-and-folders-in-git/
