<script lang="ts" setup>
import { ref, computed, watch, useTemplateRef } from "vue";
import { useToggle } from "@vueuse/core";

import { ElInput } from "element-plus";
import { Icon } from "@iconify/vue";

const inputRef = useTemplateRef("input");
const [isActive, setActive] = useToggle(false);

function open() {
	setActive();
	inputRef.value.focus();
}
</script>

<template>
	<section class="hidden-search-widget-root">
		<section
			class="search"
			:class="{
				active: isActive,
			}"
		>
			<ElInput class="input" ref="input"></ElInput>
			<Icon class="btn" icon="ant-design:search-outlined" @click="open()"></Icon>
		</section>
	</section>
</template>

<style lang="scss" scoped>
@mixin transitionAll($time: 0.3s, $ease: ease) {
	transition: all $time $ease;
}

// 搜索栏高度
$search-height: 3rem;
// 输入框字体大小
$input-font-size: 1.3rem;
// 输入框初始宽度
$input-initial-width: 3rem;
// 输入框展开后的宽度
$input-expanded-width: 10rem;
// 按钮字体大小
$btn-font-size: 24px;
// 按钮平移距离
$btn-translate-x: $input-expanded-width;
// 背景颜色
$background-color: #fff;

.hidden-search-widget-root {
	/* 设置搜索栏的容器样式 */
	.search {
		position: relative;
		height: $search-height;

		/* 设置输入框样式，并添加过渡动画以实现宽度变化效果 */
		.input {
			background-color: $background-color;
			border: 0;
			font-size: $input-font-size;
			height: $search-height;
			width: $input-initial-width; /* 初始宽度 */
			@include transitionAll();

			&:focus {
				outline: none;
			}
		}

		/* 设置按钮样式 */
		.btn {
			background-color: $background-color;
			border: 0;
			cursor: pointer;
			font-size: $btn-font-size;
			position: absolute; /* 绝对定位 */
			top: 0;
			left: 0;
			height: $search-height;
			width: $search-height;
			@include transitionAll(); /* 添加平移过渡动画 */

			&:focus {
				outline: none;
			}
		}

		/* 当搜索栏处于激活状态时，展开输入框 */
		&.active {
			.input {
				width: $input-expanded-width; /* 展开后的宽度 */
			}

			/* 当搜索栏处于激活状态时，移动按钮以适应展开的输入框 */
			.btn {
				transform: translateX($btn-translate-x); /* 平移按钮 */
			}
		}
	}
}
</style>
