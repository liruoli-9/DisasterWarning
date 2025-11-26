<!-- echarts模板，有局部刷新需要在mounted自行开启 -->
<template>
  <div ref="refChart" :style="{ height: kHOne + 'px'}"></div>
</template>

<script>
// import { listTenDayData } from "@/api/home/index";
// require("../../../assets/theme/shine")
import shineTheme from 'echarts/theme/shine.js';
export default {
  name: '',
  components: {},
  data () {
    return {
      // 获取浏览器可视区域高度（包含滚动条）、 window.innerHeight
      // 获取浏览器可视区域高度（不包含工具栏高度）、document.documentElement.clientHeight
      // 获取body的实际高度  (三个都是相同，兼容性不同的浏览器而设置的) document.body.clientHeight
      screenHeight: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
      screenWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      chartInstance: null,
      allData: [],
      allData2: [],
      // 浏览器高度
      kHOne: null,
      // 浏览器宽度
      kWOne: null,
      // 浏览器字体大小
      kFOne: null,
      // 自适应浏览器获取宽高大小定时器
      koiTime: null,
      // 局部刷新定时器
      koiTimer: null,
    }
  },
  created () {},
  beforeMount(){
    // Echarts页面加载进来时，首先设置高度进行显示图表进行初始化
    this.kHOne = Math.round(this.screenHeight * 0.36)
  },
  mounted(){
    // 页面大小改变时触发
    window.addEventListener('resize',this.getScreenHeight, false);
    // 页面大小改变时触发
    window.addEventListener('resize',this.getScreenWidth, false);
    // 鼠标移动时触发
    //window.addEventListener('mousemove',this.getHeight, false);
    // 自适应浏览器获取宽高大小定时器
    this.resizeScreen();
    // 图表初始化
    this.initChart();
    // 获取接口数据
    this.getData();
    // 调用Echarts图表自适应方法
    this.screenAdapter();
    // Echarts图表自适应
    window.addEventListener("resize", this.screenAdapter);
    // 局部刷新定时器
    this.getDataTimer();
  },
  beforeDestroy () {
    // 销毁Echarts图表
    this.chartInstance.dispose();
    this.chartInstance = null;
  },
  destroyed() {
    // 清除自适应屏幕定时器
    clearInterval(this.koiTime);
    this.koiTime = null;
    // 清除局部刷新定时器
    clearInterval(this.koiTimer);
    this.koiTimer = null;
    // 页面大小改变时触发销毁
    window.removeEventListener('resize',this.getScreenHeight, false);
    // 页面大小改变时触发销毁
    window.removeEventListener('resize',this.getScreenWidth, false);
    // Echarts图表自适应销毁
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    // 自适应浏览器获取宽高大小定时器
    resizeScreen(){
      this.koiTime = setInterval(() => {
        this.getScreenHeight();
        this.getScreenWidth();
      }, 200)
    },
    // 获取浏览器高度进行自适应
    getScreenHeight() {
      this.screenHeight = window.innerHeight || document.documentElement.innerHeight || document.body.clientHeight;
      // 四舍五入取整数
      this.kHOne = Math.round(this.screenHeight * 0.36);
      //console.log("高度->"+this.screenHeight +"-"+ this.kHOne);
    },
    // 字体大小根据宽度自适应
    getScreenWidth(){
      this.screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      // 浏览器字体计算
      this.kFOne = Math.round(this.screenWidth / 100);
      // 浏览器宽度宽度
      this.kWOne = this.screenWidth;
      //console.log("宽度->"+this.screenWidth);
    },
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.refChart,'shine');
      const initOption = {
        title: {
          text: "🍄光伏近10日耗电量",
          top: '1%'
        },
        grid: {
          top: "12%",
          left: "6%",
          bottom: "10%",
          right: "2%"
        },
        tooltip: {
          show: true,
        },
        legend: {
          data: ['柱形耗电量', '折线耗电量'],
          right: "5%",
        },
        xAxis: [
          {
            type: 'category',
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '柱形耗电量',
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' V';
              }
            }
          },
          {
            name: '折线耗电量',
            type: 'line',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' V';
              }
            },
            // 圆滑连接
            smooth: true,
            itemStyle: {
              color: '#00f2f1'  // 线颜色
            }
          }
        ]
      };
      // 图表初始化配置
      this.chartInstance.setOption(initOption);
    },
    getData() {
      // 先进行置空
      this.allData = [];
      this.allData2 = [];
      let num1 = this.randomNum(100,200);
      let num2 = this.randomNum(200,500);
      let num3 = this.randomNum(200,500);
      let num4 = this.randomNum(500,700);
      let num5 = this.randomNum(500,700);
      let num6 = this.randomNum(700,800);
      let num7 = this.randomNum(800,900);
      let num8 = this.randomNum(900,1000);
      this.allData = [
        "09-03",
        "09-04",
        "09-05",
        "09-06",
        "09-07",
        "09-08",
        "09-09",
        "09-10"
      ]
      this.allData2.push(num1,num2,num3,num4,num5,num6,num7,num8);
      // 调用接口方法
      // listTenDayData().then(res => {
      //       this.allData = res.data;
      //       this.updateChart();
      //       //console.log("ALLDATA->"+JSON.stringify(this.allData.pcsSum));
      //       // echarts查不到数据，将初始化echarts的方法全部放置到接口方法中即可。
      // })
      // 获取服务器的数据, 对this.allData进行赋值之后, 调用updateChart方法更新图表
      //console.log("ALLDATA->",JSON.stringify(res.data))
      //console.log("ALLDATA->",JSON.stringify(this.allData))
      this.updateChart();
    },
    updateChart() {
      const colorArr = [
        ["#0BA82C", "#4FF778"],
        ["#2E72BF", "#23E5E5"],
        ["#5052EE", "#AB6EE5"],
        ["hotpink", "lightsalmon"],
      ];
      // 处理图表需要的数据
      const dataOption = {
        xAxis: {
          // x轴刻度文字
          data: this.allData
        },
        series: [
          {
            // y轴柱形耗电量数据
            data: this.allData2,
            itemStyle: {
              //颜色样式部分
              normal: {
                label: {
                  show: true, //开启数字显示
                  position: "top", //在上方显示数字
                  textStyle: {
                    //数值样式
                    color: "lightpink", //字体颜色
                    //fontSize: 10, //字体大小
                  },
                },
                //   柱状图颜色渐变
                color: (arg) => {
                  let targetColorArr = null;
                  if (arg.value > 700) {
                    targetColorArr = colorArr[0];
                  } else if (arg.value > 500) {
                    targetColorArr = colorArr[1];
                  } else if (arg.value > 200) {
                    targetColorArr = colorArr[2];
                  } else {
                    targetColorArr = colorArr[3];
                  }
                  return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: targetColorArr[0],
                    },
                    {
                      offset: 1,
                      color: targetColorArr[1],
                    },
                  ]);
                },
              },
            }
          },

          {
            // y轴折线耗电量数据
            data: this.allData2
          }
        ]
      };
      // 图表数据变化配置
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      this.titleFontSize = Math.round(this.$refs.refChart.offsetWidth / 50);
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        // 圆点分类标题
        legend: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        xAxis: {
          //  改变x轴字体颜色和大小
          axisLabel: {
            textStyle: {
              fontSize: Math.round(this.titleFontSize * 0.9),
            },
          },
        },
        yAxis: {
          //  改变y轴字体颜色和大小
          axisLabel: {
            textStyle: {
              fontSize: Math.round(this.titleFontSize * 0.9),
            },
          },
        },
        series: [
          // 双柱的话复制粘贴一份即可
          {
            // 圆柱的宽度
            barWidth: Math.round(this.titleFontSize * 1.2),
            itemStyle: {
              //颜色样式部分
              normal: {
                label: {
                  textStyle: {
                    fontSize: Math.round(this.titleFontSize), //字体大小
                  },
                },
              },
            },
          }
        ],
      };
      // 图表自适应变化配置
      this.chartInstance.setOption(adapterOption);
      // 手动的调用图表对象的resize 才能产生效果
      this.chartInstance.resize();
    },
    // 定时器
    getDataTimer(){
      this.koiTimer = setInterval(() => {
        // 执行刷新数据的方法
        this.getData();
        //console.log("Hello World")
      }, 3000)
    },
  }
}
</script>
<style lang='less' scoped>

</style>
