<template>
  <div class="modal">
    <button @click="$emit('close')" class="close">关闭</button>
    <div ref="sceneContainer" class="scene"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { createLandslideScene } from '../utils/createLandslideScene'

const sceneContainer = ref(null)
let destroyScene = null

onMounted(() => {
  const { destroy } = createLandslideScene(sceneContainer.value)
  destroyScene = destroy
})

onBeforeUnmount(() => {
  if (destroyScene) destroyScene()
})
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.scene {
  width: 100%;
  height: 100%;
}

.close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #f44336;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
}
</style>
