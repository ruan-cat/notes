import { defineRuancatPresetTheme } from "@ruan-cat/vitepress-preset-config/theme";

import "./style.css";
import "./tools.scss";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

/** @see https://element-plus.org/zh-CN/guide/dark-mode.html */
import "element-plus/theme-chalk/dark/css-vars.css";

import "animate.css";

import { createPinia } from "pinia";
import piniaPluginPersistedstate, { createPersistedState } from "pinia-plugin-persistedstate";

export default defineRuancatPresetTheme({
	enhanceAppCallBack({ app, router, siteData }) {
		const pinia = createPinia();
		pinia.use(piniaPluginPersistedstate);

		// @ts-ignore
		app.use(pinia);

		// @ts-ignore
		app.use(ElementPlus);
	},
});
