# PR Draft

## Title

Improve `skills list -g` performance for linked global agent skill directories

## Body

## Problem

`skills list -g` can become very slow when the same global skills are exposed through many agent-specific skill directories. This is especially visible on Windows, where those agent directories are often Junctions pointing back to the same canonical skills folder.

In my local AI-agent workflow, this command is on the critical path because I run it frequently to let the agent discover the full set of global skills before planning or resuming work. In the reported real-world setup, a single `skills list -g` run commonly took about 20 to 25 seconds and made the machine feel noticeably sluggish.

## Root Cause

`listInstalledSkills()` already deduplicates the final output by skill name and scope, but the global listing path still repeats a lot of filesystem work before that output is produced.

For each canonical skill, the previous implementation checked each detected agent directory with repeated `access()` calls. If directory-name matching did not find the skill, it then fell back to `readdir()` and `parseSkillMd()` for the agent directory. When multiple agent directories point to the same real `SKILL.md`, the same file can be parsed repeatedly in one list operation.

The previous scope discovery also added existing agent directories outside the requested `--agent` filter, so `skills list -g --agent codex` could still scan unrelated agent skill directories.

## Solution

This PR keeps the existing output semantics but reduces repeated small filesystem I/O inside one `listInstalledSkills()` call:

- Cache parsed `SKILL.md` results for the duration of a single list operation.
- Prefer `realpath(SKILL.md)` as the cache key, with a safe fallback to the requested path.
- Build one in-memory index per agent skills directory.
- Store both directory names and frontmatter skill names in the index.
- Replace repeated `access()` / fallback `readdir()` / repeated `parseSkillMd()` work with Set lookups.
- Respect `agentFilter` when adding existing agent directories, so unrelated agents are not scanned when a filter is present.

## Compatibility

The cache is local to a single `listInstalledSkills()` call, so it does not introduce persistent stale state across CLI runs.

The output shape is unchanged. Skills are still deduplicated by scope and name, and the `agents` list is still preserved when the same skill is found through multiple agent directories.

## Tests

Added and updated tests in `tests/list-installed.test.ts`:

- Multiple linked agent directories pointing to the same real `SKILL.md` are merged into one output skill.
- The merged output still preserves the expected agents list.
- The same real `SKILL.md` is parsed once in the linked-directory scenario.
- `agentFilter: ['codex']` does not include skills from unrelated agent directories.
- Windows uses Junctions for linked directory coverage; non-Windows keeps directory symlink coverage.

Local verification:

```text
pnpm test tests/list-installed.test.ts --run
pnpm run format:check
```

Local notes:

```text
pnpm run type-check
pnpm run build
```

These two commands did not complete successfully in my local Windows environment for issues outside the edited files. I will use the GitHub PR checks as the authoritative CI signal and follow up if they fail.

## Before / After

Real-world local case from the linked issue:

Before:

- `skills list -g`: about 20 to 25 seconds
- 60 global skills
- 39 global skill scopes
- 1305 top-level entries
- 1241 Windows Junctions

After applying the same optimization locally:

- `skills list -g`: about 2.2 seconds
- `skills list -g --agent codex`: typically about 0.4 to 0.7 seconds

## Related Issue

Closes https://github.com/vercel-labs/skills/issues/1389

## Published PR

URL: https://github.com/vercel-labs/skills/pull/1390

Number: #1390

Final title: Improve `skills list -g` performance for linked global agent skill directories

Final body summary:

- Explains the slow global listing behavior in linked Windows agent skill directories.
- Describes the repeated filesystem work in `listInstalledSkills()`.
- Documents the per-call `SKILL.md` parse cache and per-agent directory index.
- Confirms `agentFilter` no longer expands scanning into unrelated agent directories.
- Lists local focused verification and records the local full-build caveat transparently.
