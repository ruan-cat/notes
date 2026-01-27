# [Bug] spawnSync in websearch-transformer.cjs fails on Windows due to missing `shell: true`

## Summary

On Windows, the `lib/hooks/websearch-transformer.cjs` script's `isCliAvailable()` function correctly detects globally installed CLI tools (e.g., `gemini`), but the subsequent `spawnSync()` calls fail with `ENOENT` error, making the WebSearch feature completely unusable.

## Environment

- **OS**: Windows 10/11
- **Node.js**: v22.x
- **Package Manager**: pnpm (gemini installed globally)
- **Installation**: `pnpm add -g @google/gemini-cli`

## Steps to Reproduce

1. Install gemini globally on Windows using pnpm:

   ```powershell
   pnpm add -g @google/gemini-cli
   ```

2. Verify gemini is correctly installed and working:

   ```powershell
   where.exe gemini
   # Output:
   # C:\Users\pc\AppData\Local\pnpm\gemini
   # C:\Users\pc\AppData\Local\pnpm\gemini.bat
   # C:\Users\pc\AppData\Local\pnpm\gemini.CMD

   gemini --version
   # Works correctly, outputs version
   ```

3. Enable CCS WebSearch feature, triggering the `websearch-transformer.cjs` hook

4. Observe the error: hook detects gemini exists, but execution fails

## Expected Behavior

- `isCliAvailable('gemini')` returns `true` ✅
- `spawnSync('gemini', [...])` executes successfully ✅

## Actual Behavior

- `isCliAvailable('gemini')` returns `true` ✅
- `spawnSync('gemini', [...])` fails with `ENOENT` ❌

**Detection says "found", but execution says "not found"**

## Root Cause Analysis

### How npm/pnpm Global Installs Work on Windows

On Windows, globally installed CLI tools via npm/pnpm are actually `.cmd` or `.bat` batch files, not real `.exe` executables:

```plain
C:\Users\pc\AppData\Local\pnpm\gemini      ← symlink
C:\Users\pc\AppData\Local\pnpm\gemini.bat  ← batch file
C:\Users\pc\AppData\Local\pnpm\gemini.CMD  ← batch file
```

### Node.js spawnSync Behavior Difference

| Operation                            | Target File Type | Requires shell | Result     |
| ------------------------------------ | ---------------- | -------------- | ---------- |
| `spawnSync('where.exe', ['gemini'])` | `.exe` file      | No             | ✅ Success |
| `spawnSync('gemini', [...])`         | `.cmd` file      | **Yes**        | ❌ ENOENT  |

`spawnSync()` without the `shell: true` option cannot directly execute `.cmd`/`.bat` batch files and returns `ENOENT` error.

### Affected Code Locations

**`isCliAvailable` function (lines 155-169)** - Works correctly because `where.exe` is a real executable:

```javascript
function isCliAvailable(cmd) {
  const isWindows = process.platform === 'win32';
  const whichCmd = isWindows ? 'where.exe' : 'which';
  // where.exe is a real .exe, can be executed directly
  const result = spawnSync(whichCmd, [cmd], { ... });
  return result.status === 0;
}
```

**`tryGeminiSearch` function (lines 287-296)** - Missing `shell: true`:

```javascript
const spawnResult = spawnSync("gemini", ["--model", model, "--yolo", "-p", prompt], {
	encoding: "utf8",
	timeout: timeoutMs,
	maxBuffer: 1024 * 1024 * 2,
	stdio: ["pipe", "pipe", "pipe"],
	// ❌ Missing: shell: true or shell: process.platform === 'win32'
});
```

The same issue exists in:

- `tryOpenCodeSearch` function (lines 353-362)
- `tryGrokSearch` function (lines 415-420)

## Minimal Reproduction Script

```javascript
const { spawnSync } = require("child_process");

const cmd = "gemini";

// Step 1: Detection - Works
const detect = spawnSync("where.exe", [cmd], { encoding: "utf8" });
console.log("Detection:", detect.status === 0 ? "✅ Found" : "❌ Not found");
console.log("Path:", detect.stdout.trim());

// Step 2: Execution (no shell) - Fails
const exec1 = spawnSync(cmd, ["--version"], { encoding: "utf8" });
console.log("Without shell:", exec1.error?.code || "Success");
// Output: ENOENT

// Step 3: Execution (with shell) - Works
const exec2 = spawnSync(cmd, ["--version"], { encoding: "utf8", shell: true });
console.log("With shell:", exec2.error?.code || "Success");
// Output: Success
```

### Full Reproduction Script Output

```plain
============================================================
Windows spawnSync Bug Reproduction
============================================================
Platform: win32
Testing command: gemini

【Step 1】Detection
----------------------------------------
Command: where.exe gemini
✅ Detection successful! Paths:
   C:\Users\pc\AppData\Local\pnpm\gemini
   C:\Users\pc\AppData\Local\pnpm\gemini.bat
   C:\Users\pc\AppData\Local\pnpm\gemini.CMD

【Step 2】Execution without shell: true
----------------------------------------
Command: spawnSync('gemini', ['--version'], { /* no shell */ })
❌ Execution failed!
   Error code: ENOENT
   Error message: spawnSync gemini ENOENT

   💡 This is the bug!
   where.exe can find the command, but spawnSync reports ENOENT
   Reason: npm/pnpm global installs are .cmd files, requires shell to execute

【Step 3】Execution with shell: true
----------------------------------------
Command: spawnSync('gemini', ['--version'], { shell: true })
✅ Execution successful!
```

## Suggested Fix

### Option 1: Define common spawn options at file top

```javascript
// Add at the top of the file
const SPAWN_OPTIONS = {
	encoding: "utf8",
	stdio: ["pipe", "pipe", "pipe"],
	shell: process.platform === "win32", // Windows needs shell to execute .cmd files
};
```

### Option 2: Add shell option to each spawnSync call

```javascript
// In tryGeminiSearch
const spawnResult = spawnSync("gemini", ["--model", model, "--yolo", "-p", prompt], {
	encoding: "utf8",
	timeout: timeoutMs,
	maxBuffer: 1024 * 1024 * 2,
	stdio: ["pipe", "pipe", "pipe"],
	shell: process.platform === "win32", // Add this line
});

// Same for tryOpenCodeSearch and tryGrokSearch
```

### Option 3: Use cross-spawn library (more robust)

```javascript
const spawn = require("cross-spawn");
// cross-spawn automatically handles Windows .cmd files
const result = spawn.sync("gemini", ["--version"]);
```

## Impact

This issue affects all Windows users trying to use CCS WebSearch feature, specifically:

- Users who install CLI tools globally via npm/pnpm/yarn
- Users using Gemini CLI, OpenCode, or Grok CLI as WebSearch providers

## References

- [Node.js child_process.spawnSync documentation](https://nodejs.org/api/child_process.html#child_processspawnsynccommand-args-options)
- [cross-spawn library](https://github.com/moxystudio/node-cross-spawn) - Common solution for cross-platform spawn issues
- Related issue: This is a well-known Node.js behavior on Windows
