/**
 * @filename lint-staged.config.js
 * @description 用于配置lint-staged的配置文件。
 * @type {import('lint-staged').Configuration}
 * @see https://github.com/lint-staged/lint-staged/blob/main/README.md#typescript
 */
export default {
	/** @see https://github.com/lint-staged/lint-staged/blob/main/README.md#automatically-fix-code-style-with-prettier-for-any-format-prettier-supports */
	"*": "prettier --ignore-unknown --experimental-cli --write",
};
