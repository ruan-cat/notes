/**
 * @type {import('typedoc').TypeDocOptions}
 *
 * @description
 * https://typedoc.org/guides/options/#javascript-files
 */

// FIXME: 高版本配置 导致bug
// ⠋ Initializing and preparing data[error] Tried to set an option (sidebar) that was not declared. You may have meant:
//         sidebarLinks
//         sort
// [error] Documentation could not be generated due to the errors above.
module.exports = {
	entryPoints: [
		"./src/index.ts",
		"docs/.vuepress/components/drill-goods/hooks/",
		"docs/.vuepress/components/drill-goods/stores/",
	],
	entryPointStrategy: "Expand",
	tsconfig: "./tsconfig.json",
	readme: "./src/readme.md",
	out: "docs-typedoc",
	cleanOutputDir: true,
	sidebar: {
		fullNames: true,
		parentCategory: "API",
	},
};
