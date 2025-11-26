// src/router/guards.js
import { ElMessage } from 'element-plus'

// 白名单 - 不需要登录就可以访问的页面
const whiteList = ['/login', '/register', '/forgot-password']

// 检查是否已登录
export function checkLogin() {
  const token = localStorage.getItem('username')
  
  return !!(token)
}

// 路由守卫
export function createRouterGuard(router) {
  router.beforeEach((to, from, next) => {
    console.log('🔐 路由守卫检查:', to.path)
    
    const isLoggedIn = checkLogin()
    
    // 需要登录的页面
    if (!isLoggedIn) {
    }
    
    next()
  })
  
  router.afterEach((to) => {
    console.log('✅ 成功访问:', to.path)
  })
}