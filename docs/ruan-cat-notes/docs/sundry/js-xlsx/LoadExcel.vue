<script lang="ts" setup>
import { ref, computed, watch, h } from "vue";

import {
	// 数据展示
	ElMessage,
	ElAlert,
	ElButton,
	ElTag,
	// 表格
	ElTable,
	ElTableColumn,
	// 布局
	ElRow,
	ElCol,
	// 表单
	ElForm,
	ElFormItem,
	ElUpload,
	ElSwitch,
	type UploadRawFile,
	type ComponentSize,
} from "element-plus";

import { isUndefined, pick, uniq } from "lodash-es";

import * as XLSX from "xlsx";

type Conditions = Array<(...args: any[]) => boolean>;

function isConditionsEvery(conditions: Conditions) {
	return conditions.every((condition) => condition());
}

function isConditionsSome(conditions: Conditions) {
	return conditions.some((condition) => condition());
}

type 账号使用状态_type = "启用" | "禁用";
type 用户是否存在_type = "存在" | "缺漏";

/** 表格的数据类型 */
interface TableData {
	用户名: string;
	登陆账号: string;
	部门: string;
	手机号: number;
	角色: string;
	账号使用状态: 账号使用状态_type;
	已经存在的用户数据: string;
	用户是否存在?: 用户是否存在_type;
}

/** 显示的 表列字段 */
const showingUseFields = <const>["用户名", "角色"];

/** 过滤的 表列字段 */
const filterUseFields = <const>["账号使用状态", "用户是否存在"];
type FilterUseFields = (typeof filterUseFields)[number];
type FilterUseFieldsSwitchable = `is${FilterUseFields}`;

/** 过滤配置表单 */
type FilterConfigForm = Pick<Required<TableData>, FilterUseFields>;
type FilterConditionSwitch = Required<Record<FilterUseFieldsSwitchable, boolean>>;

type FilterConfig = {
	[key in FilterUseFields]: (params: TableData) => boolean;
};

const elementPlusSize = ref<ComponentSize>("large");

const title = ref("你好 这是临时使用的文件导入工具");

/**
 * @see https://zhuanlan.zhihu.com/p/632551852
 */
const tableData = ref<TableData[]>([]);

type List = Pick<TableData, (typeof showingUseFields)[number]>[];

/**
 * 按照条件过滤 筛选出来的表格数据
 * @description
 * 有疑惑 不知道怎么设计类型
 *
 * 实际上参与渲染的数据 不清楚该对象有那些字段
 *
 * 这里只能使用 Partial<TableData> 了
 */
const list = ref<List>([]);

/** 重设经过处理后的列表 */
function resetList() {
	const afterFilter = tableData.value.filter((elm) => isConditionsEvery(createFilterUseConditions(elm)));

	const afterMap = afterFilter.map((elm) => pick(elm, ["用户名", "角色"]));

	list.value = afterMap;
}

function readXLSX(file: UploadRawFile) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.readAsBinaryString(file);
		reader.onload = (evt) => {
			const data = evt?.target?.result;

			const wb = XLSX.read(data, { type: "binary" });

			const ws = wb.Sheets[wb.SheetNames[0]];
			const jsonData = XLSX.utils.sheet_to_json(ws);

			console.warn(` 检查导入的数据？ `, jsonData);

			resolve(jsonData);
		};
	});
}

async function beforeUpload(file: UploadRawFile) {
	const result = await readXLSX(file);
	tableData.value = result as TableData[];
	resetList();
	return false;
}

/** 过滤条件开关 是否开启过滤条件 */
const filterConditionSwitch = ref<FilterConditionSwitch>({
	is账号使用状态: true,
	is用户是否存在: true,
});

const filterConfigForm = ref<FilterConfigForm>({
	账号使用状态: "启用",
	用户是否存在: "缺漏",
});

function removeIsPrefix(params: FilterUseFieldsSwitchable): FilterUseFields {
	return <FilterUseFields>params.slice(2);
}

/** 过滤配置 */
const filterConfig = ref<FilterConfig>({
	账号使用状态: (elm) =>
		!isUndefined(elm.账号使用状态) ? elm.账号使用状态 === filterConfigForm.value.账号使用状态 : true,

	用户是否存在: (elm) =>
		!isUndefined(elm.用户是否存在) ? elm.用户是否存在 === filterConfigForm.value.用户是否存在 : true,
});

function createFilterUseConditions(elm: TableData): Conditions {
	return (<[FilterUseFieldsSwitchable, boolean][]>Object.entries(filterConditionSwitch.value)).map(
		([key, bool], indx, arr) => {
			return bool ? () => filterConfig.value[removeIsPrefix(key)](elm) : () => true;
		},
	);
}

const reverseList = computed(() => {
	const storeMap = new Map<string, string[]>();

	list.value.forEach((elm) => {
		const roles = elm.角色.trim().split(",");

		roles.forEach((role) => {
			if (!storeMap.has(role)) {
				storeMap.set(role, []);
			}

			storeMap.get(role)?.push(elm.用户名.trim());
		});
	});

	// 不预设成字符串了
	// storeMap.forEach((value, key, map) => {
	// 	if (isArray(value)) {
	// 		map.set(key, value.join(","));
	// 	}
	// });

	// 对人名数组做去重 因为可能出现人名重复的的情况。
	storeMap.forEach((value, key, map) => {
		map.set(key, uniq(value));
	});

	return Object.entries(Object.fromEntries(storeMap.entries())).map((elm) => ({
		角色: elm[0],
		用户名: elm[1].join(","),
		总数: elm[1].length,
	}));
});

