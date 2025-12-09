<script lang="ts" setup>
import { ref, computed, watch, useTemplateRef } from "vue";
import { useMouseInElement } from "@vueuse/core";

const leftRef = useTemplateRef("leftRef");
const rightRef = useTemplateRef("rightRef");

const { isOutside: isLeftOutside } = useMouseInElement(leftRef);
const { isOutside: isRightOutside } = useMouseInElement(rightRef);

const containerClass = computed(() => {
	return {
		"hover-left": !isLeftOutside.value,
		"hover-right": !isRightOutside.value,
	};
});
</script>

<template>
	<section class="split-landing-page-root">
		<div class="container" :class="containerClass">
			<div class="split left" ref="leftRef">
				<h1>Playstation 5</h1>
				<a href="#" class="btn">Buy Now</a>
			</div>

			<div class="split right" ref="rightRef">
				<h1>XBox Series X</h1>
				<a href="#" class="btn">Buy Now</a>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.split-landing-page-root {
	width: 100%;
	height: 40vh;

	--left-bg-color: rgba(87, 84, 236, 0.7);
	--right-bg-color: rgba(43, 43, 43, 0.8);
	--left-btn-hover-color: rgba(87, 84, 236, 1);
	--right-btn-hover-color: rgba(28, 122, 28, 1);
	--hover-width: 75%;
	--other-width: 25%;
	--speed: 1000ms;

	.container {
		position: relative;
		width: 100%;
		height: 100%;
		background: #333;
	}

	.split {
		position: absolute;
		width: 50%;
		height: 100%;
		overflow: hidden;

		&.left {
			// left: 0;
			// background: url("ps.jpg");
			// background-repeat: no-repeat;
			// background-size: cover;
		}

		&.right,
		&.left,
		&.right::before,
		&.left::before {
			transition: all var(--speed) ease-in-out;
		}

		&.left {
			left: 0;
			background-color: rebeccapurple;
		}
		&.right {
			right: 0;
			background-color: brown;
		}
	}

	.hover-left {
		.left {
			width: var(--hover-width);
		}
		.right {
			width: var(--other-width);
		}
	}

	.hover-right {
		.right {
			width: var(--hover-width);
		}
		.left {
			width: var(--other-width);
		}
	}
}
</style>
