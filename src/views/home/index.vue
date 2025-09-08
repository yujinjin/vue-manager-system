<!--
 * @创建者: yujinjin9@126.com
 * @描述: 中台主页
-->
<template>
    <div class="main">
        <header-bar :menu-collapse-state="storage.menuCollapseState" :breadcrumb-names="breadcrumbNames" @toggle-menu-collapse-state="toggleMenuCollapseStateHandle" />
        <!-- 侧边栏 -->
        <side-bar :menu-collapse-state="storage.menuCollapseState" @loaded="sideBarLoadedHandle" @navigation-change="value => (breadcrumbNames = value)" />
        <div class="page-content">
            <!-- 页面tab列表 -->
            <page-tabs />
            <router-view v-slot="{ Component }">
                <keep-alive :include="cachedViews" :exclude="pageViews.excludeCacheViewNames">
                    <component :is="Component" class="page-view" />
                </keep-alive>
            </router-view>
            <!-- 引用外链的iframe列表 -->
            <iframe-list />
        </div>
        <system-tour />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { ElMessage } from "element-plus";
import { type Router, useRouter } from "vue-router";
import { type MenuTree } from "./menu-tree";
import headerBar from "./components/header-bar.vue";
import sideBar from "./components/side-bar.vue";
import pageTabs from "./components/page-tabs.vue";
import iframeList from "./components/iframe-list.vue";
import systemTour from "./components/system-tour.vue";
import { pageViewsStore, storageStore } from "@/stores";

defineOptions({
    // 在渲染该组件的对应路由被验证前调用
    beforeRouteEnter(to, from, next) {
        if (to.name === "welcome") {
            // 欢迎页正常跳转
            next();
        } else if (to.query.menuId || to.params.menuId) {
            // 当前是菜单链接，先跳转到欢迎页，检验当前用户的有该菜单的权限后才能跳转到菜单页
            next({ name: "welcome", query: { toMenuId: to.query.menuId || to.params.menuId } });
        } else {
            // 其他非法链接直接跳转到欢迎页
            next({ name: "welcome" });
        }
    }
});

const pageViews = pageViewsStore();

const storage = storageStore();

const router: Router = useRouter();

// 面包屑导航名称列表
const breadcrumbNames = ref<string[]>();

// 当前需要缓存的页面列表
const cachedViews = computed(() => {
    const routeNames: string[] = [];
    pageViews.visitedViews.forEach(item => {
        const routeName = router.resolve(item.routePath).name as string;
        if (!routeNames.includes(routeName)) {
            routeNames.push(routeName);
        }
    });
    return routeNames;
});

// 切换侧边菜单栏的折叠状态
const toggleMenuCollapseStateHandle = function () {
    storage.setMenuCollapseState(!storage.menuCollapseState);
};

// 查找菜单数据
const findMenuById = function (menuList: MenuTree[], menuId: string): null | MenuTree {
    const findMenu = menuList.find(menuItem => menuId.startsWith(menuItem.id));
    if (!findMenu) {
        return null;
    } else if (findMenu.id === menuId) {
        return findMenu;
    } else if (findMenu.childList.length === 0) {
        return null;
    }
    return findMenuById(findMenu.childList, menuId);
};

// 初始化上次固定展示的页面列表
const initLocalStoragePageViews = function (menuTreeData: MenuTree[]) {
    const menuIdList = storage.getFixedMenuData();

    if (!menuIdList || menuIdList.length === 0) {
        return;
    }

    const findMenuList: MenuTree[] = [];

    menuIdList.forEach(menuId => {
        const findMenu = findMenuById(menuTreeData, menuId);
        if (findMenu?.url && findMenu?.childList.length === 0) {
            findMenuList.push(findMenu);
        }
    });

    findMenuList.forEach(menuItem => {
        // 路由地址
        pageViews.openPageByMenu({
            id: menuItem.id,
            name: menuItem.name,
            url: menuItem.url
        });
        // 固定当前菜单地址
        pageViews.toggleFixStatus(pageViews.currentVisiteIndex);
    });

    if (findMenuList.length !== menuIdList.length) {
        // 如果当前的菜单地址有变化导致之前选择固定展示的页面不一致，这里重新保存一下
        storage.setFixedMenuData(findMenuList.map(menuItem => menuItem.id));
    }
};

// 侧边栏加载完成
const sideBarLoadedHandle = function (menuTreeData: MenuTree[]) {
    initLocalStoragePageViews(menuTreeData);
    if (pageViews.currentVisiteIndex !== 0) {
        pageViews.$patch({
            currentVisiteIndex: 0
        });
    }
    // 判断当前是否是中转页，如果是中转页则要跳转会原来的地址
    if (router.currentRoute.value.name === "welcome" && router.currentRoute.value.query.toMenuId) {
        const menuData = findMenuById(menuTreeData, router.currentRoute.value.query.toMenuId as string);
        if (menuData) {
            // 路由地址
            pageViews.openPageByMenu({
                id: menuData.id,
                name: menuData.name,
                url: menuData.url
            });
            router.replace(pageViews.visitedViews[pageViews.currentVisiteIndex].routePath);
        }
    }
};

const init = function () {
    if (window.screen.height < 768 || window.screen.width < 1366) {
        ElMessage.warning("当前管理系统屏幕分辨率最佳体验不低于1366*768!");
    }
    if (pageViews.visitedViews.findIndex(view => view.id === "welcome") === -1) {
        // 初始化欢迎页面
        pageViews.$patch(state => {
            state.visitedViews.push({
                id: "welcome",
                routePath: router.resolve({ name: "welcome" }).fullPath,
                title: "首页",
                fullPath: router.resolve({ name: "welcome" }).fullPath,
                isIframe: false,
                isFixed: true
            });
        });
    }
};

init();
</script>

<style scoped lang="scss">
.main {
    width: 100%;
    height: 100vh;
    position: relative;
    display: flex;
    min-width: 1350px;
    min-height: 600px;
    padding-top: 45px;

    .page-content {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        // .page-navbar {
        //     height: 38px;
        //     line-height: 38px;
        //     width: 100%;
        //     overflow: hidden;
        //     position: relative;
        //     z-index: 1;
        //     background-color: #fafafa;
        //     box-shadow: 4px 2px 4px 0 rgba(0, 0, 0, 0.15);
        // }

        // .page-body {
        //     flex: 1;
        //     height: 100%;
        //     background-color: #fff;
        //     overflow: hidden;
        //     display: flex;
        //     flex-direction: column;
        //     position: relative;
        //     padding-left: 8px;
        // }

        .page-view {
            flex: 1;
            background-color: #fff;
            overflow-x: hidden;
            position: relative;
        }
    }
}
</style>
