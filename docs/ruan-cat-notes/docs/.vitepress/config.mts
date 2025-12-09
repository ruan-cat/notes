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

const userConfig = setUserConfig({
	title: "阮喵喵笔记",
	description: "自己的笔记",
	head: [["link", { rel: "icon", href: "/little-alice-eats-watermelon.svg" }]],
	themeConfig: {
		nav: [
			{
				link: "/todo/",
				text: "学习待办",
			},
			{
				link: "/bug/",
				text: "遭遇的bug",
			},
			{
				link: "/git/",
				text: "git使用",
			},
			{
				link: "/demo/",
				text: "演示用的demo",
			},
			{
				link: "/css/css-challenges/",
				text: "css训练",
			},
			{
				link: "/50projects50days-vue3/",
				text: "50天50个小项目",
			},
		],
		socialLinks: [
			{
				icon: "github",
				link: "https://github.com/ruan-cat/notes",
			},
		],
	},
});
// @ts-ignore
userConfig.themeConfig.sidebar = setGenerateSidebar({
	documentRootPath: "./docs",
});
export default userConfig;
