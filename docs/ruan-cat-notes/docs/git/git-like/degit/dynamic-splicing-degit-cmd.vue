<script lang="ts" setup>
import { ref, computed } from "vue";
import { ElInput, ElButton, ElMessage } from "element-plus";

const inputUrl = ref("");
const degitCommand = computed(() => {
	if (!inputUrl.value) return "";
	return `$env:NODE_TLS_REJECT_UNAUTHORIZED=0; degit ${inputUrl.value}`;
});

const copyToClipboard = () => {
	if (!degitCommand.value) {
		ElMessage.warning("请先输入文本");
		return;
	}

	navigator.clipboard
		.writeText(degitCommand.value)
		.then(() => {
			ElMessage.success(`degit命令生成成功！命令为${degitCommand.value}，已经默认复制到你的剪贴板内`);
		})
		.catch(() => {
			ElMessage.error("复制到剪贴板失败，请手动复制");
		});
};

function clear() {
	inputUrl.value = "";
	ElMessage.warning("输入框已清空");
}
</script>

<template>
	<section class="dynamic-splicing-degit-cmd-root">
		<div class="degit-input-container">
			<ElInput
				v-model="inputUrl"
				placeholder="请输入GitHub URL或其他degit可识别的地址"
				clearable
				@keyup.enter="copyToClipboard"
				@keyup.esc="clear"
			>
				<template #append>
					<ElButton @click="copyToClipboard" type="primary"> 生成并复制 </ElButton>
				</template>
			</ElInput>

			<div v-if="degitCommand" class="command-preview">
				<p>生成的命令：</p>
				<code>{{ degitCommand }}</code>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.dynamic-splicing-degit-cmd-root {
	padding: 20px;

	.degit-input-container {
		max-width: 800px;
		margin: 0 auto;

		.command-preview {
			margin-top: 15px;
			padding: 10px;
			background-color: var(--vp-c-bg-soft);
			border-radius: 4px;

			p {
				margin-bottom: 5px;
				font-weight: bold;
			}

			code {
				display: block;
				padding: 10px;
				background-color: var(--vp-code-bg);
				border-radius: 4px;
				word-break: break-all;
				font-family: monospace;
			}
		}
	}
}
</style>
