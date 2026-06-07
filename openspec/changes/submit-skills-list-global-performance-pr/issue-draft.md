# Issue Draft

## Title

`skills list -g` is very slow with many global agent skill directories on Windows

## Body

I use `skills list -g` frequently in local AI-agent workflows so the agent can discover the full set of global skills before planning or resuming a task. This command is on the critical path for my day-to-day development loop because the agent needs a complete, current view of the globally installed skills to choose the right workflow.

On my Windows machine, `skills list -g` is currently slow enough to interrupt that workflow. A single run commonly takes about 20 to 25 seconds. During that time the machine feels noticeably sluggish, and long-running agent tasks become harder to resume because every fresh context or skill discovery step can add another long wait.

The local setup that exposes the issue has many agent-specific global skill directories, and most of those entries are Windows Junctions pointing back to the same canonical skills. The real-world scale is:

- 60 global skills
- 39 global skill scopes
- 1305 top-level entries across those scopes
- 1241 Windows Junctions
- 1682 skill-agent relationships in the `skills list -g --json` output

The command is not slow because there are thousands of unique skills. It appears to become slow because the global listing path repeatedly checks and scans many agent-specific directories, and many of those directories resolve to the same underlying skill files.

This matters for AI-agent usage because I need to run `skills list -g` often, sometimes multiple times in a single long task, to let the agent actively discover all available global skills. When each run takes 20 to 25 seconds and makes the machine feel stuck, it directly slows down development and makes the CLI feel unreliable even though it eventually completes.

I am preparing a focused PR for this issue. The PR will aim to reduce repeated filesystem I/O in the global list path while preserving the existing output semantics. The intended fix is to cache parsed `SKILL.md` results within a single `listInstalledSkills()` call, build one in-memory index per agent skills directory, and make `--agent` filtering avoid scanning unrelated agent directories.

The PR will include tests for the behavior and scanning scope. It will not assert fixed timing thresholds, because those would be too environment-dependent for CI.

## Published Issue

https://github.com/vercel-labs/skills/issues/1389
