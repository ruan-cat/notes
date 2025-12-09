<script lang="ts" setup>
import { ref, computed, watch, useTemplateRef, onMounted } from "vue";

const boxItems = useTemplateRef("boxItem");

/** 计算触发点的位置，通常在窗口底部的四分之一位置 */
const triggerBottom = (window.innerHeight / 5) * 4;

function checkBoxes() {
	boxItems.value.forEach((box) => {
		// 该盒子离html顶部的距离
		const boxTop = box.getBoundingClientRect().top;
		if (boxTop < triggerBottom) {
			box.classList.add("show");
		} else {
			box.classList.remove("show");
		}
	});
}

onMounted(() => {
	// const boxes = document.querySelectorAll(".box");
	window.addEventListener("scroll", checkBoxes);
	// 页面加载时执行一次 checkBoxes，以初始化初始状态
	checkBoxes();
});
</script>

<template>
	<section class="scroll-animation-root">
		<!-- :onscroll="checkBoxes()" -->
		<div class="box-container">
			<section class="box" v-for="num in 20" :key="num" ref="boxItem">
				{{ num }}
			</section>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.scroll-animation-root {
	/* 容器样式：使用 Flex 布局、圆角和阴影 */
	.box-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		margin-top: 100px;

		.box {
			background-color: steelblue;
			color: #fff;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 400px;
			height: 200px;
			margin: 10px;
			border-radius: 10px;
			box-shadow: 2px 4px 5px rgba(0, 0, 0, 0.3);
			transition: transform 0.4s ease;
			font-size: 4rem;

			// 奇数个方块向右滑入
			&:nth-of-type(odd) {
				transform: translateX(400%);
			}

			// 偶数个方块向左滑入
			&:nth-of-type(even) {
				transform: translateX(-400%);
			}

			/* 添加 show 类时的样式，实现方块滑入效果 */
			&.show {
				transform: translateX(0);
			}
		}
	}
}
</style>
