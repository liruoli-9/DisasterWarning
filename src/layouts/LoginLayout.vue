<template>
    <div class="login-layout">
        <el-container>
            <el-header>
                <Header></Header>
            </el-header>
            <el-main>
                <RouterView></RouterView>
            </el-main>
        </el-container>
    </div>
</template>
<script setup>
import { useRouter, useRoute, RouterView } from "vue-router";
import Header from "./components/header.vue";
</script>
<style scoped>
.login-layout {
    height: 100dvh;
    padding: 0%;
}
.el-main {
  margin: 0;
  padding: 0;
}
.el-header {
  margin: 0;
  padding: 0;
}
</style>