<template>
  <v-chart class="chart" :option="option" autoresize />
</template>

<script setup>
import VChart from 'vue-echarts'
import * as echarts from 'echarts'
import { use } from 'echarts/core'
import { LineChart, BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { ref, onMounted, onBeforeUnmount } from 'vue'

use([
  LineChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  CanvasRenderer
])

const props = defineProps({
  title: { type: String, required: true },
  unit: { type: String, default: '' },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  len: { type: Number, default: 30 },
  intervalMs: { type: Number, default: 5000 },
  color: { type: String, default: '#4a9eff' },

  // ✅ 新增：图表类型
  chartType: {
    type: String,
    default: 'line' // line | bar | stack
  }
})

function createTimeArray(len = 30) {
  return Array.from({ length: len }, (_, i) => {
    const date = new Date(Date.now() - (len - 1 - i) * 5 * 60000)
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
  })
}

function genInitial(len = 30, min = 0, max = 100) {
  return Array.from({ length: len }, () => Math.random() * (max - min) + min)
}

const time = ref(createTimeArray(props.len))

// ✅ 普通图数据
const data = ref(genInitial(props.len, props.min, props.max))

// ✅ 堆叠图数据（两组）
const data1 = ref(genInitial(props.len, props.min, props.max * 0.6))
const data2 = ref(genInitial(props.len, props.min, props.max * 0.4))

const option = ref({})

function updateOption() {
  let series = []

  // ✅ 1. 折线图
  if (props.chartType === 'line') {
    series = [
      {
        type: 'bar',
        data: data.value,
        barWidth: '50%',
        itemStyle: {
          color: props.color,
          borderRadius: [6, 6, 0, 0]
        }
      }
    ]
  }

  // ✅ 2. 普通柱状图
  if (props.chartType === 'bar') {
    series = [
      {
        type: 'bar',
        data: data.value,
        barWidth: '50%',
        itemStyle: {
          color: props.color,
          borderRadius: [6, 6, 0, 0]
        }
      }
    ]
  }

  // ✅ 3. 堆叠柱状图
  if (props.chartType === 'stack') {
    series = [
      {
        name: '预测A',
        type: 'bar',
        stack: 'total',
        data: data1.value,
        barWidth: '50%',
        itemStyle: { color: '#60a5fa' }
      },
      {
        name: '预测B',
        type: 'bar',
        stack: 'total',
        data: data2.value,
        itemStyle: { color: '#34d399' }
      }
    ]
  }

  option.value = {
    backgroundColor: 'transparent',
    title: {
      text: props.title,
      textStyle: { color: '#fff', fontSize: 12 },
      left: 'center',
      top: 0
    },
    grid: { left: '6%', right: '6%', top: '18%', bottom: '8%', containLabel: true },
    legend: props.chartType === 'stack'
      ? { top: 28, textStyle: { color: '#bbb', fontSize: 10 } }
      : undefined,
    xAxis: {
      type: 'category',
      data: time.value,
      axisLabel: { color: '#bbb', fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      name: props.unit || '',
      axisLabel: { color: '#bbb', fontSize: 10 }
    },
    tooltip: { trigger: 'axis' },
    series
  }
}

let timer = null
function tick() {
  // 普通数据滚动
  data.value.shift()
  data.value.push(Math.random() * (props.max - props.min) + props.min)

  // 堆叠数据滚动
  data1.value.shift()
  data2.value.shift()
  data1.value.push(Math.random() * props.max * 0.6)
  data2.value.push(Math.random() * props.max * 0.4)

  const now = new Date()
  time.value.shift()
  time.value.push(`${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`)

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
