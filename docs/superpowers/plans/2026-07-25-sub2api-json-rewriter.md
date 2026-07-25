# Sub2API JSON Rewriter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a browser-only Vue and Element Plus tool that reads a Sub2API JSON file, batch rewrites account `name` and `notes`, exports JSON, documents the VitePress client-component pattern, and verifies the flow without starting the full notes VitePress site.

**Architecture:** Put pure JSON rewrite logic in `sub2api-json-rewriter-core.ts`, UI and browser file APIs in `Sub2ApiJsonRewriter.vue`, page integration in `index.md`, and reusable project instructions in `.agents/skills/vitepress-client-component-usage/SKILL.md`. Unit tests cover the core behavior; a lightweight browser harness verifies the user workflow.

**Tech Stack:** Vue 3.5, VitePress 1.6, Element Plus 2.13, Vitest 3.2, browser `File`, `Blob`, `URL.createObjectURL`, `HTMLAnchorElement.download`.

## Global Constraints

- The production Vue component must not use Node APIs: no `node:fs`, `node:path`, `fileURLToPath`, `process`, `fs`, or `path`.
- `ACCOUNT_BATCH_PREFIX` must be controlled by an Element Plus text input.
- `notes` must be controlled by an Element Plus textarea and preserve user-entered newlines.
- Account `name` must be rewritten as `ACCOUNT_BATCH_PREFIX|emailLocalName`.
- Email local name source order is `extra.email`, `extra.name`, `credentials.email`, `name`.
- Empty `notes` falls back to `ACCOUNT_BATCH_PREFIX`.
- Preserve all unknown top-level fields and all non-target account fields.
- Ensure top-level `accounts`, `exported_at`, and `proxies` exist in generated JSON.
- Use explicit VitePress client rendering in `index.md`.
- Use Element Plus theme mapping to VitePress brand colors on the component root.
- Use scoped `:deep()` resets for VitePress `.vp-doc` style pollution.
- Do not modify or delete `rewrite-wishtoapp-sub2api-name.ts`.
- Do not start the full notes VitePress dev server unless low-cost validation fails.
- Do not revert existing user or staged changes.

---

## 1. File Structure

- Create `docs/ruan-cat-notes/docs/sundry/ai/sub2api/sub2api-json-rewriter-core.ts`
  - Browser-safe pure functions for parsing, rewriting, stringifying, and file-name sanitization.
- Create `docs/ruan-cat-notes/docs/sundry/ai/sub2api/Sub2ApiJsonRewriter.vue`
  - Element Plus UI, browser file reading, preview table, warnings, and download.
- Modify `docs/ruan-cat-notes/docs/sundry/ai/sub2api/index.md`
  - Add `<script setup>` import and render the component under `给 sub2api json 文件增加必要前缀`.
- Create `docs/ruan-cat-notes/tests/sub2api-json-rewriter-core.test.ts`
  - Vitest coverage for the pure core.
- Create `.agents/skills/vitepress-client-component-usage/SKILL.md`
  - Project-level future guidance for VitePress client-rendered Vue components.

## 2. Task 1: Browser-Safe Rewrite Core and Tests

**Files:**

- Create: `docs/ruan-cat-notes/docs/sundry/ai/sub2api/sub2api-json-rewriter-core.ts`
- Create: `docs/ruan-cat-notes/tests/sub2api-json-rewriter-core.test.ts`

**Interfaces:**

- Produces `parseSub2ApiJsonText(text: string): Sub2ApiExportFile`
- Produces `rewriteSub2ApiJson(source: Sub2ApiExportFile, options: RewriteSub2ApiJsonOptions): RewriteSub2ApiJsonResult`
- Produces `stringifySub2ApiJson(value: Sub2ApiExportFile): string`
- Produces `createDefaultOutputFileName(sourceFileName: string | undefined, accountBatchPrefix: string): string`
- Produces `sanitizeJsonFileName(fileName: string): string`

- [ ] **Step 1: Write the core file**

Create the core with these exact responsibilities:

```typescript
export interface AccountRecord {
	credentials?: {
		email?: string;
		[key: string]: unknown;
	};
	extra?: {
		email?: string;
		name?: string;
		[key: string]: unknown;
	};
	name?: string;
	notes?: string;
	[key: string]: unknown;
}

export interface Sub2ApiExportFile {
	accounts?: AccountRecord[];
	exported_at?: string;
	proxies?: unknown[];
	[key: string]: unknown;
}

export interface RewriteSub2ApiJsonOptions {
	accountBatchPrefix: string;
	exportedAt?: string;
	notes: string;
}

export interface RewrittenAccountPreview {
	afterName: string;
	beforeName: string;
	emailLocalName: string;
	index: number;
}

export interface RewriteSub2ApiJsonResult {
	accountCount: number;
	duplicateNames: string[];
	output: Sub2ApiExportFile;
	preview: RewrittenAccountPreview[];
}
```

