# bug: initial independent release on Windows still relies on GNU tools and manual baseline tags

## Summary

> **Note:** This issue is raised by a non-native English speaker. The text was prepared, translated, and refined with AI assistance, but the source-code review, downstream incident analysis, and reproduction reasoning were checked against the actual code.

On **Windows**, running `relizy release` / `relizy bump` for a **fresh monorepo** still does not provide a complete first-release path, especially in `independent` mode:

1. core logic still depends on GNU commands such as `grep`, `head`, and `sed`, which are not reliably available in PowerShell / cmd;
2. the "no baseline tag yet" path is only **partially** modeled internally, so downstream projects still need an external wrapper or manual bootstrap tags to complete the first release.

In practice, this means the first-release workflow still depends on downstream compatibility code instead of being handled end-to-end by `relizy` itself.

This is **not** the same problem as the Windows path separator bug already fixed in issue #52 / PR #53. It is also **separate** from the "real git root differs from relizy working directory" issue.

---

## Environment

| Item             | Value                                                     |
| ---------------- | --------------------------------------------------------- |
| OS               | Windows 10 / 11 (`win32`)                                 |
| Shell            | PowerShell / cmd                                          |
| relizy           | issue still visible on current `develop` branch           |
| Node             | `>=20`                                                    |
| Typical scenario | first release with `monorepo.versionMode = "independent"` |

---

## Current downstream symptom

Downstream projects currently need an extra compatibility wrapper before invoking `relizy`, and that wrapper has to do three things:

1. prepend Git for Windows `usr/bin` to PATH so `grep` / `head` / `sed` are executable;
2. scan workspace packages before `release` / `bump` and check whether each package already has a `pkg@x.y.z` baseline tag;
3. abort and print manual `git tag` commands if those baseline tags are missing.

That is strong evidence that `relizy` core still does not provide a native "Windows + first independent release" workflow on its own.

### Current downstream workaround: `relizy-runner`

To work around these incompatibilities, downstream projects currently use a **hand-written compatibility wrapper**:

- implementation:
  `https://github.com/ruan-cat/monorepo/blob/dev/packages/utils/src/node-esm/scripts/relizy-runner/index.ts`
- design notes:
  `https://utils.ruan-cat.com/node-esm/scripts/relizy-runner.md`

This wrapper is not intended to replace `relizy`. Its role is to add a thin layer of "environment compatibility + first-release prechecks" before calling the real `relizy` CLI. In its current form, it does three things:

1. **Windows GNU tool injection**
   - on Windows, it tries to locate Git for Windows `usr/bin`
   - it prepends `grep` / `head` / `sed` to PATH
   - this is required only because current `relizy` core still contains shell-pipeline paths that depend on those tools

2. **independent baseline-tag precheck**
   - before `release` / `bump`, it scans workspace packages from `pnpm-workspace.yaml`
   - it checks whether each package already has a `pkg@version` tag
   - if not, it aborts and prints the manual tag commands

3. **automatic `--yes` for `release` / `bump`**
   - this prevents `relizy` from blocking on interactive confirmation in CI or non-TTY shells
   - this is only a workflow convenience and does not change version-calculation behavior

It is important to be explicit about scope: `relizy-runner` **does not change `relizy` release semantics**. It is only a downstream compatibility layer:

- it **does** patch the environment, run baseline prechecks, and inject `--yes`
- it **does not** solve the underlying `relizy` core-modeling issues around tag resolution, commit ranges, and first-release baseline handling

That is why a downstream repository can be made to "work" today while the underlying problem still exists in `relizy` core. The purpose of this issue is to move as much of that currently wrapper-only behavior as possible back into `relizy` itself.

---

## Root cause

### 1. GNU pipeline dependencies still exist in core code

There are still several shell pipelines in the current source:

#### `src/core/tags.ts`

```ts
git tag --sort=-creatordate | grep -E '...' | head -n 1
git tag --sort=-creatordate | head -n 1
git tag --sort=-creatordate | grep -E '^pkg@' | head -n ${limit}
git tag --sort=-creatordate | grep -E '...' | sed -n '1p'
```

#### `src/core/repo.ts`

```ts
git log --reverse --format="%H" -- "${relativePath}" | head -1
```

These commands are usually available on Linux / macOS / Git Bash, but they are not a safe assumption in Windows PowerShell / cmd. As a result:

- tag discovery can fail;
- the new-package path in `getFirstPackageCommitHash()` also fails because it still uses `head`;
- users need external PATH patching or extra GNU tooling just to make core release logic work.

So Windows compatibility is still effectively delegated to downstream wrappers instead of being handled inside `relizy`.

### 2. The "no baseline tag yet" first-release path is only partially modeled

Current code already shows an intention to support first releases without real tags:

- `src/core/tags.ts` introduces `NEW_PACKAGE_MARKER`
- `src/core/repo.ts` special-cases `from === NEW_PACKAGE_MARKER`
- documentation already presents first-release changelogs as `v0.0.0...vX.Y.Z`

