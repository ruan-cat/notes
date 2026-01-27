# [Bug] Windows 系统下 websearch-transformer.cjs 的 spawnSync 兼容性问题

## 问题概述

在 Windows 系统中，`lib/hooks/websearch-transformer.cjs` 脚本的 `isCliAvailable()` 函数能正确检测到全局安装的 CLI 工具（如 `gemini`），但后续的 `spawnSync()` 执行却报 `ENOENT` 错误，导致 WebSearch 功能完全不可用。

## 环境信息

- **操作系统**: Windows 10/11
- **Node.js**: v22.x
- **包管理器**: pnpm（全局安装 gemini）
- **gemini 安装方式**: `pnpm add -g @google/gemini-cli`

## 复现步骤

1. 在 Windows 系统上使用 pnpm 全局安装 gemini：

   ```powershell
   pnpm add -g @google/gemini-cli
   ```

2. 验证 gemini 已正确安装且可用：

   ```powershell
   where.exe gemini
   # 输出：
   # C:\Users\pc\AppData\Local\pnpm\gemini
   # C:\Users\pc\AppData\Local\pnpm\gemini.bat
   # C:\Users\pc\AppData\Local\pnpm\gemini.CMD

   gemini --version
   # 正常输出版本号
   ```

3. 启用 CCS WebSearch 功能，触发 `websearch-transformer.cjs` hook

4. 观察错误：hook 检测到 gemini 存在，但执行时失败

## 预期行为

- `isCliAvailable('gemini')` 返回 `true` ✅
- `spawnSync('gemini', [...])` 成功执行 ✅

## 实际行为

- `isCliAvailable('gemini')` 返回 `true` ✅
- `spawnSync('gemini', [...])` 报错 `ENOENT` ❌

**检测说"有"，执行却报"找不到"**

## 根本原因分析

### Windows 上 npm/pnpm 全局安装的特殊性

在 Windows 系统上，npm/pnpm 全局安装的 CLI 工具实际上是 `.cmd` 或 `.bat` 批处理文件，而不是真正的 `.exe` 可执行文件：

```plain
C:\Users\pc\AppData\Local\pnpm\gemini      ← symlink
C:\Users\pc\AppData\Local\pnpm\gemini.bat  ← 批处理文件
C:\Users\pc\AppData\Local\pnpm\gemini.CMD  ← 批处理文件
```

### Node.js spawnSync 的行为差异

| 操作                                 | 目标文件类型 | 需要 shell | 结果      |
| ------------------------------------ | ------------ | ---------- | --------- |
| `spawnSync('where.exe', ['gemini'])` | `.exe` 文件  | 不需要     | ✅ 成功   |
| `spawnSync('gemini', [...])`         | `.cmd` 文件  | **需要**   | ❌ ENOENT |

`spawnSync()` 在没有 `shell: true` 选项时，无法直接执行 `.cmd`/`.bat` 批处理文件，会返回 `ENOENT` 错误。

### 代码中的问题位置

**`isCliAvailable` 函数（第 155-169 行）** - 使用 `where.exe`，能正常工作：

```javascript
function isCliAvailable(cmd) {
  const isWindows = process.platform === 'win32';
  const whichCmd = isWindows ? 'where.exe' : 'which';
  // where.exe 是真正的 .exe，可以直接执行
  const result = spawnSync(whichCmd, [cmd], { ... });
  return result.status === 0;
}
```

**`tryGeminiSearch` 函数（第 287-296 行）** - 缺少 `shell: true`：

```javascript
const spawnResult = spawnSync("gemini", ["--model", model, "--yolo", "-p", prompt], {
	encoding: "utf8",
	timeout: timeoutMs,
	maxBuffer: 1024 * 1024 * 2,
	stdio: ["pipe", "pipe", "pipe"],
	// ❌ 缺少: shell: true 或 shell: process.platform === 'win32'
});
```

同样的问题也存在于：

- `tryOpenCodeSearch` 函数（第 353-362 行）
- `tryGrokSearch` 函数（第 415-420 行）

## Bug 复现脚本

```javascript
const { spawnSync } = require("child_process");

const cmd = "gemini";

// Step 1: 检测 - 成功
const detect = spawnSync("where.exe", [cmd], { encoding: "utf8" });
console.log("检测结果:", detect.status === 0 ? "✅ 找到" : "❌ 未找到");
console.log("路径:", detect.stdout.trim());

// Step 2: 执行（无 shell）- 失败
const exec1 = spawnSync(cmd, ["--version"], { encoding: "utf8" });
console.log("无 shell 执行:", exec1.error?.code || "成功");
// 输出: ENOENT

// Step 3: 执行（有 shell）- 成功
const exec2 = spawnSync(cmd, ["--version"], { encoding: "utf8", shell: true });
console.log("有 shell 执行:", exec2.error?.code || "成功");
// 输出: 成功
```

### 完整复现脚本输出

```plain
============================================================
Windows spawnSync Bug Reproduction
============================================================
Platform: win32
Testing command: gemini

【Step 1】检测命令是否存在
----------------------------------------
执行: where.exe gemini
✅ 检测成功！命令路径:
   C:\Users\pc\AppData\Local\pnpm\gemini
   C:\Users\pc\AppData\Local\pnpm\gemini.bat
   C:\Users\pc\AppData\Local\pnpm\gemini.CMD

【Step 2】直接执行命令（无 shell: true）
----------------------------------------
执行: spawnSync('gemini', ['--version'], { /* 无 shell */ })
❌ 执行失败!
   Error code: ENOENT
   Error message: spawnSync gemini ENOENT

   💡 这就是 Bug！
   虽然 where.exe 能找到命令，但 spawnSync 报 ENOENT
   原因: npm/pnpm 全局安装的是 .cmd 文件，需要 shell 来执行

【Step 3】使用 shell: true 执行命令
----------------------------------------
执行: spawnSync('gemini', ['--version'], { shell: true })
✅ 执行成功!
```

## 建议修复方案

### 方案 1：在文件顶部定义通用 spawn 选项

```javascript
// 在文件顶部添加
const SPAWN_OPTIONS = {
	encoding: "utf8",
	stdio: ["pipe", "pipe", "pipe"],
	shell: process.platform === "win32", // Windows 需要 shell 执行 .cmd 文件
};
```

### 方案 2：修改各个 spawnSync 调用

```javascript
// tryGeminiSearch
const spawnResult = spawnSync("gemini", ["--model", model, "--yolo", "-p", prompt], {
	encoding: "utf8",
	timeout: timeoutMs,
	maxBuffer: 1024 * 1024 * 2,
	stdio: ["pipe", "pipe", "pipe"],
	shell: process.platform === "win32", // 添加这行
});

// tryOpenCodeSearch 和 tryGrokSearch 同理
```

### 方案 3：使用 cross-spawn 库（更健壮）

```javascript
const spawn = require("cross-spawn");
// cross-spawn 自动处理 Windows .cmd 文件
const result = spawn.sync("gemini", ["--version"]);
```

## 影响范围

此问题影响所有在 Windows 系统上使用 CCS WebSearch 功能的用户，特别是：

- 使用 npm/pnpm/yarn 全局安装 CLI 工具的用户
- 使用 Gemini CLI、OpenCode、Grok CLI 作为 WebSearch 提供者的用户

## 参考资料

- [Node.js child_process.spawnSync 文档](https://nodejs.org/api/child_process.html#child_processspawnsynccommand-args-options)
- [cross-spawn 库](https://github.com/moxystudio/node-cross-spawn) - 解决跨平台 spawn 问题的常用方案
