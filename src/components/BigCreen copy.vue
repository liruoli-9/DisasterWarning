<template>
  <div v-if="isLoading" class="loading-overlay">
    <div class="loading-spinner"></div>
  </div>
  <div style="width:1200px;height:500px;" ref="chartsDOM"></div>
</template>
<script setup>



import { useRouter, useRoute } from 'vue-router'
import {
  Document,
  Menu as IconMenu,
  Location,
  Grid,
  Setting,
} from '@element-plus/icons-vue'
import * as echarts from 'echarts';

// import getMap from '../api/getMap';
import cn from '../json/cn.json';

// import city from '../json/city.json';
import { computed, onMounted, ref, watch, nextTick } from 'vue';
import { useCounterStore } from '@/store/index'
import { getinfo } from '../api/getInfo';
import { gettype } from '../api/gettype';
import { getdata } from '../api/getdata';
import { storeToRefs } from 'pinia';
import { VisualMapComponent } from 'echarts/components';
import { MapChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

// 注册组件
echarts.use([VisualMapComponent, MapChart, CanvasRenderer]);
const counter = useCounterStore()
let $router = useRouter()
let chartsDOM = ref(null)
const isLoading = ref(false);

let classfiy = ["无", '台风', "无", "暴雨", "无", "冰雹", "无", "海啸", "无", "地震", "无"]

// function ToUserInfo() {
//   $router.push({
//     path: '/userinfo'
//   })
// }

// let arr = city.provinces
//获取所有城市数据
async function getalldata() {
  const data = await getdata();
  counter.citydata = data.value
}


onMounted(async () => {
  // await getdata()
  await getalldata()
  let arr = []
  for (const element of counter.citydata) {
    let obj = {}
    obj.name = element.name;
    obj.idx = classfiy[element.value]
    switch (obj.idx) {
      case "无":
        obj.value = 0
        break;
      case "台风":
        obj.value = 1
        break;
      case "暴雨":
        obj.value = 2
        break;
      case "冰雹":
        obj.value = 3
        break;
      case "海啸":
        obj.value = 4
        break;
      case "地震":
        obj.value = 5
        break;

      default:
        obj.value = 6;
        break;
    }
    arr.push(obj)
  }
  // console.log(arr)
  counter.zaihailist = arr

  //获取当前登录的用户信息
  // const data = await getinfo(localStorage.getItem("name"));

  // counter.isadm = JSON.parse(data.isadm)

  // counter.name = data.name

  var myChart = echarts.init(chartsDOM.value);

  // 显示 loading 动画
  myChart.showLoading();
  // 再得到数据的基础上，进行地图绘制
  // getMap.then(res => {
  // 得到结果后，关闭动画
  myChart.hideLoading();
  // 注册地图(数据放在axios返回对象的data中哦)

  echarts.registerMap('cn', cn);
  var option = {
    visualMap: {
      min: 0,
      max: 5,
      splitNumber: 5,
      inRange: {
        color: ['#f5e0e0', '#e50000'] // 从浅色到深色的渐变
      },
      outOfRange: {
        color: '#d3d3d3' // 超出范围的颜色
      },
      pieces: [
        { min: 0, max: 0, label: '无', color: '#FFFFFF' },
        { min: 1, max: 1, label: '台风', color: '#17FC00' },
        { min: 2, max: 2, label: '暴雨', color: '#FF0005' },
        { min: 3, max: 3, label: '冰雹', color: '#0012FF' },
        { min: 4, max: 4, label: '海啸', color: '#FC00E8' },
        { min: 5, max: 5, label: '地震', color: '#00FFFF' },
        { min: 6, max: 6, label: '暂无数据', color: '#050303' }
      ],
      outOfRange: {
        color: '#d3d3d3' // 超出范围的颜色
      }

    },


    tooltip: {
      trigger: 'item', // 或 'axis'
      formatter: function (params) {
        // 自定义格式
        if (params.data) {
          return `${params.name}<br>自然灾害: ${params.data.idx}`;

        }
      }
    },

    series: [
      {
        name: '地图',
        type: 'map',
        zoom: 1.2,
        roam: true, //支持拖拽缩放
        scaleLimit: {
          //滚轮缩放的极限控制
          min: 0.5, //缩放最小大小
          max: 100, //缩放最大大小
        },
        map: 'cn',// 这个是上面注册时的名字哦，registerMap（'这个名字保持一致'）
        label: {
          show: false,
          fontSize: 8
        },
        data: counter.zaihailist,

        itemStyle: {
          normal: {
            areaColor: '#000000',
            label: {
              show: false,
              textStyle: {
                color: "#000"
              }
            }
          },
          emphasis: {
            label: { show: true },
            areaColor: '#EA6464', // 鼠标悬停时区域的背景颜色
            borderColor: '#ff9800', // 鼠标悬停时边框颜色
            borderWidth: 1 // 鼠标悬停时边框宽度
          }
        },
      }
    ]
  };
  myChart.setOption(option);
})
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}
function logout() {
  $useRouter.push({
    path: '/login'
  })
}
</script>
<style lang="scss" scope>
.el-header,
.el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  height: 90px;
  line-height: 20px;

  span {
    font-size: 30px;
  }
}

.el-aside {
  // background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

.common-layout {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.el-container {
  height: 100%;
}

.el-row {
  height: 60px;
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;

}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.loading-overlay {
  position: fixed;
  top: 90px;
  left: 200px;
  width: 1200px;
  height: 500px;
  background: rgba(233, 238, 243, 0.8);
  // background-color: red;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  border: 8px solid #f3f3f3;
  border-radius: 50%;
  border-top: 8px solid #3498db;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>