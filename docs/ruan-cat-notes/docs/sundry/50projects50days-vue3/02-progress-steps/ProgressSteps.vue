<script lang="ts" setup>
import { ref, computed } from "vue";
import type { CSSProperties } from "vue";

import { ElButton } from "element-plus";

/**
 * 内部计数器
 * @description
 * 按照自然计数法 而不是数组下标计数法
 * 默认从第一个元素开始点击
 */
const counter = ref(1);

/**
 * 圆圈数目 允许使用的圆圈数目
 * @description
 * 进度块的数目
 */
const circleNumber = ref(7);

/**
 * 上一个按钮 是否可用？
 * @description
 * 是否可以点击上一个按钮
 *
 * 只要当前进度条的值大于1 就可以点击上一个按钮
 */
const isLastBtnActive = computed(() => counter.value > 1);

/**
 * 下一个按钮 是否可用？
 * @description
 * 是否可以点击下一个按钮
 *
 * 只要当前进度条的值小于圆圈数目 就可以点击下一个按钮
 */
const isNextBtnActive = computed(() => counter.value < circleNumber.value);

function doLast() {
	if (isLastBtnActive.value) {
		counter.value--;
	}
}

function doNext() {
	if (isNextBtnActive.value) {
		counter.value++;
	}
}

const progressWidth = computed<CSSProperties>(() => {
	return {
		width: `${((counter.value - 1) / (circleNumber.value - 1)) * 100}%`,
	};
});
</script>

<template>
	<section class="ProgressSteps-root">
		<section class="container">
			<section class="progress-container">
				<section class="progress" :style="progressWidth"></section>

				<section class="circle" v-for="i in circleNumber" :key="i" :class="{ active: counter >= i }">
					{{ i }}
				</section>
			</section>

			<section class="btns">
				<ElButton type="primary" @click="doLast" :disabled="!isLastBtnActive"> 上一个 </ElButton>
				<ElButton type="primary" @click="doNext" :disabled="!isNextBtnActive"> 下一个 </ElButton>
			</section>
		</section>
	</section>
</template>

<style lang="scss" scoped>
.ProgressSteps-root {
	.container {
		text-align: center;

		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		// 按钮区容器
		.btns {
			text-align: center;
		}

		/* 先定义一个区域 */
		.progress-container {
			// 定义一个过渡效果
			@mixin transition() {
				transition: 0.4s ease;
			}

			display: flex;
			align-items: center;
			justify-content: space-between; /* 这个里面有圆圈的位置*/
			position: relative;
			margin-bottom: 2rem;
			// max-width: 100%;
			width: 75%;

			/* 在区域内部,采用伪类画了灰色一条线 */
			&::before {
				content: "";
				// background-color: #eee;
				background-color: red;
				position: absolute;
				top: 50%;
				left: 0;
				transform: translateY(-50%);
				height: 4px;
				width: 100%;
				z-index: -1;
			}

			/* 在区域内部画了一条有颜色的线*/
			.progress {
				// background-color: blue;
				background-color: rebeccapurple;
				position: absolute;
				top: 50%;
				left: 0;
				transform: translateY(-50%);
				height: 4px;
				width: 0%; /* width根据点击进行百分比变化*/
				@include transition;
			}

			/* 对圆圈的字体内部的数据做处理 */
			.circle {
				z-index: 1;

				background-color: #fff;
				color: #999;
				border-radius: 50%;
				height: 30px;
				width: 30px;
				display: flex;
				align-items: center;
				justify-content: center;
				border: 3px solid #999;
				@include transition;

				/* 活跃的圆圈变了颜色 */
				&.active {
					border-color: blue;
				}
			}
		}
	}
}
</style>
