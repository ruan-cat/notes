# Sub2API JSON Rewriter Design

> **Status**: Approved by user on 2026-07-25.

## 1. Goal

Build a VitePress-rendered Vue component that replaces the manual `rewrite-wishtoapp-sub2api-name.ts` workflow with a pure browser UI for reading a Sub2API JSON file, rewriting account `name` and `notes` metadata, and exporting a new JSON file.

## 2. User Workflow

1. The user opens `docs/ruan-cat-notes/docs/sundry/ai/sub2api/index.md`.
2. In the `给 sub2api json 文件增加必要前缀` section, the page renders the JSON rewrite component on the client.
3. The user selects a Sub2API JSON file from the browser.
4. The component parses and validates the JSON.
5. The user edits:
   - `ACCOUNT_BATCH_PREFIX` in a single-line input.
   - `notes` in a multiline textarea.
   - Optional output file name.
6. The component rewrites all accounts in memory.
7. The user downloads the rewritten JSON file from the browser.

## 3. Requirements

### 3.1. Functional Requirements

- The component must run in a browser-only production environment.
- The component must not use `node:fs`, `node:path`, `fileURLToPath`, `process`, or other Node-only APIs.
- The component must read local JSON files with browser APIs.
- The component must export generated JSON with browser APIs.
- `ACCOUNT_BATCH_PREFIX` must be editable with an Element Plus text input.
- `notes` must be editable with an Element Plus textarea.
- User-entered line breaks in `notes` must be preserved so the generated JSON contains escaped `\n` newline sequences.
- The rewritten JSON must preserve all existing top-level fields and all non-target account fields.
- The rewritten JSON must ensure the top-level `accounts`, `exported_at`, and `proxies` fields exist.
- The component must show parse, validation, duplicate-name, and export errors in the UI.
- The component must provide a preview of the rewritten output before download.

### 3.2. Rewrite Rules

The browser rewrite must match the existing script's account metadata behavior:

```typescript
const emailSource = account.extra?.email ?? account.extra?.name ?? account.credentials?.email ?? account.name ?? "";

const emailLocalName = String(emailSource).split("@")[0];

const nextAccount = {
	name: `${accountBatchPrefix}|${emailLocalName}`,
	notes: notesValue || accountBatchPrefix,
	...restWithoutOldNameAndNotes,
};
```

Rules:

- `extra.email` wins over `extra.name`.
- `extra.name` wins over `credentials.email`.
- `credentials.email` wins over `name`.
- The local name is only split by `@`; no extra normalization is applied.
- Old `name` and `notes` values are removed before writing the new values.
- Empty `notes` falls back to `ACCOUNT_BATCH_PREFIX`, matching the old script's `notes || ACCOUNT_BATCH_PREFIX` behavior.
- If no email local name can be resolved, rewriting must fail with a clear account index.

### 3.3. JSON Shape

The component must accept Sub2API JSON objects with these fields:

```json
{
	"exported_at": "2026-07-25T00:00:00.000Z",
	"proxies": [],
	"accounts": []
}
```

Known optional top-level fields such as `type`, `version`, and `skipped_not_workspace` must be preserved. Unknown top-level fields must also be preserved.

Known account fields such as `platform`, `type`, `credentials`, `extra`, `concurrency`, `priority`, `rate_multiplier`, `expires_at`, `auto_pause_on_expired`, `group_ids`, and `plan_type` must be preserved.

### 3.4. VitePress Integration

- Create the Vue component beside the Sub2API markdown file:
  - `docs/ruan-cat-notes/docs/sundry/ai/sub2api/Sub2ApiJsonRewriter.vue`
- Put reusable pure rewrite logic beside it:
  - `docs/ruan-cat-notes/docs/sundry/ai/sub2api/sub2api-json-rewriter-core.ts`
- Import and render the component in:
  - `docs/ruan-cat-notes/docs/sundry/ai/sub2api/index.md`
- Use explicit client rendering:

```vue
<script setup>
import Sub2ApiJsonRewriter from "./Sub2ApiJsonRewriter.vue";
</script>

<ClientOnly>
	<div class="vp-raw">
		<Sub2ApiJsonRewriter />
	</div>
</ClientOnly>
```

### 3.5. Element Plus and Styling

