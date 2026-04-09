<template>
  <div class="wordcloud-chart-container">
    <div id="wordCloud" style="width: 200px; height: 230px"></div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import * as echarts from "echarts";
import "echarts-wordcloud";
import { parseGeoData } from "@/utils/parseGeoData.js";

onMounted(() => {
  const geoData = parseGeoData();

  // 从灾害体名称生成词云数据
  const wordCloudData = geoData.threatPopulation.map((item) => ({
    name: item.name,
    value: item.value, // 根据威胁人口生成权重
  }));

  // ECharts 配置项
  const option = {
    tooltip: {
      show: true,
      backgroundColor: "rgba(255, 255, 255, 0.9)", // 更柔和的白色背景
      textStyle: {
        color: "#333", // 深色文字
      },
      borderWidth: 1,
      borderColor: "#ddd",
    },
    series: [
      {
        type: "wordCloud",
        shape: "circle",
        gridSize: 6, // 增加网格大小，减少计算密度
        sizeRange: [12, 30], // 调整字体大小范围
        rotationRange: [0, 90], // 限制旋转角度范围
        textStyle: {
          fontFamily: "Arial, sans-serif", // 使用通用无衬线字体
          fontWeight: "bold",
          color: function () {
            // 生成RGB随机颜色
            const r = Math.round(Math.random() * 255);
            const g = Math.round(Math.random() * 255);
            const b = Math.round(Math.random() * 255);
            return `rgb(${r}, ${g}, ${b})`;
          },
          emphasis: {
            shadowBlur: 15,
            shadowColor: "rgba(0, 0, 0, 0.2)", // 更柔和的阴影
          },
        },
        data: wordCloudData,
      },
    ],
  };

  // 初始化图表
  const myChart = echarts.init(document.getElementById("wordCloud"));
  myChart.setOption(option);
});
</script>

<style lang="scss" scoped>
.wordcloud-chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%; /* 确保容器宽度自适应 */
  border-radius: 15px; /* 更大的圆角 */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); /* 更深的阴影 */
}
</style>
