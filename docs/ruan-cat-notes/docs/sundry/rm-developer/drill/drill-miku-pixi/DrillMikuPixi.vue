<template>
  <div class="drill-miku-pixi">
    <ControlPanel @file-selected="onFileSelected" />

    <div class="tabs-container">
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane label="PixiJS V8 (Latest)" name="v8">
          <PixiViewer :imageFile="imageFile" />
        </el-tab-pane>
        <el-tab-pane label="PixiJS V4 (Legacy)" name="v4">
          <PixiViewerWithPixiV4 :imageFile="imageFile" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ControlPanel from './components/ControlPanel.vue'
import PixiViewer from './components/PixiViewer.vue'
import PixiViewerWithPixiV4 from './components/PixiViewerWithPixiV4.vue'

const imageFile = ref<File | null>(null)
const activeTab = ref('v8')

const onFileSelected = (file: File) => {
  imageFile.value = file
}
</script>

<style scoped>
.drill-miku-pixi {
  max-width: 900px;
  margin: 0 auto;
}

.tabs-container {
  margin-top: 20px;
}
</style>
