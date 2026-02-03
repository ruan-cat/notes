<template>
  <div class="pixi-canvas-wrapper" ref="wrapper">
    <div ref="canvasContainer" class="canvas-container"></div>
    <div v-if="!hasImage" class="placeholder">
      请点击上方按钮上传图片<br>以查看 Pixi V4 圆柱体效果
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{
  imageFile: File | null
}>()

const canvasContainer = ref<HTMLElement | null>(null)
const wrapper = ref<HTMLElement | null>(null)
const hasImage = ref(false)

let PIXI: any = null
let app: any = null
let stageContainer: any = null

const initPixi = async () => {
  if (!canvasContainer.value) return

  if (!PIXI) {
    // @ts-ignore
    if (typeof window !== 'undefined' && !window.global) {
      // @ts-ignore
      window.global = window
    }
    // @ts-ignore
    const pixiModule = await import('pixi.js-v4')
    // Handle both default export (common in bundlers) and named export
    PIXI = pixiModule.default || pixiModule
  }

  // @ts-ignore
  app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0x1a1a1a,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true
  })

  canvasContainer.value.appendChild(app.view)

  stageContainer = new PIXI.Container()
  const resolution = app.renderer.resolution || 1
  stageContainer.x = (app.renderer.width / resolution) / 2
  stageContainer.y = (app.renderer.height / resolution) / 2
  app.stage.addChild(stageContainer)

  if (props.imageFile) {
    loadImage(props.imageFile)
  }
}

const loadImage = (file: File) => {
  if (!PIXI) return

  const reader = new FileReader()
  reader.onload = (e) => {
    if (e.target?.result && typeof e.target.result === 'string') {
      const texture = PIXI.Texture.from(e.target.result)
      createCylinderMesh(texture)
    }
  }
  reader.readAsDataURL(file)
}

/** 手动创建圆柱体 Mesh (PixiJS v4) */
const createCylinderMesh = (texture: any) => {
  if (!stageContainer || !app || !PIXI) return

  // 确保纹理已加载且尺寸有效
  if (!texture.baseTexture.hasLoaded || texture.width <= 1 || texture.height <= 1) {
    texture.once('update', () => createCylinderMesh(texture))
    return
  }

  stageContainer.removeChildren()

  const segmentsX = 40
  const segmentsY = 2
  const verticesX = segmentsX + 1
  const verticesY = segmentsY

  const imgWidth = texture.width
  const imgHeight = texture.height
  const radius = imgWidth / Math.PI

  // 使用 Plane 自动生成拓扑结构
  // @ts-ignore
  const mesh = new PIXI.mesh.Plane(texture, verticesX, verticesY)

  // 【防止重置】覆盖 refresh 方法，防止 Texture 更新时重置顶点
  // @ts-ignore
  mesh.refresh = () => {};
  // @ts-ignore
  mesh._refresh = () => {};

  const vertices = mesh.vertices

  for (let i = 0; i < vertices.length / 2; i++) {
    const col = i % verticesX
    const row = Math.floor(i / verticesX)

    const u = col / segmentsX
    const v = row / (segmentsY - 1)

    const angle = (u - 0.5) * Math.PI
    
    const cylinderX = radius * Math.sin(angle)
    const depthZ = radius * Math.cos(angle)

    const originalY = v * imgHeight
    const centerY = imgHeight / 2
    
    // 透视因子
    const perspectiveFactor = 0.85 + (depthZ / radius) * 0.15
    
    const distY = originalY - centerY
    const finalY = centerY + distY * perspectiveFactor

    vertices[i * 2] = cylinderX
    vertices[i * 2 + 1] = finalY
  }

  mesh.x = 0
  mesh.pivot.set(0, imgHeight / 2)

  // 必须把 dirty 标记设为 true
  // @ts-ignore
  if (mesh.dirty) mesh.dirty++;

  stageContainer.addChild(mesh)

  // 添加光影遮罩
  createShadingOverlay(radius, imgHeight, stageContainer)

  // --- 缩放计算优化 ---
  // 使用显式的逻辑尺寸 (800x600) 进行计算，与 initPixi 中的配置保持严格一致
  // 这样可以规避 renderer 尺寸、resolution 或 DOM 尺寸在不同环境下的不确定性
  const APP_WIDTH = 800
  const APP_HEIGHT = 600
  
  const boundsWidth = radius * 2
  const boundsHeight = imgHeight
  
  // 增加边距到 0.65 (留 35% 空隙)，确保上下肯定能完整显示
  const padding = 0.65
  
  const scaleX = (APP_WIDTH * padding) / boundsWidth
  const scaleY = (APP_HEIGHT * padding) / boundsHeight
  
  // 保持比例缩放，且最大不超过 1
  const scale = Math.min(scaleX, scaleY, 1)

  stageContainer.scale.set(scale)
  
  // 确保居中到逻辑画布中心
  stageContainer.x = APP_WIDTH / 2
  stageContainer.y = APP_HEIGHT / 2
}

/** 创建光影遮罩 (V4) */
const createShadingOverlay = (widthRadius: number, height: number, parent: any) => {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 1
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 模拟光照：两侧暗（背面），中间亮（正面）
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
  
  shadow.width = widthRadius * 2
  shadow.height = height * 0.85 // 匹配边缘高度近似值
  
  shadow.anchor.set(0.5)
  shadow.x = 0
  // 由于 Mesh pivot 调整过，容器中心即为 Mesh 中心
  shadow.y = 0 
  
  shadow.blendMode = PIXI.BLEND_MODES.MULTIPLY
  
  // 确保遮罩在 Mesh 之上
  parent.addChild(shadow)
}

watch(() => props.imageFile, (newFile) => {
  if (newFile) {
    hasImage.value = true
    loadImage(newFile)
  }
})

onMounted(() => {
  initPixi()
})

onUnmounted(() => {
  if (app) {
    app.destroy(true)
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

:deep(canvas) {
  display: block;
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
