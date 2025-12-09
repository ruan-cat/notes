<script lang="ts" setup>
import { ref, computed, watch } from "vue";

import { ElInput } from "element-plus";

const inputValue = ref();

function change(event) {
	console.log(" ?  ", event);
	// let file = event.target.files;
	// console.log(file);
}

/**
 * @see https://juejin.cn/post/7122657335402561550
 */
const readDir = async () => {
	const directoryHandle = await window.showDirectoryPicker();
	for await (const entry of directoryHandle.values()) {
		console.log(entry.kind, entry.name);
	}
};
</script>

<template>
	<section class="webkitdirectory-demo-root">
		<ElButton @click="readDir()">readDir</ElButton>

		<!-- <ElInput v-model="inputValue" placeholder="请输入内容" type="file" webkitdirectory @change="change($event)" /> -->
		<input placeholder="请输入内容" type="file" directory multiple webkitdirectory @change="change($event)" />
	</section>
</template>

<style lang="scss" scoped>
.webkitdirectory-demo-root {
}
</style>
