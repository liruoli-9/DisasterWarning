<template>
  <div class="left-second-chart-container">
    <div id="leftSecondChart" style="width: 350px; height: 170px"></div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { initEcharts } from "@/utils/initEcharts.js";
import { parseGeoData } from "@/utils/parseGeoData.js";

onMounted(() => {
  const geoData = parseGeoData();

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      backgroundColor: "rgba(255, 255, 255, 0.9)", // 半透明白色背景
      borderColor: "#cccccc",
      borderWidth: 1,
      textStyle: {
        color: "#333333",
        fontFamily: "Arial, sans-serif",
      },
    },
    legend: {
      data: ["威胁人口", "威胁财产"],
      top: "10%",
      textStyle: {
        color: "white",
        fontSize: 12,
      },
      left: "center",
      itemWidth: 20,
      itemHeight: 12,
    },
    grid: {
      left: "0%",
      right: "0%",
      bottom: "0%",
      top: "25%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: geoData.threatPopulation.map((item) => item.name),
      axisLabel: {
        rotate: 45,
        color: "white",
        interval: 0, // 强制显示所有标签
        hideOverlap: true,
        fontSize: 10,
        formatter: function (value) {
          return value.length > 4 ? value.substring(0, 4) + "..." : value;
        },
      },
      axisLine: {
        lineStyle: {
          color: "#333333",
        },
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#333333",
        },
      },
      axisLabel: {
        color: "white",
        fontSize: 10,
      },
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: "#e0e0e0",
        },
      },
    },
    series: [
      {
        name: "威胁人口",
        type: "bar",
        barWidth: "40%",
        data: geoData.threatPopulation.map((item) => item.value),
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#1f77b4" }, // 深蓝色
              { offset: 1, color: "#6baed6" }, // 浅蓝色
            ],
          },
          borderRadius: [5, 5, 0, 0], // 柱状图圆角
        },
      },
      {
        name: "威胁财产",
        type: "bar",
        barWidth: "40%",
        data: geoData.threatProperty.map((item) => item.value),
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#ff7f0e" }, // 橙色
              { offset: 1, color: "#ffbb78" }, // 浅橙色
            ],
          },
          borderRadius: [5, 5, 0, 0], // 柱状图圆角
        },
      },
    ],
  };

  // 初始化图表
  initEcharts({
    el: "leftSecondChart",
    option,
  });
});
</script>

<style lang="scss" scoped>
.left-second-chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
