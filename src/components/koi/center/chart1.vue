<template>
  <div id="center">
    <!-- 方块显示图 -->
    <div class="square">
        <dv-scroll-ranking-board :config="config" :style="{ height: kHOne + 'px'}" />

      <!--      &lt;!&ndash; 正常 &ndash;&gt;-->
<!--      <div-->
<!--        class="bg-color-black item"-->
<!--        :style="{ height: kHOne + 'px'}"-->
<!--        v-for="(item,index) in row1"-->
<!--        :key="index + 100"-->
<!--      >-->
<!--        <p-->
<!--          class="colorDarkturquoise font-bold"-->
<!--          :style="{ 'font-size': kFOne + 'px','text-align': 'left','margin-left': kFOne + 'px'}"-->
<!--          v-text="item.name"-->
<!--        ></p>-->
<!--        <p :style="{ height: Math.round(kFOne/3) + 'px'}"></p>-->
<!--        <p-->
<!--          :style="{ height: kHOne + 'px','font-size': Math.round(kFOne*2) + 'px','text-align': 'left','margin-left': kFOne + 'px','margin-top': Math.round(kFOne/2) + 'px', 'color': item.color}"-->
<!--          v-text="item.value"-->
<!--        ></p>-->
<!--      </div>-->

<!--      &lt;!&ndash; 异常 &ndash;&gt;-->
<!--      <div-->
<!--        class="bg-color-black item"-->
<!--        :style="{ height: kHOne + 'px'}"-->
<!--        v-for="(item,index) in row2"-->
<!--        :key="index + 200"-->
<!--      >-->
<!--        <p-->
<!--          class="colorLightsteelblue font-bold"-->
<!--          :style="{ 'font-size': kFOne + 'px','text-align': 'left','margin-left': kFOne + 'px'}"-->
<!--          v-text="item.name"-->
<!--        ></p>-->
<!--        <p :style="{ height: Math.round(kFOne/1.5) + 'px'}"></p>-->
<!--        <p-->
<!--          :style="{ height: kHOne + 'px','font-size': Math.round(kFOne*2) + 'px','text-align': 'left','margin-left': kFOne + 'px','margin-top': Math.round(kFOne/2) + 'px', 'color': item.color}"-->
<!--          v-text="item.value"-->
<!--        ></p>-->
<!--      </div>-->
    </div>
  </div>
</template>

<script>
// import { getCurrentData, getCurrentDataByStorage } from "@/api/ems/index";
export default {
  name: "centerBox",
  components: {},
  data() {
    return {
      allData: [
        {
          name: '2024/04/26 10:58 云南省曲靖市富源县气象台发布大风蓝色预警信号',
          value: 0.82
        },
        {
          name: '2024/04/26 10:58 福建省宁德市福安市气象台发布雷电黄色预警信号',
          value: 0.95
        },
        {
          name: '2024/04/26 10:58 河北省邯郸市气象台发布大风蓝色预警信号',
          value: 0.25
        },
        {
          name: '2024/04/26 10:58 蒙古自治区鄂尔多斯市杭锦旗气象台发布大风蓝色预警信号',
          value: 0.69,
          color: '#FF0000'
        },
        {
          name: '2024/04/26 10:58 蒙古自治区鄂尔多斯市杭锦旗气象台发布大风蓝色预警信号',
          value: 0.79,
          color: '#FFA500'
        },
      ],
      config: {
        // 轮播方式
        carousel: 'single',
        showPercent: true,
        // percent
        data: this.allData
      },
      // 获取浏览器可视区域高度（包含滚动条）、 window.innerHeight
      // 获取浏览器可视区域高度（不包含工具栏高度）、document.documentElement.clientHeight
      // 获取body的实际高度  (三个都是相同，兼容性不同的浏览器而设置的) document.body.clientHeight
      screenHeight:
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight,
      screenWidth:
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth,
        row1: [],
        row2: [],
      koiTime: null,
      koiTimer: null,
      kHOne: null,
      kFOne: null,
    };
  },
  created() {},
  beforeMount() {
    this.kHOne = Math.round(this.screenHeight * 0.07);
  },
  mounted() {
    // 页面大小改变时触发
    window.addEventListener("resize", this.getScreenHeight, false);
    // 页面大小改变时触发
    window.addEventListener("resize", this.getScreenWidth, false);
    // 鼠标移动时触发
    //window.addEventListener('mousemove',this.getHeight, false);
    this.resizeScreen();
    this.getData();
    // 定时器
    this.getDataTimer();
  },
  destroyed() {
    // 清除多次执行定时器
    clearInterval(this.koiTime);
    this.koiTime = null;
    // 清除多次执行定时器
    clearInterval(this.koiTimer);
    this.koiTimer = null;
    // 页面大小改变时触发
    window.removeEventListener("resize", this.getScreenHeight, false);
    // 页面大小改变时触发
    window.removeEventListener("resize", this.getScreenWidth, false);
  },
  methods: {
    resizeScreen() {
      this.koiTime = setInterval(() => {
        this.getScreenHeight();
        this.getScreenWidth();
      }, 200);
    },
    // 获取浏览器高度进行自适应
    getScreenHeight() {
      this.screenHeight =
        window.innerHeight ||
        document.documentElement.innerHeight ||
        document.body.clientHeight;
      // 四舍五入取整数
      this.kHOne = Math.round(this.screenHeight * 0.14);
      //console.log("高度->"+this.screenHeight +"-"+ this.kHOne);
    },
    // 字体大小根据宽度自适应
    getScreenWidth() {
      this.screenWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      this.kFOne = Math.round(this.screenWidth / 150);
      //console.log("宽度->"+this.screenWidth);
    },
    getData() {
      const { config } = this;
      // 将数据赋值给DataV的胶囊柱图
      this.config.data = this.allData;
      this.config.unit = "概率";
      this.config.rowNum=3
      this.config = { ...this.config }
      // getCurrentData().then((res) => {
      //   //console.log("ALLDATA->",JSON.stringify(res.data))
      //   this.row1 = res.data.row1;
      //   this.row2 = res.data.row2;
      //   });
      // 获取服务器的数据, 对this.allData进行赋值之后, 调用updateChart方法更新图表
      //console.log("ALLDATA->",JSON.stringify(res.data))
      //console.log("ALLDATA->",JSON.stringify(res.allData))
    },
    // 定时器
    getDataTimer() {
      this.koiTimer = setInterval(() => {
        this.getData();
        //console.log("Hello World")
      }, 3000);
    },
  },
};
</script>

<style lang="less" scoped>
#center {
  display: flex;
  flex-direction: column;
  .square {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    .item {
      // 控制方块宽度比例
      width: 24.5%;
      border-radius: 6px;
      margin-top: 0.5%;
      margin-bottom: 0.5%;
    }
  }
}
</style>
