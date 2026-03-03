import { dirname, join, resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import * as fs from "node:fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { type DefaultTheme } from "vitepress";
import { setUserConfig, setGenerateSidebar } from "@ruan-cat/vitepress-preset-config/config";
import { description } from "../../package.json";

/**
 * 手动配置的侧边栏
 * @description
 */
const sidebar: DefaultTheme.Config["sidebar"] = [
	// 警告 暂不提供
	// {
	// 	text: "2024-06 大项目报告",
	// 	link: "/report",
	// },
	// 警告 暂不提供
	// {
	// 	text: "2024-07 小项目建议",
	// 	link: "/index",
	// 	base: "/suggest",
	// 	items: [
	// 		{ text: "组长及管理者", link: "/group-leader" },
	// 		{ text: "各组员", link: "/members" },
	// 	],
	// },

	// 注意事项
	// {
	// 	text: "注意事项",
	// 	link: "/index",
	// 	base: "/attention",
	// 	items: [{ text: "及时修改git用户名", link: "/change-git-user-name" }],
	// },

	// 10wms 前端组
	{
		text: "10wms前端组",
		link: "/index",
		base: "/10wms",
		items: [{ text: "2025年2月22日-会议纪要", link: "/2025-2-22-meet-summary" }],
	},

	// 09oa项目专讲
	{
		text: "2024-09 大项目-oa项目",
		link: "/index",
		base: "/09oa",
		collapsed: true,
		items: [
			// 警告 暂不提供
			// { text: "项目首页", link: "/home" },
			// { text: "个人设置", link: "/settings" },

			{
				text: "前端项目架构",
				base: "/09oa/frontend-architecture",
				link: "/index",
				items: [
					{ text: "package.json", link: "/package-json" },
					{ text: "生产环境依赖", link: "/dependencies" },
					{ text: "开发环境依赖", link: "/devDependencies" },
					{ text: "复杂命令脚本", link: "/scripts" },
					{ text: "生成模板", link: "/template" },
					{ text: "类型声明文件", link: "/types" },
					{ text: "git忽略配置", link: "/gitignore" },
					{ text: "vscode配置", link: "/vscode-config" },
					{ text: "vite配置", link: "/vite" },
				],
			},

			{
				text: "搭建开发环境",
				base: "/09oa/frontend-dev",
				link: "/index",
				items: [
					{ text: "浏览器插件", link: "/chrome-extensions" },
					{ text: "node版本控制", link: "/node-version" },
					{ text: "高性能包管理器", link: "/pnpm" },
					{ text: "常用的vscode插件", link: "/vscode-extensions" },
					{ text: "简易网络代理", link: "/watt-toolkit" },
				],
			},

			{ text: "阶段性总结", link: "/summary" },
		],
	},

	// 历史项目
	{
		text: "历史项目",
		link: "/index",
		base: "/history-project",
		collapsed: true,
		items: [
			{ text: "08mes", link: "/08mes" },
			{ text: "09oa", link: "/09oa" },
			{ text: "10wms", link: "/10wms" },
		],
	},

	// 退出10wms项目组
	{
		text: "10wsm报告",
		link: "/10wms/report",
	},
];

const userConfig = setUserConfig({
	title: "阮喵喵的01星球笔记",
	description,
	themeConfig: {
		socialLinks: [
			{
				icon: "github",
				link: "https://github.com/ruan-cat/notes/tree/dev/docs/docs-01-star",
			},
		],
		editLink: {
			pattern: "https://github.com/ruan-cat/notes/edit/dev/docs/docs-01-star/docs/:path",
		},
	},
});
// @ts-ignore
userConfig.themeConfig.sidebar = setGenerateSidebar({
	documentRootPath: "./docs",
	/**
	 * 排除掉含有 exclude 值的md文件
	 * @see https://vitepress-sidebar.cdget.com/zhHans/guide/options#excludefilesbyfrontmatterfieldname
	 */
	excludeFilesByFrontmatterFieldName: "exclude",
});
export default userConfig;
