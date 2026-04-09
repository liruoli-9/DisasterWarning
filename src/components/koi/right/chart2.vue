<template>
  <div class="chart-container">
    <div ref="refChart" class="chart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import shineTheme from 'echarts/theme/shine.js';

export default {
  name: 'ConcentrationChart',
  data() {
    return {
      chartInstance: null,
      tootipTimer: null,
      resizeObserver: null
    }
  },
  mounted() {
    // 初始化 ECharts
    this.initChart();
    // 获取数据
    this.getData();
    // 启动自适应
    this.startResizeObserver();
    // 启动 tooltip 自动播放
    this.startTooltipTimer();
  },
  beforeUnmount() {
    // 清除定时器
    clearInterval(this.tootipTimer);
    this.tootipTimer = null;
    
    // 移除观察器
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    
    // 销毁 ECharts
    if (this.chartInstance) {
      this.chartInstance.dispose();
      this.chartInstance = null;
    }
  },
  methods: {
    initChart() {
      this.chartInstance = echarts.init(this.$refs.refChart, shineTheme);
      const initOption = {
        title: { 
          text: "🍁雾霭与雾霾浓度", 
          left: 'left',
          textStyle: {
            fontSize: 16
          }
        },
        tooltip: { 
          trigger: 'axis',
          confine: true // 确保tooltip在容器内显示
        },
        legend: {
          top: '10%',
          textStyle: {
            fontSize: 12
          }
        },
        grid: { 
          top: '25%', 
          left: '3%', 
          right: '3%', 
          bottom: '8%', 
          containLabel: true 
        },
        color: ['#019688', '#119AC2'],
        xAxis: [{ 
          type: 'category', 
          boundaryGap: false, 
          data: [],
          axisLabel: {
            fontSize: 11,
            interval: 0,
            rotate: 30 // 当标签过多时旋转
          }
        }],
        yAxis: [
          { 
            type: 'value', 
            name: '浓度数据', 
            axisTick: { show: false }, 
            axisLabel: { 
              color: '#808080',
              fontSize: 11
            }, 
            axisLine: { 
              lineStyle: { 
                width: 2, 
                color: '#019688' 
              } 
            }, 
            splitLine: { 
              lineStyle: { 
                color: 'rgba(226,226,226,0.5)' 
              } 
            } 
          },
          { 
            type: 'value', 
            name: '测量原始值', 
            axisTick: { show: false }, 
            axisLabel: { 
              color: '#808080',
              fontSize: 11
            }, 
            axisLine: { 
              lineStyle: { 
                width: 2, 
                color: '#019688' 
              } 
            }, 
            splitLine: { 
              lineStyle: { 
                color: 'rgba(226,226,226,0.5)' 
              } 
            } 
          }
        ],
        series: [
          { 
            name: '浓度数据', 
            type: 'line', 
            smooth: true, 
            symbolSize: 6, 
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(1, 150, 136, 0.3)' },
                { offset: 1, color: 'rgba(1, 150, 136, 0.1)' }
              ])
            }, 
            itemStyle: { borderWidth: 2 } 
          },
          { 
            name: '测量原始值', 
            type: 'line', 
            yAxisIndex: 1, 
            smooth: true, 
            symbolSize: 6, 
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(17, 154, 194, 0.3)' },
                { offset: 1, color: 'rgba(17, 154, 194, 0.1)' }
              ])
            }, 
            itemStyle: { borderWidth: 2 } 
          }
        ]
      };
      this.chartInstance.setOption(initOption);

      // 鼠标 hover 停止 tooltip 定时器
      this.chartInstance.on("mouseover", () => clearInterval(this.tootipTimer));
      // 鼠标移出重新启动 tooltip
      this.chartInstance.on("mouseout", this.startTooltipTimer);
    },

    getData() {
      // 模拟数据或接口赋值
      this.updateChart();
    },

    updateChart() {
      const dataOption = {
        xAxis: [{ 
          data: ['12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'] 
        }],
        series: [
          { data: [0.2,0.049,0.07,0.23,0.25,0.07,0.15,0.162,0.32,0.2,0.06,0.33] },
          { data: [2.6,5.9,9.0,6.4,8.7,0.7,5.6,2.2,0.4,0.18,0.24,0.25] }
        ]
      };
      if (this.chartInstance) this.chartInstance.setOption(dataOption);
    },

    screenAdapter() {
      if (!this.chartInstance) return;
      
      const containerWidth = this.$refs.refChart.offsetWidth;
      const containerHeight = this.$refs.refChart.offsetHeight;
      
      // 根据容器大小动态调整字体大小
      const baseSize = Math.min(containerWidth / 50, containerHeight / 20);
      
      const adapterOption = {
        title: { 
          textStyle: { 
            fontSize: Math.max(14, baseSize * 1.2)
          } 
        },
        legend: { 
          textStyle: { 
            fontSize: Math.max(10, baseSize)
          } 
        },
        xAxis: [{ 
          axisLabel: { 
            fontSize: Math.max(9, baseSize * 0.8),
            interval: containerWidth < 500 ? 'auto' : 0
          } 
        }],
        yAxis: [
          { 
            nameTextStyle: { 
              fontSize: Math.max(10, baseSize)
            }, 
            axisLabel: { 
              fontSize: Math.max(9, baseSize * 0.8)
            } 
          },
          { 
            nameTextStyle: { 
              fontSize: Math.max(10, baseSize)
            }, 
            axisLabel: { 
              fontSize: Math.max(9, baseSize * 0.8)
            } 
          }
        ]
      };
      
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },

    startResizeObserver() {
      // 使用 ResizeObserver 替代定时器，更高效
      this.resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          if (entry.target === this.$refs.refChart.parentElement) {
            this.screenAdapter();
          }
        }
      });
      
      this.resizeObserver.observe(this.$refs.refChart.parentElement);
    },

    startTooltipTimer() {
      let index = 0;
      clearInterval(this.tootipTimer);
      this.tootipTimer = setInterval(() => {
        if (!this.chartInstance) return;
        this.chartInstance.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: index
        });
        index = (index + 1) % 12;
      }, 2000);
    }
  }
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  max-height: 400px; /* 设置最小高度确保图表可见 */
  min-height: 250px;
  position: relative;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>