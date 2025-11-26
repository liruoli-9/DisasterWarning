<template>
  <div class="chart-container">
    <div id="city-pie-chart" style="width: 500px; height: 150px"></div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import * as echarts from "echarts";
import { parseGeoData } from "@/utils/parseGeoData.js";

// 解析GeoJSON数据并获取市级灾害点统计
const geoData = parseGeoData();
const cityCounts = geoData.cityCounts;

// 准备市级数据
const cityData = Object.keys(cityCounts).map((city) => ({
  name: city,
  value: cityCounts[city],
}));

// 对数据进行排序，并只保留前5项
const topN = 5; // 只显示前5项
cityData.sort((a, b) => b.value - a.value); // 按值降序排序

const topCityData = cityData.slice(0, topN);
const otherValue = cityData
  .slice(topN)
  .reduce((sum, item) => sum + item.value, 0);

// 添加"其他"项
if (otherValue > 0) {
  topCityData.push({ name: "其他", value: otherValue });
}

// ECharts配置项
const option = {
  tooltip: {
    trigger: "item",
    backgroundColor: "rgba(50, 50, 50, 0.7)",
    textStyle: {
      color: "#fff",
    },
  },
  series: [
    {
      name: "市级灾害点",
      type: "pie",
      radius: ["20%", "50%"], // 环形图，增加内外径大小
      center: ["40%", "50%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 8, // 增加圆角
        borderColor: "#fff",
        borderWidth: 2,
      },
      label: {
        show: true,
        position: "outside", // 标签显示在外侧
        formatter: "{b}({d}%)",
        rich: {
          b: {
            fontSize: 8,
            lineHeight: 33,
          },
        },
      },
      labelLine: {
        length: 5,
        length2: 10,
        smooth: true,
      },
      data: topCityData,
    },
  ],
};

onMounted(() => {
  const chart = echarts.init(document.getElementById("city-pie-chart"));
  chart.setOption(option);
});
</script>

<style scoped>
.chart-container {
  display: flex;
  justify-content: left;
  align-items: flex-start;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 轻微阴影，增加立体感 */
}
</style>
