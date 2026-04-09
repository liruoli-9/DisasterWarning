//对外暴露路由
export const constantRout = [
  {
    path: '/login',
    component: () => import('@/views/LoginView.vue'),
    name: "login",
    meta: {
      title: '登录',
      hidden: true,
    }
  },
  {
    path: '/index',
    component: () => import('@/components/index.vue'),
    name: "index",
    meta: {
      title: '首页',
      hidden: true,
    },
    children:[
      {
        path: '/userinfo',
        component: () => import('@/components/UserInfo.vue'),
        name: "userinfo",
        meta: {
          title: '用户信息',
          hidden: true,
        }
      },
      {
        path: '/alluser',
        component: () => import('@/components/AllUser.vue'),
        name: "alluser",
        meta: {
          title: '所有用户',
          hidden: true,
        }
      },
      {
        path: '/bigscreen',
        component: () => import('@/components/BigCreen.vue'),
        name: "bigscreen",
        meta: {
          title: '大屏展示',
          hidden: true,
          requiresAuth: true // 需要登录
        }
      },
      {
        path: '/disaster_info',
        component: () => import('@/components/DisasterInfo.vue'),
        name: "disaster_info",
        meta: {
          title: '灾情信息',
          hidden: true,
        }
      },
      {
        path: '/material_requisition',
        component: () => import('@/components/MaterialRequisition.vue'),
        name: "material_requisition",
        meta: {
          title: '物资申请',
          hidden: true,
        }
      },
      {
        path: '/my_request',
        component: () => import('@/components/My_request.vue'),
        name: "my_request",
        meta: {
          title: '我的申请',
          hidden: true,
        }
      },
      {
        path: '/all_request',
        component: () => import('@/components/All_Request.vue'),
        name: "all_request",
        meta: {
          title: '全部申请',
          hidden: true,
        }
      },
      {
        path: '/disaster_report',
        component: () => import('@/components/Disaster_Report.vue'),
        name: "disaster_report",
        meta: {
          title: '灾情上报',
          hidden: true,
        }
      },
      {
        path: '/disaster_audit',
        component: () => import('@/components/Disaster_audit.vue'),
        name: "disaster_audit",
        meta: {
          title: '灾情审核',
          hidden: true,
        }
      }

    ]
  },
  
  {
    path: '/',
    redirect:'/login'
  },


]