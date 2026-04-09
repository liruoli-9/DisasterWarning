<template>
  <div ref="mapContainer" class="map-box"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { loadAMap } from "./AMapLoader.js";

const mapContainer = ref(null);

onMounted(async () => {
  const AMap = await loadAMap();

  // 初始化地图
  const map = new AMap.Map(mapContainer.value, {
    zoom: 11,                   // 初始缩放
    center: [116.397428, 39.90923], // 北京天安门
    viewMode: "3D"
  });

  // 添加缩放工具条
  map.addControl(new AMap.ToolBar());
  map.addControl(new AMap.Scale());

  // 添加一个标记点
  const marker = new AMap.Marker({
    position: [116.397428, 39.90923],
    title: "北京天安门"
  });
  map.add(marker);
});
</script>

<style scoped>
.map-box {
  width: 100%;
  height: 100vh;
}
</style>
