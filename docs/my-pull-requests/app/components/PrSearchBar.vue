<script setup lang="ts">
const model = defineModel<string>({ default: "" });

withDefaults(
	defineProps<{
		/** 是否在请求 GitHub 接口 */
		loading?: boolean;
	}>(),
	{ loading: false },
);

const placeholder = "按标题、正文关键词或仓库名搜索 PR…";
</script>

<template>
	<UInput
		v-model="model"
		:loading="loading"
		icon="i-lucide-search"
		:placeholder="placeholder"
		autocomplete="off"
		:aria-busy="loading"
		class="w-full"
	>
		<template v-if="model.length" #trailing>
			<UButton color="neutral" variant="link" size="xs" icon="i-lucide-x" aria-label="清除搜索" @click="model = ''" />
		</template>
	</UInput>
</template>
