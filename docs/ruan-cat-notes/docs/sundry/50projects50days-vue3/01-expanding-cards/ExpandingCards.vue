<script lang="ts" setup>
import { ref, computed, watch, onMounted } from "vue";
import { v4 as uuidv4 } from "uuid";
import { ElImage, ElLoading } from "element-plus";

import axios from "axios";

/** @see https://www.dmoe.cc/ */
type GetImageResponse = {
	code: string;
	imgurl: string;
	width: string;
	height: string;
};

/** 遍历的图片项 */
type Item = {
	image: string;
	id: string;
};

/**
 * 随机图片接口 数据集
 * @description
 *
 * @see https://www.laoluowl.cn/archives/35
 * @see https://blog.csdn.net/SectSnow/article/details/115835711
 * @see https://www.dmoe.cc/
 */
const imageApiList = [
	// 樱花随机二次元图片API
	// "https://www.dmoe.cc/random.php",
	"https://www.dmoe.cc/random.php?return=json",

	// 随机二次元图片API接口
	"https://api.vvhan.com/api/acgimg",
];

const imageApi = imageApiList[0];

const isLoading = ref(false);

const service = axios.create({
	withCredentials: false,
	headers: {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Credentials": "true",
	},
});

async function getImage() {
	return await service.get<GetImageResponse>(imageApi).then((response) => {
		return response;
	});
}

const items = ref<Item[]>([]);

const itemNumber = 5;

/** `<el-image>` 的 preview-src-list 配置 */
const previewSrcList = computed(() => items.value.map((elm) => elm.image));

async function initItems() {
	const asyncList = new Array(itemNumber).fill(1).map((elm) => {
		return getImage();
	});

	isLoading.value = true;
	await Promise.all(asyncList)
		.then((response) => {
			items.value = response.map((res) => {
				return {
					image: res.data.imgurl,
					id: uuidv4(),
				};
			});
		})
		.finally(() => {
			isLoading.value = false;
		});
}

/** 被点击图片项的id值 */
const itemIdClicked = ref<Item["id"]>("");

function initItemIdClicked() {
	itemIdClicked.value = items.value?.[0]?.id ?? "";
}

function handleClick(params: Item) {
	itemIdClicked.value = params.id;
}

onMounted(async () => {
	// https://api.oick.cn/random/api.php?type=pc
	// https://www.dmoe.cc/random.php?return=json

	fetch("https://api.oick.cn/random/api.php?type=pc", {
		mode: "no-cors",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => response.json())
		.then((data) => {});
});
</script>

<template>
	<section class="ExpandingCards-root">
		<!-- v-loading="isLoading" 
			无法使用 局部导入时 导致了识别错误
		-->
		<section class="container" v-loading="isLoading">
			<ElImage
				class="item"
				fit="cover"
				loading="lazy"
				v-for="item in 5"
				src="https://api.oick.cn/random/api.php?type=pc"
			>
				<template #error> </template>
			</ElImage>
		</section>
	</section>
</template>

<style lang="scss" scoped>
.ExpandingCards-root {
	// 默认占据一半可视高度
	height: 50vh;
	width: 100%;

	.container {
		height: 100%;
		width: 100%;

		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;

		gap: 20px;

		.item {
			flex: 0.5 0;
			height: 100%;
			cursor: pointer;
			transition: all 0.5s ease-in;

			&.isClicked {
				flex: 4 0;
			}

			// 反选择器 只要没选择的 就应用 灰色滤镜 和 模糊
			&:not(.isClicked) {
				filter: grayscale(100%) blur(3px);
			}

			// 该写法无效
			// &:deep(.el-image) {
			// 	opacity: 0.4;
			// }

			/**
				参考资料 https://blog.csdn.net/m0_47097190/article/details/131306821 
				使用背景图片时 样式设置才有效
			 */
			// 	// 保持原有比例
			// 	background-size: cover;
			// 	// 不重复
			// 	background-repeat: no-repeat;
			// 	// 图片居中
			// 	background-position: center;
		}
	}
}

// 该深度作用选择器写法才是有效的
// .ExpandingCards-root {
// 	:deep(.el-image) {
// 		opacity: 0.4;
// 	}
// }
</style>
