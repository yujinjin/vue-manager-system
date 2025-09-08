<!--
 * @创建者: yujinjin9@126.com
 * @描述: html编辑器弹窗
-->
<template>
    <el-dialog v-model="dialogVisible" append-to-body destroy-on-close fullscreen :show-close="false" class="html-editor-dialog" @closed="dialogClosed">
        <template #header>
            <span>{{ title }}</span>
            <i class="svg-icon" @click="dialogClosed">
                <icon-exit-full-screen />
            </i>
        </template>
        <html-editor v-model="modelValue" />
    </el-dialog>
</template>
<script setup lang="ts">
import { ref } from "vue";
import htmlEditor from "./html-editor.vue";
import { IconExitFullScreen } from "@/components/icon-svg";

defineProps({
    title: {
        type: String,
        default: "HTML编辑器"
    }
});

// 弹窗显示状态
const dialogVisible = ref<boolean>(true);

const emits = defineEmits(["close"]);

const modelValue = defineModel({ type: String, default: "" });

// 弹窗关闭
const dialogClosed = function () {
    emits("close");
};
</script>
<style lang="scss">
.html-editor-dialog {
    .el-dialog__header {
        display: flex;
        align-content: center;
        justify-content: space-between;

        span {
            font-size: 16px;
            font-weight: 500;
        }

        i {
            font-size: 18px;
            cursor: pointer;

            &:hover {
                color: var(--el-color-primary);
            }
        }
    }

    .el-dialog__body {
        height: calc(100% - 40px);
        width: 100%;
        overflow: hidden;
    }
}
</style>
