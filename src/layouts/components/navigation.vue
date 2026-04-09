<template>
  <el-row class="tac">
    <el-col :span="24">
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-menu-item index="1" @click="to_home">
          <el-icon>
            <Grid />
          </el-icon>
          <span>
            自然灾害大屏
            <!-- <RouterLink :to="{ name: 'bigscreen' }">自然灾害大屏</RouterLink> -->
          </span>
        </el-menu-item>
         <!-- <el-menu-item index="2" @click="to_datamanagement">
          <el-icon><icon-menu /></el-icon>
          <span >数据平台</span>
        </el-menu-item> -->
        <el-menu-item index="3" @click="to_disasterinfo">
          <el-icon><icon-menu /></el-icon>
          <span >灾情信息</span>
        </el-menu-item>
        <el-menu-item index="4" @click="to_disasterupload">
          <el-icon><Upload /></el-icon>
          <span >灾情上报</span>
        </el-menu-item>
        <el-menu-item index="5" @click="to_Request">
          <el-icon><Checked /></el-icon>
          <span >物资申请</span>
        </el-menu-item>
        <el-menu-item index="6" @click="to_alluser">
          <el-icon><Checked /></el-icon>
          <span >用户管理</span>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
  import {
    Document,
    Menu as IconMenu,
    Location,
    Grid,
    Setting,
    Checked,
    Files,
    Upload,
    QuestionFilled
  } from "@element-plus/icons-vue";
  import { useCounterStore } from "@/store/index";
  import { useRouter, useRoute, RouterView, RouterLink } from "vue-router";
  let $router = useRouter();
  const counter = useCounterStore();

  function to_datamanagement(){
    $router.push({
      path:'/data_management'
    })
  }
  function to_home(){
    $router.push({
      path:'/home'
    })
  }
  function to_alluser(){
    
    $router.push({
      path:'/alluser'
    })
  }
  function to_disasterinfo(){
    
    $router.push({
      path:'/disaster_info'
    })
  }
  function to_Request(){
    $router.push({
      path:'/my_request'
    })
  }
  function to_disasterupload(){
    $router.push({
      path:'/disaster_upload'
    })
  }
  const handleOpen = (key, keyPath) => {
    console.log(key, keyPath);
  };
  const handleClose = (key, keyPath) => {
    console.log(key, keyPath);
  };
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
