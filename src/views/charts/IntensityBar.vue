<template>
  <div class="chart-container">
    <div id="intensity-bar-chart" style="width: 500px; height: 160px"></div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import * as echarts from "echarts";
import { parseGeoData } from "@/utils/parseGeoData.js";

// 解析GeoJSON数据并获取地震烈度统计
const geoData = parseGeoData();
const intensityCounts = geoData.intensityCounts;

// 准备地震烈度数据
const intensityData = Object.keys(intensityCounts).map((intensity) => ({
  name: intensity,
  value: intensityCounts[intensity],
}));

// ECharts配置项
const option = {
  backgroundColor: "#ffffff", // 设置背景色
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(50, 50, 50, 0.7)",
    textStyle: {
      color: "#fff",
    },
    axisPointer: {
      type: "shadow",
    },
  },
  grid: {
    top: "15%",
    bottom: "15%",
    left: "15%",
    right: "10%",
  },
  xAxis: {
    type: "category",
    data: intensityData.map((item) => item.name),
    axisLabel: {
      interval: 0,
      rotate: 30,
      color: "#333",
      fontSize: 12,
    },
    axisLine: {
      lineStyle: {
        color: "#333",
      },
    },
  },
  yAxis: {
    type: "value",
    axisLabel: {
      color: "#333",
      fontSize: 8,
    },
    axisLine: {
      lineStyle: {
        color: "#333",
      },
    },
    splitLine: {
      lineStyle: {
        color: "#eee",
        type: "dashed", // 使用虚线分隔
      },
    },
  },
  series: [
    {
      name: "数量",
      type: "bar",
      data: intensityData.map((item) => item.value),
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#83bff6" },
          { offset: 0.5, color: "#188df0" },
          { offset: 1, color: "#188df0" },
        ]), // 使用线性渐变
        borderRadius: [5, 5, 0, 0], // 圆角效果
      },
      barWidth: "60%",
      animationDelay: function (idx) {
        return idx * 100; // 添加动画延迟
      },
    },
  ],
  animationEasing: "elasticOut", // 动画效果
  animationDelayUpdate: function (idx) {
    return idx * 100;
  },
};

onMounted(() => {
  const chart = echarts.init(document.getElementById("intensity-bar-chart"));
  chart.setOption(option);
});
</script>

<style scoped>
.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f5f5f5; /* 增加背景色，突出图表 */
  border-radius: 15px; /* 添加圆角，使整体视觉更柔和 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 轻微阴影，增加立体感 */
}
</style>
