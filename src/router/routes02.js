import DefaultLayout from "@/layouts/DefaultLayout.vue";
import LoginLayout from "@/layouts/LoginLayout.vue";

export const constantRout = [
  {
    path: '/index',
    component: DefaultLayout,
    children: [
      {
        path: '/home',
        component: () => import('@/views/HomeView.vue'),
        name: "home",
      },
      {
        path: '/data_management',
        component: () => import('@/views/MapView.vue'),
        name: "data_management",
      },
      {
        path: '/disaster_info',
        component: () => import('@/views/DisasterInfo.vue'),
        name: "disaster_info",
      },
      {
        path: '/disaster_upload',
        component: () => import('@/views/DisasterUpload.vue'),
        name: "disaster_upload",
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
        path: '/alluser',
        component: () => import('@/views/AllUser.vue'),
        name: "alluser",
        meta: {
          title: '用户管理',
          hidden: true,
        }
      },
    ],
  },
  {
    path: '/user',
    component: LoginLayout,
    children: [
      {
        path: '/login',
        component: () => import('@/views/LoginView.vue'),
        name: "login",
      },
    ],
  },
  {
    path: '/',
    redirect: '/login'
  }
]