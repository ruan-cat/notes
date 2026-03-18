import { setUserConfig, setGenerateSidebar, addChangelog2doc } from "@ruan-cat/vitepress-preset-config/config";

// 为文档添加自动生成的changelog
// addChangelog2doc({
// 	// 设置changelog的目标文件夹
// 	target: "./docs",
// 	// 设置changelog顶部的yaml数据。通常是排序
// 	data: {
// 		order: 1000,
// 		dir: {
// 			order: 1000,
// 		},
// 	},
// });

const userConfig = setUserConfig(
	{
		vite: {
			ssr: {
				noExternal: ["@iconify/vue"],
			},
		},
		title: "阮喵喵笔记",
		description: "自己的笔记",
		head: [["link", { rel: "icon", href: "/little-alice-eats-watermelon.svg" }]],
		themeConfig: {
			nav: [
				{ link: "/todo/", text: "待办" },
				{ link: "/bug/", text: "bug记录" },
				{ link: "/juejin/", text: "掘金文章" },
				// 常用入口
				{
					text: "常用入口",
					items: [
						{ text: "浅克隆 shallow clone", link: "/git/shallow-clone/" },
						{ text: "技能 skills", link: "/skills/" },
						{ text: "域名路由记录表", link: "/cloudflare/domain-mail/" },
					],
				},
			],
			socialLinks: [
				{
					icon: "github",
					link: "https://github.com/ruan-cat/notes",
				},
			],
			editLink: {
				pattern: "https://github.com/ruan-cat/notes/edit/dev/docs/ruan-cat-notes/docs/:path",
			},
		},
	},
	{
		plugins: {
			// 笔记项目不需要开启严格的 llmstxt 插件，这会加剧构建时间，速度太慢了。
			llmstxt: false,
		},
	},
);
// @ts-ignore
userConfig.themeConfig.sidebar = setGenerateSidebar({
	documentRootPath: "./docs",
});
export default userConfig;
