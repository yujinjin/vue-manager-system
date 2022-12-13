<template>
    <img alt="Vue logo" src="@/assets/logo.png" />
    <HelloWorld msg="Hello Vue 3 + Vite" />
</template>

<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from "@/views/components/HelloWorld.vue";
import { onMounted, onUnmounted } from "vue";

// 初始化菜单列表
const initUserMenuList = function () {
    // TODO: 实现
};

// 初始化上次固定展示的页面列表
const initLocalStoragePageViews = function () {
    // TODO: 实现
};

const init = function () {
    initUserMenuList();
    initLocalStoragePageViews();
};

init();

onMounted(() => {
    console.info("App onMounted");
});

onUnmounted(() => {
    console.info("App onUnmounted");
});
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
