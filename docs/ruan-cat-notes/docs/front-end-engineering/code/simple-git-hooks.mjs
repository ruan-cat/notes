/**
 * 每次修改该文件后 务必执行一次 `npx simple-git-hooks` 命令
 * 否则这些钩子不会生效
 */
export default {
	/**
	 * @see https://juejin.cn/post/7381372081915166739#heading-8
	 * @see https://fabric.modyqyw.top/zh-Hans/guide/git/commitlint.html#%E6%95%B4%E5%90%88-simple-git-hooks
	 */
	"commit-msg": "npx --no-install commitlint --edit ${1}",
	"pre-commit": "npx lint-staged",
	// "pre-push": "pnpm run format",
};
