import * as prettierPluginOxc from "@prettier/plugin-oxc";

// @ts-check
/** @type {import("prettier").Config} */
const config = {
	/**
	 * lint-md 跨入口兼容性契约。不要删除、压缩或改成对象插件；完整决策档案保存在
	 * 本技能随附的 `references/version-matrix.md`、`references/runtime-loading-model.md`
	 * 与 `references/decision-evolution.md`。
	 *
	 * 历史演进：
	 * 1. `^1.0.1` 曾解析到 `1.0.3`。后者把主入口改为 `.cjs`，使 VSCode
	 *    `esbenp.prettier-vscode` 经 `require.resolve` 加载字符串插件时可能静默失效；
	 *    因此必须精确锁定 `1.0.1`，并同时核验声明、lockfile 和运行时版本。
	 * 2. 曾把插件改为顶层对象以绕过 VSCode 入口问题，但 experimental CLI 的顶层
	 *    plugin specifier 只接受字符串，对象会加载失败。
	 * 3. 曾把对象仅放入 Markdown override；这能避开 experimental CLI 的顶层对象
	 *    限制，却使 VSCode 从 `resolveConfig().plugins` 的顶层列表发现不到插件。
	 *
	 * 现行结论：精确锁定 `prettier-plugin-lint-md@1.0.1`，并在唯一生效配置中使用
	 * 顶层字符串。普通 CLI 必须验证该字符串的自动加载和真实 Markdown 输出；
	 * experimental CLI 从根 cwd 向上发现该配置后同样自动加载顶层字符串；A/B 实验证明
	 * 显式 `--plugin prettier-plugin-lint-md` 与不传参数输出一致。因此生产命令不重复声明
	 * `--plugin`，只在插件解析故障的诊断/隔离验证中使用；活动命令仍带且只带一个
	 * `--no-parallel`。不要只看 `prettier --check` 或单一入口的退出码。
	 */
	plugins: ["prettier-plugin-lint-md"],

	/** @see https://github.com/prettier/prettier/tree/main/packages/plugin-oxc */
	overrides: [
		{
			files: "**/*.{js,mjs,cjs,jsx}",
			parser: "oxc",
			plugins: [prettierPluginOxc],
		},
		{
			files: "**/*.{ts,mts,cts,tsx}",
			parser: "oxc-ts",
			plugins: [prettierPluginOxc],
		},
		{
			files: [".vscode/extensions.json", ".vscode/settings.json"],
			parser: "jsonc",
			trailingComma: "none",
		},
	],
	printWidth: 120,
	semi: true,
	singleQuote: false,
	jsxSingleQuote: true,
	useTabs: true,
	tabWidth: 2,
	endOfLine: "lf",
	"space-around-alphabet": true,
	"space-around-number": true,
	"no-empty-code-lang": false,
	"no-empty-code": false,
};

export default config;
