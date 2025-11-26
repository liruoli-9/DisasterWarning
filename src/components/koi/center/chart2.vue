<template>
  <div class="map-wrapper">
    <div id="container"></div>

    <!-- 卫星/标准图按钮 -->
    <div class="button01">
      <button @click="addSatellite">卫星图</button>
      <button @click="removeSatellite">标准图</button>
    </div>

    <!-- 模态框展示模型 -->
    <b-modal
      v-model="showModelModal"
      title="模型展示"
      hide-footer
      size="xl"
      :dialog-class="'custom-dialog'"
    >
      <div class="model-viewer-container">
        <ModelViewer />
      </div>
    </b-modal>
  </div>
</template>

<script>
import { onMounted, onBeforeUnmount, ref, nextTick } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import ModelViewer from "./modelview.vue";
import { BModal } from "bootstrap-vue-3";

export default {
  name: "YourMapComponent",
  components: { ModelViewer, BModal },

  setup() {
    const map = ref(null);
    const satelliteLayer = ref(null);
    const showModelModal = ref(false);

    // Marker 数据表
    const markerData = [
      { lng: 103.43, lat: 36.17, type: "hongshui1", title: "洪水灾害预警" },
      { lng: 103.43, lat: 36.27, type: "hongshui2", title: "洪水灾害预警" },
      { lng: 103.53, lat: 36.17, type: "hongshui3", title: "洪水灾害预警" },
      { lng: 103.4, lat: 36.37, type: "hongshui4", title: "洪水灾害预警" },
      { lng: 103.33, lat: 36.47, type: "nishiliu1", title: "泥石流灾害预警" },
      { lng: 103.33, lat: 36.27, type: "nishiliu2", title: "泥石流灾害预警" },
      { lng: 103.30, lat: 36.17, type: "nishiliu3", title: "泥石流灾害预警" },
      { lng: 103.53, lat: 36.27, type: "nishiliu4", title: "泥石流灾害预警" },
      { lng: 103.63, lat: 36.37, type: "huapo1", title: "滑坡灾害预警" },
      { lng: 103.73, lat: 36.47, type: "huapo2", title: "滑坡灾害预警" },
      { lng: 103.53, lat: 36.47, type: "huapo3", title: "滑坡灾害预警" },
      { lng: 103.13, lat: 36.07, type: "huapo4", title: "滑坡灾害预警" },
    ];

    // 弹出模态框
    const showModelPopup = () => {
      showModelModal.value = true;
    };

    // 卫星图/标准图
    const addSatellite = () => {
      if (!satelliteLayer.value) {
        satelliteLayer.value = new AMap.TileLayer.Satellite();
      }
      map.value.addLayer(satelliteLayer.value);
    };
    const removeSatellite = () => {
      if (satelliteLayer.value) {
        map.value.removeLayer(satelliteLayer.value);
      }
    };

    // 初始化地图和 marker
    onMounted(async () => {
      try {
        const AMap = await AMapLoader.load({
          key: "59b4182d06458f2cbbc0d09188a0ce6e",
          version: "2.0",
          plugins: ["AMap.Scale"],
        });

        map.value = new AMap.Map("container", {
          viewMode: "3D",
          zoom: 11,
          mapStyle: "amap://styles/darkblue",
          layers: [new AMap.TileLayer.RoadNet()],
          center: [103.4379, 36.1741],
        });

        // 循环生成 marker
        const markers = markerData.map((item) => {
          const icon = new AMap.Icon({
            size: new AMap.Size(60, 50),
            image: new URL(`../../../assets/images/icon/${item.type}.png`, import.meta.url).href,
            imageSize: new AMap.Size(60, 50),
          });

          const marker = new AMap.Marker({
            position: new AMap.LngLat(item.lng, item.lat),
            icon,
            title: item.title,
            zooms: [2, 15],
          });

          marker.on("click", showModelPopup);
          return marker;
        });

        map.value.add(markers);

        // 添加窗口大小变化监听器，使地图自适应
        window.addEventListener('resize', resizeMap);
        // 初始时调整一次地图大小
        nextTick(() => {
          resizeMap();
        });
      } catch (error) {
        console.error("AMap加载失败:", error);
      }
    });

    // 调整地图大小
    const resizeMap = () => {
      if (map.value) {
        // 延迟执行，确保父容器已经完成布局
        setTimeout(() => {
          map.value.resize();
        }, 100);
      }
    };

    // 销毁地图
    onBeforeUnmount(() => {
      if (map.value) map.value.destroy();
      // 移除窗口大小变化监听器
      window.removeEventListener('resize', resizeMap);
    });

    return { addSatellite, removeSatellite, showModelModal };
  },
};
</script>

<style scoped>
.map-wrapper {
  position: relative;
  width: 100%;
  height: 100%; /* 改为100%而不是100vh */
}

#container {
  width: 80%;
  height: 100%;
}

.button01 {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 100;
}

.custom-dialog {
  height: auto;
}

.model-viewer-container {
  width: 80%;
}
</style>