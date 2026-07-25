<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import {
	ElAlert,
	ElButton,
	ElDescriptions,
	ElDescriptionsItem,
	ElForm,
	ElFormItem,
	ElInput,
	ElMessage,
	ElTable,
	ElTableColumn,
	ElTag,
	ElUpload,
} from "element-plus";
import type { UploadFile } from "element-plus";
import { Download, RefreshLeft, UploadFilled, View } from "@element-plus/icons-vue";
import {
	createDefaultOutputFileName,
	parseSub2ApiJsonText,
	rewriteSub2ApiJson,
	sanitizeJsonFileName,
	stringifySub2ApiJson,
	type RewriteSub2ApiJsonResult,
	type Sub2ApiExportFile,
} from "./sub2api-json-rewriter-core";

const sourceFileName = ref("");
const accountBatchPrefix = ref("");
const notes = ref("");
const outputFileName = ref("");
const sourceJson = ref<Sub2ApiExportFile | null>(null);
const rewriteResult = ref<RewriteSub2ApiJsonResult | null>(null);
const rawJsonText = ref("");
const errorMessage = ref("");

const isReady = computed(() => Boolean(sourceJson.value && accountBatchPrefix.value.trim()));
const hasPreview = computed(() => Boolean(rewriteResult.value));
const previewRows = computed(() => rewriteResult.value?.preview.slice(0, 20) ?? []);
const duplicateNames = computed(() => rewriteResult.value?.duplicateNames ?? []);
const accountCount = computed(() => {
	if (rewriteResult.value) return rewriteResult.value.accountCount;
	if (Array.isArray(sourceJson.value?.accounts)) return sourceJson.value.accounts.length;
	return 0;
});
const effectiveNotes = computed(() => notes.value || accountBatchPrefix.value || "未生成");

watch(
	[accountBatchPrefix, notes],
	() => {
		rewriteResult.value = null;
	},
	{ flush: "sync" },
);

function getDisplayError(error: unknown) {
	return error instanceof Error ? error.message : String(error);
}

function getPrefixFromFileName(fileName: string) {
	return fileName.replace(/\.json$/i, "").trim();
}

async function handleFileChange(uploadFile: UploadFile) {
	errorMessage.value = "";
	rewriteResult.value = null;

	const file = uploadFile.raw;
	if (!file) {
		errorMessage.value = "未读取到浏览器 File 对象";
		return;
	}

	try {
		const text = await file.text();
		rawJsonText.value = text;
		sourceFileName.value = file.name;
		sourceJson.value = parseSub2ApiJsonText(text);

		if (!accountBatchPrefix.value.trim()) {
			accountBatchPrefix.value = getPrefixFromFileName(file.name);
		}

		outputFileName.value = createDefaultOutputFileName(file.name, accountBatchPrefix.value);
		rewritePreview();
	} catch (error) {
		sourceJson.value = null;
		errorMessage.value = getDisplayError(error);
		ElMessage.error("JSON 读取失败");
	}
}

function rewritePreview() {
	errorMessage.value = "";

	if (!sourceJson.value) {
		errorMessage.value = "请先选择 Sub2API JSON 文件";
		return;
	}

	try {
		rewriteResult.value = rewriteSub2ApiJson(sourceJson.value, {
			accountBatchPrefix: accountBatchPrefix.value,
			notes: notes.value,
		});

		if (!outputFileName.value.trim()) {
			outputFileName.value = createDefaultOutputFileName(sourceFileName.value, accountBatchPrefix.value);
		}

		if (duplicateNames.value.length > 0) {
			ElMessage.warning("预览已生成，但存在重复的新账号名");
			return;
		}

		ElMessage.success("预览已生成");
	} catch (error) {
		rewriteResult.value = null;
		errorMessage.value = getDisplayError(error);
		ElMessage.error("预览生成失败");
	}
}

function downloadJson() {
	if (!rewriteResult.value) {
		rewritePreview();
	}

	if (!rewriteResult.value) return;

	try {
		const fileName = sanitizeJsonFileName(
			outputFileName.value || createDefaultOutputFileName(sourceFileName.value, accountBatchPrefix.value),
		);
		const blob = new Blob([stringifySub2ApiJson(rewriteResult.value.output)], {
			type: "application/json;charset=utf-8",
		});
		const objectUrl = URL.createObjectURL(blob);
		const anchor = document.createElement("a");

		anchor.href = objectUrl;
		anchor.download = fileName;
		anchor.rel = "noopener";
		document.body.appendChild(anchor);
		anchor.click();
		anchor.remove();
		window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);

		outputFileName.value = fileName;
		ElMessage.success(`已下载 ${fileName}`);
	} catch (error) {
		errorMessage.value = getDisplayError(error);
		ElMessage.error("JSON 下载失败");
	}
}

function resetForm() {
	sourceFileName.value = "";
	accountBatchPrefix.value = "";
	notes.value = "";
	outputFileName.value = "";
	sourceJson.value = null;
	rewriteResult.value = null;
	rawJsonText.value = "";
	errorMessage.value = "";
}
</script>

