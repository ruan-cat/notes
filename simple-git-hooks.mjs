/**
 * @filename: simple-git-hooks.mjs
 * @description 配置 simple-git-hooks 的 git 钩子。
 *
 * 每次修改该文件后，需要在用户明确授权后执行一次 `pnpm exec simple-git-hooks` 命令，
 * 否则这些钩子不会生效。
 */
export default {
	/**
	 * @see https://juejin.cn/post/7381372081915166739#heading-8
	 * @see https://fabric.modyqyw.top/zh-Hans/guide/git/commitlint.html#%E6%95%B4%E5%90%88-simple-git-hooks
	 */
	"commit-msg": "pnpm exec commitlint --edit ${1}",
	"pre-commit": "pnpm exec lint-staged",

	/**
	 * [可选] post-commit：提交完成后将本次提交涉及的文件从 index（LF）写回工作区，
	 * 修复 Windows 上 AI 编辑器（Cursor / Claude Code 等）使用 CRLF 写文件后
	 * 残留在工作区的"幽灵 git modified"。
	 *
	 * 仅恢复本次提交修改的文件（Added / Copied / Modified / Renamed），
	 * 不会动其他未暂存的工作区变更，数据安全。
	 *
	 * 跨平台说明：
	 *   - `git diff -z` 使用 NUL（\0）分隔文件名，避免含空格路径被切断
	 *   - `xargs -0` 以 NUL 为分隔符读取，Windows（Git Bash）、macOS、Linux 均支持
	 *   - `2>/dev/null || true` 同时兜底"第一次提交（无 HEAD~1）"和"空输入"两种边界情况
	 *
	 * 已知限制：
	 *   - 需要 git >= 2.23（2019-08 发布），`git restore` 命令在此版本引入
	 *   - 若同一文件同时存在"已暂存"和"未暂存"两份改动，恢复会丢失未暂存部分
	 *     （AI 工具通常全量写文件，该情况在 AI 协作中极少触发）
	 *
	 * 使用方式：取消下一行注释，然后在用户明确授权后执行 `pnpm exec simple-git-hooks` 重新初始化钩子。
	 */
	// "post-commit": "git diff HEAD~1..HEAD --diff-filter=ACMR --name-only -z 2>/dev/null | xargs -0 git restore --worktree -- 2>/dev/null || true",
};
