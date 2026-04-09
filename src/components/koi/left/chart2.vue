<!-- echarts模板，有局部刷新需要在mounted自行开启 -->
<template>
  <div ref="refChart" :style="{ height: kHOne + 'px'}"></div>
</template>

<script>
require("../../../assets/theme/shine")
import { get24HoursData3 } from "../../../api/ems/index";
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
  kHOne: null,
  // 自适应浏览器获取宽高大小定时器
  koiTime: null,
  // 局部刷新数据定时器
  koiTimer: null,
}
},
created () {},
beforeMount(){
  this.kHOne = Math.round(this.screenHeight * 0.52)
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
  //this.getDataTimer();
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
      this.kHOne = Math.round(this.screenHeight * 0.52);
      //console.log("高度->"+this.screenHeight +"-"+ this.kHOne);
  },
  // 字体大小根据宽度自适应
  getScreenWidth(){
    this.screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    //console.log("宽度->"+this.screenWidth);
  },
  initChart() {
    this.chartInstance = this.$echarts.init(this.$refs.refChart,'shine');
    const initOption = {
      title: {
        text: "🌞隐患点分布",
        left: 'center'
      },
      calculable: true,
      legend: {
        //   指示框名字  注意！要和下方series中的name一起改
        data: ["洪水", "泥石流","滑坡"],
        // 指示框位置  距离上下左右多少
        right: "5%",
        // top: '50%',
        textStyle: {
          //color: '#4F4F4F'   //字体颜色
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
      },
      xAxis: [
        {
          type: "category",
          axisLine: {
            //x轴线的颜色以及宽度
            show: true, //是否显示X轴
            lineStyle: {
              color: "#4F4F4F",
            },
          },
          axisLabel: {
            // interval: 0,  //间隔几条显示
            // rotate: 20,  // 切斜度数
            // fontSize: 10,   //字体大小
          },
          axisTick: {
            //是否显示刻度线
            show: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          axisTick: {
            //y轴刻度线
            show: false,
          },
          axisLine: {
            show: false, // Y轴
            lineStyle: {
              color: "#4F4F4F",
            },
          },
          splitLine: {
            // 表格里面Y轴线条
            show: true,
            lineStyle: {
              type: "dashed", //虚线
              color: "#04072F", //虚线颜色
            },
          },


        },
      ],
      series: [
        {
          barWidth: 10, //柱子宽度
          name: "洪水",
          type: "bar",
          itemStyle: {
            //颜色样式部分
            normal: {
              barBorderRadius: [20, 20, 0, 0], //圆角[上左，上右，下右，下左]
              label: {
                show: true, //开启数字显示
                position: "top", //在上方显示数字
                textStyle: {
                  //数值样式
                  color: "orange", //字体颜色
                  //fontSize: 10, //字体大小
                },
              },
              //   柱状图颜色渐变
              color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: "#8277E9" },
                { offset: 1, color: "#CC77E9" },
              ]),
            },
          },
        },
        {
          barWidth: 10, //柱子宽度
          name: "泥石流",
          type: "bar",
          itemStyle: {
            //颜色样式部分
            normal: {
              barBorderRadius: [20, 20, 0, 0], //圆角[上左，上右，下右，下左]
              label: {
                show: true, //开启数字显示
                position: "top", //在上方显示数字
                textStyle: {
                  //数值样式
                  color: "white", //字体颜色
                  fontSize: 10, //字体大小
                },
              },
              //   柱状图颜色渐变
              color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: "#017CE4" },
                { offset: 1, color: "#249EFD" },
                // {offset: 2, color: "#249EFD"}
              ]),
            },
          },
        },
        {
          barWidth: 10, //柱子宽度
          name: "滑坡",
          type: "bar",
          itemStyle: {
            //颜色样式部分
            normal: {
              barBorderRadius: [20, 20, 0, 0], //圆角[上左，上右，下右，下左]
              label: {
                show: true, //开启数字显示
                position: "top", //在上方显示数字
                textStyle: {
                  //数值样式
                  color: "orange", //字体颜色
                  //fontSize: 10, //字体大小
                },
              },
              //   柱状图颜色渐变
              color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: "#8277E9" },
                { offset: 1, color: "#CC77E9" },
                // { offset: 2, color: "red" },
              ]),
            },
          },
        },
      ],
    };
    // 图表初始化配置
    this.chartInstance.setOption(initOption);
  },
  getData() {
    // 调用接口方法
    // get24HoursData3().then(res => {
    //       this.allData = res.data;
    //       // 刷新数据即可
    //       this.updateChart();
    //       //console.log("ALLDATA->"+JSON.stringify(this.allData));
    //       // echarts查不到数据，将初始化echarts的方法全部放置到接口方法中即可。
    // })
    // 获取服务器的数据, 对this.allData进行赋值之后, 调用updateChart方法更新图表
    //console.log("ALLDATA->",JSON.stringify(res.data))
    //console.log("ALLDATA->",JSON.stringify(this.allData))
    this.updateChart();
  },
  updateChart() {
    // 处理图表需要的数据
    const dataOption = {
      // xAxis: [
      //   {
      //     data: this.allData.timeHour
      //   },
      // ],
      // series: [
      //   {
      //     data: this.allData.column1
      //   },
      //   {
      //     data: this.allData.column1
      //   },
      // ],
      xAxis: [
        {
          data: [
            // "0:00",
            // "1:00",
            // "2:00",
            // "3:00",
            "区域一",
            "区域二",
            "区域三",
            "区域四"

          ],
        },
      ],
      series: [
        {
          data: [
            220, 182, 191, 234, 290, 330, 310, 365, 220, 182, 191, 234, 290,
            330, 310, 365, 220, 182, 191, 234, 290, 330, 310, 365, 235,
          ]
        },
        {
          data: [
            120, 132, 101, 134, 90, 230, 210, 265, 120, 132, 101, 134, 90,
            230, 210, 265, 120, 132, 101, 134, 90, 230, 210, 265, 156,
          ]
        },
        {
          data: [
            20, 82, 191, 234, 90, 330, 30, 365, 20, 182, 191, 234, 280,
            320, 312, 265, 420, 182, 170, 224, 290, 300, 30, 325, 235,
          ]
        },
      ],

    };
    // 图表数据变化配置
    this.chartInstance.setOption(dataOption);
  },
  screenAdapter() {
    this.titleFontSize = Math.round(this.$refs.refChart.offsetWidth / 30);
    //console.log("screenAdapter->"+this.titleFontSize);
    const adapterOption = {
      title: {
        textStyle: {
          fontSize: Math.round(this.titleFontSize),
        },
      },
      // 圆点分类标题
      legend: {
        textStyle: {
          fontSize: Math.round(this.titleFontSize),
        },
      },
      xAxis: {
        //  改变x轴字体颜色和大小
        axisLabel: {
          textStyle: {
            fontSize: Math.round(this.titleFontSize),
          },
        },
      },
      yAxis: {
        //  改变y轴字体颜色和大小
        axisLabel: {
          textStyle: {
            fontSize: Math.round(this.titleFontSize),
          },
        },
      },
      series: [
          {
            // 圆柱的宽度
            barWidth: Math.round(this.titleFontSize * 1.5),
            itemStyle: { //设置渐变色
              normal: {
                  label: {
                    textStyle: {
                      fontSize: Math.round(this.titleFontSize), //字体大小
                  },
                },
              }
            }
        },
        {
          // 圆柱的宽度
          barWidth: Math.round(this.titleFontSize * 1.5),
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
        },
        {
            // 圆柱的宽度
            barWidth: Math.round(this.titleFontSize * 1.5),
            itemStyle: { //设置渐变色
              normal: {
                  label: {
                    textStyle: {
                      fontSize: Math.round(this.titleFontSize), //字体大小
                  },
                },
              }
            }
        },
      ]
    };
    // 图表自适应变化配置
    this.chartInstance.setOption(adapterOption);
    this.chartInstance.resize();
  },
  // 定时器
  getDataTimer(){
    this.koiTimer = setInterval(() => {
      // 执行刷新数据的方法
      this.getData();
      //console.log("Hello World")
    }, 60000 * 30)
  },
}
}
</script>
<style lang='less' scoped>

</style>
