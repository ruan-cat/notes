import { copyFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
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

const apiTransferStationLlmsDir = "sundry/ai/api-transfer-station";
const generatedLlmsFiles = ["llms.txt", "llms-full.txt"];

/** 复制根部 llms 文件到 API 中转站文档目录 */
function copyApiTransferStationLlmsFiles() {
	let outDir = "";

	return {
		name: "copy-api-transfer-station-llms-files",
		apply: "build",
		enforce: "post",
		configResolved(config) {
			outDir = config.vitepress?.outDir ?? config.build.outDir;
		},
		async closeBundle() {
			const targetDir = join(outDir, apiTransferStationLlmsDir);

			await mkdir(targetDir, { recursive: true });
			await Promise.all(
				generatedLlmsFiles.map((fileName) => copyFile(join(outDir, fileName), join(targetDir, fileName))),
			);
		},
	};
}

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
				{ link: "/posts/", text: "掘金文章" },
				// 常用入口
				{
					text: "常用入口",
					items: [
						{ text: "浅克隆 shallow clone", link: "/git/shallow-clone/" },
						{ text: "技能 skills", link: "/skills/" },
						{ text: "本地AI记忆工具 memorix", link: "/memorix/" },
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
			// 只为 API 中转站少量生产运维文档生成 llms 文件，避免全站笔记参与生成。
			llmstxt: {
				title: "API 中转站文档",
				description: "Sub2API、9router 和相关 VPS 部署运维文档。",
				details: "仅收录 sundry/ai/api-transfer-station 目录内的生产运维文档。",
				ignoreFiles: [`!${apiTransferStationLlmsDir}/**`],
				injectLLMHint: false,
				sidebar: [],
			},
		},
	},
);
userConfig.vite ??= {};
userConfig.vite.plugins = [
	...(Array.isArray(userConfig.vite.plugins)
		? userConfig.vite.plugins
		: userConfig.vite.plugins
			? [userConfig.vite.plugins]
			: []),
	copyApiTransferStationLlmsFiles(),
];
// @ts-ignore
userConfig.themeConfig.sidebar = setGenerateSidebar({
	documentRootPath: "./docs",
});
export default userConfig;
