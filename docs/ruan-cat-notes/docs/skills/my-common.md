# 我常用的技能

这里列举出自己常用的技能快速安装命令

```bash
# 自研技能
skills add https://github.com/ruan-cat/monorepo/tree/dev/ai-plugins/dev-skills/skills --skill '*' -g -y -a claude-code -a codex
skills add https://github.com/ruan-cat/monorepo/tree/dev/ai-plugins/common-tools/skills --skill '*' -g -y -a claude-code -a codex

# pua（tanweai/pua —— tree URL 定向到 skills/pua，避免装进 pua-en/pua-ja/pro/p7 等兄弟技能）
skills add tanweai/pua -s pua -g -y -a claude-code -a codex

# frontend-design（anthropics/skills —— 多技能仓库，指名安装）
skills add anthropics/skills -s frontend-design skill-creator -g -y -a claude-code -a codex

# agent-browser（vercel-labs/agent-browser —— tree URL 定向，避免装进 skill-data/ 下 9 个数据技能）
skills add https://github.com/vercel-labs/agent-browser/tree/main/skills/agent-browser --skill '*' -g -y -a claude-code -a codex

# find-skills（vercel-labs/skills —— tree URL 定向，避开 .factory/ 下的工作流技能）
skills add https://github.com/vercel-labs/skills/tree/main/skills/find-skills --skill '*' -g -y -a claude-code -a codex

# web-design-guidelines（vercel-labs/agent-skills —— 9 技能仓库，指名安装）
skills add vercel-labs/agent-skills -s web-design-guidelines -g -y -a claude-code -a codex

# ui-design-brain（carmahhawwari/ui-design-brain —— 根 SKILL.md 单技能仓库）
skills add carmahhawwari/ui-design-brain --skill '*' -g -y -a claude-code -a codex

# caveman（JuliusBrussee/caveman —— tree URL 定向到 skills/caveman，避开 20+ 个 caveman-* 兄弟技能）
skills add https://github.com/JuliusBrussee/caveman/tree/main/skills/caveman --skill '*' -g -y -a claude-code -a codex

# https://github.com/emilkowalski/skills
skills add emilkowalski/skills -s emil-design-eng animate animation-performance animation-vocabulary break-ui improve-animations apple-design -g -y -a claude-code -a codex

# https://github.com/addyosmani/agent-skills
skills add addyosmani/agent-skills -s browser-testing-with-devtools context-engineering -g -y -a claude-code -a codex
```