const layoutConf = ref({
	maxHeight: "100vh",
});

/**
 * EventTarget
 * MouseEvent
 * Event
 */
async function dblclickCopy($event: MouseEvent) {
	/** 参考资料： https://blog.csdn.net/weixin_45022563/article/details/127392836 */
	await navigator.clipboard.writeText(($event.target as HTMLElement).innerHTML).then((res) => {
		ElMessage({
			type: "success",
			message: h("section", null, [
				h("section", null, "复制成功！"),
				h("section", null, "文本已保存在粘贴板内，随时可以复制粘贴。"),
				h("section", null, "使用快捷键 win+v 来打开粘贴板。"),
			]),
		});
	});
}
</script>

<template>
	<section class="LoadExcel-root">
		<el-alert
			type="warning"
			effect="light"
			show-icon
			:title="title"
			:closable="false"
			:size="elementPlusSize"
		></el-alert>

		<el-upload
			ref="upload"
			:auto-upload="true"
			accept=".xls,.xlsx"
			:before-upload="beforeUpload"
			:show-file-list="false"
		>
			<template #trigger>
				<el-button type="primary">选择文件</el-button>
			</template>
		</el-upload>

		<el-row :gutter="20">
			<el-col :span="12" :offset="0">
				<ElTag type="success"> 是否开启筛选 </ElTag>
				<ElTag type="warning"> 账号使用状态 </ElTag>

				<ElSwitch
					v-model="filterConditionSwitch.is账号使用状态"
					active-text="开启"
					inactive-text="关闭"
					:active-value="true"
					:inactive-value="false"
					:size="elementPlusSize"
					@change="resetList()"
				/>
			</el-col>

			<el-col :span="12" :offset="0">
				<ElSwitch
					v-show="filterConditionSwitch.is账号使用状态"
					v-model="filterConfigForm.账号使用状态"
					active-text="启用"
					inactive-text="禁用"
					active-value="启用"
					inactive-value="禁用"
					:size="elementPlusSize"
					@change="resetList()"
				/>
			</el-col>
		</el-row>

		<el-row :gutter="20">
			<el-col :span="12" :offset="0">
				<ElTag type="success"> 是否开启筛选 </ElTag>
				<ElTag type="warning"> 用户是否存在 </ElTag>

				<ElSwitch
					v-model="filterConditionSwitch.is用户是否存在"
					active-text="开启"
					inactive-text="关闭"
					:active-value="true"
					:inactive-value="false"
					:size="elementPlusSize"
					@change="resetList()"
				/>
			</el-col>

			<el-col :span="12" :offset="0">
				<ElSwitch
					v-show="filterConditionSwitch.is用户是否存在"
					v-model="filterConfigForm.用户是否存在"
					active-text="存在"
					inactive-text="缺漏"
					active-value="存在"
					inactive-value="缺漏"
					:size="elementPlusSize"
					@change="resetList()"
				/>
			</el-col>
		</el-row>

		<el-row :gutter="20">
			<el-col :span="8" :offset="0">
				<el-table
					style="width: 100%"
					:data="list"
					:max-height="layoutConf.maxHeight"
					:stripe="true"
					:border="true"
					:highlight-current-row="true"
				>
					<el-table-column type="index" label="序号" width="80" />

					<el-table-column prop="用户名" label="用户名" width="180">
						<template #default="{ row, column, $index }">
							<section @dblclick="dblclickCopy($event)">
								{{ row["用户名"] }}
							</section>
						</template>
					</el-table-column>

					<el-table-column prop="角色" label="角色" min-width="180">
						<template #default="{ row, column, $index }">
							<section @dblclick="dblclickCopy($event)">
								{{ row["角色"] }}
							</section>
						</template>
					</el-table-column>
				</el-table>
			</el-col>

			<el-col :span="16" :offset="0">
				<el-table
					style="width: 100%"
					:data="reverseList"
					:max-height="layoutConf.maxHeight"
					:stripe="true"
					:border="true"
					:highlight-current-row="true"
				>
					<el-table-column type="index" label="序号" width="80" />

					<el-table-column prop="角色" label="角色" width="180">
						<template #default="{ row, column, $index }">
							<section @dblclick="dblclickCopy($event)">
								{{ row["角色"] }}
							</section>
						</template>
					</el-table-column>

					<el-table-column prop="用户名" label="用户名" min-width="180">
						<template #default="{ row, column, $index }">
							<section @dblclick="dblclickCopy($event)">
								{{ row["用户名"] }}
							</section>
						</template>
					</el-table-column>

					<el-table-column prop="总数" label="总数" width="80" fixed="right" />
				</el-table>
			</el-col>
		</el-row>
	</section>
</template>

<style lang="scss" scoped>
.LoadExcel-root {
	:deep(.el-table) {
		table {
			// 清除边距
			margin: 0 0;
		}

		.el-scrollbar__bar.is-vertical {
			width: 10px;

			.el-scrollbar__thumb:hover {
				background-color: gray;
			}
		}
	}
}
</style>
