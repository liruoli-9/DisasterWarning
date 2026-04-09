<template>
  <div class="dashboard-container">
    <div class="header">
      <img class="logo" src="/src/assets/logo.png" alt="logo" />
      <h1 class="title">兰新线地质灾害数据管理平台</h1>
    </div>

    <!-- 显示日期 -->
    <div class="date">
      <Clock />
    </div>

    <!-- 天气按钮 -->
    <div class="weather-button" @click="toggleWeather">
      <i class="iconfont icon-duoyun"></i>
    </div>

    <!-- 天气信息部分 -->
    <div class="weather" v-if="showWeather">
      <div class="weather-details">
        <div class="city">
          <div>{{ weatherInfo.city }}</div>
          <span>{{ weatherInfo.weather }}</span>
        </div>

        <div class="info">
          <span
            ><i class="iconfont icon-wendu"></i
            >{{ weatherInfo.temperature }}℃</span
          >
          <span
            ><i class="iconfont icon-fengxiang"></i
            >{{ weatherInfo.winddirection }}</span
          >
          <span
            ><i class="iconfont icon-shidu"></i
            >{{ weatherInfo.humidity }}%</span
          >
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <div class="left">


        <!-- <div>
    <button @click="showModal = true" class="btn">播放山体滑坡动画</button>
    <LandslideModal v-if="showModal" @close="showModal = false" />
  </div> -->

        <div class="chart panel">
          <div class="title">灾害体类型分布</div>
          <div class="chart-container">
            <LeftFirstChart />
          </div>
        </div>
        <div class="chart panel">
          <div class="title">威胁人口和威胁财产分布</div>
          <div class="chart-container">
            <LeftSecondChart />
          </div>
        </div>
      </div>
      <div class="map-container">
        <div class="map">
          <MapModule />
        </div>
      </div>
      <div class="right">
        <div class="layer-control panel">
          <div class="title">市级灾害点占比</div>
          <CityPie />
        </div>
        <div class="second">
          <div class="chart panel">
            <div class="chart-container">
              <WordCloud />
            </div>
          </div>
          <div class="chart panel">
            <div class="title">灾害点威胁等级分布</div>
            <div class="chart-container">
              <IntensityBar />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <!-- © 2024 四川省地质灾害数据管理平台&nbsp; 微信公众号:
      <a href="">Map Forge</a>&nbsp;
      <i class="iconfont icon-Gmail"></i>&nbsp;Email:
      <a href="">yqxlearning@gmail.com</a> -->

      © 2025 兰新线地质灾害数据管理平台&nbsp; 
    </div>
  </div>
</template>

<script setup>
import LandslideModal from '@/components/LandslideModal.vue'

import { ref, onMounted, onUnmounted, inject } from "vue";
import MapModule from "@/components/MapModule.vue";
import CityPie from "./charts/CityPie.vue";
import LeftFirstChart from "./charts/LeftFirstChart.vue";
import LeftSecondChart from "./charts/LeftSecondChart.vue";
import WordCloud from "./charts/WordCloud.vue";
import IntensityBar from "./charts/IntensityBar.vue";
import { downloadMap } from "@/utils/downloadMap.js";
import {
  updateCurrentTime,
  updateCurrentDate,
  fetchLocation,
  fetchWeather,
} from "@/utils/timeWeatherUtils.js";
import { createDraw } from "@/utils/createDraw";
import * as turf from "@turf/turf";
import Clock from "@/components/Clock.vue";

const showModal = ref(false)

const currentTime = ref("");
const currentDate = ref("");
const weatherInfo = ref("");
const activeTool = ref("");
const layers = ref([]);
let drawSources = {};
let map;
let drawInteraction = null;
let measureInteraction = null;

const animateView = () => {
  const view = map.getView();
  view.cancelAnimations(); // 取消当前正在进行的所有动画,否则会导致点了也没法动
  view.animate({
    center: [97.93417608189009, 39.58753766974178],
    zoom: 6,
    duration: 500,
  });
};

// 画笔工具激活函数
const activateDrawTool = (type) => {
  if (drawInteraction) map.removeInteraction(drawInteraction);

  drawInteraction = createDraw({ type, source: drawSources[type] });
  map.addInteraction(drawInteraction);
  drawInteraction.on("drawend", () => {
    map.removeInteraction(drawInteraction);
  });
};

// 清空画布
const clearDraw = () => {
  for (const key in drawSources) {
    drawSources[key].clear();
  }
};



const showWeather = ref(false); // 新增状态控制天气信息的显示和隐藏

// 切换天气信息的显示和隐藏
const toggleWeather = () => {
  showWeather.value = !showWeather.value;
};

const amapKey = "478b72215fa422eddb4febb0548a14ab";

