<!--
 * @创建者: yujinjin9@126.com
 * @描述: 中台中转页面（主要用来刷新当前正在展示的单页）
-->
<template>
    <div class="transit"></div>
</template>
<script setup lang="ts">
import { nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { pageViewsStore } from "@/stores";

// 全局路由对象
const router = useRouter();
const route = useRoute();

// vuex
const pageViews = pageViewsStore();

const init = async function () {
    if (route.query.fromPageIndex) {
        // 如果是来自指定的页面索引，这里去除缓存再跳转
        const index = parseInt(route.query.fromPageIndex as string, 10);
        const routePath = pageViews.visitedViews[index].routePath;
        const routeName = router.resolve(routePath).name as string;
        pageViews.insertExcludeCacheViewName(routeName);
        await nextTick();
        router.replace(routePath);
        pageViews.deleteExcludeCacheViewName(routeName);
    } else if (route.query.fromPagePath) {
        // 如果直接指定跳转页面
        router.replace(route.query.fromPagePath as string);
    }
};

init();
</script>
