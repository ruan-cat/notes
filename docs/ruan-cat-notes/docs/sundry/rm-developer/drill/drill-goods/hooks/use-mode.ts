import { ref, computed } from "vue";

export type Mode = "info" | "edit";

/** 使用模式 */
export const useMode = function () {
	const mode = ref<Mode>("info");

	function getMode() {
		return mode.value;
	}

	/** 参考资料 自定义类型守卫 */
	function isInfoJudge(p: Mode): p is "info" {
		return (p as Mode) === "info";
	}

	function isEditJudge(p: Mode): p is "edit" {
		return (p as Mode) === "edit";
	}

	const isInfo = computed(() => isInfoJudge(mode.value));
	const isEdit = computed(() => isEditJudge(mode.value));

	function switchMode() {
		if (isInfoJudge(mode.value)) {
			mode.value = "info";
		}

		if (isEditJudge(mode.value)) {
			mode.value = "edit";
		}
	}

	return {
		mode,

		getMode,
		isInfoJudge,
		isEditJudge,
		switchMode,

		isInfo,
		isEdit,
	};
};
