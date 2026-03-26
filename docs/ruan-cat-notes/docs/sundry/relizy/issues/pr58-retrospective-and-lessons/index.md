# relizy PR #58 实战复盘与经验教训

## 适用范围

本文总结的是一次完整的、真实落地的 `relizy` 上游 issue / PR 实战过程，目标问题是：

1. Windows 环境下 GNU 工具缺失导致 `relizy` 直接失效。
2. 全新 monorepo 首次发版时没有 baseline tag，导致 independent release 无法继续。

这次实战最终对应：

- upstream issue: `#57`
- upstream PR: `#58`
- PR 标题：`fix: support Windows initial independent releases`

这份文档不是 issue 草稿，也不是流水账。它的目标是让下次再处理 `relizy` 相关 issue / PR 时，能够直接绕开本次已经踩过的坑，不要重复绕圈。

---

## 最终结论

### 这次 PR 真正解决了什么

这次 PR 真正解决的是两类问题：

1. `relizy` 内部仍然依赖 `grep` / `head` / `sed` 这类 GNU 工具，导致 Windows 原生环境不兼容。
2. independent mode 下，首次发版没有 package baseline tag 时，`relizy` 无法正确计算 release 边界。

### 这次 PR 没有解决什么

这次 PR 没有解决 `nested git root` 问题。

也就是：

- 当前运行目录不是 Git 顶层目录。
- 代码目录和真正 `.git` 所在目录之间隔了一层。
- `relizy` 在 `git add` / `git commit` / `git tag` / `git push` 阶段，使用了错误的工作目录，最终导致待提交文件路径被拼错。

这个问题必须单独作为下一个 issue / PR 处理，不能混进本次 GNU / baseline 修复 PR 里。

---

## 本次任务里最重要的判断

### 1. 先把问题拆成两条线

一开始最容易犯的错误，是把所有实际遇到的故障都混成“这次 PR 要一起修”。

这次实际碰到的问题至少有四类：

1. Windows 缺 GNU 工具。
2. 首次发版缺 baseline tag。
3. nested git root。
4. 某些托管平台 compare URL 格式与 GitHub 不兼容。

正确做法是先拆线：

- 本次 PR 只处理 `GNU tools + baseline tag`。
- `nested git root` 下一个 PR 再处理。
- 自定义 compare URL 再下一个 PR 处理。

如果不拆线，PR 会变得又大又乱，维护者很难审核，而且你自己也会越来越难判断“当前失败到底是不是这次改动带来的”。

### 2. patch coverage 不够，不等于生产代码错了

本次 PR 中，很多时间花在了覆盖率追踪上。

必须明确：

- `test-unit` 通过，说明主路径没有明显被打坏。
- Codecov 报 `patch coverage` 不够，尤其是 `0 missing, 2 partials` 这种情况，通常说明：
  - 新增分支没有被测到；
  - 或者 if / else / throw 的某一边没走到；
  - 不代表生产逻辑一定写错了。

这次后续做对的事情是：

- 不靠修改 `vitest.config.ts` 阈值过关。
- 不为了“看起来更合理”去重写生产代码。
- 而是根据 Codecov 的缺口，定点补测试。

这才是对维护者最有说服力的做法。

### 3. `vitest.config.ts` 被自动改，不是应该提交的改动

这个仓库的 `vitest.config.ts` 开了 coverage `autoUpdate`。

结果是：

- 只要本地跑 `pnpm test:unit:coverage`
- Vitest 就可能自动回写 `statements / functions / branches / lines` 的数值

这类改动在这个仓库历史里本来就频繁出现，但在这次 PR 场景里，它是**副作用**，不是本次问题的真实修复。

因此结论很明确：

- 可以观察它。
- 可以知道这是仓库工具行为。
- 但不应该把它当成这次 PR 的有效修复提交上去。

### 4. 不要把 pre-existing workflow 问题混进当前 PR

本次过程中，一度把 `dry-run-release` 的失败和当前 PR 混在了一起。

后来验证才清楚：

