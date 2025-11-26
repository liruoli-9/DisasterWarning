<template>
  <div ref="refChart" :style="{ height: kHOne + 'px' }"></div>
</template>

<script>
import * as echarts from 'echarts';
import shineTheme from 'echarts/theme/shine.js';

export default {
  name: 'DynamicPieChart',
  data() {
    return {
      screenHeight: window.innerHeight,
      screenWidth: window.innerWidth,
      chartInstance: null,
      allData: [],
      kHOne: null,
      koiTime: null,   // 局部自适应定时器
      koiTimer: null,  // 图表刷新定时器
    };
  },
  created() {
    this.kHOne = Math.round(this.screenHeight * 0.44);
  },
  mounted() {
    // 注册主题
    echarts.registerTheme('shine', shineTheme);

    // 初始化图表
    this.initChart();

    // 监听窗口尺寸变化
    window.addEventListener('resize', this.screenAdapter);

    // 自适应高度/宽度定时器
    this.resizeScreen();

    // 初始化数据
    this.getData();

    // 定时刷新数据
    this.getDataTimer();
  },
  beforeUnmount() {
    // 销毁图表
    if (this.chartInstance) {
      this.chartInstance.dispose();
      this.chartInstance = null;
    }

    // 清除定时器
    clearInterval(this.koiTime);
    clearInterval(this.koiTimer);

    // 移除窗口事件
    window.removeEventListener('resize', this.screenAdapter);
  },
  methods: {
    // 屏幕自适应定时器
    resizeScreen() {
      this.koiTime = setInterval(() => {
        this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth;
        this.kHOne = Math.round(this.screenHeight * 0.30);
      }, 200);
    },

    // 初始化图表
    initChart() {
      this.chartInstance = echarts.init(this.$refs.refChart, 'shine');

      const initOption = {
        title: {
          text: "🍀近7天隐患故障",
          left: '20%',
          top: '2%',
          textStyle: { 
            color: 'white',
            fontSize: 16
          }
        },
        tooltip: { 
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: { 
          orient: 'vertical', 
          left: 'left',
          top: '15%',
          bottom: '10%',
          textStyle: { 
            color: 'white',
            fontSize: 12
          },
          itemWidth: 12,
          itemHeight: 12
        },
        series: [
          {
            name: '模块故障',
            type: 'pie',
            radius: ['35%', '65%'],
            center: ['55%', '55%'],
            avoidLabelOverlap: false,
            itemStyle: { 
              borderRadius: 5, 
              borderColor: '#fff', 
              borderWidth: 2 
            },
            label: { 
              show: true, 
              position: 'outside',
              formatter: '{b}\n{d}%',
              color: 'white',
              fontSize: 11,
              lineHeight: 14
            },
            emphasis: { 
              label: { 
                show: true, 
                fontSize: 14, 
                fontWeight: 'bold' 
              } 
            },
            labelLine: { 
              show: true,
              length: 15,
              length2: 8
            }
          }
        ],
        grid: {
          top: '15%',
          left: '0%',
          right: '0%',
          bottom: '5%',
          containLabel: true
        }
      };

      this.chartInstance.setOption(initOption);

      // 鼠标事件停止/启动刷新
      this.chartInstance.on('mouseover', () => clearInterval(this.koiTimer));
      this.chartInstance.on('mouseout', () => this.getDataTimer());
    },

    // 模拟数据获取
    getData() {
      this.updateChart();
    },

    // 更新图表数据
    updateChart() {
      const randomNum = (min, max) => Math.floor(Math.random() * (max - min) + min);

      this.allData = [
        { value: randomNum(100, 201), name: '泥石流隐患' },
        { value: randomNum(50, 201), name: '滑坡隐患' },
        { value: randomNum(60, 201), name: '洪水隐患' },
        { value: randomNum(70, 201), name: '地面沉降隐患' },
        { value: randomNum(85, 201), name: '地裂缝隐患' }
      ];

      this.chartInstance.setOption({
        series: [{ data: this.allData }]
      });
    },

    // 图表自适应
    screenAdapter() {
      if (!this.chartInstance) return;

      const containerWidth = this.$refs.refChart.offsetWidth;
      const containerHeight = this.$refs.refChart.offsetHeight;
      
      // 根据容器尺寸动态调整布局
      const titleFontSize = Math.max(14, containerWidth / 25);
      const legendFontSize = Math.max(10, containerWidth / 35);
      
      // 根据宽高比调整饼图位置和大小
      const isWide = containerWidth / containerHeight > 1.5;
      
      const optionUpdate = {
        title: { 
          textStyle: { 
            fontSize: Math.round(titleFontSize) 
          } 
        },
        legend: { 
          textStyle: { 
            fontSize: Math.round(legendFontSize) 
          }
        },
        series: [{
          radius: isWide ? ['40%', '70%'] : ['35%', '65%'],
          center: isWide ? ['65%', '50%'] : ['50%', '55%'],
          label: {
            fontSize: Math.round(legendFontSize * 0.9)
          }
        }]
      };

      this.chartInstance.setOption(optionUpdate);
      this.chartInstance.resize();
    },

    // 定时刷新图表
    getDataTimer() {
      clearInterval(this.koiTimer);
      this.koiTimer = setInterval(() => this.getData(), 1500);
    }
  }
};
</script>

<style scoped lang="scss">
/* 确保容器没有内边距和外边距 */
div {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>