/**
 * @filename: lint-staged.config.js
 * @description 用于配置 lint-staged 的配置文件。在 git commit 时自动格式化暂存区的文件。
 * @type {import('lint-staged').Configuration}
 * @see https://github.com/lint-staged/lint-staged/blob/main/README.md#typescript
 */
export default {
	/** @see https://github.com/lint-staged/lint-staged/blob/main/README.md#automatically-fix-code-style-with-prettier-for-any-format-prettier-supports */
	"*": "prettier --experimental-cli --write",
};