Core behavior:

- `parseSub2ApiJsonText` parses JSON and rejects non-object or array root values.
- `rewriteSub2ApiJson` rejects blank `accountBatchPrefix`.
- `rewriteSub2ApiJson` rejects missing or non-array `accounts`.
- `rewriteSub2ApiJson` rejects non-object accounts and reports the zero-based index.
- `rewriteSub2ApiJson` computes email local names using `extra.email ?? extra.name ?? credentials.email ?? name ?? ""`.
- `rewriteSub2ApiJson` writes `name`, writes `notes || accountBatchPrefix`, and preserves rest fields.
- `rewriteSub2ApiJson` preserves top-level fields and adds `exported_at` and `proxies` when missing.
- `rewriteSub2ApiJson` reports duplicate rewritten names.
- `stringifySub2ApiJson` returns tab-indented JSON plus final newline.
- `sanitizeJsonFileName` removes Windows-illegal characters and control characters, trims whitespace, and appends `.json`.
- `createDefaultOutputFileName` keeps the uploaded source file name when present, otherwise uses `${accountBatchPrefix}.json`.

- [ ] **Step 2: Write Vitest tests**

Create tests with `import { test, describe } from "vitest";`.

Test cases:

- `extra.email` has priority over `credentials.email`.
- `credentials.email` is used when `extra.email` is missing.
- `name` is used as the final fallback.
- Multiline notes become escaped `\n` after `JSON.stringify`.
- Blank notes fall back to prefix.
- Existing top-level fields remain unchanged.
- Missing `exported_at` and `proxies` are added.
- Invalid JSON root throws.
- Missing accounts array throws.
- Invalid account item throws with index.
- Duplicate names are reported.
- File names are sanitized.

- [ ] **Step 3: Run tests**

Run:

```bash
pnpm exec vitest run docs/ruan-cat-notes/tests/sub2api-json-rewriter-core.test.ts
```

Expected: PASS.

## 3. Task 2: Vue Element Plus Component

**Files:**

- Create: `docs/ruan-cat-notes/docs/sundry/ai/sub2api/Sub2ApiJsonRewriter.vue`
- Consume: `docs/ruan-cat-notes/docs/sundry/ai/sub2api/sub2api-json-rewriter-core.ts`

**Interfaces:**

- Consumes all functions from Task 1.
- Produces a client-only user workflow for upload, rewrite preview, and download.

- [ ] **Step 1: Build the SFC script**

Use `<script lang="ts" setup>` and import:

```typescript
import { computed, ref } from "vue";
import {
	ElAlert,
	ElButton,
	ElDescriptions,
	ElDescriptionsItem,
	ElForm,
	ElFormItem,
	ElInput,
	ElMessage,
	ElTable,
	ElTableColumn,
	ElTag,
	ElUpload,
} from "element-plus";
import type { UploadFile } from "element-plus";
import { Download, RefreshLeft, UploadFilled } from "@element-plus/icons-vue";
```

State:

- `sourceFileName`
- `accountBatchPrefix`
- `notes`
- `outputFileName`
- `sourceJson`
- `rewriteResult`
- `rawJsonText`
- `errorMessage`
- `isReady`

Handlers:

- `handleFileChange(uploadFile: UploadFile)` uses `uploadFile.raw?.text()`.
- `rewritePreview()` uses `rewriteSub2ApiJson`.
- `downloadJson()` uses `Blob`, `URL.createObjectURL`, an anchor with `download`, and `URL.revokeObjectURL`.
- `resetForm()` clears state.

- [ ] **Step 2: Build the template**

The template must include:

- A root `.sub2api-json-rewriter` tool surface.
- `ElUpload` with `drag`, `accept=".json,application/json"`, `auto-upload=false`, `show-file-list=false`.
- `ElForm` with:
  - `ACCOUNT_BATCH_PREFIX` text input.
  - `notes` textarea.
  - output file name text input.
- Action buttons:
  - Generate preview.
  - Download JSON.
  - Reset.
- Summary using `ElDescriptions`.
- Warnings using `ElAlert`.
- Preview table using `ElTable` for the first rewritten account rows.

- [ ] **Step 3: Add scoped styling**

Add `lang="scss" scoped`.

Required styling:

- Root maps Element Plus primary variables to VitePress brand variables.
- Root uses one bordered tool surface with `border-radius: 8px`.
- Use `:deep(button)`, `:deep(label)`, `:deep(ul)`, `:deep(li)`, `:deep(table)` resets to prevent VitePress `.vp-doc` pollution.
- Keep responsive layout usable below 640px.
- Do not use nested cards.

