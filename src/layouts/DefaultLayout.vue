<template>
    <div class="default-layout">
        <el-container>
            <el-header>
                <Header></Header>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <Navigation></Navigation>
                </el-aside>
                <el-container>
                    <el-main>
                        <RouterView></RouterView>
                    </el-main>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>
<script setup>
    import { useRouter, useRoute, RouterView } from "vue-router";
    import Navigation from "./components/navigation.vue";
    import Header from "./components/header.vue";
    import { provide, ref } from "vue";
    let isRouterAlive = ref(true);
    let $router = useRouter();
    provide("reloadApp", reloadApp);
    function reloadApp() {
        isRouterAlive.value = false;
        setTimeout(() => {
            isRouterAlive.value = true;
        }, 0);
    }
</script>
<style lang="scss" scope>
    .default-layout {
        height: 96vh;
        width: 100vw;
    }
</style>