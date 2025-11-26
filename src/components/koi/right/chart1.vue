<template>
  <div ref="refChart" :style="{ height: kHOne + 'px', width: '100%' }"></div>
</template>

<script>
import axios from "axios";
import getRegion from '../../../utils/region.js'
import * as echarts from 'echarts';
import shineTheme from 'echarts/theme/shine.js';

export default {
  name: "WeatherChart",
  data() {
    return {
      screenHeight: window.innerHeight,
      screenWidth: window.innerWidth,
      kHOne: Math.round(window.innerHeight * 0.28), // 高度占屏幕比例
      kFOne: 14,
      chartInstance: null,
      allData: [],       // 日期
      rainfallData: [],  // 降雨量
      highT: [],         // 高温
      lowT: [],          // 低温
      refreshTimer: null,
      regions: getRegion.data
    };
  },
  mounted() {
    this.initChart();
    this.getData();
    this.startRefresh();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    clearInterval(this.refreshTimer);
    window.removeEventListener('resize', this.handleResize);
    if (this.chartInstance) {
      this.chartInstance.dispose();
      this.chartInstance = null;
    }
  },
  methods: {
    handleResize() {
      this.screenHeight = window.innerHeight;
      this.screenWidth = window.innerWidth;
      this.kHOne = Math.round(this.screenHeight * 0.28);
      if (this.chartInstance) {
        this.chartInstance.resize();
      }
    },
    initChart() {
      this.chartInstance = echarts.init(this.$refs.refChart, 'shine');
      const initOption = {
        title: {
          text: "🍄 甘肃省兰州市一周天气",
          top: '2%'
        },
        tooltip: { show: true },
        legend: {
          data: ['柱状降雨量', '折线高温', '折线低温'],
          right: '3%',
          top: '5%'
        },
        grid: { top: "15%", left: "6%", bottom: "10%", right: "2%" },
        xAxis: [{ type: 'category', axisPointer: { type: 'shadow' }, data: [] }],
        yAxis: [{ type: 'value' }],
        series: [
          { name: '柱状降雨量', type: 'bar', data: [], itemStyle: { color: '#3fb1e3' } },
          { name: '折线高温', type: 'line', data: [], smooth: true, itemStyle: { color: '#f44545' } },
          { name: '折线低温', type: 'line', data: [], smooth: true, itemStyle: { color: '#00f2f1' } }
        ]
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      try {
        const res = await axios.get('https://api.seniverse.com/v3/weather/daily.json', {
          params: {
            key: 'SzPhoxwQ75omAHo4V',
            location: 'lanzhou',
            language: 'zh-Hans',
            unit: 'c',
            start: '-1',
            days: '4'
          }
        });
        const daily = res.data.results[0].daily;
        this.allData = daily.map(item => item.date.substring(5));
        this.rainfallData = daily.map(item => item.rainfall);
        this.highT = daily.map(item => item.high);
        this.lowT = daily.map(item => item.low);
        this.updateChart();
      } catch (err) {
        console.error('获取天气数据失败:', err);
      }
    },
    updateChart() {
      const option = {
        xAxis: { data: this.allData },
        series: [
          { name: '柱状降雨量', data: this.rainfallData },
          { name: '折线高温', data: this.highT },
          { name: '折线低温', data: this.lowT }
        ]
      };
      this.chartInstance.setOption(option);
    },
    startRefresh() {
      this.refreshTimer = setInterval(this.getData, 30000); // 每30秒刷新一次
    }
  }
};
</script>

<style scoped>
div {
  max-height: 350px; /* 设置最小高度确保图表可见 */
  min-height: 250px;
}
</style>
