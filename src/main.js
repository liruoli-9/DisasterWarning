import { createApp } from 'vue'
import App from '@/App.vue'
// model-viewer web component for rendering .glb/.gltf models
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import './mock'

import { createPinia } from 'pinia'
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import Region from 'v-region'

export const app = createApp(App)

const pinia = createPinia()

app.use(ElementPlus, {
  locale: zhCn,
})

app.use(pinia)
app.use(router)
app.use(Region)

app.mount('#app')

