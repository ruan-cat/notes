---
juejin: TODO
desc: 对 bumpp+changelogithub 和 changelogen 这两款发版方案的实践探索与对比。
---

# 对 changelogen 和 changelogithub 使用的思考

> **摘要**：
>
> 对 bumpp+changelogithub 和 changelogen 这两款发版方案的实践探索与对比。

我试着使用这两款工具，实现`版本升级`、`更新日志生成`、和`依赖包发布`。不过用起来有点卡手，对我来说仅仅只使用部分的功能。

我打算在一个普通的管理后台项目内，使用这些工具，实现`版本升级`和`日志生成`。不考虑依赖包发布的事情，因为不可能发布一个管理后台到 npm 镜像内。

## 试着直接使用工作流的 changelogithub 和 bumpp 工具实现上述要求

在 node 项目安装 [bumpp](https://github.com/antfu-collective/bumpp) ，这是一个用来实现依赖包版本号升级的库，用于**手动升级**项目内根包的版本号。

在 package.json 内编写命令：

```json
{
	"release:bumpp": "bumpp"
}
```

## bumpp 的默认行为不适合同步上传本地修改的 `CHANGELOG.md` 文件

bumpp 是一个很单纯的，对版本号做升级的工具。阅读文档，其默认开启了一下三款参数：

1. `--commit` 默认生成 git commit 提交信息。
2. `--tag` 默认生成 git tag 版本。
3. `--push` 默认同时推送 tag 和 commit 信息。

这些默认行为不好去拆分处理，彼此相互耦合，形成了一套固定的，**仅仅对外更新 package.json 版本号和推送 git tag** 的工作流程。

如果我想拆分掉其中的内容，重新有机组合自己的工作流程，就很**坐牢**。

### 试着在本次 git commit 生成的时候，不默认提交到本地仓库

这事实上做不到，只要你写配置，就一定会生成 git commit，并且默认推送到本地 git 仓库。而且你的 git commit 仅仅只有一个文件修改和一个 tag 提交，你不能添加额外的东西。

比如说我想在更新版本号后，同时更新 `CHANGELOG.md` 文件，然后再提交。让一次 git commit 同时包含三个内容：

- 被更新的 `CHANGELOG.md` 文件。
- 被更新的根目录 `package.json` 文件。
- 新增的 git tag 标签。

这是做不到的，bumpp 工具没办法让你多上传一个被更改的本地文件。

基于 bumpp 工具的版本升级逻辑，就不允许，也不考虑你在本地写入、更新、并推送`CHANGELOG.md` 文件到 git 仓库。你的每次 git commit 只能包含以下两个内容：

- 被更新的根目录 `package.json` 文件。
- 新增的 git tag 标签。

这种逻辑你必须接受，否则你就别用 bumpp 来升级版本号。这让我非常难受，因为我之前习惯用 changset 来更新版本号，并且每次提交的时候，都是可以一次性提交：

1. 被更新的 `CHANGELOG.md` 文件。
2. 被更新的根目录 `package.json` 文件。
3. 新增的 git tag 标签。

这些都可以自由掌控，而 bumpp 发版工具卡死了，限定死了。不允许你有多余的日志更新与上传行为。

### 试着在 `bump.config.ts` 内不提供 `--tag` 参数

这事实上是不可理喻的，反而让自己坐牢。不提供 tag 参数，bumpp 甚至没办法给 package.json 更新有意义的版本号，直接留空，无法写入。

### 试着在 `bump.config.ts` 内不提供 `--push` 参数

这反而自己坐牢。不提供 `--push` 参数，虽然 package.json 的修改没有被默认推送到本地 git 仓库，可是 tag 标签却没办法推送，要自己手动不全 git 的推送参数才行。

```bash
git push --follow-tags
```

你要自己找机会，确保生成的 tag 被推送云端仓库，才能不会漏东西。这反而加重了心智负担。

### 结论： bumpp 就不给你机会生成什么日志文件

bumpp 本身的默认行为就不适合你在任何渠道内同时上传本地的 `CHANGELOG.md` 文件、package.json 的版本号和 git tag 标签。

## bumpp 事实上和 changelogithub 高度耦合的

我上面折腾那么久，不就是为了实现在本地生成 `CHANGELOG.md` 文件并且一同上传么？我就是喜欢 changeset 这种提交方式啊。

所以更新日志的生成能力，只能仰赖其他的工具。经过调研，bumpp 经常是用 [changelogithub](https://github.com/antfu/changelogithub) 来生成更新日志的。

但是很不巧的是，changelogithub 本身就仅仅只考虑生成最好的 github release 更新日志，不考虑生成本地的 `CHANGELOG.md` 更新日志。

### 正常使用 changelogithub 的工作流

一般来说，changelogithub 是在 github workflow 工作流配置文件内写的，而且往往是通过 git tag 来触发工作流的。

```yaml
# .github\workflows\release.yaml
name: Release

on:
  push:
    tags:
      - "v*"

permissions: write-all

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: 设置javascript环境
        uses: sxzz/workflows/setup-js@v1
        with:
          fetch-all: false
          package-manager: pnpm
          auto-install: true

			- name: 用 changelogithub 生成 github release 发行版日志
        run: pnpm dlx changelogithub
        continue-on-error: true
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

在工作流内写起来很简单，很优雅。但是只负责，只考虑在 github release 内发布更新日志。

### 尝试在 github workflow 内让 changelogithub 生成日志文件

实在不行我试着让 changelogithub 在云端工作流内，也写入 `CHANGELOG.md` 更新日志，再实现提交。

1. 在 github workflow 内额外增加一个步骤 `pnpm dlx changelogithub --output "CHANGELOG.md"` 。在云端内写入文件。
2. 在云端的 git 内设置用户名、邮箱。
3. 确定云端 git 的分支名称。
4. 推送到 origin 远程仓库。
5. 本机仓库再 git fetch 拉取更新。

这套流程很麻烦，要实现云端生成文件、修改文件、生成 git commit 提交并拉取更新，太麻烦了。我都套模板了，至于搞那么复杂么？

这套流程不好走通，而且 changelogithub 本身提供的 `--output` 参数在仓库文档内是不写清楚的，要你自己亲自看源码才知道有这个参数的。可想而知这个方案太离谱，太弯弯绕绕了。太卡手了，不能去落实下去。

### 尝试在本地仓库用 changelogithub 生成日志文件，然后额外提交一个 git commit 专门说明更新了日志文件

这肯定很不优雅嘛。哪有一个 git commit 提交专门为了说明一个版本更新的日志的。那肯定会问，为什么更新日志不能和更新版本后的 package.json 一起发布呢？

这问题又绕回来了，bumpp 没办法让我做到这一点。这就意味着，只要我使用这一套 `bumpp` + `changelogithub` 的发版工作流，就算能生成本地日志文件，git commit 提交也被迫变乱。

### changelogithub 本地生成的 `CHANGELOG.md` 更新日志太难看

在本地运行命令：

```bash
pnpm dlx changelogithub --output "CHANGELOG.md"
```

控制台内看起来很好看：

![2025-11-13-22-47-30](https://gh-img-store.ruan-cat.com/img/2025-11-13-22-47-30.png)

但是实际在 `CHANGELOG.md` 文件内，看的难看的要死：

![2025-11-13-22-48-16](https://gh-img-store.ruan-cat.com/img/2025-11-13-22-48-16.png)

满屏幕都是 `&nbsp;` 空格，这个 `CHANGELOG.md` 文件都不是给人看的。这不能接受吧，不可能去生成这种全都是 `&nbsp;` 空格的文件给人去阅读的，太离谱了。

### 结论： changelogithub 就不给你在本地生成能看的日志文件

所以很遗憾，只能放弃掉用 changelogithub 在云端和本地生成 `CHANGELOG.md` 文件的方案。

changelogithub 的用途就卡死了，自己就仅仅限定在 github workflow 工作流内，根据 tag 标签触发更新，生成 github release 更新日志。

完全不能去生成任何实体的，具体的 `CHANGELOG.md` 文件。

在生成 github release 日志这件事上，这个工具很优雅。但也就只能做这一种事情。

## 尝试用 bumpp + changelogen 的搭配来生成本地的更新日志文件

那既然本地用 changelogithub 生成 `CHANGELOG.md` 文件是一坨答辩，那我退而求其次用更加根本的 changelogen 来生成更新日志，行不行呢？

changelogithub 本质上就是对 [changelogen](https://github.com/unjs/changelogen) 的二次封装，在 bumpp 升级版本后，紧接着用 changelogen 来生成：

运行命令：

```bash
pnpm dlx changelogen --output "CHANGELOG.md"
```

实际出现一个致命缺陷，changelogen 没办法在本地内判断上一个 tag 标签和最新的 tag 标签，导致生成的更新日志是空的。两个相同版本号之间是没有任何差异的，所以日志是空的。

## 尝试单独使用 changelogen 完成一整个版本升级和日志生成工作

我就很纳闷了，changelogen 有那么废物么？在 bumpp 升级版本后，紧接着用 changelogen 来生成本地日志，结果无法判断版本号差异？生成空日志？

我很怀疑 changelogen 本身是不能去依赖别人来更新版本号的，如果让 changelogen 自己去实现版本号升级，并且自己去生成日志，会怎么样？

这是一套完全独立的新方案了。和 `bumpp` + `changelogithub` 方案完全不同了。

### 编写命令并生成版本号

阅读 changelogen 的 [README](https://github.com/unjs/changelogen/blob/main/README.md) 文档，得知要想让 changelogen 独立完成上述工作，需要以下这几个参数：

1. `--bump` 根据 git 语义化提交来确定版本号，写入 package.json 文件并升级版本号。
2. `--release` 生成更新日志。并生成 git tag。
3. `--push` 根据预设的 git commit 模板，同时推送：
   - 升级版本号，更改后的 package.json 文件。
   - 更新日志文件。
   - git tag 标签。

```json
{
	"release:changelogen": "changelogen --bump --release --push"
}
```

如下图所示：

![2025-11-13-23-13-24](https://gh-img-store.ruan-cat.com/img/2025-11-13-23-13-24.png)

查看 git 记录，同时有 git tag、本地的修改日志文件、被修改的 package.json。

![2025-11-13-23-14-45](https://gh-img-store.ruan-cat.com/img/2025-11-13-23-14-45.png)

而且本地的 `CHANGELOG.md` 文件很工整美观：

![2025-11-13-23-15-42](https://gh-img-store.ruan-cat.com/img/2025-11-13-23-15-42.png)

这很完美哦，完美满足了我上面的全部需求。不过单独的 changelogen 方案还是有一些问题的。

### 容易误触

你一点击，你就发布更新了。你要手动撤回 git 修改内容才行，包括手动删除掉推送的 tag 标签。

误触撤回比较麻烦。很容易不小心就触发版本更新了。

### 没办法自己确定版本号

changelogen 是根据语义化的 git commit 信息，来自主判断确定版本号的。你没得选版本号。

### 总是会自己打开 github release 页面

目前 changelogen 是没有办法自己关闭掉默认打开 github release 页面的行为的，这一点有点恼人。

![2025-11-13-23-17-10](https://gh-img-store.ruan-cat.com/img/2025-11-13-23-17-10.png)

### 总结： 顾此失彼，失去对版本号的手动控制了

changelogen 能独立完成我的核心需求，但是我却没办法手动精准选择版本号了。只能按照语义化的发版规则，自主更新版本号。

## 方案对比总结表

经过上述的折腾，可以总结出这两款方案的使用细节差异：

|                       方案                       | `bumpp` + `changelogithub` 结合方案 |                单独 `changelogen` 方案                |
| :----------------------------------------------: | :---------------------------------: | :---------------------------------------------------: |
|               能否手动控制版本号？               |     可以用 bumpp 手动选择版本号     | 不能，根据 conventionalcommits 约定式提交来生成版本号 |
|  本地自动生成的提交 <br /> 包含 git tag 标签？   |                包含                 |                         包含                          |
| 本地自动生成的提交 <br /> 包含 `package.json` ？ |                包含                 |                         包含                          |
| 本地自动生成的提交 <br /> 包含 `CHANGELOG.md` ？ |               不包含                |                         包含                          |
|       本地生成的 `CHANGELOG.md` 是否美观？       |     不美观。滥用 `&nbsp;` 空格      |            正常。没有冗余的 `&nbsp;` 空格             |
|     是否方便生成本地的 `CHANGELOG.md` 文件？     |               不方便                |                       正常生成                        |
|    是否方便生成云端的 `github release` 日志？    |              正常生成               |                 不方便，默认手动上传                  |

## 发版方案对比总结表

就仅仅针对 _更新版本号_ 、 _维护 `CHANGELOG.md` 更新日志文件_ 与 _推送 github release 更新日志_ 这三件事而言，不同的发版方案有不同的处理细节。总结如下：

|          发版方案           |    `bumpp` + `changelogithub`    |          `changelogen`          |                           `changeset`                           |
| :-------------------------: | :------------------------------: | :-----------------------------: | :-------------------------------------------------------------: |
|  更新 package.json 版本号   |       由 bumpp 可独立完成        |      由 `--bump` 参数实现       |         `changeset version` 命令消耗变更集并按配置更新          |
| 如何控制 semver 语义化版本  |        由 bumpp 手动选择         | 由 conventionalcommits 自动映射 | 在 `changeset add` 命令内手动选择 <br /> 或在变更集文件手动编写 |
|        更新日志内容         | 由 conventionalcommits 自动生成  | 由 conventionalcommits 自动生成 |                            手动编写                             |
|     对 monorepo 的支持      |     全部包共用唯一一个版本号     |    全部包共用唯一一个版本号     |    每个包有独立的版本号 <br /> 也可以通过配置实现共用版本号     |
| git 提交允许 `CHANGELOG.md` | 不包含本地的 `CHANGELOG.md` 文件 |            允许上传             |    允许上传，消耗变更集会默认包含本地的 `CHANGELOG.md` 文件     |
|  生成 github release 日志   |    由 changelogithub 独立生成    |   在 github 工作流内自动生成    |    不能独立生成。须依赖额外的 `changesets/action` 工作流完成    |
|  github workflow 触发方式   |      由 git tag 触发工作流       |      由 git tag 触发工作流      | 分两步：`changesets/action` 识别变更集生成 pr；合并 pr 更新版本 |
|     发版流程的心智负担      |          轻量级，无负担          |              还行               |      繁杂。手动写更新日志，并围绕变更集，合并 pr 完成发版       |
|          发版速度           |               最快               |              最快               |                   最慢，很多步骤需要人工确认                    |
|        是否容易误触         |             容易误触             |            容易误触             |       全人工编写变更集 + 手动合合并 pr ，几乎没有误触风险       |
|        方案落地难度         |             非常简单             |     略有重复代码，也很简单      |               稍微比较复杂，有多个常用命令要声明                |
|     适用代码与团队规模      |       个人、单仓库、小团队       |      个人、单仓库、小团队       |              多人协作、多包维护、严格流程的大团队               |
|   对比其他方案的综合评价    |          轻量级，无负担          |         还行。保持平衡          |                   最通用，最繁杂，生态最完整                    |

> 该总结表也是作者在 2025 年内，**折腾**发包发版和日志生成时，最有价值的表格了。

## 使用建议

1. 如果是公司级别的正式的，规范的项目。那我选择 `changeset` 方案，因为可以手动编写更新日志，多人审核复核，人工控制发版版本号。
2. 如果是单人维护的，放到 github 的小项目。那我选择 `changelogen` 方案，有一个差不多能看的更新日志，本地能看，github release 也能看日志，语义化的版本号，就够用了。
3. 如果是追求快速落地的 npm 包发布。那我选择 `bumpp` + `changelogithub` 方案，该方案落地最快，实现最快，配置最少，发版最迅速。

回到最初的需求，我打算在一个普通的管理后台项目内，实现`版本升级`和`日志生成`。我应该选择 `changelogen` 方案。