- Use Element Plus form controls for the user-facing UI.
- Import Element Plus components explicitly in the SFC for type clarity.
- Map Element Plus primary colors to VitePress brand colors on the component root:
  - `--el-color-primary: var(--vp-c-brand-1)`
  - `--el-color-primary-light-3: var(--vp-c-brand-2)`
  - `--el-color-primary-light-5: var(--vp-c-brand-3)`
  - `--el-color-primary-light-9: var(--vp-c-brand-soft)`
- Use `:deep()` scoped CSS resets to prevent `.vp-doc` styles from breaking Element Plus `button`, `label`, `ul`, `li`, `table`, and form layouts.
- Do not add nested cards. Use one focused tool surface with clear sections.
- Keep border radius at 8px or lower.
- Keep copy operational; do not add marketing text or visible explanations of keyboard shortcuts.

### 3.6. Project-Level Skill

Create:

```plain
.agents/skills/vitepress-client-component-usage/SKILL.md
```

The skill must follow the concise structure of `.claude/skills/write-juejin-posts/SKILL.md` and document:

- When to use the skill.
- Component file placement.
- Markdown import and render modes.
- `<demo vue="./Xxx.vue" />` mode.
- `<ClientOnly><div class="vp-raw">...</div></ClientOnly>` mode.
- Element Plus style isolation requirements.
- Theme color mapping requirements.
- Validation checklist.
- Anti-patterns.

### 3.7. Validation Requirements

Validation must include:

- Unit tests for the pure rewrite functions.
- A no-Node scan on the Vue component and browser core logic.
- A low-cost browser validation with `agent-browser`.
- No full notes VitePress dev server unless a lighter approach fails.

## 4. Implementation Approach

Use a split design:

- `sub2api-json-rewriter-core.ts` contains pure browser-safe functions and is unit-tested.
- `Sub2ApiJsonRewriter.vue` handles Element Plus UI, browser file reading, preview, and download.
- `index.md` only imports and renders the component.
- `.agents/skills/vitepress-client-component-usage/SKILL.md` records the project pattern for future tasks.

This keeps business logic testable without booting the full VitePress site and keeps the VitePress page integration small.

## 5. Testing Strategy

### 5.1. Unit Tests

Create:

```plain
docs/ruan-cat-notes/tests/sub2api-json-rewriter-core.test.ts
```

Cover:

- `extra.email` priority.
- `credentials.email` fallback.
- `name` fallback.
- Batch prefix rewrite.
- Notes newline preservation.
- Empty notes fallback to prefix.
- Preservation of top-level fields.
- Auto-fill of missing `exported_at` and `proxies`.
- Invalid JSON and invalid account shape errors.
- Output file name sanitization.

### 5.2. Command Verification

Run:

```bash
pnpm exec vitest run docs/ruan-cat-notes/tests/sub2api-json-rewriter-core.test.ts docs/ruan-cat-notes/tests/sub2api-rewrite-wishtoapp-name.test.ts
```

Expected: both test files pass.

Run:

```bash
rg -n "node:|from \"fs\"|from 'fs'|from \"path\"|from 'path'|process\\." docs/ruan-cat-notes/docs/sundry/ai/sub2api/Sub2ApiJsonRewriter.vue docs/ruan-cat-notes/docs/sundry/ai/sub2api/sub2api-json-rewriter-core.ts
```

Expected: no matches.

Run:

```bash
git diff --check
```

Expected: no whitespace errors.

### 5.3. Browser Validation

Use a lightweight Vite harness or equivalent low-cost browser setup to mount the component without starting the full notes VitePress project.

With `agent-browser`, validate:

- The component renders.
- A sample Sub2API JSON file can be selected.
- Prefix and notes can be edited.
- The preview shows rewritten account names.
- Download produces a JSON file.
- The downloaded JSON parses and contains the rewritten `name` and `notes` values.

## 6. Non-Goals

- Do not replace or delete `rewrite-wishtoapp-sub2api-name.ts`.
- Do not add a backend service.
- Do not use Node APIs in the production component.
- Do not start the full notes VitePress dev server unless all lower-cost validation paths fail.
- Do not commit automatically.

## 7. Risks

- Element Plus internals may be affected by VitePress `.vp-doc` styles. Mitigation: root theme variables and scoped `:deep()` resets.
- Upload components can imply server upload. Mitigation: `auto-upload=false`, local `File.text()`, and no `action`-based flow.
- Existing staged changes include the target markdown section. Mitigation: append to the current file content without reverting staged changes.
- The old script does not add missing `exported_at` or `proxies`, but project memory requires these top-level fields. Mitigation: the new browser core preserves existing fields and adds missing `exported_at` and `proxies` for schema correctness.
