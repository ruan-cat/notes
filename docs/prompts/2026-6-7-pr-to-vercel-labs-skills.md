<!-- TODO: 未完成 -->

# 向 https://github.com/vercel-labs/skills 仓库 pr

你的任务是，根据 `D:\code\ruan-cat\notes\docs\reports\2026-06-07-skills-list-global-performance.md` 文档的内容，克隆我的 `https://github.com/ruan-cat/skills` 仓库，我已经 fork 目标仓库 `github.com/vercel-labs/skills` 了，然后按照 `2026-06-07-skills-list-global-performance.md` 的要求，完成 issue 稿的编写，本地 fork 仓库的修改，以及最终 pr 的发布。

1. 在 `D:\code\store` 内，新建一个 `skills__ruan-cat` 文件夹，在这个文件夹内克隆我的 fork 的 `https://github.com/ruan-cat/skills`仓库。
2. 按照 pr 的规范，在 main 分支的基础上，新建专门的分支，来完成修改。不要直接在 main 分支内做出修改，这会导致 pr 被拒绝。
3. 根据 2026-06-07-skills-list-global-performance.md ，找到存在严重性能瓶颈的代码，并按照要求，改写代码，并发布 pr。
   - 要求 pr 的提交必须包含必要的测试用例，确保 pr 后能够走通 `vercel-labs/skills` 仓库默认执行的 github workflow PR 自检流水线。确保提交后的 pr 能够跑通流水线，便于合并。
4. 先编写**纯英文**的 issue 稿，在这个 issue 稿内，我要求你重点说明我的使用场景，说明清楚我目前遇到的性能瓶颈，重点说明清楚机器卡顿，缓慢的情况。并且在 issue 稿内说明清楚接下来会给出相应的 pr，来专项解决这个 issue。
   - 在动机上面，重点说明清楚我需要在本地高频执行 `skills list -g` 命令，来让我的 AI agent 清晰的，主动的获取齐全全部的全局 skills，但是该命令 `skills list -g` 速度太慢，严重影响我的开发效率。故编写该 issue 和后续的 pr 。
5. 给目标 `vercel-labs/skills` 仓库发布 issue。
6. 然后给 vercel-labs/skills 仓库正式推送 pr。编写**纯英文**的 pr 稿，并说明清楚 pr 解决了那些性能问题。
7. 在全面完成 issue、pr 的任务后，开始编写掘金文章，用于外宣和体现出自己的技术思考能力，便于求职。
   - 用 `D:\code\ruan-cat\notes\.claude\skills\write-juejin-posts\SKILL.md` 这个技能来指导你如何编写外宣性质的掘金技术文章。
   - 模仿 `D:\code\ruan-cat\notes\docs\ruan-cat-notes\docs\posts` 文件夹内其他掘金文章的特点和行文风格，新建合适的文件夹，并编写掘金文章。
8. 最后，在 `D:\code\ruan-cat\notes\docs\reports` 内编写一个报告，说明清楚本次你完成 pr 的成果与报告。
