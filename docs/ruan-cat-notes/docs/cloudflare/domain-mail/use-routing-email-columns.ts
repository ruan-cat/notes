import { defineStore } from "pinia";
import { ref } from "vue";

/** 全部可用的列字段名 */
export const ALL_COLUMN_KEYS = ["order", "email", "cursor", "kiro", "github", "openai"] as const;

/** 路由邮箱表格列可见性配置 Store，使用 localStorage 持久化列显示偏好 */
export const useRoutingEmailColumnsStore = defineStore(
	"routing-email-columns",
	() => {
		const visibleColumns = ref<string[]>([...ALL_COLUMN_KEYS]);

		/** 重置为默认显示全部列 */
		function resetColumns() {
			visibleColumns.value = [...ALL_COLUMN_KEYS];
		}

		return { visibleColumns, resetColumns };
	},
	{
		// @ts-ignore
		persist: true,
	},
);
