<script lang="ts" setup>
import { ref, computed, watch, nextTick } from "vue";
import { storeToRefs } from "pinia";
import {
	ElTable,
	ElTableColumn,
	ElPagination,
	ElPopover,
	ElCheckboxGroup,
	ElCheckbox,
	ElButton,
	ElMessage,
} from "element-plus";
import type { TableColumnCtx } from "element-plus";
import { Setting } from "@element-plus/icons-vue";
// routingEmails,
import { type RutingEmail } from "./routing-email";
import { mockRoutingEmails as routingEmails } from "./routing-email-mock";
import { useRoutingEmailColumnsStore } from "./use-routing-email-columns";

/** 表格列配置类型，复用 Element Plus TableColumnCtx 的全部字段约束 */
type ColumnConfig = Partial<TableColumnCtx<RutingEmail>>;

/** 全部表格列配置 */
const allColumns: ColumnConfig[] = [
	{ prop: "order", label: "序号", width: 70, fixed: "left" },
	{ prop: "email", label: "邮箱", minWidth: 220 },
	{ prop: "cursor", label: "Cursor", minWidth: 180 },
	{ prop: "kiro", label: "Kiro", minWidth: 120 },
	{ prop: "github", label: "GitHub", minWidth: 120 },
	{ prop: "openai", label: "OpenAI", minWidth: 120 },
];

const store = useRoutingEmailColumnsStore();
const { visibleColumns } = storeToRefs(store);

const tableRef = ref<InstanceType<typeof ElTable>>();
const currentPage = ref(1);
const pageSize = ref(10);

/** 数据总条数 */
const total = computed(() => routingEmails.length);

/** 当前页的分页数据 */
const paginatedData = computed(() => {
	const start = (currentPage.value - 1) * pageSize.value;
	return routingEmails.slice(start, start + pageSize.value);
});

/** 当前可见的列配置 */
const visibleColumnConfigs = computed(() => {
	return allColumns.filter((col) => visibleColumns.value.includes(col.prop));
});

/** 监听可见列变化，触发表格重新布局以避免列切换时的抖动 */
watch(
	visibleColumns,
	async () => {
		await nextTick();
		tableRef.value?.doLayout();
	},
	{ deep: true },
);

/** 分页大小变化时重置到第一页 */
function handleSizeChange() {
	currentPage.value = 1;
}

/** 鼠标进入单元格时，为同列所有单元格添加高亮类 */
function handleCellMouseEnter(_row: RutingEmail, _column: TableColumnCtx<RutingEmail>, cell: HTMLTableCellElement) {
	const table = tableRef.value?.$el as HTMLElement | undefined;
	if (!table) return;
	const colIndex = cell.cellIndex + 1;
	table.querySelectorAll(`td.el-table__cell:nth-child(${colIndex})`).forEach((c) => c.classList.add("is-column-hover"));
}

/** 鼠标离开单元格时，移除同列所有单元格的高亮类 */
function handleCellMouseLeave(_row: RutingEmail, _column: TableColumnCtx<RutingEmail>, cell: HTMLTableCellElement) {
	const table = tableRef.value?.$el as HTMLElement | undefined;
	if (!table) return;
	const colIndex = cell.cellIndex + 1;
	table
		.querySelectorAll(`td.el-table__cell:nth-child(${colIndex})`)
		.forEach((c) => c.classList.remove("is-column-hover"));
}

/** 双击单元格时将文本复制到剪贴板 */
async function handleCellDblClick(row: RutingEmail, column: TableColumnCtx<RutingEmail>) {
	const text = String(row[column.property as keyof RutingEmail] ?? "");
	if (!text) return;
	try {
		await navigator.clipboard.writeText(text);
		ElMessage.success(`已复制: ${text}`);
	} catch {
		ElMessage.error("复制失败");
	}
}
</script>

