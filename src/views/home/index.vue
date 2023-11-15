<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-12-19 14:21:12
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-11-15 10:35:10
 * @项目的路径: \vue-manager-system\src\views\home\index.vue
 * @描述: 中台主页
-->
<template>
    <div class="main">
        <header-bar :menuCollapseState="menuCollapseState" @toggleMenuCollapseState="menuCollapseState = !menuCollapseState" />
        <div class="page-content">
            <!-- 侧边栏 -->
            <div></div>
            <!-- 页面tab列表 -->
            <div></div>
            <!-- <keep-alive :include="$store.state.pageTabs.cachedViews">
                <router-view :key="routeKey" class="page-body"></router-view>
            </keep-alive> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import { ref } from "vue";
import headerBar from "./components/header-bar.vue";

// 菜单折叠的状态
const menuCollapseState = ref(false);

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
    if (window.screen.height < 768 || window.screen.width < 1366) {
        ElMessage.warning("当前管理系统屏幕分辨率最佳体验不低于1366*768!");
    }
};

init();
</script>

<style scoped lang="less">
.main {
    width: 100%;
    height: 100vh;
    position: relative;
    display: flex;
    min-width: 1360px;
    min-height: 650px;
    padding-top: 45px;

    .page-content {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .page-navbar {
            height: 38px;
            line-height: 38px;
            width: 100%;
            overflow: hidden;
            position: relative;
            z-index: 1;
            background-color: #fafafa;
            box-shadow: 4px 2px 4px 0 rgba(0, 0, 0, 0.15);
        }

        .page-body {
            flex: 1;
            height: 100%;
            background-color: #fff;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            position: relative;
            padding-left: 8px;
        }
    }
}
</style>
