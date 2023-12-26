<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-11-14 15:21:53
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-12-19 15:29:53
 * @项目的路径: \vue-manager-system\src\views\home\components\men-text.vue
 * @描述: 侧边栏菜单名称展示
-->
<template>
    <el-tooltip effect="light" :content="menuItem!.name" placement="right" :disabled="isDisabledTips">
        <a class="menu-text" @mouseenter="mouseenterEvent" :href="routePath" @click="clickEvent">{{ menuItem!.name }}</a>
    </el-tooltip>
</template>
<script setup lang="ts">
import type { PropType } from "vue";
import { onMounted } from "vue";
import type { System } from "/#/modules/system";
import { ref } from "vue";
import type { Router } from "vue-router";
import { useRouter } from "vue-router";
import { pageViewsStore } from "@/stores";
import { isExternalLink } from "@/utils/index";
import { externalRoutePath, innerRoutePath } from "@/routers";

const props = defineProps({
    menuItem: {
        type: Object as PropType<System.MenuTree>,
        require: true
    }
});

const pageViews = pageViewsStore();

// 是否禁用提示
const isDisabledTips = ref(true);

const router: Router = useRouter();

// 路由地址
const routePath = ref();

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
