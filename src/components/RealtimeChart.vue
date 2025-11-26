<template>
  <v-chart class="chart" :option="option" autoresize />
</template>

<script setup>
import VChart from 'vue-echarts'
import * as echarts from 'echarts'
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, TitleComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { ref, onMounted, onBeforeUnmount } from 'vue'

use([LineChart, GridComponent, TooltipComponent, TitleComponent, CanvasRenderer])

const props = defineProps({
  title: { type: String, required: true },
  unit: { type: String, default: '' },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  len: { type: Number, default: 30 },
  intervalMs: { type: Number, default: 5000 },
  color: { type: String, default: '#4a9eff' }
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
const data = ref(genInitial(props.len, props.min, props.max))
const option = ref({})

function updateOption() {
  option.value = {
    backgroundColor: 'transparent',
    title: { text: props.title, textStyle: { color: '#fff', fontSize: 12 }, left: 'center', top: 6 },
    grid: { left: '6%', right: '6%', top: '18%', bottom: '8%', containLabel: true },
    xAxis: { type: 'category', data: time.value, axisLabel: { color: '#bbb', fontSize: 10 } },
    yAxis: { type: 'value', name: props.unit || '', axisLabel: { color: '#bbb', fontSize: 10 } },
    tooltip: { trigger: 'axis' },
    series: [{ type: 'line', data: data.value, smooth: true, lineStyle: { color: props.color }, areaStyle: { color: new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color: props.color.replace('#','rgba(') + ',0.28)'},{offset:1,color: props.color.replace('#','rgba(') + ',0)'}]) }, showSymbol:false }]
  }
}

let timer = null
function tick() {
  data.value.shift()
  data.value.push(Math.random() * (props.max - props.min) + props.min)
  const now = new Date()
  time.value.shift()
  time.value.push(`${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`)
  updateOption()
}

onMounted(() => { updateOption(); timer = setInterval(tick, props.intervalMs) })
onBeforeUnmount(() => { clearInterval(timer) })
</script>

<style scoped>
.chart { width: 100%; flex: 1; margin: 0; }
</style>
