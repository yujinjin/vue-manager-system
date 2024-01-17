<template>
    <div class="transit"></div>
</template>
<script setup lang="ts">
import { nextTick } from "vue";
import { useRouter } from "vue-router";
import { pageViewsStore } from "@/stores";
import { useRoute } from "vue-router";

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
        pageViews.visitedViews[index].routePath = route.fullPath;
        await nextTick();
        pageViews.visitedViews[index].routePath = routePath;
        router.replace(routePath);
    } else if (route.query.fromPagePath) {
        // 如果直接指定跳转页面
        router.replace(route.query.fromPagePath as string);
    }
};

init();
</script>
<style lang="scss" scoped>
.external {
}
</style>
