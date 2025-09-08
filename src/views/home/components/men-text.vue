<!--
 * @创建者: yujinjin9@126.com
 * @描述: 侧边栏菜单名称展示
-->
<template>
    <el-tooltip effect="light" :content="menuItem!.name" placement="right" :disabled="isDisabledTips">
        <a class="menu-text" :href="menuHref" @mouseenter="mouseenterEvent" @click="clickEvent">{{ menuItem!.name }}</a>
    </el-tooltip>
</template>
<script setup lang="ts">
import { type PropType } from "vue";
import { computed, onMounted, ref } from "vue";

import { type Router } from "vue-router";
import { useRouter } from "vue-router";
import { type MenuTree } from "../menu-tree";
import config from "@/config";
import { pageViewsStore } from "@/stores";
import { isExternalLink, externalRoutePath, innerRoutePath } from "@/utils/index";

const props = defineProps({
    menuItem: {
        type: Object as PropType<MenuTree>,
        require: true,
        default: () => ({})
    }
});

const pageViews = pageViewsStore();

// 是否禁用提示
const isDisabledTips = ref(true);

const router: Router = useRouter();

// 路由地址
const routePath = ref<string | undefined>();

// 当前菜单a标签显示的外部链接
const menuHref = computed<string | undefined>(() => {
    if (!routePath.value) {
        return routePath.value;
    }
    return config.projectContentPath + (config.isWebHash ? "/#" : "") + routePath.value;
});

// 是否外链
const externalLink = ref(true);

// 点击事件
const clickEvent = function (e: Event) {
    if (!routePath.value) {
        return;
    }
    e.stopPropagation();
    e.preventDefault();
    router.push(routePath.value);
    pageViews.openPageByMenu({
        id: props.menuItem!.id,
        name: props.menuItem!.name,
        url: props.menuItem!.url,
        routePath: routePath.value!,
        externalLink: externalLink.value
    });
};

// 鼠标移动上去判断是否需要显示提示语
const mouseenterEvent = function (e: MouseEvent) {
    isDisabledTips.value = (e.currentTarget as HTMLElement).scrollWidth <= (e.currentTarget as HTMLElement).clientWidth;
};

onMounted(() => {
    if (props.menuItem?.url && props.menuItem?.childList.length === 0) {
        if (isExternalLink(props.menuItem!.url)) {
            routePath.value = externalRoutePath({ menuId: props.menuItem!.id });
        } else {
            externalLink.value = false;
            routePath.value = innerRoutePath(props.menuItem!.url, { menuId: props.menuItem!.id });
        }
    }
});
</script>
