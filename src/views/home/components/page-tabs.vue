<template>
    <div class="page-tabs-bar">
        <div v-if="isShowScrollDirection" class="icon-box" @click="scrollTo('left')">
            <el-icon><ArrowLeft /></el-icon>
        </div>
        <div class="page-tabs" ref="pageTabsRef">
            <div class="page-tabs-inner">
                <div
                    class="page-tab"
                    :class="{ actived: pageViews.currentVisiteIndex === index, fixed: item.isFixed }"
                    v-for="(item, index) in pageViews.visitedViews"
                    :key="item.id"
                    ref="pageTabRefs"
                    @click="showPageTab(index)"
                    @contextmenu.stop.prevent="showContextmenuHandle(index)"
                >
                    <span>{{ item.title }}</span>
                    <el-icon @click.stop.prevent="closePageViews(index)"><Close /></el-icon>
                </div>
            </div>
        </div>
        <div v-if="isShowScrollDirection" class="icon-box" @click="scrollTo('right')">
            <el-icon><ArrowRight /></el-icon>
        </div>
    </div>
    <el-popover
        v-if="pageTabRefs[tabMenuPopover.tabIndex]"
        virtual-triggering
        :virtual-ref="pageTabRefs[tabMenuPopover.tabIndex]"
        :disabled="!tabMenuPopover.isShow"
        popper-class="page-tab-menu-popper"
        v-model:visible="tabMenuPopover.isShow"
    >
        <div class="page-tab-menu" @click="tabMenuPopover.isShow = false">
            <div class="menu-item" @click="refreshPage(tabMenuPopover.tabIndex)">刷新</div>
            <div
                v-if="pageViews.visitedViews[tabMenuPopover.tabIndex].isFixed"
                class="menu-item"
                :class="{ disabled: tabMenuPopover.tabIndex === 0 }"
                @click="toggleFixStatus(tabMenuPopover.tabIndex)"
            >
                取消固定
            </div>
            <div v-else class="menu-item" :class="{ disabled: fixedNumberRunOut || !pageViews.visitedViews[tabMenuPopover.tabIndex].menuId }" @click="toggleFixStatus(tabMenuPopover.tabIndex)">
                固定展示
            </div>
            <div class="menu-item" @click="closePageViews(tabMenuPopover.tabIndex)">关闭当前</div>
            <div class="menu-item" @click="pageViews.closeOtherPageViews(tabMenuPopover.tabIndex)">关闭其他</div>
            <div class="menu-item" @click="pageViews.closeAllPageViews()">全部关闭</div>
        </div>
    </el-popover>
