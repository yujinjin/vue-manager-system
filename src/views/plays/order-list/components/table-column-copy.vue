<template>
    <div class="table-column-copy">
        <span class="text">{{ value || "-" }}</span>
        <el-tooltip v-if="value" effect="dark" :content="copyTips">
            <div ref="elIconRef" class="icon-box">
                <el-icon @click="copyTextHandle">
                    <DocumentCopy />
                </el-icon>
            </div>
        </el-tooltip>
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { DocumentCopy } from "@element-plus/icons-vue";
import { useClipboard } from "@vueuse/core";
import { ElMessage } from "element-plus";

const props = defineProps({
    value: {
        type: String,
        default: ""
    },
    copyTips: {
        type: String,
        default: "复制"
    }
});

const elIconRef = ref<HTMLDivElement>();

const { copy, isSupported } = useClipboard({ legacy: true });

// 复制操作
const copyTextHandle = async function () {
    if (!isSupported.value) {
        ElMessage.error("您的浏览器不支持 Clipboard API");
        return;
    }
    await copy(props.value!);
    ElMessage({
        message: "已复制.",
        type: "success"
    });
};
</script>
<style lang="scss" scoped>
.table-column-copy {
    width: 100%;
    display: flex;
    align-items: center;

    .text {
        flex: 1;
        display: -webkit-box;
        word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
    }

    .icon-box {
        padding: 2px;
        cursor: pointer;
        text-align: center;
        font-size: 16px;

        &:hover {
            color: #15c359;
        }
    }
}
</style>
