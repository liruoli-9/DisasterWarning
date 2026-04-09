<template>
  <v-chart class="chart" :option="option" autoresize />
</template>

<script setup>
import VChart from 'vue-echarts'
import * as echarts from 'echarts'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'   // ✅ ① 改为 BarChart
import { GridComponent, TooltipComponent, TitleComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { ref, onMounted, onBeforeUnmount } from 'vue'

use([
  BarChart,           
  GridComponent,
  TooltipComponent,
  TitleComponent,
  CanvasRenderer
])

const props = defineProps({
  intervalMs: { type: Number, default: 5000 },
  len: { type: Number, default: 30 }
})

function createTimeArray(len = 30) {
  return Array.from({ length: len }, (_, i) => {
    const date = new Date(Date.now() - (len - 1 - i) * 5 * 60000)
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
  })
}

function genInitial(len = 30, min = 0, max = 50) {
  return Array.from({ length: len }, () => Math.random() * (max - min) + min)
}

const time = ref(createTimeArray(props.len))
const data = ref(genInitial(props.len, 0, 50))
const option = ref({})

function updateOption() {
  option.value = {
    backgroundColor: 'transparent',
    title: {
      text: '降雨量 (mm)',
      textStyle: { color: '#fff', fontSize: 12 },
      left: 'center',
      top: 6
    },
    grid: {
      left: '6%',
      right: '6%',
      top: '18%',
      bottom: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: time.value,
      axisLabel: { color: '#bbb', fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      name: 'mm',
      axisLabel: { color: '#bbb', fontSize: 10 }
    },
    tooltip: { trigger: 'axis' },

    
    series: [
      {
        type: 'bar',
        data: data.value,
        barWidth: '50%',
        itemStyle: {
          color: '#4ae88a',
          borderRadius: [6, 6, 0, 0]
        }
      }
    ]
  }
}

let timer = null
function tick() {
  data.value.shift()
  data.value.push(Math.random() * 50)

  const now = new Date()
  time.value.shift()
  time.value.push(
    `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
  )

  updateOption()
}

onMounted(() => {
  updateOption()
  timer = setInterval(tick, props.intervalMs)
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.chart {
  width: 100%;
  flex: 1;
  margin: 0;
}
</style>
