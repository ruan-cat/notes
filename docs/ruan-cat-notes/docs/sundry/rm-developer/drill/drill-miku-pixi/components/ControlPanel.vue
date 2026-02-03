<template>
  <div class="control-panel">
    <div class="upload-btn-wrapper">
      <el-button type="primary" :icon="Upload">选择图片文件</el-button>
      <input type="file" accept="image/*" @change="handleFileChange" />
    </div>
    <div class="hint">请上传你的资源图片 (如 Miku 图)</div>
  </div>
</template>

<script setup lang="ts">
import { Upload } from '@element-plus/icons-vue'

const emit = defineEmits<{
  (e: 'file-selected', file: File): void
}>()

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    emit('file-selected', input.files[0])
  }
}
</script>

<style scoped>
.control-panel {
  padding: 20px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.upload-btn-wrapper {
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.upload-btn-wrapper input[type=file] {
  font-size: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
  height: 100%;
  width: 100%;
}

.hint {
  font-size: 14px;
  color: #666;
}
</style>
