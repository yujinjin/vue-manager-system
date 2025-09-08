<!--
 * @创建者: yujinjin9@126.com
 * @描述: 引用外链的iframe列表
-->
<template>
    <div v-show="route.name === 'external'" class="iframe-list">
        <iframe
            v-for="(iframe, index) in iframeList"
            v-show="index === showIframeIndex"
            :id="iframe.id"
            ref="iframeRefList"
            :key="iframe.id"
            :src="iframe.fullPath"
            scrolling="yes"
            frameborder="0"
            width="100%"
            height="100%"
            @load="iframeLoadEvent(index)"
            @blur="iframeBlurEvent"
        ></iframe>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { pageViewsStore } from "@/stores";
import logs from "@/services/logs";

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

const iframeLoadEvent = function (index: number) {
    logs.info("设置 IframeId：" + iframeList.value[index].id);
    iframeRefList.value[index].contentWindow?.postMessage({ eventType: "setIframeId", value: iframeList.value[index].id }, "*");
};

const iframeBlurEvent = function () {
    window.dispatchEvent(new Event("click"));
};

// 接手iframe发过来的消息
const receiveIfrmaeMessage = function (event: MessageEvent) {
    if (event.data.eventType === "openNewTabPage") {
        const beforePageIndex = pageViews.currentVisiteIndex;
        // 打开新的tab page，如果有指定pageId有传值会判断当前已经打开的 tab 页里是否存在该 ID，存在的情况展示该 tab 页,不存在就新增一个 tab 页
        pageViews.openPageByTabPage({ url: event.data.value.url, fromPageId: event.data.value.iframeId, title: event.data.value.title, pageId: event.data.value.pageId });
        if (beforePageIndex !== pageViews.currentVisiteIndex) {
            router.push(pageViews.visitedViews[pageViews.currentVisiteIndex].routePath);
        }
        logs.info(event.data);
    } else if (event.data.eventType === "closeTabPage") {
        // 关闭tab page
        const findIndex = pageViews.visitedViews.findIndex(item => item.id === event.data.value);
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
    } else if (event.data.eventType === "gotoTabPage") {
        // 跳转已经指定tab page，如果当前页面关闭成功发送true消息，如果页面已经关闭发送false消息
        const pageId = event.data.value.pageId;
        const callbackId = event.data.value.callbackId;
        const findIndex = pageViews.visitedViews.findIndex(item => item.id === pageId);
        if (findIndex === -1) {
            logs.error("当前跳转页面标识肯能会因为用户已经手动关闭的缘故导致不存在了");
        } else if (findIndex !== pageViews.currentVisiteIndex) {
            router.push(pageViews.visitedViews[findIndex].routePath);
        }
        if (callbackId) {
            const fromPageId = event.data.value.iframeId;
            const fromPageIndex = iframeList.value.findIndex(item => item.id === fromPageId);
            iframeRefList.value[fromPageIndex].contentWindow?.postMessage({ eventType: "callback", value: findIndex !== -1, callbackId }, "*");
        }
    } else if (event.data.eventType === "loginTokenExpired") {
        // 子页面发送过来消息说登录过期了，一般情况是框架去验证一遍是否真的过期了，如果没过期刷新页面重新传一下登录tonken，如果已过期就跳转到登录页重新登录就可以了
        // TODO: 这个根据自己的系统情况来实现此业务
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
