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

    <!-- 中间：单视频卡片（占满 2x2 网格） -->
    <section class="center-panel">
      <ElCard class="center-card fullspan video-card">
        <div class="video-container">
          <video
            ref="satVideo"
            class="video"
            :src="assets.satelliteVideo"
            controls
            autoplay
            muted
            loop
            playsinline
          ></video>
        </div>

        <div class="video-info">
          <div class="info-left">
            <VChart :options="speedOption" :option="speedOption" class="speed-chart" />
          </div>

          <div class="info-right">
            <div class="carousel-body" :class="{ 'overlay-debug': overlayDebug }">
              <ElTable
                :data="carouselRows"
                class="carousel-table"
                :highlight-current-row="false"
                style="width: 100%"
              >
                <ElTableColumn prop="time" label="时间" width="100" />
                <ElTableColumn prop="source" label="来源" width="70" />
                <ElTableColumn prop="risk" label="风险" width="70" />
                <ElTableColumn prop="normal" label="是否正常" width="90">
                  <template #default="{ row }">
                    {{ row.normal ? '正常' : '异常' }}
                  </template>
                </ElTableColumn>
              </ElTable>
            </div>
          </div>
        </div>
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
import { ElCard, ElTable, ElTableColumn } from 'element-plus'
import 'element-plus/dist/index.css'

// ECharts 模块和注册（单独块，便于修改）
import { use } from 'echarts/core'
import * as echarts from 'echarts'
import VChart from 'vue-echarts'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import myvideo from '@/assets/videos/predict.mp4'
// replaced multiple model/map viewers with a single video card



// register required components
use([LineChart, GridComponent, TooltipComponent, TitleComponent, LegendComponent, CanvasRenderer])

