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
    PIXI = await import('pixi.js-v4')
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

/** 手动创建圆柱体 Mesh */
const createCylinderMesh = (texture: any) => {
  if (!stageContainer || !app || !PIXI) return

  if (!texture.baseTexture.hasLoaded) {
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

  // 手动构建顶点数组
  const vertices = new Float32Array(verticesX * verticesY * 2)
  const uvs = new Float32Array(verticesX * verticesY * 2)

  for (let row = 0; row < verticesY; row++) {
    for (let col = 0; col < verticesX; col++) {
      const idx = (row * verticesX + col) * 2

      // UV 坐标 (0 到 1)
      const u = col / segmentsX
      const v = row / (segmentsY - 1)
      uvs[idx] = u
      uvs[idx + 1] = v

      // 圆柱投影
      const angle = (u - 0.5) * Math.PI
      const cylinderX = radius * Math.sin(angle)
      const depthZ = radius * Math.cos(angle)

      // Y 坐标 + 透视
      const originalY = v * imgHeight
      const centerY = imgHeight / 2
      const perspectiveFactor = 0.85 + (depthZ / radius) * 0.15
      const distY = originalY - centerY
      const finalY = centerY + distY * perspectiveFactor

      vertices[idx] = cylinderX
      vertices[idx + 1] = finalY
    }
  }

  // 构建索引数组 (三角形)
  const indices = new Uint16Array(segmentsX * (segmentsY - 1) * 6)
  let indexIdx = 0
  for (let row = 0; row < segmentsY - 1; row++) {
    for (let col = 0; col < segmentsX; col++) {
      const topLeft = row * verticesX + col
      const topRight = topLeft + 1
      const bottomLeft = (row + 1) * verticesX + col
      const bottomRight = bottomLeft + 1

      // 第一个三角形
      indices[indexIdx++] = topLeft
      indices[indexIdx++] = bottomLeft
      indices[indexIdx++] = topRight

      // 第二个三角形
      indices[indexIdx++] = topRight
      indices[indexIdx++] = bottomLeft
      indices[indexIdx++] = bottomRight
    }
  }

  console.log('[V4] Custom mesh - vertices:', vertices.length / 2, 'indices:', indices.length)
  console.log('[V4] First 10 vertices:', Array.from(vertices.slice(0, 20)))
  console.log('[V4] First 10 uvs:', Array.from(uvs.slice(0, 20)))
  console.log('[V4] First 10 indices:', Array.from(indices.slice(0, 10)))
  console.log('[V4] PIXI.mesh.Mesh:', PIXI.mesh.Mesh)
  console.log('[V4] DRAW_MODES:', PIXI.mesh.Mesh.DRAW_MODES)

  // 创建自定义 Mesh
  // V4 的 Mesh 构造函数: Mesh(texture, vertices, uvs, indices, drawMode)
  // @ts-ignore
  const mesh = new PIXI.mesh.Mesh(texture, vertices, uvs, indices, PIXI.mesh.Mesh.DRAW_MODES.TRIANGLES)

  console.log('[V4] Mesh created:', mesh)
  console.log('[V4] Mesh vertices:', mesh.vertices)
  console.log('[V4] Mesh uvs:', mesh.uvs)

  mesh.x = 0
  mesh.pivot.set(0, imgHeight / 2)

  stageContainer.addChild(mesh)

  // 缩放适应画布
  const boundsWidth = radius * 2
  const boundsHeight = imgHeight
  const padding = 0.9
  const resolution = app.renderer.resolution || 1
  const screenWidth = app.renderer.width / resolution
  const screenHeight = app.renderer.height / resolution
  const scaleX = (screenWidth * padding) / boundsWidth
  const scaleY = (screenHeight * padding) / boundsHeight
  const scale = Math.min(scaleX, scaleY, 1)

  stageContainer.scale.set(scale)
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
