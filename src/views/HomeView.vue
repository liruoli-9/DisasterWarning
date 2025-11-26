<template>
  <div class="home-view">
    <!-- 左侧：实时数据图表（Echarts） -->
    <section class="side-panel">
      <ElCard class="data-card">
        <PoreWaterChart />
      </ElCard>

      <ElCard class="data-card">
        <RainfallChart />
      </ElCard>

      <ElCard class="data-card">
        <SoilMoistureChart />
      </ElCard>
    </section>

    <!-- 中间：3D 模型 + 视频 （2x2 网格） -->
    <section class="center-panel">
      <ElCard class="center-card">
        <!-- 3D 模型占位 -->
        <ModelViewer :model-url="assets.landslideModel"></ModelViewer>
      </ElCard>

      <ElCard class="center-card">
        <ModelViewer :model-url="assets.floodModel"></ModelViewer>
      </ElCard>

      <ElCard class="center-card">
        <ModelViewer :model-url="assets.debrisModel"></ModelViewer>
      </ElCard>

      <ElCard class="center-card">
        <!-- 卫星地图（Leaflet/Esri） -->
        <MapViewer></MapViewer>
      </ElCard>
    </section>

    <!-- 右侧：实时预测图表（Echarts） -->
    <section class="side-panel">
      <ElCard class="data-card">
        <RealtimeChart title="滑坡预测" unit="kPa" :min="40" :max="200" color="#f97316" />
      </ElCard>

      <ElCard class="data-card">
        <RealtimeChart title="洪水预测" unit="mm" :min="0" :max="200" color="#06b6d4" />
      </ElCard>

      <ElCard class="data-card">
        <RealtimeChart title="泥石流预测" unit="%" :min="0" :max="100" color="#ef4444" />
      </ElCard>
    </section>
  </div>
</template>

<script setup>
import { ElCard } from 'element-plus'
import 'element-plus/dist/index.css'

// ECharts 模块和注册（单独块，便于修改）
import { use } from 'echarts/core'
import * as echarts from 'echarts'
import VChart from 'vue-echarts'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import ModelViewer from '@/components/ModelViewer.vue'
import SatelliteMap from '@/components/SatelliteMap.vue'
import MapViewer from '@/components/MapViewer.vue'


// register required components
use([LineChart, GridComponent, TooltipComponent, TitleComponent, LegendComponent, CanvasRenderer])

// Vue reactivity
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'

// 假装的 3D 模型和视频文件（占位用）
const assets = reactive({
  landslideModel: '/models/landslide.glb',
  floodModel: '/models/flood.glb',
  debrisModel: '/models/debris.glb',
  satelliteVideo: '/videos/satellite.mp4'
})

// ----- 图表构建器：分离成小模块，便于单独修改 -----

// 生成时间轴（最近 n 个点，间隔 intervalMin 分钟）
function createTimeArray(len = 30, intervalMin = 5) {
  return Array.from({ length: len }, (_, i) => {
    const date = new Date(Date.now() - (len - 1 - i) * intervalMin * 60000)
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
  })
}

// 生成随机初始数据
function genInitialData(len = 30, min = 0, max = 100) {
  return Array.from({ length: len }, () => Math.random() * (max - min) + min)
}

// 生成单图 option（接受时间数组与数据数组）
function generateChartOption(titleLabel, dataArr, timeArr, yUnit) {
  return {
    backgroundColor: 'transparent',
    grid: { left: '8%', right: '8%', top: '18%', bottom: '10%', containLabel: true },
    title: { text: titleLabel, textStyle: { color: '#fff', fontSize: 12 }, left: 'center', top: 6 },
    xAxis: {
      type: 'category',
      data: timeArr,
      axisLabel: { fontSize: 10, color: '#bbb' },
      axisLine: { lineStyle: { color: '#333' } }
    },
    yAxis: {
      type: 'value',
      name: yUnit || '',
      nameTextStyle: { fontSize: 10, color: '#bbb' },
      axisLabel: { fontSize: 10, color: '#bbb' },
      axisLine: { lineStyle: { color: '#333' } },
      splitLine: { lineStyle: { color: '#222' } }
    },
    tooltip: { trigger: 'axis' },
    series: [
      {
        name: titleLabel,
        type: 'line',
        data: dataArr,
        smooth: true,
        lineStyle: { color: '#4a9eff', width: 2 },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(74,158,255,0.28)' },
          { offset: 1, color: 'rgba(74,158,255,0)' }
        ]) },
        itemStyle: { color: '#4a9eff', borderColor: '#fff', borderWidth: 1 },
        symbol: 'circle',
        symbolSize: 4,
        showSymbol: false
      }
    ]
  }
}

// makeRealtimeChart：为每个图创建独立的数据、时间和 option，并提供 start/stop
function makeRealtimeChart({ title, unit = '', min = 0, max = 100, len = 30, intervalMs = 5000 }) {
  const time = ref(createTimeArray(len))
  const data = ref(genInitialData(len, min, max))
  const option = ref(generateChartOption(title, data.value.slice(), time.value.slice(), unit))

  let timer = null
  function tick() {
    // 推入新值，滚动窗口
    data.value.shift()
    data.value.push(Math.random() * (max - min) + min)
    const now = new Date()
    time.value.shift()
    time.value.push(`${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`)

    // 更新 option（浅拷贝触发响应）
    option.value = generateChartOption(title, data.value.slice(), time.value.slice(), unit)
  }

  function start() {
    if (timer) return
    timer = setInterval(tick, intervalMs)
  }
  function stop() {
    if (!timer) return
    clearInterval(timer)
    timer = null
  }

  return { time, data, option, start, stop }
}

// import separated chart components
import PoreWaterChart from '@/components/PoreWaterChart.vue'
import RainfallChart from '@/components/RainfallChart.vue'
import SoilMoistureChart from '@/components/SoilMoistureChart.vue'
import RealtimeChart from '@/components/RealtimeChart.vue'

// 左侧 items 已改为独立组件（可直接在组件内修改）
const leftItems = []

// 右侧占位（保持原样，可按需替换为独立 chart 实例）
const emptyOption = generateChartOption('实时预测', [10, 30, 20], ['A', 'B', 'C'], '')
const rightItems = [
  { key: 'lp', title: '滑坡预测', option: emptyOption },
  { key: 'fp', title: '洪水预测', option: emptyOption },
  { key: 'dp', title: '泥石流预测', option: emptyOption }
]
</script>

<style scoped>
.home-view {
  display: flex;
  height: 90vh;
  background: #0a1a2f;
  color: #fff;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
}

.side-panel {
  width: 20%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 10px;
  background: rgba(20,40,80,0.7);
  box-sizing: border-box;
}


.center-panel {
  width: 60%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 1fr;
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
}

.data-card, .center-card {
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  text-align: center;
  padding: 12px; /* ensure content has internal spacing */
  display: flex;
  flex-direction: column;
  min-height: 0; /* allow proper flex child sizing inside grid */
}

/* legacy: .center-row removed - grid handles layout */

.chart {
  width: 90%;
  height: 150px;
  margin: 10px auto;
}

.model, .video {
  width: 100%;
  flex: 1; /* fill remaining card height */
  min-height: 0; /* allow proper flex/grid sizing */
  height: 100%;
  margin: 0;
  background: #111;
  border-radius: 8px;
  object-fit: contain;
}

h3 {
  font-size: 1.1rem;
  margin-bottom: 10px;
}
</style>
