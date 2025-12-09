<script lang="ts" setup>
import { ElTabs, ElTabPane } from "element-plus";
import { ref, reactive, computed } from "vue";

import SingleCommodity from "./components/SingleCommodity.vue";

const tabBusinessConfList = [
	{
		name: "singleCommodity",
		label: "商品单品管理",
	},

	{
		name: "setMenu",
		label: "套餐组合管理",
	},
];

const selected = ref(tabBusinessConfList[0].name);
</script>

<template>
	<section>
		<ElTabs v-model="selected">
			<ElTabPane label="商品单品管理" name="singleCommodity">
				<SingleCommodity></SingleCommodity>
			</ElTabPane>

			<ElTabPane label="套餐组合管理" name="setMenu">
				<h2>套餐组合管理</h2>
			</ElTabPane>
		</ElTabs>
	</section>
</template>

<style lang="scss" scoped></style>