- [ ] **Step 4: Run component no-Node scan**

Run:

```bash
rg -n "node:|from \"fs\"|from 'fs'|from \"path\"|from 'path'|process\\." docs/ruan-cat-notes/docs/sundry/ai/sub2api/Sub2ApiJsonRewriter.vue docs/ruan-cat-notes/docs/sundry/ai/sub2api/sub2api-json-rewriter-core.ts
```

Expected: no matches.

## 4. Task 3: VitePress Markdown Integration

**Files:**

- Modify: `docs/ruan-cat-notes/docs/sundry/ai/sub2api/index.md`

**Interfaces:**

- Consumes `Sub2ApiJsonRewriter.vue`.
- Produces client-rendered component under the target section.

- [ ] **Step 1: Add script setup import**

At the top of `index.md`, before the first heading, add:

```vue
<script setup>
import Sub2ApiJsonRewriter from "./Sub2ApiJsonRewriter.vue";
</script>
```

- [ ] **Step 2: Render under the target section**

Under `## 给 sub2api json 文件增加必要前缀`, add:

```vue
<ClientOnly>
	<div class="vp-raw">
		<Sub2ApiJsonRewriter />
	</div>
</ClientOnly>
```

- [ ] **Step 3: Preserve staged content**

Before and after editing, run:

```bash
git diff --cached -- docs/ruan-cat-notes/docs/sundry/ai/sub2api/index.md
git diff -- docs/ruan-cat-notes/docs/sundry/ai/sub2api/index.md
```

Expected: the existing staged heading remains; unstaged diff only adds the import and component render.

## 5. Task 4: Project-Level VitePress Component Skill

**Files:**

- Create: `.agents/skills/vitepress-client-component-usage/SKILL.md`

**Interfaces:**

- Produces project guidance for future agents.

- [ ] **Step 1: Create skill**

Write frontmatter:

```yaml
---
name: vitepress-client-component-usage
description: 在 D:\code\ruan-cat\notes 的 docs/ruan-cat-notes/docs 中创建、导入、渲染或修复 VitePress Markdown 内客户端 Vue 组件时使用。覆盖 <demo vue="./Xxx.vue" />、<ClientOnly>、vp-raw、Element Plus 样式隔离、主题色映射和浏览器端验证。
---
```

Write sections:

- `## 1. 适用场景`
- `## 2. 组件落点`
- `## 3. Markdown 使用模式`
- `## 4. Element Plus 组件约束`
- `## 5. 样式隔离`
- `## 6. 验证清单`
- `## 7. 反模式`

All second-level and third-level headings must have numeric prefixes.

- [ ] **Step 2: Validate skill text**

Run:

```bash
rg -n "TB[D]|TO[D]O|待[补]|占[位]" .agents/skills/vitepress-client-component-usage/SKILL.md
```

Expected: no matches.

## 6. Task 5: Verification

**Files:**

- Read/verify files from Tasks 1-4.
- Temporary browser harness files may be created under `.temp/sub2api-json-rewriter-harness/` and removed before final response.

**Interfaces:**

- Consumes final component and core.
- Produces command and browser evidence.

- [ ] **Step 1: Run unit tests**

Run:

```bash
pnpm exec vitest run docs/ruan-cat-notes/tests/sub2api-json-rewriter-core.test.ts docs/ruan-cat-notes/tests/sub2api-rewrite-wishtoapp-name.test.ts
```

Expected: both test files pass.

- [ ] **Step 2: Run no-Node scan**

Run:

```bash
rg -n "node:|from \"fs\"|from 'fs'|from \"path\"|from 'path'|process\\." docs/ruan-cat-notes/docs/sundry/ai/sub2api/Sub2ApiJsonRewriter.vue docs/ruan-cat-notes/docs/sundry/ai/sub2api/sub2api-json-rewriter-core.ts
```

Expected: no matches.

- [ ] **Step 3: Run format safety check**

Run:

```bash
git diff --check
```

Expected: no whitespace errors.

- [ ] **Step 4: Browser validate with agent-browser**

Use a lightweight Vite harness, not the full notes VitePress server.

Browser assertions:

- Component renders.
- A sample JSON file can be loaded.
- Prefix can be edited.
- Notes can be edited with a newline.
- Preview shows `prefix|local`.
- Downloaded JSON parses and includes escaped newline in `notes`.

- [ ] **Step 5: Cleanup**

Close subagents and remove temporary harness files. Run the cleanup-agent-team-node-processes skill or an equivalent process check to avoid orphan Node processes.
