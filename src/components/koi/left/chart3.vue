<template>
  <div ref="radarChart" style="width: 100%; height: 100%;"></div>
</template>

<script>
import * as echarts from 'echarts';

// require("../../../assets/theme/shine")
import shineTheme from 'echarts/theme/shine.js';
export default {
  name: 'RadarChart',
  data () {
    return {
      chartInstance: null,
      allData: [],
      kHOne: null,
      koiTime: null,
      koiTimer: null,
      data: [], // 初始化数据
      indicators: [
        { name: '无风险', max: 100 },
        { name: '低风险', max: 100 },
        { name: '中风险', max: 100 },
        { name: '高风险', max: 100 }
      ]
    }
  },
  mounted(){
    this.initChart();
    window.addEventListener("resize", this.screenAdapter);
    this.getDataTimer();
  },
  watch: {
    data: 'initChart',
    indicators: 'initChart'
  },
  beforeDestroy () {
    if (this.chartInstance) {
      this.chartInstance.dispose();
      this.chartInstance = null;
    }
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    initChart() {
      this.chartInstance = echarts.init(this.$refs.radarChart);
      const option = {
        title: {
          text: '风险等级数量统计',
          left: 'center',
          textStyle: {
            color: '#ffffff'
          }
        },
        radar: {
          indicator: this.indicators,
          shape: 'polygon',
          splitArea: {
            areaStyle: {
              color: ['#e0f7fa', '#80deea', '#26c6da', '#00acc1', '#00838f']
            }
          }
        },
        series: [{
          name: '风险等级',
          type: 'radar',
          areaStyle: { normal: {} },
          data: [{
            value: this.data,
            name: '风险指数',
            label: {
              show: true,
              formatter: (params) => {
                return params.value;
              }
            }
          }]
        }]
      };
      this.chartInstance.setOption(option);
      this.screenAdapter();
    },
    getData() {
      const newData = [
        Math.round(Math.random() * 100),
        Math.round(Math.random() * 100),
        Math.round(Math.random() * 100),
        Math.round(Math.random() * 100)
      ];
      this.data = newData;
      this.updateChart();
    },
    updateChart() {
      if (this.chartInstance) {
        const option = {
          series: [{
            data: [{
              value: this.data,
              name: '风险指数',
              label: {
                show: true,
                formatter: (params) => {
                  return params.value;
                }
              }
            }]
          }]
        };
        this.chartInstance.setOption(option);
      }
    },
    getDataTimer(){
      this.koiTimer = setInterval(() => {
        this.getData();
      }, 3000)
    },
    screenAdapter() {
      if (this.chartInstance) {
        this.chartInstance.resize();
      }
    }
  }
}
</script>

<style scoped>
div {
  width: 100%;
  height: 100%;
}
</style>
