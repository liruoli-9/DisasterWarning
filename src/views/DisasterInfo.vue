<!--  -->
<template>
  <div id="index">
    <el-row>
      <el-col :span="7">
        <div style="width: 90%;display: flex; flex-direction: column; justify-content: center; margin-top:1rem;margin-left: 2rem;">
          <div style="align-items: center; justify-content: center;max-width: 100%;">
            <leftchart1></leftchart1>
          </div>
          <div style="align-items: center; justify-content: center; margin-top:6rem">
            <!-- style="padding:12px" -->
            <leftchart2></leftchart2>
          </div>
        </div>
      </el-col>
      <el-col :span="7">
        <div style="width: 90%;">
          <el-card style="background-color: rgba(255,255,255,0.2);border:none;margin-top:10px">
            <DemoMap></DemoMap>
          </el-card>
          <!-- <centerchart2></centerchart2> -->
        </div>
      </el-col>
      <el-col :span="7">
        <div style="width: 100%;height: 100%;display: flex;flex-direction: column;margin-left: -2rem;">
          <div style="height: 30%;">
            <rightchart1></rightchart1>
          </div>
          <div style="height: 30%;">
            <rightchart2></rightchart2>
          </div>
          <div style="height: 40%;">
            <rightchart3></rightchart3>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { formatTime } from '@/utils/index.js';
import leftchart1 from "@/components/koi/left/chart1.vue";
import leftchart2 from "@/components/koi/left/chart2data.vue";
import leftchart3 from "@/components/koi/left/chart3.vue";
import centerchart1 from "@/components/koi/center/chart1.vue";
import centerchart2 from "@/components/koi/center/chart2.vue";
import centerchart3 from "@/components/koi/center/chart3.vue";
import rightchart1 from "@/components/koi/right/chart1.vue";
import rightchart2 from "@/components/koi/right/chart2.vue";
import rightchart3 from "@/components/koi/right/chart3.vue";
import DemoMap from '@/components/DemoMap.vue';
//引入css
import '../assets/less/style.less';
export default {
  name: 'index',
  components: {
    leftchart1,
    leftchart2,
    leftchart3,
    centerchart1,
    centerchart2,
    centerchart3,
    rightchart1,
    rightchart2,
    rightchart3,
    DemoMap
  },
  data() {
    return {
      loading: true,
      // 装饰8颜色
      decorationColor: ['#568aea', '#000000'],
      // 时间
      timer: null,
      // 适应浏览器
      koiTime: null,
      // 定时跳转页面
      koiTimer: null,
      dateDay: null,
      dateYear: null,
      dateWeek: null,
      weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      // 获取浏览器可视区域高度（包含滚动条）、
      // 获取浏览器可视区域高度（不包含工具栏高度）、
      // 获取body的实际高度  (三个都是相同，兼容性不同的浏览器而设置的)
      screenHeight: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
      screenWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      kHOne: 100,
      kHTwo: 100,
      kHThree: 300,
      kHFour: 500,
      kHFive: 450,
      kHSix: 300,
      kHSeven: 400,
      kHEight: 400
    }
  },
  created() {

  },
  mounted() {
    // 页面大小改变时触发
    window.addEventListener('resize', this.getScreenHeight, false);
    // 页面大小改变时触发
    window.addEventListener('resize', this.getScreenWidth, false);
    // 鼠标移动时触发
    //window.addEventListener('mousemove',this.getHeight, false);
    this.timeInterval();
    this.cancelLoading();
    this.resizeScreen();
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null;
    clearInterval(this.koiTime);
    this.koiTime = null;
    clearInterval(this.koiTimer);
    this.koiTimer = null;
    // 页面大小改变时触发
    window.removeEventListener('resize', this.getScreenHeight, false);
    // 页面大小改变时触发
    window.removeEventListener('resize', this.getScreenWidth, false);
  },
  watch: {
    screenWidth: function (news, old) {
      if (news <= 1200) {
        this.$notify({
          title: '浏览器高度提示',
          dangerouslyUseHTMLString: true,
          message: '<strong style= "color: teal">浏览器宽度<1200px将不再进行自适应</strong>',
          type: 'warning',
          position: 'bottom-right',
          duration: 2000
        });
      }
    },
    screenHeight: function (news, old) {
      if (news <= 700) {
        this.$notify({
          title: '浏览器宽度提示',
          dangerouslyUseHTMLString: true,
          message: '<strong style= "color: teal">浏览器高度<700px将不再进行自适应</strong>',
          type: 'warning',
          position: 'bottom-right',
          duration: 2000
        });
      }
    }
  },
  methods: {
    timeInterval() {
      this.timer = setInterval(() => {
        this.dateDay = formatTime(new Date(), 'HH: mm: ss')
        this.dateYear = formatTime(new Date(), 'yyyy/MM/dd')
        this.dateWeek = this.weekday[new Date().getDay()]
      }, 1000)
    },
    cancelLoading() {
      setTimeout(() => {
        this.loading = false
      }, 500)
    },
    resizeScreen() {
      this.koiTime = setInterval(() => {
        this.getScreenHeight();
        this.getScreenWidth();
      }, 200)
    },
    // 获取浏览器高度进行自适应
    getScreenHeight() {
      this.screenHeight = window.innerHeight || document.documentElement.innerHeight || document.body.clientHeight;
      // 四舍五入取整数
      this.kHOne = Math.round(this.screenHeight * 0.3);
      this.kHTwo = Math.round(this.screenHeight * 0.32);
      this.kHThree = Math.round(this.screenHeight * 0.18);
      this.kHFour = Math.round(this.screenHeight * 0.38);
      this.kHFive = Math.round(this.screenHeight * 0.385);
      this.kHSix = Math.round(this.screenHeight * 0.3);
      this.kHSeven = Math.round(this.screenHeight * 0.32);
      this.kHEight = Math.round(this.screenHeight * 0.325);
      //console.log(this.screenHeight +"-"+ Math.round(this.percentHThirty) +"-"+ Math.round(this.percentHForty));
    },
    // 字体大小根据宽度自适应
    getScreenWidth() {
      this.screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      //console.log("hh-"+this.screenWidth+"-"+this.screenHeight);
    }
  }
}
</script>

<style lang="less" scoped></style>