onMounted(() => {
  updateCurrentTime(currentTime);
  updateCurrentDate(currentDate);
  fetchLocation(amapKey, (city) => fetchWeather(city, amapKey, weatherInfo));

  const timer = setInterval(() => {
    updateCurrentTime(currentTime);
    updateCurrentDate(currentDate);
  }, 1000);

  map = inject("$map");
  layers.value = map.getLayers().getArray();
  drawSources = {
    Point: new ol.source.Vector(),
    LineString: new ol.source.Vector(),
    Polygon: new ol.source.Vector(),
    Square: new ol.source.Vector(),
    Circle: new ol.source.Vector(),
  };

  for (const [type, source] of Object.entries(drawSources)) {
    const drawLayer = new ol.layer.Vector({ source, title: "画笔图层" });
    map.addLayer(drawLayer);
  }
  map.addLayer(measureLayer);

  onUnmounted(() => {
    clearInterval(timer);
    if (drawInteraction) map.removeInteraction(drawInteraction);
    if (measureInteraction) map.removeInteraction(measureInteraction);
  });
});

function toggleToolMenu(tool) {
  if (activeTool.value === tool) {
    activeTool.value = "";
  } else {
    activeTool.value = tool;
  }
}

function toggleLayer(layer) {
  const currentVisibility = layer.getVisible();
  layer.setVisible(!currentVisibility);
}

// 修改后的 removeLayerByTitle 函数，增加 title 参数
function removeLayerByTitle(title) {
  map
    .getLayers()
    .getArray()
    .forEach((layer) => {
      if (layer.get("title") === title) {
        map.removeLayer(layer);
      }
    });
}
function getLayerByTitle(title) {
  return map
    .getLayers()
    .getArray()
    .find((layer) => layer.get("title") === title);
}

function performHeatmapAnalysis() {
  // 优化1: 减少数据量（如果可能的话，可以基于地图的视野加载数据）
  const heatSource = new ol.source.Vector({
    url: "/src/assets/SCdiaster.json",
    format: new ol.format.GeoJSON(),
  });

  const heatMapLayer = new ol.layer.Heatmap({
    source: heatSource,
    blur: 7, // 优化2: 降低 blur 和 radius 值
    radius: 5,
    gradient: ["#00f", "#0ff", "#0f0", "#ff0", "#f00"],
    weight: (feature) => {
      const weight = feature.get("weight");
      return weight ? Math.min(weight, 1) : 0.1; // 确保 weight 值在 0 到 1 之间
    },
  });

  // 清除之前的热力图图层
  getLayerByTitle("地质灾害点").setVisible(false);
  removeLayerByTitle("热力图");
  heatMapLayer.set("title", "热力图");
  map.addLayer(heatMapLayer);

  // 使用 map 的动画帧方法来优化渲染
  map.render();
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  user-select: none; /* 禁用文本选择 */
  width: 100%;
  height: 100vh;
  background: url("@/assets/dashBoardBG.jpeg") no-repeat center center;
  background-size: cover;
  position: relative;
}

// 通用面板样式
.panel {
  position: relative;
  background: rgba(255, 255, 255, 0.05); /* 更透明的背景色 */
  border: 2px solid transparent;
  border-width: 0.6375rem 0.475rem 0.25rem 1.65rem;
  border-image-source: url("@/assets/border.png");
  border-image-slice: 51 38 20 132;
  border-image-repeat: stretch; /* 确保边框图像重复填充，适应内容 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 轻微阴影 */
  backdrop-filter: blur(2px); /* 背景模糊效果 */
  transition: box-shadow 0.3s ease, transform 0.3s ease; /* 过渡效果 */
  padding-right: 5px;
  margin-bottom: 15px;
  .title {
    text-align: center;
    margin-bottom: 2px;
    color: #ffffff;
    font-weight: bold;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5); /* 增强文本可读性 */
  }

  &:hover {
    transform: translateY(-5px); /* 悬停时上移效果 */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* 悬停时阴影增强 */
  }
}

