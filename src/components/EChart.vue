<template>
  <div ref="chartRef" :style="chartStyle"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'

// Props
const props = defineProps({
  option: { type: Object, required: true },
  width:  { type: String, default: '100%' },
  height: { type: String, default: '400px' }
})

const chartRef = ref(null)
let chartInstance = null

// 组件 style
const chartStyle = {
  width: props.width,
  height: props.height
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(props.option)
}

// 监听 option 变化自动更新
watch(
  () => props.option,
  newOption => {
    if (chartInstance) {
      chartInstance.setOption(newOption)
    }
  },
  { deep: true }
)

// resize
const resizeChart = () => {
  chartInstance?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeChart)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  chartInstance?.dispose()
})
</script>
