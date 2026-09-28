# 当 cz 命令集体罢工：commitizen 裸模块名与 pnpm 12 全局隔离布局的冲突

## 一、现象：所有项目的 cz 都炸了

某天照常在一个项目里敲下 `cz`，准备写一条规规矩矩的 conventional commit，结果迎面一盆冷水：

```log
PS D:\code\ruan-cat\SmallAliceWeb> cz
Could not resolve cz-git. Cannot find module 'cz-git'
Require stack:
- C:\Users\pc\AppData\Local\pnpm\global\v11\5a6c-18d56a1f7f818d68-18\node_modules\.pnpm\commitizen@4.3.2_.../dist/commitizen/adapter.js
- ...
```

换个项目再试，同样的报错，一字不差。`cz` 是全局命令，报错栈里全是 commitizen 自己的文件——说明 commitizen 本体活得好好的，是它在加载 adapter（也就是 `cz-git`）的时候扑空了。

第一反应很自然：全局的 `cz-git` 丢了？重装！

```bash
pnpm add -g cz-git
```

装完再跑 `cz`——依然炸。`pnpm ls -g` 里明明写着 `cz-git@1.14.0`，白纸黑字，但 commitizen 就是不认。

## 二、第一个矛盾：明明装了，为什么找不到

更诡异的事情在项目内部。`SmallAliceWeb` 的 `package.json` 里有 `cz-git@^1.12.0`，`node_modules/cz-git` 好好地躺在那里。用 node 直接解析：

```bash
cd D:\code\ruan-cat\SmallAliceWeb
node -e "console.log(require.resolve('cz-git'))"
# D:\code\ruan-cat\SmallAliceWeb\node_modules\.pnpm\cz-git@1.12.0\node_modules\cz-git\lib\index.js
```

**解析成功，路径清清楚楚。** 但 commitizen 跑起来就是 `Cannot find module 'cz-git'`。

项目里的包，node 看得见，commitizen 看不见。这就不是「包丢了」的问题了，而是 commitizen **找包的方式**和我想的不一样。

## 三、读源码：commitizen 是怎么找 adapter 的

翻开 commitizen 4.3.2 的 `dist/commitizen/adapter.js`，核心函数 `resolveAdapterPath` 大约长这样（去掉覆盖率插桩后的逻辑）：

```js
function resolveAdapterPath(inboundAdapterPath) {
	// 判断传入的是"路径"还是"模块名"
	let parsed = path.parse(inboundAdapterPath);
	let isPath = parsed.dir.length > 0 && parsed.dir.charAt(0) !== "@";

	// 如果是路径，从 git 仓库根解析；如果是模块名，原样保留
	let absoluteAdapterPath = isPath ? path.resolve(getGitRootPath(), inboundAdapterPath) : inboundAdapterPath;

	try {
		return require.resolve(absoluteAdapterPath);
	} catch (error) {
		error.message = "Could not resolve " + absoluteAdapterPath + ". " + error.message;
		throw error;
	}
}
```

答案就在这个 `isPath` 分支里，两种写法走的是**完全不同的查找路径**：

| `.czrc` 写法                                | commitizen 的行为                                                                      |
| ------------------------------------------- | -------------------------------------------------------------------------------------- |
| `"path": "cz-git"`（裸模块名）              | `require.resolve('cz-git')`，**从 commitizen 自己的安装位置**向上逐级查找 node_modules |
| `"path": "node_modules/cz-git"`（相对路径） | `path.resolve(git仓库根, 'node_modules/cz-git')`，得到绝对路径后直接加载               |

关键结论：**裸模块名写法从来没有「从当前项目找」的 fallback**。`require.resolve('cz-git')` 的查找起点是 commitizen 自己——全局装的那个 commitizen。它一路向上翻的是 `global/v11/<hash>/node_modules/...`、`AppData/Local/node_modules`、`C:/Users/pc/node_modules`、`C:/node_modules`……唯独**永远不会**去看你项目里的 `node_modules`。

所以「项目里明明装了 cz-git」和「commitizen 找得到」之间，隔着一整个文件系统。

## 四、真相：pnpm 12 的全局目录是「一格一包」

那全局重装为什么也没用？这就要看 pnpm 12 的全局目录长什么样了。

