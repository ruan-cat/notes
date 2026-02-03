<template>
  <div class="pixi-canvas-wrapper" ref="wrapper">
    <div ref="canvasContainer" class="canvas-container"></div>
    <div v-if="!hasImage" class="placeholder">
      请点击上方按钮上传图片<br>以查看圆柱体效果
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as PIXI from 'pixi.js'

const props = defineProps<{
  imageFile: File | null
}>()

const canvasContainer = ref<HTMLElement | null>(null)
const wrapper = ref<HTMLElement | null>(null)
const hasImage = ref(false)

let app: PIXI.Application | null = null
let stageContainer: PIXI.Container | null = null

// 初始化 Pixi 应用
const initPixi = async () => {
  if (!canvasContainer.value) return

  app = new PIXI.Application()
  await app.init({
    width: 800,
    height: 600,
    background: '#1a1a1a',
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true
  })

  canvasContainer.value.appendChild(app.canvas)

  stageContainer = new PIXI.Container()
  stageContainer.x = app.screen.width / 2
  stageContainer.y = app.screen.height / 2
  app.stage.addChild(stageContainer)
}

// 创建圆柱体网格
const createCylinderPlane = async (texture: PIXI.Texture) => {
  if (!stageContainer || !app) return

  // 清理旧内容
  stageContainer.removeChildren()

  // --- 配置参数 ---
  const segmentsX = 40 // X轴分段数
  const segmentsY = 2  // Y轴分段数

  const imgWidth = texture.width
  const imgHeight = texture.height

  // 创建 SimplePlane
  const plane = new PIXI.MeshPlane({ texture, verticesX: segmentsX, verticesY: segmentsY })

  // --- 数学变换 ---
  const buffer = plane.geometry.getBuffer('aPosition')
  const data = buffer.data as Float32Array

  // 理论圆柱半径
  const radius = (imgWidth / Math.PI) * 1.2

  for (let i = 0; i < data.length; i += 2) {
    const originalY = data[i + 1]

    const vertexIndex = i / 2
    const cols = segmentsX + 1
    const colIndex = vertexIndex % cols

    // 归一化比例 k (0.0 ~ 1.0)
    const k = colIndex / segmentsX

    // 映射到角度 (-90度 ~ +90度)
    const angle = (k - 0.5) * Math.PI

    // 圆柱投影公式
    const cylinderX = radius * Math.sin(angle)
    const depthZ = radius * Math.cos(angle)

    // 应用坐标
    data[i] = cylinderX

    // 透视效果
    const perspectiveFactor = 0.85 + (depthZ / radius) * 0.15

    // 调整 Y 轴
    const centerY = imgHeight / 2
    const distY = originalY - centerY
    data[i + 1] = centerY + distY * perspectiveFactor
  }

  buffer.update()

  // 居中平面
  plane.x = -imgWidth / 2 + (imgWidth - (radius * 2)) / 2
  // Pixi v8 pivot handled differently or same? Let's assume standard behavior.
  // Actually SimplePlane doesn't have width/height properties in same way as Sprite sometimes.
  // Let's set pivot to center.
  plane.pivot.set(imgWidth / 2, imgHeight / 2)

  stageContainer.addChild(plane)

  // 添加阴影
  createShadingOverlay(radius, imgHeight, stageContainer)
}

// 创建光影遮罩
const createShadingOverlay = (widthRadius: number, height: number, parent: PIXI.Container) => {
  const canvas = document.createElement('canvas')
  const projectedWidth = widthRadius * 2

  canvas.width = 256
  canvas.height = 1
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const gradient = ctx.createLinearGradient(0, 0, 256, 0)
  gradient.addColorStop(0, 'rgba(0,0,0, 0.8)')
  gradient.addColorStop(0.2, 'rgba(0,0,0, 0.2)')
  gradient.addColorStop(0.5, 'rgba(0,0,0, 0.0)')
  gradient.addColorStop(0.8, 'rgba(0,0,0, 0.2)')
  gradient.addColorStop(1, 'rgba(0,0,0, 0.8)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 256, 1)

  const shadowTexture = PIXI.Texture.from(canvas)
  const shadow = new PIXI.Sprite(shadowTexture)

  shadow.width = projectedWidth
  shadow.height = height
  shadow.scale.y = 0.85 // 透视因子平均值

  shadow.anchor.set(0.5)
  // Pixi v8 uses blendMode differently? BLEND_MODES.MULTIPLY should work.
  shadow.blendMode = 'multiply'

  parent.addChild(shadow)
}

watch(() => props.imageFile, (newFile) => {
  if (newFile) {
    hasImage.value = true
    const reader = new FileReader()
    reader.onload = async (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        const texture = await PIXI.Assets.load(e.target.result)
        createCylinderPlane(texture)
      }
    }
    reader.readAsDataURL(newFile)
  }
})

onMounted(() => {
  initPixi()
})

onUnmounted(() => {
  if (app) {
		// @ts-ignore
    app.destroy(true, { children: true, texture: true, baseTexture: true })
  }
})
</script>

<style scoped>
.pixi-canvas-wrapper {
  position: relative;
  width: 100%;
  height: 600px;
  background: #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.canvas-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.placeholder {
  position: absolute;
  color: #fff;
  text-align: center;
  font-size: 18px;
  pointer-events: none;
  line-height: 1.5;
}
</style>
