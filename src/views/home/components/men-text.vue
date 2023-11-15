<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-11-14 15:21:53
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-11-14 16:08:13
 * @项目的路径: \vue-manager-system\src\views\home\components\men-text.vue
 * @描述: 侧边栏菜单名称展示
-->
<template>
    <el-tooltip effect="light" :content="menuItem!.name" placement="right" :disabled="isDisabledTips">
        <a class="menu-text" @mouseenter="mouseenterEvent" :href="getLink()" @click.stop.prevent>{{ menuItem!.name }}</a>
    </el-tooltip>
</template>
<script setup lang="ts">
import type { PropType } from "vue";
import type { System } from "/#/modules/system";
import { ref } from "vue";
import { isExternalLink } from "@/utils/index";

const props = defineProps({
    menuItem: {
        type: Object as PropType<System.MenuTree>,
        require: true
    }
});

// 是否禁用提示
const isDisabledTips = ref(true);

// 获取菜单链接
const getLink = function () {
    if (props.menuItem!.url && props.menuItem!.childList.length === 0) {
        return isExternalLink(props.menuItem!.url) ? "/external/" + props.menuItem!.id : props.menuItem!.url;
    }
};

// 鼠标移动上去判断是否需要显示提示语
const mouseenterEvent = function (e: MouseEvent) {
    isDisabledTips.value = (e.currentTarget as HTMLElement).scrollWidth <= (e.currentTarget as HTMLElement).clientWidth;
};
</script>
<style lang="less" scoped>
.menu-text {
    width: 100%;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    overflow: hidden;
    -ms-text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    -webkit-text-overflow: ellipsis;
    text-overflow: ellipsis;
}
</style>
