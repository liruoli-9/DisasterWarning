import { createRouter, createWebHashHistory } from "vue-router"
import { constantRout } from '../router/routes02'
import { createRouterGuard } from "./guard"

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRout,
  scrollBehavior() {
    return {
      left: 0,
      top: 0
    }
  }
})

// 添加路由守卫
createRouterGuard(router)
export default router