<template>
	<div class="sub2api-json-rewriter">
		<ElUpload
			drag
			accept=".json,application/json"
			:auto-upload="false"
			:show-file-list="false"
			:on-change="handleFileChange"
			class="sub2api-json-rewriter__upload"
		>
			<div class="sub2api-json-rewriter__upload-content">
				<UploadFilled class="sub2api-json-rewriter__upload-icon" />
				<div class="sub2api-json-rewriter__upload-title">选择 Sub2API JSON 文件</div>
				<div class="sub2api-json-rewriter__upload-meta">{{ sourceFileName || "未选择文件" }}</div>
			</div>
		</ElUpload>

		<ElAlert v-if="errorMessage" :title="errorMessage" type="error" show-icon :closable="false" />

		<ElAlert
			v-if="duplicateNames.length > 0"
			:title="`存在 ${duplicateNames.length} 个重复的新账号名`"
			type="warning"
			show-icon
			:closable="false"
		/>

		<ElForm label-position="top" class="sub2api-json-rewriter__form">
			<div class="sub2api-json-rewriter__form-grid">
				<ElFormItem label="ACCOUNT_BATCH_PREFIX" required>
					<ElInput v-model="accountBatchPrefix" clearable placeholder="2026-7-25-02-k12" />
				</ElFormItem>

				<ElFormItem label="输出文件名">
					<ElInput v-model="outputFileName" clearable placeholder="account-pool-redeem-sub2api.json" />
				</ElFormItem>
			</div>

			<ElFormItem label="notes">
				<ElInput
					v-model="notes"
					type="textarea"
					:autosize="{ minRows: 3, maxRows: 8 }"
					placeholder="留空时使用 ACCOUNT_BATCH_PREFIX"
				/>
			</ElFormItem>
		</ElForm>

		<div class="sub2api-json-rewriter__actions">
			<ElButton type="primary" :icon="View" :disabled="!isReady" @click="rewritePreview">生成预览</ElButton>
			<ElButton type="success" :icon="Download" :disabled="!hasPreview" @click="downloadJson">下载 JSON</ElButton>
			<ElButton :icon="RefreshLeft" @click="resetForm">重置</ElButton>
		</div>

		<ElDescriptions v-if="sourceJson || rewriteResult" :column="3" border class="sub2api-json-rewriter__summary">
			<ElDescriptionsItem label="来源文件">{{ sourceFileName || "未选择" }}</ElDescriptionsItem>
			<ElDescriptionsItem label="账号数量">{{ accountCount }}</ElDescriptionsItem>
			<ElDescriptionsItem label="JSON 字符数">{{ rawJsonText.length || "未读取" }}</ElDescriptionsItem>
			<ElDescriptionsItem label="生效 notes">{{ effectiveNotes }}</ElDescriptionsItem>
			<ElDescriptionsItem label="重复名称">
				<ElTag :type="duplicateNames.length > 0 ? 'warning' : 'success'" effect="plain">
					{{ duplicateNames.length }}
				</ElTag>
			</ElDescriptionsItem>
			<ElDescriptionsItem label="预览行数">{{ previewRows.length }}</ElDescriptionsItem>
		</ElDescriptions>

		<div v-if="hasPreview" class="sub2api-json-rewriter__preview">
			<ElTable :data="previewRows" border stripe max-height="360" empty-text="暂无预览">
				<ElTableColumn prop="index" label="序号" width="90" />
				<ElTableColumn prop="beforeName" label="原 name" min-width="220" show-overflow-tooltip />
				<ElTableColumn prop="emailLocalName" label="邮箱前缀" min-width="180" show-overflow-tooltip />
				<ElTableColumn prop="afterName" label="新 name" min-width="260" show-overflow-tooltip>
					<template #default="{ row }">
						<ElTag type="success" effect="plain">{{ row.afterName }}</ElTag>
					</template>
				</ElTableColumn>
			</ElTable>

			<div
				v-if="rewriteResult && rewriteResult.preview.length > previewRows.length"
				class="sub2api-json-rewriter__more"
			>
				已显示前 {{ previewRows.length }} 行，共 {{ rewriteResult.preview.length }} 行
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.sub2api-json-rewriter {
	--el-color-primary: var(--vp-c-brand-1);
	--el-color-primary-light-3: var(--vp-c-brand-2);
	--el-color-primary-light-5: var(--vp-c-brand-3);
	--el-color-primary-light-9: var(--vp-c-brand-soft);

	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 20px;
	background-color: var(--vp-c-bg-soft);
	border: 1px solid var(--vp-c-divider);
	border-radius: 8px;

	&__upload {
		width: 100%;
	}

	&__upload-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		padding: 12px;
	}

	&__upload-icon {
		width: 36px;
		height: 36px;
		color: var(--el-color-primary);
	}

	&__upload-title {
		font-size: 16px;
		font-weight: 600;
		color: var(--vp-c-text-1);
	}

	&__upload-meta {
		max-width: 100%;
		overflow-wrap: anywhere;
		font-size: 13px;
		color: var(--vp-c-text-2);
	}

	&__form {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	&__form-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 14px;
	}

	&__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	&__summary,
	&__preview {
		min-width: 0;
	}

	&__more {
		margin-top: 8px;
		font-size: 13px;
		color: var(--vp-c-text-2);
	}

	:deep(button) {
		margin: 0;
	}

	:deep(label) {
		margin: 0;
		color: var(--el-text-color-regular);
	}

	:deep(ul),
	:deep(li) {
		padding-left: 0;
		margin: 0;
		list-style: none;
	}

	:deep(table) {
		display: table;
		width: 100%;
		margin: 0;
		border-collapse: separate;
	}

	:deep(.el-upload),
	:deep(.el-upload-dragger) {
		width: 100%;
	}

	:deep(.el-form-item) {
		margin-bottom: 0;
	}

	:deep(.el-descriptions__body table) {
		table-layout: fixed;
	}

	:deep(.el-table__inner-wrapper table) {
		table-layout: auto;
	}
}

@media (max-width: 640px) {
	.sub2api-json-rewriter {
		padding: 14px;

		&__form-grid {
			grid-template-columns: 1fr;
		}

		&__actions {
			flex-direction: column;
			align-items: stretch;
		}

		:deep(.el-button) {
			width: 100%;
		}
	}
}
</style>