</template>
<script setup lang="ts">
import type { Router } from "vue-router";
import type { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll";
import BScroll from "@better-scroll/core";
import MouseWheel from "@better-scroll/mouse-wheel";
import { ArrowLeft, Close, ArrowRight } from "@element-plus/icons-vue";
import { computed, watch } from "vue";
import { onMounted, onUnmounted, reactive, ref, nextTick } from "vue";
import { debounce } from "@yujinjin/utils";
import { useRouter, useRoute } from "vue-router";
import { pageViewsStore, storageStore } from "@/stores";
import { transitRoutePath } from "@/routers";

// 全局路由对象
const router: Router = useRouter();
const route = useRoute();

// vuex
const pageViews = pageViewsStore();
const storage = storageStore();

// 固定的page 数量是否耗尽(最大6个固定，包括首页)
const fixedNumberRunOut = computed(() => {
    return pageViews.visitedViews.filter(item => item.isFixed).length >= 6;
});

// pageTab ref
const pageTabsRef = ref<HTMLDivElement>();

// page tabs ref
const pageTabRefs = ref<Array<HTMLDivElement>>([]);

// better-scroll 实例
const scrollInstance = ref<BScrollConstructor>();

// 是否显示滚动方向
const isShowScrollDirection = ref(false);

// page tab 右键菜单选项
const tabMenuPopover = reactive({
    isShow: false,
    tabIndex: -1
});

watch(
    () => pageViews.visitedViews.length,
    () => {
        refreshScroll();
    }
);

watch(
    () => route.fullPath,
    () => {
        if (pageViews.visitedViews[pageViews.currentVisiteIndex].routePath === route.fullPath) {
            return;
        }
        // 当前路由是通过浏览器的前进或后台方式来跳转的,也存在外部某个页面跳转到某个tab页
        const findIndex = pageViews.visitedViews.findIndex(item => item.routePath === route.fullPath);
        if (findIndex !== -1) {
            pageViews.$patch({ currentVisiteIndex: findIndex });
            scrollToElement(pageTabRefs.value[findIndex]);
        }
    }
);

// 显示右键菜单操作
const showContextmenuHandle = function (index: number) {
    tabMenuPopover.tabIndex = index;
    tabMenuPopover.isShow = true;
};

// 刷新scroll
const refreshScroll = async function () {
    await nextTick();
    scrollInstance.value?.refresh();
    const isShow = scrollInstance.value!.maxScrollX < 0;
    if (isShow !== isShowScrollDirection.value) {
        isShowScrollDirection.value = isShow;
        await nextTick();
        scrollInstance.value?.refresh();
    }
};

// 左右滑动
const scrollTo = function (direction: "left" | "right") {
    // scrollInstance.value?.refresh();
    // 当前移动的距离
    const moveDistance = 300;
    if (direction === "left") {
        scrollInstance.value?.scrollTo(scrollInstance.value?.x + moveDistance > 0 ? 0 : scrollInstance.value?.x + moveDistance, 0, 300);
    } else {
        scrollInstance.value?.scrollTo(scrollInstance.value?.x - moveDistance < scrollInstance.value?.maxScrollX ? scrollInstance.value?.maxScrollX : scrollInstance.value?.x - moveDistance, 0, 300);
    }
};

// 滑动到某个元素上
const scrollToElement = function (element: HTMLDivElement) {
    // 该元素距离左边的距离
    const leftDistance = element.getBoundingClientRect().left - pageTabsRef.value!.getBoundingClientRect().left;
    // 该元素距离右边的距离
    const rightDistance = pageTabsRef.value!.getBoundingClientRect().right - element.getBoundingClientRect().right;
    if (leftDistance < 150) {
        scrollInstance.value?.scrollToElement(element, 300, -150, 0);
    } else if (rightDistance < 150) {
        scrollInstance.value?.scrollToElement(element, 300, 150 - rightDistance - leftDistance, 0);
    }
};

// 关闭当前页
const closePageViews = function (index: number) {
    pageViews.closePageViews(index);
    if (pageViews.currentVisiteIndex !== index) {
        if (pageViews.currentVisiteIndex === -1) {
            // 当前tab已经被全部关闭，去欢迎页
            router.push({ name: "welcome" });
        } else {
            // 打开新的路由页面
            router.push(pageViews.visitedViews[pageViews.currentVisiteIndex].routePath);
        }
    }
};

// 显示页面tab
const showPageTab = function (index: number) {
    pageViews.$patch({ currentVisiteIndex: index });
    scrollToElement(pageTabRefs.value[index]);
    router.push(pageViews.visitedViews[index].routePath);
};

// 页面固定状态切换
const toggleFixStatus = function (index: number) {
    if (pageViews.visitedViews[tabMenuPopover.tabIndex].isFixed && index === 0) {
        // 第一个页面（欢迎页）不能取消固定
        return;
    } else if (!pageViews.visitedViews[tabMenuPopover.tabIndex].isFixed && (fixedNumberRunOut.value || !pageViews.visitedViews[tabMenuPopover.tabIndex].menuId)) {
        // 当前页面固定的数额已经用完了或者当前页面不是从菜单进入的
        return;
    }
    pageViews.toggleFixStatus(tabMenuPopover.tabIndex);
    // 保存当前固定的页面状态
    storage.setFixedMenuData(pageViews.visitedViews.filter(item => item.isFixed && item.id !== "welcome").map(item => item.menuId!));
};

// 刷新当前页面
const refreshPage = async function (index: number) {
    if (pageViews.visitedViews[index].isIframe) {
        // 刷新iframe
        (document.querySelector("iframe[id='" + pageViews.visitedViews[index].id + "']") as HTMLIFrameElement).src = pageViews.visitedViews[index].fullPath;
    } else if (index === pageViews.currentVisiteIndex) {
        // 当前正在展示的单页刷新
        router.push(transitRoutePath({ pageIndex: index }));
    } else {
        // 未展示的单页刷新，只需短暂的把keep-alive 去掉就行了
        const routePath = pageViews.visitedViews[index].routePath;
        const routeName = router.resolve(routePath).name as string;
        pageViews.insertExcludeCacheViewName(routeName);
        await nextTick();
        pageViews.deleteExcludeCacheViewName(routeName);
    }
};

// 屏幕尺寸变化事件
const resizeHandle = debounce(refreshScroll, 100);

onMounted(() => {
    BScroll.use(MouseWheel);
    scrollInstance.value = new BScroll(pageTabsRef.value!, {
        scrollX: true,
        scrollY: false,
        mouseWheel: true
    });
    refreshScroll();
    window.addEventListener("resize", resizeHandle);
});

onUnmounted(() => {
    scrollInstance.value?.destroy();
    window.removeEventListener("resize", resizeHandle);
});
</script>
<style lang="scss" scoped>
.page-tabs-bar {
    display: flex;
    width: 100%;
    overflow: hidden;
    position: relative;
    z-index: 1;
    box-shadow: 0px 2px 4px 0 rgba(0, 0, 0, 0.15);
    min-height: 32px;

    .icon-box {
        width: 35px;
        color: #999;
        display: flex;
        font-size: 15px;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        background-color: #ffffff;
        border-left: 1px solid #eee;
        border-right: 1px solid #eee;
        flex-shrink: 0;

        &:hover {
            background-color: #f2f2f2;
        }
    }

    .page-tabs {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;

        .page-tabs-inner {
            display: inline-flex;
            height: 100%;

            .page-tab {
                position: relative;
                display: inline-flex;
                padding: 0 8px;
                transition: all 0.3s ease-out 0s;
                color: #999;
                border-right: 1px solid #eeeeee;
                cursor: pointer;
                min-width: 60px;
                font-size: 12px;
                line-height: 32px;
                display: flex;
                align-items: center;
                flex-shrink: 0;

                .el-icon {
                    padding: 2px 3px;
                    display: inline-block;
                    height: auto;
                    width: auto;
                    border-radius: 50%;

                    svg {
                        transform: scale(0.8);
                    }
                }

                &:hover {
                    background-color: var(--el-color-primary-light-9);

                    .el-icon {
                        color: #999;
                        background-color: var(--el-color-info-light-9);

                        svg {
                            transform: scale(1);
                        }
                    }
                }

                &.fixed::before {
                    position: absolute;
                    content: "";
                    z-index: 1;
                    right: 4px;
                    top: 4px;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background-color: var(--el-color-primary);
                }

                &.actived {
                    color: #fff;
                    background-color: var(--el-color-primary);

                    &.fixed::before {
                        background-color: #fff;
                    }
                }

                span {
                    max-width: 220px;
                    display: inline-block;
                    white-space: nowrap;
                    word-wrap: normal;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }
    }
}

.page-tab-menu {
    line-height: 30px;
    color: #333;
    width: 120px;
    padding: 8px 0px;
    font-size: 13px;

    .menu-item {
        cursor: pointer;
        padding: 0px 20px;

        &:hover {
            background-color: var(--el-color-primary-light-9);
            color: var(--el-color-primary);
        }

        &.disabled {
            cursor: not-allowed;
            color: var(--el-disabled-text-color);
            background: none !important;
        }
    }
}
</style>
<style lang="scss">
.el-popover.el-popper.page-tab-menu-popper {
    padding: 0px;
    width: 120px !important;
    min-width: 120px;
}
</style>