// 头部
.header {
  width: 100%;
  height: 80px;
  background: url("@/assets/Header.png") no-repeat center center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 10;

  .logo {
    transform: translateY(-5px);
    width: 50px;
    height: 50px;
    margin-right: 15px;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease;
  }

  .title {
    transform: translateY(-5px);
    font-size: 24px;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  &:hover .logo {
    transform: scale(1.1) translateY(-5px);
  }
}

/* 日期样式 */
.date {
  align-items: center;
  justify-content: center;
  z-index: 99;
  position: fixed;
  right: 30px;
  top: 8px;
}
/* 天气按钮样式 */
.weather-button {
  position: fixed;
  z-index: 100;
  left: 10px;
  top: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 15px;

  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  .iconfont {
    color: #dddddd;
    font-size: 15px;
  }
}

/* 天气信息样式 */
.weather {
  position: fixed;
  z-index: 99;
  left: 60px;
  top: 2px; /* 调整位置，使其在按钮下方 */
  background-color: #dddddd;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  color: black;
  max-width: 300px;
  transition: all 0.3s ease; /* 添加过渡效果 */
}

.weather-icon {
  z-index: 999;
  font-size: 30px;
  margin-bottom: 10px;
  color: #ffdd57; /* 根据天气类型调整颜色 */
}

.weather-details {
  display: flex;
  flex-direction: column;
  .city {
    display: flex;

    justify-content: space-between;
    font-size: 16px;
    font-family: "华文细黑";
    margin-bottom: 8px;
  }
}

.info {
  display: flex;
  justify-content: center;
  gap: 10px;
  font-size: 12px;
  align-items: center;
}

.info span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.info i {
  font-size: 16px;
}
// 内容区域
.main-content {
  display: flex;
  width: 100%;
  height: calc(100vh - 80px);
  color: white;
  .left {
    margin: 0 15px;
    width: 280px;
    z-index: 99;
    .panel {
      height: 200px;
    }
  }
  .map-container {
    position: relative;
    padding-top: 30px;
    flex: 1;
    .map {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.5);
    }
    .toolbox {
      position: absolute;
      bottom: 35px;
      left: 50%;
      transform: translateX(-40%);
      width: 90%;
      display: flex;
      justify-content: space-between;

      .tool-item {
        position: relative; /* 设置相对定位以便子元素绝对定位 */
        width: 65px;
        height: 55px;
        background: url("@/assets/baseBottom.png") no-repeat center center;
        background-size: cover;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        .activelayer {
          color: #ffcc00; /* 高亮颜色 */
          font-weight: bold; /* 文字加粗 */
          text-shadow: 0 0 5px rgba(255, 255, 0, 0.7); /* 添加文本阴影以增强可见性 */
        }

        .iconfont {
          transform: translateY(-10px);
          color: #ffffff;
          font-size: 20px;
          transition: color 0.3s ease;
        }

        .text {
          transform: translateY(-8px);
          color: #ffffff;
          font-size: 12px;
          font-weight: bold;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
          transition: color 0.3s ease;
        }

        &:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);

          .iconfont,
          .text {
            color: #ffcc00;
          }
        }

        .tool-options {
          position: absolute; /* 绝对定位以便可以自由定位 */
          bottom: 60px; /* 初始位置在工具项的上方 */
          left: 50%;
          transform: translateX(-50%) translateY(10px); /* 向上偏移10px */
          opacity: 0; /* 初始透明度为0 */
          background-color: rgba(0, 0, 0, 0.8);
          border-radius: 5px;
          padding: 15px 10px;
          padding-bottom: 5px;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: opacity 0.3s ease, transform 0.3s ease; /* 添加过渡效果 */

          div {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: 6x;
            color: #ffffff;
            font-size: 10px; /* 调小文字大小 */
            margin-bottom: 4px; /* 选项间距 */
            cursor: pointer;
            white-space: nowrap; /* 防止文字换行 */
          }
        }

        &:hover .tool-options {
          transform: translateX(-50%) translateY(0); /* 悬停时向上移动 */
          opacity: 1; /* 悬停时显示 */
        }
      }
    }
  }
  .right {
    display: flex;
    flex-direction: column;
    justify-content: left;
    align-items: center;
    min-width: 250px;
    z-index: 99;
    .panel {
      width: 360px;
      height: 150px;
    }
    .second {
      width: 420px;
      display: flex;
      justify-content: end;
      .panel {
        width: 100px;
        height: 220px;
        &:first-child {
          margin-right: 5px;
        }
        &:last-child {
          width: 200px;
          height: 225px;
        }
      }
    }
  }
}
.footer {
  user-select: text;
  text-align: center;
  position: fixed;
  bottom: 0px;
  padding: 6px;
  background-color: rgba(0, 0, 0, 0.7); /* 半透明的深色背景 */
  color: #f0f0f0; /* 柔和的白色文字 */
  left: 50%;
  transform: translateX(-50%);
  font: 200 12px "华文细黑";
  border-radius: 8px; /* 更圆的边角 */
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.2); /* 较轻的阴影效果 */
  .iconfont {
    font: 1em sans-serif;
    margin: 0 1px;
  }
  a {
    color: #ffdd57; /* 柔和的黄色 */
    text-decoration: none; /* 去掉下划线 */
    margin-left: 3px;
  }
}

.btn {
  padding: 10px 20px;
  background: #1e90ff;
  color: white;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
