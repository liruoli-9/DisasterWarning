<template>
  <div class="left-first-chart-container">
    <div id="leftFirstChart" style="width: 300px; height: 150px"></div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { initEcharts } from "@/utils/initEcharts.js";
import { parseGeoData } from "@/utils/parseGeoData.js";

onMounted(() => {
  const geoData = parseGeoData();

  const option = {
    title: {},
    tooltip: {
      trigger: "item",
      backgroundColor: "#ffffff", // 白色背景
      borderColor: "#cccccc", // 灰色边框
      borderWidth: 1,
      textStyle: {
        color: "#333333", // 深色文本
        fontSize: 12,
      },
    },
    series: [
      {
        name: "灾害体类型",
        type: "pie",
        radius: ["20%", "65%"], // 调整半径，确保标签有足够空间
        center: ["45%", "50%"],
        label: {
          show: true,
          formatter: "{b}", // 显示名称和百分比
          color: "#ffffff", // 白色文本
          fontFamily: "Arial, sans-serif",
          fontSize: 12,
          fontWeight: "bold", // 加粗文本

          borderRadius: 4, // 添加圆角
          padding: [5, 8], // 内边距
          shadowBlur: 3, // 标签的阴影模糊度
          shadowColor: "rgba(0, 0, 0, 0.3)", // 标签阴影颜色
          overflow: "truncate", // 防止文字溢出
          width: 90, // 设置宽度限制
          ellipsis: "...", // 当文字超出时显示省略号
        },
        labelLine: {
          length: 12, // 标签线的长度
          length2: 10, // 标签线到文字的长度
          lineStyle: {
            color: "#333333", // 深色线条
            width: 1.5, // 线条宽度
          },
          smooth: true, // 平滑的标签引导线
        },
        data: Object.entries(geoData.disasterTypeCounts).map(
          ([key, value]) => ({
            value,
            name: key,
            itemStyle: {
              color: natureColorPalette(key), // 使用科研风格的调色板
              borderColor: "#ffffff", // 白色边框分隔不同扇形
              borderWidth: 2, // 边框宽度
              shadowBlur: 10, // 扇形阴影模糊度
              shadowColor: "rgba(0, 0, 0, 0.15)", // 扇形阴影颜色
              shadowOffsetX: 2, // 阴影横向偏移
              shadowOffsetY: 2, // 阴影纵向偏移
            },
          })
        ),
        emphasis: {
          itemStyle: {
            shadowBlur: 20,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.3)", // 更柔和的阴影
          },
          label: {
            show: true,
            fontSize: 14,
            fontWeight: "bolder",
            color: "#ffcc00", // 高亮时标签文字颜色
            shadowBlur: 5,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  // 初始化图表
  initEcharts({
    el: "leftFirstChart",
    option,
  });
});

/**
 * 科研风格的颜色调色板
 * @param {string} key - 数据项的名称
 * @returns {string} 对应的颜色
 */
function natureColorPalette(key) {
  const colors = {
    斜坡: "#1f77b4",
    泥石流: "#ff7f0e",
    崩塌: "#2ca02c",
    滑坡: "#d62728",
    地面塌陷: "#9467bd",
    其它: "#8c564b",
  };
  return colors[key] || "#1f77b4"; // 如果没有匹配项，则使用默认颜色
}
</script>

<style lang="scss" scoped>
.left-first-chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
