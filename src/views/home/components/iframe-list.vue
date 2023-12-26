<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-12-20 15:14:12
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-12-26 10:14:52
 * @项目的路径: \vue-manager-system\src\views\home\components\iframe-list.vue
 * @描述: 引用外链的iframe列表
-->
<template>
    <div class="iframe-list" v-show="route.name === 'external'">
        <iframe
            v-for="(iframe, index) in iframeList"
            v-show="index === showIframeIndex"
            ref="iframeRefList"
            :key="iframe.id"
            :id="iframe.id"
            :src="iframe.fullPath"
            scrolling="yes"
            frameborder="0"
            width="100%"
            height="100%"
            @load="iframeLoad(index)"
        ></iframe>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { pageViewsStore } from "@/stores";

const router = useRouter();

const route = useRoute();

const pageViews = pageViewsStore();

// iframe 列表
const iframeList = computed(() => {
    return pageViews.visitedViews.filter(item => item.isIframe);
});

const iframeRefList = ref<HTMLIFrameElement[]>([]);

// 可以显示的iframe 索引
const showIframeIndex = computed(() => {
    return iframeList.value.findIndex(item => item.id === pageViews.visitedViews[pageViews.currentVisiteIndex].id);
});

const iframeLoad = function (index: number) {
    logs.info(".............iframeLoad");
    iframeRefList.value[index].contentWindow?.postMessage({ eventType: "setIframeId", value: iframeList.value[index].id }, "*");
};

// 接手iframe发过来的消息
const receiveIfrmaeMessage = function (event: MessageEvent) {
    if (event.data.eventType === "openNewTabPage") {
        const beforePageIndex = pageViews.currentVisiteIndex;
        // 打开新的tab page
        pageViews.openPageByTabPage({ url: event.data.value.url, fromPageId: event.data.value.iframeId, title: event.data.value.title, pageId: event.data.value.pageId });
        if (beforePageIndex !== pageViews.currentVisiteIndex) {
            router.push(pageViews.visitedViews[pageViews.currentVisiteIndex].routePath);
        }
        logs.info(event.data);
    } else if (event.data.eventType === "closeTabPage") {
        // 关闭tab page
        const findIndex = pageViews.visitedViews.findIndex(item => item.id === event.data);
        if (findIndex === -1) {
            logs.error("当前关闭的页面标识不存在，请检查");
        } else {
            pageViews.closePageViews(findIndex);
            if (pageViews.currentVisiteIndex !== findIndex) {
                if (pageViews.currentVisiteIndex === -1) {
                    // 当前tab已经被全部关闭，去欢迎页
                    router.push({ name: "welcome" });
                } else {
                    // 打开新的路由页面
                    router.push(pageViews.visitedViews[pageViews.currentVisiteIndex].routePath);
                }
            }
        }
        logs.info(event.data);
    }
};

window.addEventListener("message", receiveIfrmaeMessage);

onUnmounted(() => {
    window.removeEventListener("message", receiveIfrmaeMessage);
});
</script>
<style lang="scss" scoped>
.iframe-list {
    flex: 1;
    background-color: #fff;
    overflow: hidden;
    position: relative;
}
</style>
