<template>
    <div class="content-wrapper" :style="{ height: containerHeight + 'px'}">

      
      <!-- 设备和人员信息 -->
      <div class="info-grid">
        <div class="info-item">
          <img src="../../../assets/images/plumber.png" alt="监测员">
          <span>监测员{{ items[0] }}人</span>
        </div>
        <div class="info-item">
          <img src="../../../assets/images/专业监测预警.png" alt="专业监测">
          <span>专业监测{{ items[1] }}个</span>
        </div>
        <div class="info-item">
          <img src="../../../assets/images/shipin.png" alt="视频监控">
          <span>视频监控{{ items[2] }}个</span>
        </div>
        <div class="info-item">
          <img src="../../../assets/images/qixiangzhan.png" alt="气象站">
          <span>气象站{{ items[3] }}个</span>
        </div>
      </div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
import shineTheme from 'echarts/theme/shine.js';

export default {
  name: 'Chart3',
  props: {
    showChart: {
      type: Boolean,
      default: false
    },
    // 新增父容器高度属性
    parentHeight: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      screenHeight: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
      screenWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      chartInstance: null,
      allData: [],
      containerHeight: 0, // 改为动态计算
      koiTime: null,
      koiTimer: null,
      items: ["120", "360", "20", "60"],
      titleFontSize: 0
    }
  },
  watch: {
    // 监听父容器高度变化
    parentHeight: {
      immediate: true,
      handler(newVal) {
        if (newVal > 0) {
          this.containerHeight = Math.round(newVal * 0.3); // 占父容器30%高度
        }
      }
    }
  },
  beforeMount(){
    // 如果父容器高度未传入，使用屏幕高度计算
    if (this.parentHeight === 0) {
      this.containerHeight = Math.round(this.screenHeight * 0.3);
    }
  },
  mounted(){
    window.addEventListener('resize', this.getScreenHeight, false);
    window.addEventListener('resize', this.getScreenWidth, false);
    
    this.resizeScreen();
    if (this.showChart) {
      this.initChart();
      this.getData();
      window.addEventListener("resize", this.screenAdapter);
      this.screenAdapter();
      this.getDataTimer();
    }
  },
  beforeDestroy () {
    if (this.chartInstance) {
      this.chartInstance.dispose();
      this.chartInstance = null;
    }
  },
  destroyed() {
    clearInterval(this.koiTime);
    this.koiTime = null;
    clearInterval(this.koiTimer);
    this.koiTimer = null;
    window.removeEventListener('resize', this.getScreenHeight, false);
    window.removeEventListener('resize', this.getScreenWidth, false);
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    initChart() {
      if (this.$refs.refChart) {
        this.chartInstance = echarts.init(this.$refs.refChart, shineTheme);
        
        const initOption = {
          title: {
            text: "设备人员",
            left: 'center',
            textStyle: {
              color: 'white',
            }
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
          },
          series: [
            {
              name: '模块故障',
              type: 'pie',
              radius: ['50%', '33%'],
              center: ["50%", "35%"],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 5,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: false,
                position: 'center',
                formatter: '{d}%'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '20',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
            }
          ]
        };
        
        this.chartInstance.setOption(initOption);

        this.chartInstance.on("mouseover", () => {
          clearInterval(this.koiTimer);
        });

        this.chartInstance.on("mouseout", () => {
          this.getDataTimer();
        });
      }
    },
    getScreenHeight() {
      this.screenHeight = window.innerHeight || document.documentElement.innerHeight || document.body.clientHeight;
      // 如果父容器高度未传入，使用屏幕高度计算
      if (this.parentHeight === 0) {
        this.containerHeight = Math.round(this.screenHeight * 0.3);
      }
    },
    getScreenWidth() {
      this.screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    },
    resizeScreen() {
      this.koiTime = setInterval(() => {
        this.getScreenHeight();
        this.getScreenWidth();
      }, 200)
    },
    getData() {
      this.updateChart();
    },
    updateChart() {
      let num1 = this.randomNum(100,201);
      let num2 = this.randomNum(50,201);
      let num3 = this.randomNum(60,201);
      let num4 = this.randomNum(70,201);
      let num5 = this.randomNum(85,201);
      this.allData = [];
      this.allData.push({ value: num1, name: '泥石流隐患' })
      this.allData.push({ value: num2, name: '滑坡隐患' })
      this.allData.push({ value: num3, name: '洪水隐患' })
      this.allData.push({ value: num4, name: '地面沉降隐患' })
      this.allData.push({ value: num5, name: '地裂缝隐患' })

      const dataOption = {
        series: [
          {
            data: this.allData
          }
        ]
      };
      
      if (this.chartInstance) {
        this.chartInstance.setOption(dataOption);
      }
    },
    screenAdapter() {
      if (this.$refs.refChart) {
        this.titleFontSize = (this.$refs.refChart.offsetWidth / 100) * 2;
        const adapterOption = {
          title: {
            textStyle: {
              fontSize: Math.round(this.titleFontSize * 2),
            },
          },
          legend: {
            textStyle: {
              fontSize: Math.round(this.titleFontSize * 1.2),
            },
          }
        };
        
        if (this.chartInstance) {
          this.chartInstance.setOption(adapterOption);
          this.chartInstance.resize();
        }
      }
    },
    getDataTimer() {
      this.koiTimer = setInterval(() => {
        this.getData();
      }, 1500)
    },
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }
}
</script>

<style lang='scss' scoped>
.chart-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  // 确保内容不超过30%高度
  overflow: hidden;
}

.title {
  color: aliceblue;
  font-size: x-large;
  text-align: center;
  margin: 0 0 10px 0;
  flex-shrink: 0; // 防止标题被压缩
}

.chart-area {
  width: 100%;
  height: 60%; // 图表区域占内容区域的60%
  min-height: 150px;
  flex-shrink: 0; // 防止图表被压缩
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
  margin-top: 10px;
  width: 100%;
  flex: 1; // 信息区域填充剩余空间
  overflow: hidden; // 防止内容溢出
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
}

.info-item img {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  object-fit: contain;
}

.info-item span {
  color: aliceblue;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
    grid-gap: 8px;
  }
  
  .info-item {
    padding: 5px 8px;
  }
  
  .info-item img {
    width: 20px;
    height: 20px;
  }
  
  .info-item span {
    font-size: 12px;
  }
  
  .title {
    font-size: large;
    margin-bottom: 8px;
  }
  
  .chart-area {
    min-height: 120px;
  }
}

@media (max-width: 480px) {
  .info-item span {
    font-size: 11px;
  }
  
  .title {
    font-size: medium;
    margin-bottom: 6px;
  }
  
  .chart-area {
    min-height: 100px;
  }
}
</style>