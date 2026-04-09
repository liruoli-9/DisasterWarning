<template>
  <div class="chart-container">
    <div ref="refChart" :style="{ height: kHOne + 'px' }"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import shineTheme from 'echarts/theme/shine.js';

export default {
  name: 'DynamicBarChart',
  data() {
    return {
      screenHeight: window.innerHeight,
      screenWidth: window.innerWidth,
      kHOne: null,
      chartInstance: null,
      koiTime: null,   // 自适应定时器
      koiTimer: null,  // 局部刷新定时器
      allData: []
    };
  },
  created() {
    this.kHOne = Math.round(this.screenHeight * 0.42);
  },
  mounted() {
    // 注册主题
    echarts.registerTheme('shine', shineTheme);

    // 初始化图表
    this.initChart();

    // 初始化数据
    this.getData();

    // 窗口自适应
    window.addEventListener('resize', this.screenAdapter);
    this.resizeScreen();

    // 局部刷新数据（可选，默认关闭，可手动开启）
    // this.getDataTimer();
  },
  beforeUnmount() {
    if (this.chartInstance) {
      this.chartInstance.dispose();
      this.chartInstance = null;
    }
    clearInterval(this.koiTime);
    clearInterval(this.koiTimer);
    window.removeEventListener('resize', this.screenAdapter);
  },
  methods: {
    resizeScreen() {
      this.koiTime = setInterval(() => {
        this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth;
        this.kHOne = Math.round(this.screenHeight * 0.30);
      }, 200);
    },

    initChart() {
      this.chartInstance = echarts.init(this.$refs.refChart, 'shine');

      const LinearGradient = echarts.graphic.LinearGradient;

      const initOption = {
        title: { 
          text: "🌞隐患点分布", 
          left: '20%',
          top: 10,
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        legend: { 
          data: ["洪水", "泥石流","滑坡"], 
          top: 10,
          right: 10,
          itemWidth: 12,
          itemHeight: 12,
          textStyle: {
            fontSize: 12
          }
        },
        tooltip: { 
          trigger: "axis", 
          axisPointer: { type: "shadow" },
          confine: true
        },
        grid: {
          top: 50,
          left: 10,
          right: 10,
          bottom: 10,
          containLabel: true
        },
        xAxis: { 
          type: "category", 
          axisLine: { 
            lineStyle: { color: "white" } 
          }, 
          axisTick: { 
            show: true,
            alignWithLabel: true
          },
          axisLabel: {
            interval: 0,
            fontSize: 12
          }
        },
        yAxis: { 
          type: "value", 
          splitLine: { 
            lineStyle: { 
              type: "dashed", 
              color: "white" 
            } 
          },
          axisLabel: {
            fontSize: 12
          }
        },
        series: [
          { 
            name: "洪水", 
            type: "bar", 
            barWidth: 20, 
            itemStyle: { 
              color: "red"
            } 
          },
          { 
            name: "泥石流", 
            type: "bar", 
            barWidth: 20, 
            itemStyle: { 
              color: "green" 
            } 
          },
          { 
            name: "滑坡", 
            type: "bar", 
            barWidth: 20, 
            itemStyle: { 
              color: "blue"
            } 
          }
        ]
      };

      this.chartInstance.setOption(initOption);
    },

    getData() {
      // 模拟数据，可替换为接口调用
      this.allData = [
        { xData: ["区域一","区域二","区域三","区域四"], seriesData: [220,182,191,234], name: "洪水" },
        { xData: ["区域一","区域二","区域三","区域四"], seriesData: [120,132,101,134], name: "泥石流" },
        { xData: ["区域一","区域二","区域三","区域四"], seriesData: [20,82,191,234], name: "滑坡" }
      ];
      this.updateChart();
    },

    updateChart() {
      const xAxisData = this.allData[0].xData;
      const seriesData = this.allData.map(item => ({ 
        name: item.name, 
        data: item.seriesData, 
        type: "bar",
        barWidth: 20
      }));
      
      this.chartInstance.setOption({ 
        xAxis: { data: xAxisData }, 
        series: seriesData 
      });
    },

    screenAdapter() {
      if (!this.chartInstance) return;
      const chartWidth = this.$refs.refChart.offsetWidth;
      const titleFontSize = Math.max(Math.round(chartWidth / 40), 12);
      const labelFontSize = Math.max(Math.round(chartWidth / 50), 10);
      const barWidth = Math.max(Math.round(chartWidth / 25), 15);

      const adapterOption = {
        title: { 
          textStyle: { 
            fontSize: titleFontSize 
          } 
        },
        legend: { 
          textStyle: { 
            fontSize: labelFontSize 
          },
          itemWidth: labelFontSize,
          itemHeight: labelFontSize
        },
        xAxis: { 
          axisLabel: { 
            textStyle: { 
              fontSize: labelFontSize 
            } 
          } 
        },
        yAxis: { 
          axisLabel: { 
            textStyle: { 
              fontSize: labelFontSize 
            } 
          } 
        },
        series: [
          { barWidth: barWidth },
          { barWidth: barWidth },
          { barWidth: barWidth }
        ]
      };
      
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },

    getDataTimer() {
      clearInterval(this.koiTimer);
      this.koiTimer = setInterval(() => this.getData(), 60000*30);
    }
  }
};
</script>

<style scoped lang="less">
.chart-container {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
</style>