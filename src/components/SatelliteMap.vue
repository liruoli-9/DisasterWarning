<template>
  <div ref="mapContainer" class="sat-map"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const mapContainer = ref(null)
let map

onMounted(() => {
  map = L.map(mapContainer.value, {
    center: [30.0, 104.0], // default center (China)
    zoom: 4,
    zoomControl: true,
  })

  // ESRI World Imagery (satellite) - commonly available without API key
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
  }).addTo(map)
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style scoped>
.sat-map {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}
</style>