// Vue reactivity
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
// 假装的 3D 模型和视频文件（占位用）
const assets = reactive({
  landslideModel: '/models/landslide.glb',
  floodModel: '/models/flood.glb',
  debrisModel: '/models/debris.glb',
  satelliteVideo: myvideo
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

// 生成专用速度图 option（固定 y 轴 0-200，紧凑布局）
function generateSpeedOption(titleLabel, dataArr, timeArr, yUnit) {
  return {
    backgroundColor: 'transparent',
    grid: { left: '6%', right: '6%', top: '20%', bottom: '14%', containLabel: true },
    title: { text: titleLabel, textStyle: { color: '#fff', fontSize: 10 }, left: 'center', top: 2 },
    xAxis: {
      type: 'category',
      data: timeArr,
      axisLabel: { fontSize: 9, color: '#bbb', interval: 'auto' },
      axisLine: { lineStyle: { color: '#333' } }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 200,
      name: yUnit || '',
      nameTextStyle: { fontSize: 9, color: '#bbb' },
      axisLabel: { fontSize: 9, color: '#bbb' },
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
        itemStyle: { color: '#4a9eff' },
        symbol: 'none',
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

// 左侧 items 已改为独立组件（可直接在组件内修改）
// import separated chart components
import PoreWaterChart from '@/components/PoreWaterChart.vue'
import RainfallChart from '@/components/RainfallChart.vue'
import SoilMoistureChart from '@/components/SoilMoistureChart.vue'
import RealtimeChart from '@/components/RealtimeChart.vue'

const leftItems = []

// video ref and helpers
const satVideo = ref(null)

// demo data (speed cycle + carousel)
import demo, { speedCycle as demoSpeedCycle, generateCarousel } from '@/mock/demoData.js'
const demoCarousel = generateCarousel(6)

// debug overlay toggle for carousel
const overlayDebug = ref(true)

// chart (速度) and carousel (轮播表) state
const cycleLen = 15 // 15 "minutes" per cycle (mapped to seconds for demo)
const progress = ref(0)
const speedOption = ref(generateSpeedOption('列车速度', Array.from({ length: cycleLen }, () => 0), Array.from({ length: cycleLen }, (_, i) => `${i}`), 'km/h'))

function getSpeedAt(p) {
  // p in [0, cycleLen)
  if (p < 4) {
    return 180 * (p / 4)
  }
  if (p < 13) {
    return 180
  }
  // decelerate over last 2
  return 180 * (1 - (p - 13) / 2)
}

function updateSpeedOption() {
  const data = []
  const labels = []
  for (let i = progress.value - (cycleLen - 1); i <= progress.value; i++) {
    const idx = ((i % cycleLen) + cycleLen) % cycleLen
    data.push(getSpeedAt(idx))
    labels.push(`${idx}`)
  }
  speedOption.value = generateSpeedOption('列车速度 (km/h)', data, labels, 'km/h')
}

// carousel rows and updating
const carouselRows = ref([])
let rowId = 1
const sources = ['无人机', '传感节点', '卫星']
const highlightIndex = ref(0)

function sampleRisk() {
  const r = Math.random()
  if (r < 0.98) return '低'
  if (r < 0.999) return '中'
  return '高'
}

function pushCarouselRow() {
  const risk = sampleRisk()
  const normal = risk !== '高'
  carouselRows.value.unshift({
    id: rowId++,
    time: new Date().toLocaleTimeString(),
    source: sources[Math.floor(Math.random() * sources.length)],
    risk,
    normal
  })
  console.debug('[HomeView] pushCarouselRow ->', carouselRows.value[0])
  // keep last 8 entries
  if (carouselRows.value.length > 8) carouselRows.value.pop()
}

let masterInterval = null
onMounted(() => {
  // try to autoplay
  if (satVideo.value && typeof satVideo.value.play === 'function') {
    const p = satVideo.value.play()
    if (p && p.catch) p.catch(() => {})
  }

  // seed initial rows from demo data for consistent demo
  carouselRows.value = demoCarousel.slice().reverse()
  console.debug('[HomeView] initial carouselRows', carouselRows.value)
  // set progress so last element corresponds to cycle position 0
  progress.value = 0
  // initialize speed chart using demo cycle
  speedOption.value = generateSpeedOption('列车速度 (km/h)', demoSpeedCycle.slice(), Array.from({ length: demoSpeedCycle.length }, (_, i) => `${i}`), 'km/h')

  masterInterval = setInterval(() => {
    progress.value = progress.value + 1
    updateSpeedOption()
    pushCarouselRow()
    highlightIndex.value = (highlightIndex.value + 1) % Math.max(1, carouselRows.value.length)
  }, 1000) // 1s == 1 minute for demo
})

onBeforeUnmount(() => {
  if (masterInterval) clearInterval(masterInterval)
})

function enterFullscreen() {
  const el = satVideo.value ? satVideo.value.parentElement : null
  if (el && el.requestFullscreen) el.requestFullscreen()
}

function snapshot() {
  const v = satVideo.value
  if (!v) return
  const w = v.videoWidth || v.clientWidth
  const h = v.videoHeight || v.clientHeight
  if (!w || !h) {
    alert('视频尚未准备好，稍后再试。')
    return
  }
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.drawImage(v, 0, 0, w, h)
  const data = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = data
  a.download = 'snapshot.png'
  a.click()
}

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

.center-card.fullspan {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  padding: 8px;
}

.video-card {
  padding: 0; /* video container will handle spacing */
  position: relative; /* allow overlay positioned inside card */
  display: flex;
  flex-direction: column;
  height: 100%;
}

.video-container {
  display: block;
  flex: 0 0 60%; /* video takes ~60% of card height */
}

.video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #000;
  position: relative;
  z-index: 1;
  display: block;
}

.video-info {
  display: flex;
  gap: 12px;
  padding: 12px;
  box-sizing: border-box;
  background: rgba(0,0,0,0.45);
  color: #fff;
  position: relative;
  z-index: 2;
  flex: 1 1 auto; /* fill remaining height under video */
  align-items: stretch;
}


.video-info .controls button {
  margin-left: 8px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.12);
  color: #fff;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.video-info .controls button:hover {
  background: rgba(255,255,255,0.04);
}

.info-left {
  flex: 1 1 60%;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.info-right {
  line-height: 10px;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  top:-2rem;
}
.speed-chart {
  /* make speed chart flexible so carousel can also grow */
  height: auto;
  flex: 1 1 45%;
  min-height: 200px;
}
.speed-fallback {
  margin-top: 6px;
  font-size: 12px;
  color: #ddd;
}
.right-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  padding: 2px 0 6px 0;
}
.right-controls button {
  margin-left: 6px;
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255,255,255,0.08);
  padding: 4px 6px;
  border-radius: 4px;
}
.carousel-body {
  flex: 1 1 45%;
  overflow: auto;
  /* top:-1px; */;
}

.carousel-table {
  border-radius: 8px;
  line-height: 10px;
  overflow: hidden;
}

/* ElTable dark theme overrides */
.carousel-table :deep(.el-table) {
  background-color: transparent;
  border: 0;
  border-radius: 8px;
  overflow: hidden;
}

.carousel-table :deep(.el-table__header) {
  background-color: transparent;
}

.carousel-table :deep(.el-table__header th) {
  background-color: rgba(100,150,150,0.25);
  color: #6fa8a8;
  font-weight: 500;
  border-bottom: 1px solid rgba(100,150,150,0.12);
}

.carousel-table :deep(.el-table__header th:first-child) {
  border-radius: 8px 0 0 0;
}

.carousel-table :deep(.el-table__header th:last-child) {
  border-radius: 0 8px 0 0;
}

.carousel-table :deep(.el-table__body td) {
  border-bottom: 1px solid rgba(100,150,150,0.08);
  color: #5a8989;
  padding: 6px 8px;
  white-space: nowrap;
}

.carousel-table :deep(.el-table__row) {
  background-color: rgba(100,150,150,0.1);
}

.carousel-table :deep(.el-table__row:last-child td) {
  border-bottom: none;
}

.carousel-table :deep(.el-table__row:last-child td:first-child) {
  border-radius: 0 0 0 8px;
}

.carousel-table :deep(.el-table__row:last-child td:last-child) {
  border-radius: 0 0 8px 0;
}

.carousel-table :deep(.el-table__row:hover > td) {
  background-color: rgba(100,150,150,0.12) !important;
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
