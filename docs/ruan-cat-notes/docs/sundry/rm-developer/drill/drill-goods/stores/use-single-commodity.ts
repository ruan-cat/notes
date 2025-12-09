import { defineStore } from "pinia";

import { ref } from "vue";
import { merge, cloneDeep } from "lodash-es";

import type { Ref } from "vue";

/** 默认的图标色 这里不清楚如何实现scss的ts模块导入 */
export const defIconColor = "#096dd9";
// import palette from "../../../styles/palette.scss";
// $theme-color

/** 商品类 特指单个商品 */
export type Commodity = {
	/** 商品名称 */
	name: string;

	/** 商品价格 */
	price: number;

	/** 商品描述 */
	desc: string;

	/** 商品图标 这里默认是 iconify 的图标字符串 */
	icon: string;

	/** 图标颜色 不使用则默认为 vuepress 系统主题色 */
	iconColor?: string;
};

export const defCommodity: Ref<Commodity[]> = ref([
	{
		name: "土豆",
		desc: "小爱丽丝在鹅萝斯-东伯利亚种的土豆。",
		icon: "fluent-emoji-high-contrast:potato",
		price: 50,
	},

	{
		name: "橘子",
		desc: "进口自QQ飞车的橘子。",
		icon: "game-icons:orange-slice",
		price: 20,
	},

	{
		name: "葡萄",
		desc: "在旧疆生产的紫水晶葡萄",
		icon: "fluent-emoji-high-contrast:grapes",
		price: 30,
	},
]);

/** 使用 商品单品 管理store */
export const useSingleCommodity = defineStore(
	"singleCommodity",
	() => {
		const commodity = ref(cloneDeep(defCommodity));

		const someState = ref("你好 pinia");
		return { someState, commodity };
	},

	// {
	// 	// 目前没能够实现 localstorage 的兼容问题。同时兼容vite 浏览器 node。故不使用持久化。
	// 	persist: false,
	// }
);
