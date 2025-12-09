<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useToggle } from "@vueuse/core";

const [isShowNav, setShowNav] = useToggle(false);

function openNav() {
	setShowNav(true);
}

function closeNav() {
	setShowNav(false);
}
</script>

<template>
	<section class="rotating-navigation-animation-root">
		<h2>wefwefg</h2>

		<div
			class="container"
			:class="{
				'show-nav': isShowNav,
			}"
		>
			<!-- 旋转的内容... -->
			<div class="circle-container">
				<div class="circle">
					<button id="close" @click="closeNav">关闭</button>

					<button id="open" @click="openNav">打开</button>
				</div>
			</div>

			<div class="content">
				<!-- 文章内容... -->
				一大堆文章内容
			</div>
		</div>

		<nav>
			<ul>
				<!-- 导航项... -->
			</ul>
		</nav>
	</section>
</template>

<style lang="scss" scoped>
.rotating-navigation-animation-root {
	width: 100%;
	height: auto;

	@mixin transition() {
		transition: transform 0.5s linear;
	}

	.container {
		@include transition(); /* 引用过渡动画 */

		background-color: #fafafa; /* 设置背景颜色 */
		transform-origin: top left; /* 以左上角为旋转中心 */
		position: relative;
		// 隐藏溢出内容
		overflow: hidden;
		width: 100%;
		min-height: 75vh;
		padding: 3rem; /* 添加内边距 */

		.circle-container {
			$distance: 5rem;
			// position: fixed; /* 固定定位，脱离文档流 */
			// 在我们演示demo内 不需要固定定位
			// 定位到相对的父容器上面即可
			position: absolute;
			top: -$distance; /* 初始位置上移 */
			left: -$distance; /* 初始位置左移 */

			.circle {
				@include transition(); /* 引用过渡动画 */
				background-color: #ff7979; /* 设置圆圈背景颜色 */
				height: 2 * $distance;
				width: 2 * $distance;
				border-radius: 50%; /* 圆圈的圆角边框 */
				position: relative;

				button {
					cursor: pointer;
					position: relative;
					top: 50%;
					left: 50%;
					height: fit-content;
					background: transparent; /* 透明背景 */
					border: 0;
					font-size: 1.8rem;
					color: rebeccapurple;

					&:focus {
						outline: none; /* 去除按钮的聚焦样式 */
					}

					&#open {
						// left: 60%; /* 调整 "open" 按钮的位置 */
						left: 12%; /* 调整 "open" 按钮的位置 */
					}

					&#close {
						top: 60%; /* 调整 "close" 按钮的位置 */
						transform: rotate(90deg); /* 旋转 "close" 按钮 */
						transform-origin: top left; /* 以左上角为旋转中心 */
					}
				}
			}
		}

		// 在我们的项目内 因为定位问题 所以此处的内容需要专门写选择器实现
		&.show-nav {
			transform: rotate(-20deg); /* 在显示导航时旋转容器 */

			.circle {
				// 在显示导航时旋转圆圈
				transform: rotate(-70deg);
			}
		}
	}
}
</style>
