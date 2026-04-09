// Demo data generator for HomeView.vue
// Exports: generateCarousel(n), speedCycle (15-step array per spec)

function getSpeedAt(p) {
  // p in [0,14]
  if (p < 4) return 180 * (p / 4)
  if (p < 13) return 180
  return 180 * (1 - (p - 13) / 2)
}

export const speedCycle = Array.from({ length: 15 }, (_, i) => getSpeedAt(i))

export const sources = ['无人机', '传感节点', '卫星']

function sampleRisk() {
  const r = Math.random()
  if (r < 0.98) return '低'
  if (r < 0.999) return '中'
  return '高'
}

export function generateCarousel(n = 8) {
  const rows = []
  for (let i = 0; i < n; i++) {
    const risk = sampleRisk()
    rows.push({
      id: i + 1,
      time: new Date(Date.now() - (n - i) * 60000).toLocaleTimeString(),
      source: sources[Math.floor(Math.random() * sources.length)],
      risk,
      normal: risk !== '高'
    })
  }
  return rows
}

export default {
  speedCycle,
  generateCarousel
}