<template>
	<div class="routing-email-list">
		<div class="routing-email-list__toolbar">
			<ElPopover trigger="click" placement="bottom-start" :width="220" popper-class="routing-email-popover">
				<template #reference>
					<ElButton :icon="Setting" size="small">列设置</ElButton>
				</template>
				<ElCheckboxGroup v-model="visibleColumns">
					<div v-for="col in allColumns" :key="col.prop" class="routing-email-list__checkbox-item">
						<ElCheckbox :value="col.prop" :label="col.label" />
					</div>
				</ElCheckboxGroup>
			</ElPopover>
		</div>

		<ElTable
			ref="tableRef"
			:data="paginatedData"
			border
			stripe
			max-height="40vh"
			class="routing-email-list__table"
			empty-text="暂无数据"
			@cell-dblclick="handleCellDblClick"
			@cell-mouse-enter="handleCellMouseEnter"
			@cell-mouse-leave="handleCellMouseLeave"
		>
			<ElTableColumn
				v-for="col in visibleColumnConfigs"
				:key="col.prop"
				:prop="col.prop"
				:label="col.label"
				:min-width="col.minWidth"
				show-overflow-tooltip
			/>
		</ElTable>

		<div class="routing-email-list__pagination">
			<ElPagination
				v-model:current-page="currentPage"
				v-model:page-size="pageSize"
				:total="total"
				:page-sizes="[5, 10, 20, 50]"
				layout="total, sizes, prev, pager, next, jumper"
				@size-change="handleSizeChange"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.routing-email-list {
	// ========================
	// VitePress ↔ Element Plus 主题色映射
	// Element Plus 默认使用蓝色主色调，与 VitePress 的 indigo 品牌色不一致。
	// 通过 CSS 变量覆盖，让组件内所有 Element Plus 子组件（按钮、复选框、分页、表格等）
	// 统一使用 VitePress 定义的品牌色。
	// ========================
	--el-color-primary: var(--vp-c-brand-1);
	--el-color-primary-light-3: var(--vp-c-brand-2);
	--el-color-primary-light-5: var(--vp-c-brand-3);
	--el-color-primary-light-7: var(--vp-c-brand-2);
	--el-color-primary-light-8: var(--vp-c-brand-3);
	--el-color-primary-light-9: var(--vp-c-brand-soft);
	--el-color-primary-dark-2: var(--vp-c-brand-1);

	display: flex;
	flex-direction: column;
	gap: 12px;

	// ========================
	// BEM 子元素
	// ========================

	&__toolbar {
		display: flex;
		justify-content: flex-end;
		flex-shrink: 0;
	}

	&__table {
		min-height: 0;
		overflow: auto;
		cursor: default;
	}

	&__pagination {
		display: flex;
		justify-content: center;
		flex-shrink: 0;
		padding: 8px 0;
	}

	&__checkbox-item {
		padding: 2px 0;
		margin: 0 !important;
		line-height: 1;
	}

	// ========================
	// VitePress 样式隔离
	// VitePress .vp-doc 全局样式会给 table / button / li / a 等原生元素
	// 设置 display:block / margin / background / color 等，
	// 破坏 Element Plus 组件的内部布局和视觉表现。
	// 此处统一重置，确保组件渲染不受干扰。
	// ========================

	:deep(table) {
		display: table;
		margin: 0;
		border-collapse: separate;
	}

	// 分页栏：VitePress 给 ul/li/button 添加的 padding/margin/background 会导致分页按钮错位变形
	:deep(.el-pagination) {
		ul,
		ol {
			padding-left: 0 !important;
			margin: 0 !important;
			list-style: none;
		}

		button,
		li {
			background: transparent;
			border: none;
			margin: 0;
			line-height: normal;
		}
	}

	// 列设置弹框样式：见文件底部非 scoped 的 <style> 块（.routing-email-popover），
	// 因弹框默认 teleport 到 <body>，脱离 scoped 作用域，需通过 popper-class 全局选择。

	// ========================
	// 表格单元格交互
	// ========================

	:deep(.el-table__body td.el-table__cell) {
		// 提示用户可双击复制单元格内容
		cursor: copy;
		// 行列高亮切换时背景色平滑过渡
		transition: background-color 0.15s;

		// 列高亮：鼠标所在列的所有单元格，由 JS 动态添加 .is-column-hover 类
		&.is-column-hover {
			background-color: var(--el-color-primary-light-9) !important;
		}
	}

	// 行高亮：覆盖 Element Plus 默认的行悬停背景色，统一使用主题色
	:deep(.el-table__body tr:hover > td.el-table__cell) {
		background-color: var(--el-color-primary-light-9) !important;

		// 行列交叉点：鼠标所在单元格同时命中行和列高亮，使用更深的主题色突出焦点
		&.is-column-hover {
			background-color: var(--el-color-primary-light-7) !important;
		}
	}

	// ========================
	// 滚动条样式增强
	// ElTable 内部使用 el-scrollbar 组件管理滚动，
	// 以下样式增强滚动条的可见性和交互反馈。
	// ========================

	:deep(.el-scrollbar__bar) {
		transition:
			opacity 0.3s,
			width 0.2s,
			height 0.2s;

		// 竖向滚动条：默认 8px，悬停加宽到 12px 便于点击
		&.is-vertical {
			width: 8px;
			transition: width 0.2s;

			&:hover {
				width: 12px;
			}
		}

		// 横向滚动条：默认 8px，悬停加高到 12px 便于点击
		&.is-horizontal {
			height: 8px;
			transition: height 0.2s;

			&:hover {
				height: 12px;
			}
		}
	}

	:deep(.el-scrollbar__thumb) {
		background-color: var(--el-color-info-light-5);
		border-radius: 4px;
		transition:
			background-color 0.2s,
			width 0.2s,
			height 0.2s;
		// 提示用户可拖拽
		cursor: grab;

		&:hover {
			// 悬停时加深背景色，增强视觉反馈
			background-color: var(--el-color-info);
		}

		&:active {
			// 拖拽中切换为握紧样式
			cursor: grabbing;
		}
	}
}
</style>

<style lang="scss">
// ========================
// 列设置弹框（非 scoped）
// ElPopover 默认 teleport 到 <body>，脱离了组件的 scoped 作用域，
// 通过 popper-class="routing-email-popover" 为其添加自定义类名，
// 在此用全局样式选中并重置 VitePress 的干扰。
// ========================
.routing-email-popover {
	background-color: var(--el-bg-color-overlay) !important;
	border: 1px solid var(--el-border-color-light) !important;
	border-radius: var(--el-border-radius-base) !important;
	box-shadow: var(--el-box-shadow-light) !important;
	padding: 12px !important;

	// 重置弹框内所有元素的文字颜色和间距
	// VitePress 的 .vp-doc 会给 div / label / p 等元素加上 margin，导致选项间距异常
	label,
	span,
	div,
	.el-checkbox__label {
		color: var(--el-text-color-regular) !important;
		margin: 0 !important;
		line-height: 1 !important;
	}

	.el-checkbox {
		display: flex;
		align-items: center;
		height: 26px;
		margin-right: 0;
	}

	// 映射 Element Plus 主色为 VitePress 品牌色，保持弹框内复选框颜色一致
	--el-color-primary: var(--vp-c-brand-1);
	--el-color-primary-light-3: var(--vp-c-brand-2);
	--el-color-primary-light-5: var(--vp-c-brand-3);
	--el-color-primary-light-9: var(--vp-c-brand-soft);
}
</style>
