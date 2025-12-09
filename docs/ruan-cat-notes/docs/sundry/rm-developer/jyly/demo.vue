<script lang="ts" setup>
import { ref, computed, watch, useTemplateRef } from "vue";

import { ElForm, ElFormItem, ElInput, ElRow } from "element-plus";

const gutter = ref(20);
const span = ref(12);

interface Schedule {
	x1: string;
	x2: string;
	x3: string;
	x4: string;
	y1: string;
	y2: string;
	y3: string;
	y4: string;
}

const form = ref<Schedule>({
	x1: "",
	x2: "",
	x3: "",
	x4: "",
	y1: "",
	y2: "",
	y3: "",
	y4: "",
});

const rules = {
	x1: [{ required: true, message: "请输入x1", trigger: "blur" }],
	x2: [{ required: true, message: "请输入x2", trigger: "blur" }],
	x3: [{ required: true, message: "请输入x3", trigger: "blur" }],
	x4: [{ required: true, message: "请输入x4", trigger: "blur" }],
	y1: [{ required: true, message: "请输入y1", trigger: "blur" }],
	y2: [{ required: true, message: "请输入y2", trigger: "blur" }],
	y3: [{ required: true, message: "请输入y3", trigger: "blur" }],
	y4: [{ required: true, message: "请输入y4", trigger: "blur" }],
};

const formFef = useTemplateRef("formFef");

const formLayoutConfig = ref([
	{
		label: "夜间位置",
		props: ["x1", "y1"],
	},
	{
		label: "黎明位置",
		props: ["x2", "y2"],
	},
	{
		label: "白天位置",
		props: ["x3", "y3"],
	},
	{
		label: "黄昏位置",
		props: ["x4", "y4"],
	},
]);

/**
 * 最终生成出来的模板字符串
 * @description
 * <schedule:[x1,y1],[x2,y2],[x3,y3],[x4,y4]>
 */
const scheduleTemplate = computed(() => {
	return `<schedule:[${form.value.x1},${form.value.y1}],[${form.value.x2},${form.value.y2}],[${form.value.x3},${form.value.y3}],[${form.value.x4},${form.value.y4}]>`;
});
</script>

<template>
	<section class="OcRam_NPC_Scheduler-root">
		<ElForm :model="form" label-width="80px" :rules="rules" ref="formFef">
			<!-- <ElFormItem label="夜间位置">
				<ElRow :gutter="gutter">
					<ElCol :span="span">
						<ElFormItem prop="x1">
							<ElInput v-model="form.x1" placeholder="请输入x1" :clearable="true" />
						</ElFormItem>
					</ElCol>
					<ElCol :span="span">
						<ElFormItem prop="x2">
							<ElInput v-model="form.x2" placeholder="请输入x2" :clearable="true" />
						</ElFormItem>
					</ElCol>
				</ElRow>
			</ElFormItem> -->

			<template v-for="(item, index) in formLayoutConfig" :key="index">
				<ElFormItem :label="item.label">
					<ElRow :gutter="gutter">
						<ElCol :span="span" v-for="prop in item.props" :key="prop">
							<ElFormItem :prop="prop">
								<ElInput v-model="form[prop]" :placeholder="'请输入' + prop" :clearable="true" />
							</ElFormItem>
						</ElCol>
					</ElRow>
				</ElFormItem>
			</template>
		</ElForm>

		最终生成的结果：
		<ElTag type="success"> {{ scheduleTemplate }} </ElTag>
	</section>
</template>

<style lang="scss" scoped>
.OcRam_NPC_Scheduler-root {
}
</style>