翻进 `C:\Users\pc\AppData\Local\pnpm\global\v11\`，看到的不是以前那种「一个大 node_modules 平铺所有全局包」的景象，而是**上百个 hash 命名的目录**：

```log
global/v11/
├── 5a6c-18d56a0ebcf8fca0-0/
├── 5a6c-18d56a10d6389e1c-2/
├── ...（100+ 个 hash 目录）
├── d9aeee6e03c2.../          ← commitizen 住这里
│   └── node_modules/
│       ├── commitizen        ← 顶层只有它自己
│       └── .pnpm/            ← 只有 commitizen 的依赖闭包
├── 96670f83a790.../          ← cz-git 住这里
│   └── node_modules/
│       └── cz-git            ← 顶层也只有它自己
└── pnpm-lock.yaml
```

每个 hash 目录是一个**独立虚拟环境**：自带一份 `package.json`（只记录该次安装的包）和独立的 `.pnpm` 依赖闭包。做了一组实验验证：

```bash
pnpm add -g commitizen cz-git
# .../global/v11/1d48-18d967ae213c5ba8-0  | commitizen 4.3.2（148 个包）
# .../global/v11/1d48-18d967ae54f85258-1  | cz-git（1 个包）
```

**同一条 `pnpm add -g` 命令装两个包，pnpm 12 依然把它们拆进两个互不相通的 hash 环境。** 这不是操作失误，是布局设计如此。扫描了全局目录里全部 100+ 个历史环境，commitizen 和 cz-git 从来没有在同一个闭包里出现过。

于是整个故障链条闭合了：

1. `.czrc` 写的是裸模块名 `"cz-git"` → commitizen 从**自己的 hash 环境**里找；
2. pnpm 12 把每个全局包隔离在独立环境 → commitizen 的环境里**永远**不会有 cz-git；
3. 项目本地的 cz-git？裸模块名分支根本不看项目 → 装了也白装。

至于为什么「以前一直好好的」——那是因为 npm 时代的全局目录是平铺的，全局包互相可见，裸模块名**碰巧**能工作。这是历史巧合，从来不是 commitizen 承诺过的行为。pnpm 11/12 换掉全局布局后，巧合失效，问题就浮出水面了。

## 五、修复：一个写法的差别

commitizen 的 `isPath` 分支给了我们正解：**让配置走「相对路径」分支**。这也正是 cz-git 官方文档推荐的写法：

```json
{
	"path": "node_modules/cz-git"
}
```

它的工作机制：commitizen 先用 `git rev-parse --show-toplevel` 拿到 git 仓库根，再 `path.resolve(git根, 'node_modules/cz-git')` 拼出绝对路径，最后 `require.resolve` 这个绝对路径——精准命中**项目本地安装的 cz-git**。

两个使用前提：

1. 项目本地装了 cz-git（`pnpm i -D cz-git`）；
2. `.czrc` 所在项目根 = git 仓库根。monorepo 子包的 git root 在上层，相对路径要写成相对 git root 的形式。

修复后跑一遍 commitizen 真实的加载链做验证：

```bash
node -e "const a=require('<全局commitizen>/dist/commitizen/adapter.js');
console.log(a.resolveAdapterPath('node_modules/cz-git'));
console.log(typeof a.getPrompter('node_modules/cz-git'))"
# D:\code\ruan-cat\SmallAliceWeb\node_modules\.pnpm\cz-git@1.12.0\node_modules\cz-git\lib\index.js
# function
```

`resolveAdapterPath` 返回了项目本地的 cz-git，`getPrompter` 把 adapter 模块真刀真枪加载了一遍并拿到了 prompter 函数。`cz` 复活。

## 六、举一反三：pnpm 12 全局布局的避坑清单

这次排障沉淀下来几条通用结论，凡是用 pnpm 12 全局包的都值得过一遍：

1. **全局包互相不可见是常态，不是故障。** 任何「全局宿主 + 全局 adapter/插件」模式的工具链（commitizen + adapter 只是其一），在 pnpm 12 下都不能依赖全局闭包互通。
2. **`pnpm ls -g` 的清单会骗人。** 它读的是全局 manifest 的汇总，显示「已安装」不代表运行时能 `require` 到——清单在根上，实体在各自 hash 环境里。
3. **反复重装治不了布局问题。** 出事后的第一直觉「重装试试」在这个案例里完全是无效动作——装一百次，两个包还是分居两个 hash。
4. **adapter 类配置统一写相对路径。** `node_modules/<包名>` 的写法同时兼容 npm / pnpm / yarn，把「工具从哪里找依赖」的决定权收回到项目自己手里，这才是可移植的写法。

---

_适配版本：pnpm 12.4.1 / commitizen 4.3.2 / cz-git 1.12 ~ 1.14 · 2026-09-28_
