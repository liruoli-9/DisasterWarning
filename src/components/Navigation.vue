<template>
  <el-row class="tac">
    <el-col :span="24">
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-menu-item index="1" @click="to_bigscreen">
          <el-icon>
            <Grid />
          </el-icon>
          <span>
            自然灾害大屏
            <!-- <RouterLink :to="{ name: 'bigscreen' }">自然灾害大屏</RouterLink> -->
          </span>
        </el-menu-item>
        <el-menu-item index="2" @click="to_disasterinfo">
          <el-icon><icon-menu /></el-icon>
          <span >灾情信息</span>
        </el-menu-item>
        <el-menu-item index="3" @click="to_disasterreport">
          <el-icon><Upload /></el-icon>
          <span >灾情上报</span>
        </el-menu-item>
        <el-menu-item index="4" @click="to_disasteraudit">
          <el-icon><QuestionFilled /></el-icon>
          <span >灾情审核</span>
        </el-menu-item>
        <el-menu-item index="5" @click="to_MaterialRequisition">
          <el-icon>
            <document />
          </el-icon>
          <span >物资申请</span>
        </el-menu-item>
        <el-menu-item index="6" @click="to_MyRequest">
          <el-icon><Checked /></el-icon>
          <span >我的申请</span>
        </el-menu-item>
        <el-menu-item v-if="counter.isadm" index="7" @click="to_AllRequest">
          <el-icon><Files /></el-icon>
          <span >全部申请</span>
        </el-menu-item>
        <el-sub-menu index="8">
          <template #title>
            <el-icon>
              <location />
            </el-icon>
            <span>用户管理</span>
          </template>
          <el-menu-item-group title="用户管理">
            <el-menu-item index="8-1" @click="to_userinfo">
              <span >用户信息</span>
              <!-- <RouterLink :to="{ name: 'userinfo' }">用户信息</RouterLink> -->
              <!-- <router-link to="/userinfo">
                        
                      </router-link> -->
            </el-menu-item>
            <!-- <el-menu-item index="4-2">item two</el-menu-item> -->
          </el-menu-item-group>
          <el-menu-item-group title="管理员管理" v-if="counter.isadm">
            <el-menu-item index="8-3" @click="to_alluser">
              <!-- <RouterLink :to="{ name: 'alluser' }">所有用户</RouterLink> -->
              <span >所有用户</span>
            </el-menu-item>
            <el-menu-item index="8-4">用户权限</el-menu-item>
          </el-menu-item-group>
          <!-- <el-sub-menu index="4-4">
                    <template #title>item four</template>
                    <el-menu-item index="4-4-1">item one</el-menu-item>
                  </el-sub-menu> -->
        </el-sub-menu>
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
  function to_bigscreen(){
    
    $router.push({
      path:'/bigscreen'
    })
  }
  function to_alluser(){
    
    $router.push({
      path:'/alluser'
    })
  }
  function to_userinfo(){
    
    $router.push({
      path:'/userinfo'
    })
  }
  function to_disasterinfo(){
    
    $router.push({
      path:'/disaster_info'
    })
  }
  function to_MaterialRequisition(){
    
    $router.push({
      path:'/material_requisition'
    })
  }
  function to_MyRequest(){
    $router.push({
      path:'/my_request'
    })
  }
  function to_AllRequest(){
    $router.push({
      path:'/all_request'
    })
  }
  function to_disasterreport(){
    $router.push({
      path:'/disaster_report'
    })
  }
  function to_disasteraudit(){
    $router.push({
      path:'/disaster_audit'
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