- `test-unit` 红，是这次 PR 自己引入的 coverage 缺口。
- `dry-run-release` 红，不是这次 PR 才出现，之前的 PR 也已经这样。

因此原则是：

- 当前 PR 只修自己确认引入的问题。
- 仓库既有 workflow 问题不要顺手混修。
- 否则会让 PR 目标失焦。

---

## 本次 PR 中哪些代码修改是必要的

### 核心必要修改

这几处是根因修复，属于必须改：

- `src/core/tags.ts`
- `src/core/repo.ts`

原因：

- `tags.ts` 里原本有 GNU 工具链依赖，需要改成 Node 内过滤和排序，才能真正 Windows 兼容。
- `repo.ts` 里路径分隔符和首个 package commit 处理必须改，否则 Windows 环境和首次 independent release 仍然会失败。

### 闭环必要修改

这几处不是“顺手重构”，而是为了让 baseline 语义贯通到底：

- `src/core/changelog.ts`
- `src/core/github.ts`
- `src/core/gitlab.ts`

原因：

- `NEW_PACKAGE_MARKER` 不能只在 bump 阶段出现。
- 如果 changelog / provider release 这些下游消费者不理解这个 marker，那么修复是不完整的。
- 所以必须把它解释成真正的 bootstrap baseline，例如 `pkg-a@0.0.0`。

### 可批评但不算错的地方

本次里有些 diff 看起来偏大，主要是 helper 拆分导致。

尤其是 `github.ts`：

- 行为改动本身是必要的。
- 但 helper 拆分让 diff 体积扩大。
- 这会提高维护者阅读成本。

经验教训：

- 行为必须改，就改。
- 但尽量减少“为了写法更优雅而扩大 diff”的倾向。

---

## 覆盖率阶段的真实经验

### 不要猜，直接根据 Codecov 缺口定位

本次真正提升效率的一步，是不再泛泛地“多补点测试”，而是根据：

- PR diff
- 本地 `coverage/lcov.info`
- Codecov comment 点名的文件和 partial branch

去精确定位缺口。

例如后面能明确定位到：

- `src/core/tags.ts:54`
- `src/core/tags.ts:253`

说明应该去补 legacy tag lookup 和 non-stable pattern 分支，而不是继续盲目扩大测试范围。

### 正确策略是“补测试证明逻辑”，不是“改逻辑凑覆盖率”

本次后期做对的策略是：

1. 先确认主逻辑方向是对的。
2. 再补 focused test 去打掉 branch partial。
3. 只在测试过程中发现语义含混时，才考虑最小重构。

不要反过来做。

### 最终有效的覆盖率策略

后面实际有效的测试补充方向主要是：

- bootstrap tag helper 的真假分支
- legacy tag lookup 分支
- independent mode 下 guard / throw 分支
- `config.from` override 优先级
- provider 层对 bootstrap baseline 的消费路径

也就是说，下次如果你再做类似 PR，应该优先先想：

> 本次新增的 if / else / throw / fallback，我有没有让它真的执行过？

而不是先想：

> 能不能顺便把这块代码改得更漂亮？

---

## 本地验证阶段的关键经验

### 1. 两个项目都必须真实验证

只在 `relizy` 仓库里看 unit test 通过，不够。

这次必须做的，是在真实本地 monorepo 中验证：

- `D:\code\github-desktop-store\01s-11comm`
- `D:\code\01s\202603-13hzb\yunxiao\01s-2603-13eams\eams-frontend-monorepo`

而且不是跑 wrapper 脚本，而是直接验证链接后的 `relizy` 本体能否完成发版。

### 2. `pnpm link --global relizy` 在 Windows 下不稳定

这次实测里，直接：

```bash
pnpm link --global relizy
```

在目标项目中会撞上：

- `Symlink path is the same as the target path`

这说明不能把“全局 link 流程”想得过于理想。

更稳妥的替代方案有两个：

1. 目录链接：

```bash
pnpm link D:\code\github-desktop-store\relizy__ruan-cat
```

2. `file:` 依赖 override：

