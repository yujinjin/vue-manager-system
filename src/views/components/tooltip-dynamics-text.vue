<!--
 * @创建者: yujinjin9@126.com
 * @描述: 内容超出省略并展示提示信息
-->
<template>
    <el-tooltip v-if="content && content.length > 1" popper-class="ellipsis-tooltip-popover" effect="light" :content="content" :disabled="isDisabledTips">
        <div class="text" :style="{ '-webkit-line-clamp': lineNumber }" @mouseenter="mouseenterEvent">
            {{ content }}
        </div>
    </el-tooltip>
    <template v-else>{{ content }}</template>
</template>
<script lang="ts" setup>
import { ref } from "vue";

defineProps({
    content: {
        type: String,
        default: ""
    },
    lineNumber: {
        type: Number,
        default: 1
    } // 内容超出行数省略
});

// 是否禁用tooltip提示
const isDisabledTips = ref(true);

// 鼠标进入事件
const mouseenterEvent = function (e: MouseEvent) {
    isDisabledTips.value = (e.currentTarget as HTMLDivElement).scrollHeight <= (e.currentTarget as HTMLDivElement).clientHeight;
};
</script>
<style lang="scss" scoped>
.text {
    text-overflow: ellipsis;
    display: -webkit-box;
    white-space: initial;
    -webkit-box-orient: vertical;
    width: 100%;
    overflow: hidden;
}
</style>

<style lang="scss">
.el-popper.ellipsis-tooltip-popover {
    max-width: 500px;
    background-color: #fff;
    border: 0px;
    box-shadow:
        0px 9px 28px 8px rgba(0, 0, 0, 0.05),
        0px 6px 16px 0px rgba(0, 0, 0, 0.08),
        0px 3px 6px -4px rgba(0, 0, 0, 0.12);
    color: #121736;
    padding: 8px;
    font-weight: 400;
    color: #121736;
    font-size: 14px;
    line-height: 22px;
}
</style>
