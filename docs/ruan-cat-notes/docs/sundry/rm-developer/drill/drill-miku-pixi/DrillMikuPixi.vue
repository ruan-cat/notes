<template>
  <div class="drill-miku-pixi">
    <ControlPanel @file-selected="onFileSelected" />
    <PixiViewer :imageFile="imageFile" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ControlPanel from './components/ControlPanel.vue'
import PixiViewer from './components/PixiViewer.vue'

const imageFile = ref<File | null>(null)

const onFileSelected = (file: File) => {
  imageFile.value = file
}
</script>

<style scoped>
.drill-miku-pixi {
  max-width: 900px;
  margin: 0 auto;
}
</style>
