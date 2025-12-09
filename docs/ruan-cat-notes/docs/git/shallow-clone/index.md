<script setup>
import MakeGitCloneCmd from "./make-git-clone-cmd.vue";
</script>

# 浅克隆技术

稀疏检出的方式，操作起来还是有点难受的。直接用浅克隆也行，至少查看的历史记录少很多了。

## 参考资料

::: details 实践教程

- https://github.blog/open-source/git/get-up-to-speed-with-partial-clone-and-shallow-clone/
- https://git-scm.com/docs/git-clone#Documentation/git-clone.txt-code--depthcodeemltdepthgtem

:::

## 具体案例

克隆一个 monorepo 仓库，深度为 1，克隆到目录 gh.vercel.examples 。

```bash
git clone --depth=1 https://github.com/vercel/examples gh.vercel.examples
```

::: details 仅 1 条历史记录

拿到了全部的文件，但是只有 1 条历史记录。

该情况很适合去阅读别人的 monorepo，特别是那种 demo 集合。

![2024-08-14-11-39-44](https://gh-img-store.ruan-cat.com/img/2024-08-14-11-39-44.png)

:::

## 动态生成 git 浅克隆命令

以下小工具会帮助你根据 github 链接生成便于克隆的：

<ClientOnly>
	<MakeGitCloneCmd />
</ClientOnly>