However, the flow is still incomplete:

1. `NEW_PACKAGE_MARKER` mainly solves "do not diff from the first commit of the whole repository and cause ENOBUFS", but it does not elevate "no baseline tag yet" into a unified core concept.
2. `src/core/changelog.ts` still mostly organizes behavior around real tags or `getFirstCommit()` fallback rather than a formal no-baseline state shared across bump / changelog / compare / provider-release steps.
3. `src/core/tags.ts` still has fallbacks like `getLastRepoTag(...) || getFirstCommit(config.cwd)` in repo-wide paths.

Inference from the current source:

> **Inference from code inspection:** if the repository's first commit itself is used directly as `from`, the left boundary commit can be excluded from the effective diff range. The independent new-package path already works around this by using `firstPackageCommit^`, which suggests that "first release without tags" should be modeled as an explicit baseline-resolution problem rather than mixing three meanings (`real tag`, `first commit`, and `special marker`) across different code paths.

In other words, the codebase already contains pieces that point toward first-release support, but not a full end-to-end model. That is why downstream projects still need wrapper-level baseline checks.

---

## Expected behavior

`relizy` should treat the following as a **native supported scenario**:

1. On Windows, `relizy release` / `relizy bump` should work in a normal Node + Git for Windows setup without requiring extra `grep` / `head` / `sed` availability.
2. In `independent` mode, if a package has no historical tag yet, `relizy` should still treat it as a valid first release instead of requiring users to manually create bootstrap tags first.
3. For first releases, version calculation, commit-range resolution, changelog titles, compare ranges, and provider-release text should all rely on one consistent "bootstrap baseline" model rather than forcing downstream wrappers to fill the gap.

---

## Proposed fix

### Core direction

Move both concerns into `relizy` core so the "first release on Windows" path becomes a single supported and testable workflow.

### Concrete changes

#### 1. Replace shell pipelines with pure Node filtering

Suggested approach:

- use `git tag --sort=-creatordate` once to get the tag list;
- filter stable tags / package tags in JavaScript / TypeScript;
- change `getFirstPackageCommitHash()` to a single `git log --reverse --format="%H" -- <path>` call and pick the first line in Node;
- remove reliance on `grep`, `head`, and `sed`.

That would bring Windows compatibility back into the core library instead of keeping it as an external PATH workaround.

#### 2. Promote "no baseline tag yet" into a formal baseline-resolution layer

Instead of treating first release as "the downstream user must create a real bootstrap tag first", `relizy` could model it explicitly inside core, for example as:

- repo-level no-tag baseline
- package-level no-tag baseline

That layer could return two kinds of information:

- **calculation boundary**: the git revision actually used for commit-range computation, for example "parent of the first relevant commit";
- **display boundary**: the virtual baseline shown in changelog / compare / release text, for example `v0.0.0` or `pkg@0.0.0`.

This means:

- **calculation** should not require a real pre-existing git tag;
- **display** can still preserve the documented `v0.0.0...vX.Y.Z` / `pkg@0.0.0...pkg@X.Y.Z` presentation.

#### 3. Reuse the same baseline semantics across the whole workflow

At minimum, this should be consistent across:

- `src/core/tags.ts`
- `src/core/repo.ts`
- `src/core/changelog.ts`
- compare / provider-release generation logic

The goal is:

- bump resolves the correct first-release commit range;
- changelog generates the expected `0.0.0 -> new version` presentation;
- provider release / compare links no longer assume that a real bootstrap tag must already exist.

#### 4. Add Vitest regression coverage

Suggested regression tests:

- Windows-safe tag lookup and first-package-commit discovery without GNU tools;
- first release in independent mode when package tags do not exist yet;
- first release in unified / selective mode when repo tags do not exist yet;
- changelog output still renders `v0.0.0...vX.Y.Z` or `pkg@0.0.0...pkg@X.Y.Z`;
- existing tagged upgrade flows remain unchanged.

---

## Why this is better than continuing to require manual bootstrap tags

The documentation already presents "first release" as a normal supported capability, not as a semi-manual bootstrap procedure. Since core already contains building blocks such as `NEW_PACKAGE_MARKER` and `v0.0.0` display behavior, the more coherent direction is to complete that design inside `relizy` rather than leaving first-release handling to every downstream wrapper.

---

## Additional notes

- This is not the Windows path separator issue fixed by issue #52 / PR #53.
- This is also not the nested git-root / `gitRoot` mismatch issue.
- The downstream wrapper should be viewed as a temporary guardrail, not the desired long-term release architecture.

---

## References

- issue #52: Windows path separator mismatch causes "No packages to bump" in independent monorepo mode
- PR #53: normalize path separators to POSIX before commit body matching
- current source files involved:
  - `src/core/tags.ts`
  - `src/core/repo.ts`
  - `src/core/changelog.ts`
  - `docs/src/guide/getting-started.md`
  - `docs/src/guide/changelog.md`