```yaml
overrides:
  relizy: file:../../../../../github-desktop-store/relizy__ruan-cat
```

### 3. `pnpm link` 会把工作树弄脏，导致 relizy clean check 失败

这是一个非常容易忽略的坑。

在目标仓库里执行 link / install 后，经常会导致：

- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`

发生修改。

而 `relizy release` 默认会检查 Git 工作树是否干净，于是会直接失败。

因此正确测试步骤是：

1. 完成 link / install。
2. 确认 `node_modules/relizy` 已经指向本地目标。
3. 把 link 带来的配置改动临时 stash 掉。
4. 再执行 release 命令。

### 4. 真实验证命令必须补 `--patch`

这次两个项目都证明了同一件事：

直接执行：

```bash
pnpm exec relizy release --no-publish --no-provider-release --yes --force
```

如果当前仓库没有可自动推导的 release type，就会失败。

而补上：

```bash
pnpm exec relizy release --no-publish --no-provider-release --yes --force --patch
```

就能进入真实 release 流程。

因此下次做本地验收时，不要忘记：

- 本地验证命令需要显式 release type。
- 这里默认用 `--patch` 是合理的验收方式。

---

## 两个真实项目的最终验证结论

### 01s-11comm

这是本次最干净的成功案例。

验证过程：

1. 将本地 `relizy` 链接进项目。
2. 暂时 stash 掉 `pnpm link` 带来的 `pnpm-lock.yaml` / `pnpm-workspace.yaml` 脏改动。
3. 执行：

```bash
pnpm exec relizy release --no-publish --no-provider-release --yes --force --patch
```

结果：

- bump 成功
- changelog 成功
- commit 成功
- tag 成功
- push 成功

最终证据：

- 最新提交：`b0771e71`
- 新 tag：
  - `@01s-11comm/admin@6.1.2`
  - `@01s-11comm/type@1.1.1`

结论：

- 这次 GNU / baseline 修复在一个真实 monorepo 上已经完整跑通。

### eams-frontend-monorepo

这是本次最有价值的复杂验证案例。

首次直接验证时，情况是：

- GNU / baseline 修复已经生效
- bump 和 changelog 都成功
- 但 commit 阶段失败

失败根因不是本次 PR 本身，而是：

- 当前运行目录不是 Git 顶层目录
- `git rev-parse --show-prefix` 返回 `eams-frontend-monorepo/`
- `relizy` 在 commit 阶段把待提交路径拼成了重复前缀

也就是本地报告里说的 `nested git root` 问题。

这个问题的关键经验是：

- 不能因为它还存在，就误以为本次 GNU / baseline 修复无效。
- 实际上，本次 PR 的修复已经让流程推进到了更后面的阶段。

为了完成本地最终验收，本次采用了项目侧临时兜底：

1. 不改上游当前 PR。
2. 不把 nested-root 修复混进本次 PR。
3. 仅在 `eams-frontend-monorepo` 内部使用：
   - 本地 `file:` 依赖形式的 `relizy`
   - 项目侧临时 `relizy@1.2.2-beta.1.patch`

注意一个非常关键的细节：

- 这份 patch 不是多余 patch。
- 它修的是 nested git root。
- 只是原 patch 针对的是旧的 `dist/shared/relizy.*.mjs` hash。
- 当本地 `relizy` 构建产物 hash 变了以后，patch 也必须同步更新到新的文件名，否则 patch 无法应用。

最终执行：

```bash
pnpm exec relizy release --no-publish --no-provider-release --yes --force --patch
```

结果：

- bump 成功
- changelog 成功
- commit 成功
- tag 成功
- push 成功

最终证据：

- 最新提交：`03d09899`
- 新 tag：
  - `@eams-monorepo/admin@0.0.3`
  - `@eams-monorepo/stu-app@0.0.3`
  - `@eams-monorepo/tea-app@0.0.3`
  - `hello-world@0.1.2`
  - `@eams-monorepo/vue-element-cui@0.0.3`
  - `@eams-monorepo/vue-element-cui-nuxt@0.0.3`

结论：

- 在 nested git root 通过项目侧临时 patch 兜底后，本次 GNU / baseline 修复也在第二个真实项目上验证成功。

---

## 本次最容易再犯的误区

### 误区 1：想一次性把所有 relizy 问题都修掉

错误。

必须按问题类型拆 PR。

### 误区 2：看到 Codecov 红了，就怀疑生产逻辑错了

错误。

先看是 missing line，还是 partial branch。

### 误区 3：私自提交 `vitest.config.ts` 数值更新

错误。

那通常只是 coverage autoUpdate 的副作用。

### 误区 4：把 pre-existing CI 问题混进当前 PR

错误。

当前 PR 只修自己确认引入的问题。

### 误区 5：以为 link 成功就等于 relizy 真被用了

错误。

必须验证：

- `node_modules/relizy` 实际指向哪里
- `pnpm exec relizy --version` 输出什么版本

### 误区 6：看到 `eams` 的 patch 文件就默认它是“应该删掉的多余 patch”

错误。

必须先阅读 patch 内容，确认它修的到底是什么。

本次实际证明：

- `eams` 的 `relizy@1.2.2-beta.1.patch`
- 修的是 nested git root
- 不是 GNU / baseline
- 因此它是“另一个问题的临时修复”，不是“无意义 patch”

---

## 下次再做 relizy issue / PR 的建议顺序

### 如果是 GNU / baseline 类问题

1. 先阅读下游 wrapper / runner 文档和事故报告。
2. 明确区分：
   - 上游应修的问题
   - 下游临时兼容层做的事情
3. issue 草稿里必须写清楚：
   - 现在下游是如何临时兼容的
   - 为什么这不是上游已修复的证据
4. PR 里优先做最小根因修复。
5. 覆盖率不够时优先补测试，不随意改生产代码。
6. 本地至少找两个真实项目验收。

### 如果是 nested git root 类问题

1. 先确认：
   - `git rev-parse --show-toplevel`
   - `git rev-parse --show-prefix`
2. 如果两者不一致，先认定这是独立问题。
3. 检查 commit / tag / push 是否使用了错误 `cwd`。
4. 不要把它混进 GNU / baseline PR。

### 如果要做本地真实发版验证

推荐顺序：

1. `pnpm build`
2. 验证本地产物存在
3. 采用目录链接或 `file:` override
4. 验证 `node_modules/relizy` 的真实指向
5. 验证 `pnpm exec relizy --version`
6. 清理或 stash link / install 带来的脏工作树
7. 执行：

```bash
pnpm exec relizy release --no-publish --no-provider-release --yes --force --patch
```

---

## 这次任务的高价值证据

下次和维护者沟通时，最有价值的不是“我觉得修好了”，而是下面这些证据：

1. PR #58 在上游仓库中通过了 unit test / coverage。
2. `01s-11comm` 在本地直接用链接的 `relizy` 成功发版。
3. `eams-frontend-monorepo` 在 nested-root 由项目侧临时 patch 兜底后，也成功发版。
4. 因此可以明确区分：
   - GNU / baseline 修复已经有效
   - nested git root 仍是独立未合并问题

这套证据链非常重要，因为它能避免维护者把所有问题都误解成“你这个 PR 还没修好”。

---

## 面向下次会话的直接行动建议

如果下次继续推进 `relizy`：

1. 先单独起 `nested git root` 的上游 issue / PR。
2. 直接引用本次 `eams-frontend-monorepo` 的本地 patch 证据。
3. 明确说明：
   - GNU / baseline 已在 PR #58 处理
   - nested-root 是下一条独立修复线
4. 本地验证时，继续保留“两个真实项目都要成功”的标准。

---

## 一句话版本

这次最大的经验不是“怎么把代码改对”，而是：

> 必须把 `GNU tools / baseline tag / nested git root / compare URL` 这些问题彻底拆开，分别立 issue、分别做 PR、分别给出本地验证证据；覆盖率问题优先补测试，不要靠改阈值或扩大生产代码修改来糊过去。
