import { fileURLToPath, URL } from "node:url";
import { dirname, resolve, join } from "node:path";

import { defineUserConfig } from "vuepress";
import { getDirname, path } from "vuepress/utils";
import { viteBundler } from "@vuepress/bundler-vite";
import { docsearchPlugin } from "@vuepress/plugin-docsearch";
// import { componentsPlugin } from "vuepress-plugin-components";
import { registerComponentsPlugin } from "@vuepress/plugin-register-components";

import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

import theme from "./theme.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const typesPath = path.resolve(process.cwd(), "types");

const port = 6312;

export default defineUserConfig({
	theme,
	base: "/",

	shouldPrefetch: false,
	port,

	locales: {
		"/": {
			lang: "zh-CN",
			title: "阮喵喵笔记",
			description: "自己的笔记",
		},
	},

	markdown: {
		headers: {
			level: [2, 3, 4, 5],
		},
	},

	// bundler: viteBundler({
	// 	viteOptions: {},
	// 	vuePluginOptions: {},
	// }),

	/**
	 * 尝试实现element-plus的类型生成，并导入。而不是单纯的组件导入和注册。
	 * 组件全局注册，已经由vuepress另外实现了。
	 * 想实现针对组件的类型生成与识别。
	 *
	 * 暂时又取消注释了 这个导致代码又莫名其妙跑不起来了
	 */
	bundler: viteBundler({
		vuePluginOptions: {},
		viteOptions: {
			// 加上此内容后就出错了 不知道是不是vuepress的解析问题。直接说SFC缺少内容。
			// plugins: [vue()],
			plugins: [
				AutoImport({
					resolvers: [ElementPlusResolver()],
					dts: join(typesPath, "auto-imports.d.ts"),
					imports: ["vue", "@vueuse/core"],
				}),
				Components({
					resolvers: [ElementPlusResolver()],
					dts: join(typesPath, "components.d.ts"),
				}),
			],

			/**
			 * 处理element-plus打包时 莫名其妙的css识别错误
			 * @see https://github.com/vuepress/core/issues/570#issuecomment-1116297227
			 */
			ssr: {
				noExternal: ["element-plus"],
			},

			resolve: {
				alias: {
					"@docs": fileURLToPath(new URL("../../docs", import.meta.url)),
				},
			},
		},
	}),

	// 尝试处理跨域问题 请求公共的图片接口报错
	// bundler: viteBundler({
	// 	viteOptions: {
	// 		server: {
	// 			proxy: {
	// 				// https://api.vvhan.com/api/acgimg
	// 				"/vvhan-img": {
	// 					// target: `https://localhost:${port}/`,
	// 					target: "https://api.vvhan.com/",
	// 					changeOrigin: true,
	// 					// 不可以省略rewrite
	// 					rewrite: (path) => path.replace(/^\/vvhan-img/, ""),
	// 				},
	// 			},
	// 		},
	// 	},
	// }),

	plugins: [
		/** 参考资料 https://vuejs.press/zh/reference/plugin/register-components.html */
		// registerComponentsPlugin({
		// 	componentsDir: join(process.cwd(), "docs"),
		// 	componentsPatterns: ["**/*.vue", "./.vuepress/**/*.vue"],
		// 	getComponentName(filename) {
		// 		const res = path.trimExt(filename.replace(/.*\//, ""));
		// 		console.log("组件名称", res);
		// 		return res;
		// 	},
		// }),
		// componentsPlugin({
		// 	components: ["BiliBili"],
		// }),
		/**
		 * 注释掉 不使用
		 * You are not allowed to use plugin "@vuepress/plugin-slimsearch" yourself in vuepress config file.
		 * Set "plugins.slimsearch" in theme options to customize it.
		 */
		// slimsearchPlugin({
		// 	indexContent: true,
		// 	autoSuggestions: true,
		// }),
		// 该内容暂时保留 目前通过正确的爬虫配置，可以实现后端搜索了。
		// searchProPlugin({
		// 	indexContent: true,
		// 	autoSuggestions: true,
		// 	// customFields: [
		// 	// 	// 类型报错
		// 	// 	// {
		// 	// 	//   getter: (page) => page.frontmatter.category,
		// 	// 	//   formatter: {
		// 	// 	//     '/': 'Category: $content',
		// 	// 	//     '/zh/': '分类：$content',
		// 	// 	//   },
		// 	// 	// },
		// 	// 	// {
		// 	// 	//   getter: (page) => page.frontmatter.tag,
		// 	// 	//   formatter: {
		// 	// 	//     '/': 'Tag: $content',
		// 	// 	//     '/zh/': '标签：$content',
		// 	// 	//   },
		// 	// 	// },
		// 	// ],
		// }),
	],
});
