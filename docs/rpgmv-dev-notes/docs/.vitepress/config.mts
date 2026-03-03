import { dirname, join, resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import * as fs from "node:fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { type DefaultTheme } from "vitepress";
import { setUserConfig, setGenerateSidebar } from "@ruan-cat/vitepress-preset-config/config";
import { description } from "../../package.json";

const userConfig = setUserConfig({
	title: "阮喵喵的rmmv开发笔记",
	description,
	themeConfig: {
		socialLinks: [
			{
				icon: "github",
				link: "https://github.com/ruan-cat/notes/tree/dev/docs/rpgmv-dev-notes",
			},
		],
		editLink: {
			pattern: "https://github.com/ruan-cat/notes/edit/dev/docs/rpgmv-dev-notes/docs/:path",
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
