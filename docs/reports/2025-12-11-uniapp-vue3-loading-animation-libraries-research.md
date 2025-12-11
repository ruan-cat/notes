# 2025-12-11 UniApp Vue3 TypeScript 加载动效库调研报告

## 1. 调研概述

### 1.1 调研背景

本报告调研于 2025-12-11，旨在为基于 uniapp + vue3 + typescript 技术栈的项目寻找美观、精彩的加载等待动效库。

### 1.2 调研范围

- GitHub 开源项目
- uniapp 生态专用组件库
- Vue3 兼容的通用加载组件

### 1.3 调研结果概览

共调研到 **3 个主要 UI 框架** 和**多个独立解决方案**，涵盖从完整 UI 库到轻量化专用组件的各类选择。

## 2. 核心发现

### 2.1 UV-UI（Vue3 优先推荐）

**基本信息**

| 项目地址 | GitHub: [climblee/uv-ui](https://github.com/climblee/uv-ui) |
| :------: | :---------------------------------------------------------: |
|  Stars   |                          中等活跃                           |
| 最后更新 |                    2024-2025 年持续维护                     |
|  技术栈  |            兼容 Vue2/Vue3，内置 TypeScript 支持             |
| 组件数量 |                         60+ 个组件                          |

**加载动效组件：uv-loading-icon**

UV-UI 是专为 uniapp 设计的现代化 UI 库，其加载动效组件具有以下特性：

|    特性    |                   说明                    |
| :--------: | :---------------------------------------: |
|  动画模式  |        spinner、circle、semicircle        |
| 自定义能力 |     颜色、尺寸、文本、布局完全可配置      |
| 平台兼容性 |      App、H5、微信小程序等多平台支持      |
|  事件处理  | 内置 @touchmove.stop.prevent 防止滚动穿透 |
|  性能评级  |                ⭐⭐⭐⭐⭐                 |

**使用示例**

```vue
<template>
	<view>
		<!-- 基础使用 -->
		<uv-loading-icon mode="spinner" color="#ff9900" size="36" text="加载中..." />

		<!-- 自定义样式 -->
		<uv-loading-icon mode="circle" color="#1890ff" size="40" text="数据加载中" text-color="#666" />
	</view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

/** 加载状态控制 */
const loading = ref<boolean>(true);

onMounted(() => {
	setTimeout(() => {
		loading.value = false;
	}, 2000);
});
</script>
```

**安装命令**

```bash
npm install @climblee/uv-ui
# 或
pnpm add @climblee/uv-ui
```

**推荐指数**：⭐⭐⭐⭐⭐（五星推荐）

**推荐理由**：原生 Vue3 支持，TypeScript 集成度高，专为 uniapp 多平台优化

### 2.2 uView-plus（Vue3 升级版）

**基本信息**

|  项目地址  | GitHub: [ijry/uview-plus](https://github.com/ijry/uview-plus) |
| :--------: | :-----------------------------------------------------------: |
|    前身    |                     uView-ui 的 Vue2 版本                     |
| Vue3 支持  |                     ✅ 原生 Vue3.4+ 支持                      |
| TypeScript |                        ✅ 完整类型定义                        |
|  最后更新  |                      2024 年持续升级优化                      |

**加载动效组件：u-loading**

作为 uniapp 领域最受欢迎的 UI 库之一，uView 的 Vue3 版本保持了其易用性和功能的完整性。

|    特性    |             说明              |
| :--------: | :---------------------------: |
| API 兼容性 | 与 uView 1.x 版本保持高度一致 |
|  性能优化  |   针对 Vue3 编译做专门优化    |
| 组件丰富度 |   50+ 个组件，涵盖常用场景    |
|  学习曲线  |        平缓，文档详尽         |
| 社区活跃度 |          ⭐⭐⭐⭐⭐           |

**使用示例**

```vue
<template>
	<view>
		<!-- 显示加载动画 -->
		<u-loading :show="isLoading" mode="circle" color="#1890ff" size="40" />

		<!-- 内容区域 -->
		<view v-show="!isLoading">
			<!-- 页面内容 -->
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref } from "vue";

/** 加载状态 */
const isLoading = ref<boolean>(true);

/** 模拟异步操作 */
async function fetchData() {
	isLoading.value = true;
	try {
		// 模拟 API 调用
		await new Promise((resolve) => setTimeout(resolve, 1500));
	} finally {
		isLoading.value = false;
	}
}
</script>
```

**安装命令**

```bash
npm install uview-plus
# 或
pnpm add uview-plus
```

**推荐指数**：⭐⭐⭐⭐☆（四星推荐）

**推荐理由**：社区庞大，生态成熟，适合从 uView 1.x 迁移的项目，但对于新项目推荐 UV-UI

### 2.3 uni-loading（纯 CSS 动画集合）

**基本信息**

| 项目地址 | GitHub: [wkiwi/uni-loading](https://github.com/wkiwi/uni-loading) |
| :------: | :---------------------------------------------------------------: |
| 项目类型 |                      专注加载动画的轻量级库                       |
| 动画数量 |                       30+ 种纯 CSS 加载动画                       |
| 技术特点 |                        无依赖，纯 CSS 实现                        |
| 适用场景 |               只需加载动画，不需要完整 UI 库的项目                |

**项目特性**

|    特性    |             说明             |
| :--------: | :--------------------------: |
|  文件大小  |      极小，仅 CSS 代码       |
|  使用方式  | 复制动画 CSS 代码到项目即可  |
|   定制化   | 可通过修改变量调整颜色、尺寸 |
| TypeScript |        ❌ 无类型定义         |
|  维护状态  |  ⚠️ 传统项目，维护频率较低   |

**使用示例**

```vue
<template>
	<view>
		<!-- 使用组件 -->
		<w-loading text="加载中.." mask="true" click="true" ref="loadingRef" />
	</view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

/** 加载组件引用 */
const loadingRef = ref<any>(null);

onMounted(() => {
	/** 显示加载动画 */
	loadingRef.value?.open();

	/** 模拟数据加载完成后关闭 */
	setTimeout(() => {
		loadingRef.value?.close();
	}, 3000);
});
</script>
```

**获取方式**

```bash
git clone https://github.com/wkiwi/uni-loading
```

**推荐指数**：⭐⭐⭐☆☆（三星推荐）

**推荐理由**：轻量简单，适合对动画效果要求不高且追求包体积小的项目

## 3. 通用 Vue3 加载组件

### 3.1 vue3-loading-overlay

**项目地址**：GitHub: [moyoujun/vue3-loading-overlay](https://github.com/moyoujun/vue3-loading-overlay)

|    特性    |                  说明                  |
| :--------: | :------------------------------------: |
|  项目类型  |         Vue3 专用全屏加载遮罩          |
| TypeScript |              ✅ 完整支持               |
| 自定义能力 | 支持颜色、透明度、模糊效果、z-index 等 |
|   兼容性   |         可在 uniapp 项目中使用         |
|   活跃度   |              持续维护更新              |

**安装与使用**

```bash
npm install vue3-loading-overlay
```

```vue
<template>
	<div>
		<loading
			v-model:active="isLoading"
			:can-cancel="true"
			:on-cancel="onCancel"
			color="#4B98FE"
			loader="dots"
			:width="80"
			:height="80"
			background-color="#000000"
			:opacity="0.7"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";

/** 组件加载状态 */
const isLoading = ref<boolean>(false);

/** 取消加载回调 */
const onCancel = () => {
	console.log("用户取消了加载");
};
</script>
```

### 3.2 vue3-spinner

**项目地址**：GitHub: [ricardoaponte/vue3-spinner](https://github.com/ricardoaponte/vue3-spinner)

|    特性    |         说明          |
| :--------: | :-------------------: |
|  组件类型  |     加载动画集合      |
|  动画种类  | 提供多种 spinner 类型 |
| TypeScript |      ✅ 类型定义      |
|  使用方式  |       按需导入        |
|  最近更新  |     2023-2024 年      |

**安装与使用**

```bash
npm install vue3-spinner
```

```vue
<template>
	<div>
		<!-- 网格加载动画 -->
		<grid-loader :loading="loading" :color="color" :size="size" />

		<!-- 点状加载动画 -->
		<dot-loader :loading="loading" :color="color" :size="size" />
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { GridLoader, DotLoader } from "vue3-spinner";

/** 加载状态 */
const loading = ref<boolean>(true);

/** 动画颜色 */
const color = ref<string>("#4B98FE");

/** 动画尺寸 */
const size = ref<string>("40px");
</script>
```

## 4. 2024 年 Vue3 实现最佳实践

### 4.1 Composition API + 全局工具函数

现代化的实现方式，利用 Vue3 的 `createVNode` 和 `render` 函数：

```typescript
// utils/loading.ts
import { createVNode, render, VNode } from "vue";
import LoadingComponent from "@/components/Loading.vue";

interface LoadingOptions {
	/** 加载提示文本 */
	text?: string;
	/** 是否显示遮罩层 */
	mask?: boolean;
	/** 动画类型 */
	type?: "default" | "spinner" | "circle";
	/** 自定义样式类名 */
	customClass?: string;
}

let loadingInstance: VNode | null = null;
let container: HTMLDivElement | null = null;

/**
 * 显示加载动画
 * @param options - 加载配置选项
 * @returns 加载实例
 */
export function showLoading(options: LoadingOptions = {}) {
	// 防止重复创建
	if (loadingInstance) {
		return loadingInstance;
	}

	container = document.createElement("div");
	document.body.appendChild(container);

	const vnode = createVNode(LoadingComponent, {
		...options,
		onClose: () => {
			hideLoading();
		},
	});

	render(vnode, container);
	loadingInstance = vnode;

	return vnode.component?.exposed;
}

/**
 * 隐藏加载动画
 */
export function hideLoading() {
	if (container && loadingInstance) {
		render(null, container);
		document.body.removeChild(container);
		loadingInstance = null;
		container = null;
	}
}

/**
 * 获取加载实例
 */
export function getLoadingInstance() {
	return loadingInstance;
}
```

### 4.2 TypeScript 类型安全的组件示例

```vue
<template>
	<transition name="fade">
		<div v-if="loading" class="loading-overlay" :class="customClass" @touchmove.stop.prevent>
			<div class="loading-content">
				<div class="loading-spinner" :class="`loading-${type}`">
					<div v-for="i in 4" :key="i" class="loading-dot" />
				</div>
				<p v-if="text" class="loading-text">{{ text }}</p>
			</div>
		</div>
	</transition>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from "vue";

/** 加载动画类型 */
type LoadingType = "default" | "spinner" | "circle";

interface Props {
	/** 是否显示加载状态 */
	loading: boolean;
	/** 加载提示文本 */
	text?: string;
	/** 加载动画类型 */
	type?: LoadingType;
	/** 自定义样式类名 */
	customClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
	text: "加载中...",
	type: "spinner",
	customClass: "",
});

const emit = defineEmits<{
	/** 关闭时触发 */
	(e: "close"): void;
}>();

/** 组件卸载时清理 */
onUnmounted(() => {
	emit("close");
});
</script>

<style scoped>
.loading-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.6);
	z-index: 9999;
	display: flex;
	align-items: center;
	justify-content: center;
}

.loading-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 15px;
}

.loading-text {
	color: #fff;
	font-size: 14px;
}

.loading-spinner {
	width: 40px;
	height: 40px;
	position: relative;
}

.loading-default {
	animation: spin 1s linear infinite;
	border: 3px solid transparent;
	border-top: 3px solid #4b98fe;
	border-radius: 50%;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
```

## 5. 框架对比与选型建议

### 5.1 横向对比表

|    特性维度    |   uv-ui    | uView-plus | uni-loading | vue3-loading-overlay | vue3-spinner |
| :------------: | :--------: | :--------: | :---------: | :------------------: | :----------: |
| **TypeScript** |     ✅     |     ✅     |     ❌      |          ✅          |      ✅      |
| Vue3 原生支持  |     ✅     |     ✅     |     ⚠️      |          ✅          |      ✅      |
|  uniapp 优化   |     ✅     |     ✅     |     ⚠️      |          ⚠️          |      ⚠️      |
|   组件丰富度   |    60+     |    50+     | 仅加载动画  |      仅加载组件      |  仅加载组件  |
|    性能评分    | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |  ⭐⭐⭐⭐   |      ⭐⭐⭐⭐⭐      |   ⭐⭐⭐⭐   |
|   维护活跃度   |     高     |     高     |     中      |          中          |      中      |
|    学习曲线    |    中等    |    平缓    |    平缓     |         平缓         |     平缓     |
|     包体积     |    中等    |    中等    |    极小     |          小          |      小      |
|    社区支持    | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |   ⭐⭐⭐    |        ⭐⭐⭐        |    ⭐⭐⭐    |
|    推荐指数    | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐☆  |  ⭐⭐⭐☆☆   |      ⭐⭐⭐⭐☆       |   ⭐⭐⭐☆☆   |

### 5.2 选型建议

|      项目场景      |          推荐方案          |                             理由                             |
| :----------------: | :------------------------: | :----------------------------------------------------------: |
|  ** 新项目开发 **  |        ** uv-ui **         | 原生 Vue3 支持，TypeScript 集成度高，专为 uniapp 新架构优化  |
| ** 原有项目升级 ** |      ** uView-plus **      |         与 uView 1.x 兼容性好，迁移成本低，社区庞大          |
|    **极简需求**    |      **uni-loading**       |          仅需加载动画时选择，包体积极小，无额外依赖          |
|  ** H5/PC 优先 **  | ** vue3-loading-overlay ** |            更适合 Web 端的全屏加载场景，配置灵活             |
|  **特殊动画需求**  |        **组合使用**        | 基础项目使用 uv-ui，特殊动画使用 uni-loading 或 vue3-spinner |

## 6. 总结与建议

### 6.1 调研总结

本次调研共发现 5 个主要解决方案，涵盖从完整 UI 库到轻量专用组件的各类选择。其中 uv-ui 和 uView-plus 作为 uniapp 生态的主要 UI 库，均提供了完善的加载动效组件和 TypeScript 支持。

### 6.2 最终推荐

#### 🥇 最佳推荐：uv-ui

**适用场景**：

- 新项目从零开始
- 需要使用完整的 uniapp UI 组件库
- 高度重视 TypeScript 类型安全
- 追求最佳的性能和开发体验

**优势**：

- Vue3 原生设计，无需兼容性处理
- 全面的 TypeScript 类型定义
- 活跃的开发维护
- 丰富的组件生态系统

#### 🥈 备选方案：uView-plus

**适用场景**：

- 已有 uView 1.x 项目需要升级
- 团队熟悉 uView 的使用方式
- 需要稳定的社区支持

**优势**：

- 成熟的社区生态
- 详尽的文档和示例
- 与旧版本兼容性好

### 6.3 注意事项

1. **安装前确认**：请在安装前确认项目是否已正确配置 Vue3 和 TypeScript 环境
2. **按需导入**：推荐按需导入组件以减少包体积
3. **样式隔离**：在 uniapp 多平台场景下，注意组件样式隔离
4. **性能优化**：对于频繁切换的加载状态，建议使用 v-show 而非 v-if

## 7. 参考资料

### 7.1 GitHub 项目源码

- [uv-ui](https://github.com/climblee/uv-ui)
- [uView-plus](https://github.com/ijry/uview-plus)
- [uni-loading](https://github.com/wkiwi/uni-loading)
- [vue3-loading-overlay](https://github.com/moyoujun/vue3-loading-overlay)
- [vue3-spinner](https://github.com/ricardoaponte/vue3-spinner)

### 7.2 相关文档

- UV-UI 官方文档：https://www.uvui.cn/components/loadingIcon.html
- uView-plus 文档：https://uview-plus.jiangruyi.com/

### 7.3 技术文章

- [UniApp 自定义动态加载组件(2024.7 更新)](https://blog.csdn.net/qq_37523448/article_details/140434727)
- [Vue3 加载动画实现与优化指南](https://hot.dawoai.com/posts/2025/vue3-loading-animations-realization-and-optimization-guide/)

---

**调研完成时间**：2025-12-11

**调研人员**：AI Code Assistant

**版本**：v1.0.0
