/**
 * @filename: lint-staged.config.js
 * @description 用于配置 lint-staged 的配置文件。在 git commit 时自动格式化暂存区的文件。
 * @type {import('lint-staged').Configuration}
 * @see https://github.com/lint-staged/lint-staged/blob/main/README.md#typescript
 */
export default {
	/**
	 * @see https://github.com/lint-staged/lint-staged/blob/main/README.md#automatically-fix-code-style-with-prettier-for-any-format-prettier-supports
	 *
	 * 使用 `--no-parallel` 的原因：
	 * Prettier 3.6+ 的 `--experimental-cli` 默认会启动并行 worker pool（默认 worker 数 = CPU 核心数 - 1）。
	 * 在 lint-staged / pre-commit 场景中，某些文件（如大型 markdown、特殊字符、或特定插件处理的文件）
	 * 可能导致 worker 线程崩溃，抛出 `WorkTankWorkerError`，从而阻塞提交。
	 * 1.x 背景：提交钩子的第一优先级是稳定性，因此模板中关闭并行；其他全量格式化脚本曾可保留并行以换取速度。
	 * 当前 v3：所有活动命令只要包含 `--experimental-cli`，都必须带且只带一个 `--no-parallel`，
	 * 顶层字符串配置已经由根 cwd 自动发现；不要把诊断时的显式 `--plugin` 重复写入生产命令。
	 */
	"*": "prettier --experimental-cli --write --no-parallel",
};
