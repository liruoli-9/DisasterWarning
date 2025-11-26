<template>
  <div class="map-module-container">
    <div id="map"></div>
    <div v-if="coordinate.length > 0" id="mousePosition">
      <i class="iconfont icon-jingweidu"></i> {{ formattedCoordinate }}
    </div>
    <div v-else id="mousePosition">Put Mouse On Map</div>
  </div>
</template>

<script setup>
import { app } from "@/main";
import { onMounted, ref, computed } from "vue";

// 定义颜色映射
const intensityColors = {
  Ⅵ: "#FFCC00",
  Ⅶ: "#FF9900",
  Ⅷ: "#FF3300",
  Ⅸ: "#FF0000",
  Ⅹ: "#990000",
};

// 样式函数
function getIntensityStyle(feature) {
  const intensity = feature.get("地震烈度");
  const color = intensityColors[intensity] || "#000000";

  return new ol.style.Style({
    image: new ol.style.Circle({
      radius: 6,
      fill: new ol.style.Fill({ color: color }),
      stroke: new ol.style.Stroke({
        color: "#ffffff",
        width: 1,
      }),
    }),
  });
}

// 聚合样式函数
function getClusterStyle(feature) {
  const size = feature.get("features").length;
  let style;

  if (size > 1) {
    const color = size > 20 ? "#ff0000" : size > 10 ? "#ff9900" : "#3399CC";
    const radius = Math.min(12 + size, 20);

    style = new ol.style.Style({
      image: new ol.style.Circle({
        radius: radius,
        fill: new ol.style.Fill({
          color: color,
        }),
        stroke: new ol.style.Stroke({
          color: "#fff",
          width: 2,
        }),
      }),
      text: new ol.style.Text({
        text: size.toString(),
        fill: new ol.style.Fill({
          color: "#fff",
        }),
        stroke: new ol.style.Stroke({
          color: "#000",
          width: 2,
        }),
        font: "bold 14px Arial, sans-serif",
      }),
    });

    // 为图标设置样式和透明度
    style.getImage().setOpacity(0.75 + size / 100); // 调整图标透明度
  } else {
    const originalFeature = feature.get("features")[0];
    style = getIntensityStyle(originalFeature);
  }
  return style;
}

let coordinate = ref([]);
const formattedCoordinate = computed(() => {
  if (coordinate.value.length === 2) {
    const [lon, lat] = coordinate.value;
    return `Lon: ${lon.toFixed(3)}, Lat: ${lat.toFixed(3)}`;
  }
  return "";
});

// 创建聚合源
const clusterSource = new ol.source.Cluster({
  distance: 40, // 聚合的距离，可以根据需要调整
  source: new ol.source.Vector({
    url: "/src/assets/SCdiaster.json",
    format: new ol.format.GeoJSON(),
  }),
});

// 地质灾害点图层，应用聚合样式函数
const disasterLayer = new ol.layer.Vector({
  title: "地质灾害点",
  source: clusterSource,
  style: getClusterStyle, // 设置聚合样式函数
});

const gaodeMapLayer = new ol.layer.Tile({
  title: "高德路网瓦片",
  source: new ol.source.XYZ({
    url: "http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}",
    wrapX: false,
    crossOrigin: "anonymous", // 确保使用匿名跨域请求
  }),
});

const imageLayer = new ol.layer.Tile({
  title: "高德影像地图",
  source: new ol.source.XYZ({
    url: "http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6&x={x}&y={y}&z={z}",
    wrapX: false,
    crossOrigin: "anonymous", // 确保使用匿名跨域请求
  }),
});

const annotationLayer = new ol.layer.Tile({
  title: "高德注记地图",
  source: new ol.source.XYZ({
    url: "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
    wrapX: false,
    crossOrigin: "anonymous", // 确保使用匿名跨域请求
  }),
});

onMounted(() => {
  const map = new ol.Map({
    target: "map",
    layers: [gaodeMapLayer, imageLayer, disasterLayer, annotationLayer],
    view: new ol.View({
      center: [97.93417608189009, 39.58753766974178],
      zoom: 6,
      projection: "EPSG:4326",
    }),
  });

  map.on("pointermove", (e) => {
    coordinate.value = e.coordinate;
  });
  // const drawSource = new ol.source.Vector();
  // const drawLayer = new ol.layer.Vector({
  //   source: drawSource,
  // });
  // map.addLayer(drawLayer);
  // const draw = new ol.interaction.Draw({
  //   type: "LineString",
  //   source: drawSource,
  // });
  // map.addInteraction(draw);
  app.provide("$map", map);
});
</script>

<style lang="scss" scoped>
.map-module-container {
  width: 100%;
  height: 100%;
  position: relative;

  #map {
    width: 100%;
    height: 100%;
  }

  #mousePosition {
    position: absolute;
    right: 2px;
    bottom: 4px;
    width: 220px; /* 设置固定宽度 */
    color: rgb(231, 222, 160); /* 使用醒目的科技色 */
    padding: 8px 15px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: bold;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4), 0 0 10px rgba(0, 255, 204, 0.3);
    transition: transform 0.3s ease, box-shadow 0.3s ease; /* 添加过渡效果 */
    overflow: hidden; /* 隐藏超出边界的文本 */
    white-space: nowrap; /* 防止文本换行 */
    text-align: center; /* 文本居中 */
    .iconfont {
      color: lightskyblue;
      margin-right: 5px;
    }
  }

  #mousePosition:hover {
    transform: scale(1.05); /* 鼠标悬停时放大效果 */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 255, 204, 0.5); /* 悬停时的阴影效果 */
  }
}
</style>
