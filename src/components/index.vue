<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <!-- <el-row :gutter="20">
          <el-col :span="4">
            <div class="grid-content ep-bg-purple" />
          </el-col>
          <el-col :span="16">
            <div class="grid-content ep-bg-purple" />
            <span>全国自然灾害预警及资源调度系统</span>
          </el-col>
          <el-col :span="4">
            <div class="grid-content ep-bg-purple" />
            <span>{{ counter.name }}</span>
            <a href="" @click="logout">退出登录</a>
          </el-col>
        </el-row> -->
        <Header></Header>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <Navigation></Navigation>
        </el-aside>
        <el-container>
          <el-main>
            <RouterView v-if="isRouterAlive"></RouterView>
            
            <!-- <div v-if="isLoading" class="loading-overlay">
              <div class="loading-spinner"></div>
            </div>
            <div style="width:1200px;height:500px;" ref="chartsDOM"></div> -->
            <!-- <BigCreen></BigCreen> -->
          </el-main>
          <el-footer>Footer</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
  import { useRouter, useRoute, RouterView, RouterLink } from "vue-router";
  import BigCreen from "./BigCreen.vue";
  import Navigation from "./Navigation.vue";
  import {
    Document,
    Menu as IconMenu,
    Location,
    Grid,
    Setting,
  } from "@element-plus/icons-vue";
  import * as echarts from "echarts";
  // import getMap from '../api/getMap';
  import cn from "../json/cn.json";
  import Header from "./Header.vue";
  // import city from '../json/city.json';
  import { computed, onMounted, ref, watch, nextTick, provide } from "vue";
  import { useCounterStore } from "@/store/index";
  import { getinfo } from "../api/getInfo";
  import { gettype } from "../api/gettype";
  import { getdata } from "../api/getdata";
  import { storeToRefs } from "pinia";
  import { VisualMapComponent } from "echarts/components";
  import { MapChart } from "echarts/charts";
  import { CanvasRenderer } from "echarts/renderers";

  // 注册组件
  echarts.use([VisualMapComponent, MapChart, CanvasRenderer]);
  const counter = useCounterStore();
  provide("reloadApp", reloadApp);
  let isRouterAlive = ref(true);
  let $router = useRouter();
  // function ToUserInfo() {
  //   $router.push({
  //     path: '/userinfo'
  //   })
  // }
  function reloadApp() {
    isRouterAlive.value = false;
    nextTick(() => {
      isRouterAlive.value = true;
    });
  }

  onMounted(async () => {
    const data = await getinfo(localStorage.getItem("username"));
    // console.log(data)
    counter.isadm = JSON.parse(data.value.isadm);
    counter.name = data.name;
    localStorage.setItem("isadm", JSON.parse(data.value.isadm));
  });
  const handleOpen = (key, keyPath) => {
    console.log(key, keyPath);
  };
  const handleClose = (key, keyPath) => {
    console.log(key, keyPath);
  };
  // function logout() {
  //   $useRouter.push({
  //     path: '/login'
  //   })
  // }
</script>
<style lang="scss" scope>
  .el-header,
  .el-footer {
    background-color: #b3c0d1;
    color: #333;
    text-align: center;
    height: 90px;
    line-height: 20px;

    span {
      font-size: 30px;
    }
  }

  .el-aside {
    // background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #e9eef3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  .common-layout {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .el-container {
    height: 100%;
  }

  .el-row {
    height: 60px;
    margin-bottom: 20px;
  }

  .el-row:last-child {
    margin-bottom: 0;
  }

  .el-col {
    border-radius: 4px;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .loading-overlay {
    position: fixed;
    top: 90px;
    left: 200px;
    width: 1200px;
    height: 500px;
    background: rgba(233, 238, 243, 0.8);
    // background-color: red;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  .loading-spinner {
    border: 8px solid #f3f3f3;
    border-radius: 50%;
    border-top: 8px solid #3498db;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
</style>