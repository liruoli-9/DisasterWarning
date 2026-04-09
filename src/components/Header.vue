<template>
  <el-row :gutter="20">
    <el-col :span="4">
      <div class="grid-content ep-bg-purple" />
    </el-col>
    <el-col :span="16">
      <div class="grid-content ep-bg-purple" />
      <span>全国自然灾害预警及资源调度系统</span>
    </el-col>
    <el-col :span="4">
      <div class="grid-content ep-bg-purple" />
      <span>{{ counter.userinfo.nickname }}</span>
      <a href="" @click="logout">退出登录</a>
    </el-col>
  </el-row>
  
</template>
<script setup lang="ts">
import {nextTick, onMounted, ref} from 'vue'
import { useCounterStore } from '@/store/index'
import { useRouter, useRoute, RouterView,RouterLink } from 'vue-router'
import { getinfo } from "../api/getInfo";
const counter = useCounterStore()
// let nickname=ref('')

onMounted(async()=>{
  const data1 = await getinfo(localStorage.getItem("username"));
  counter.userinfo=data1.value
  // counter.nickname=data1.value.nickname
})
// nickname.value=localStorage.getItem('nickname');
let $router = useRouter()
function logout() {
  $router.push({
    path: '/login'
  })
  localStorage.clear()
}
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
