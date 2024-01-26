<template>
    <div class="table-column-copy">
        <span class="text">{{ value || "-" }}</span>
        <el-tooltip v-if="value" effect="dark" :content="copyTips">
            <div class="icon-box" ref="elIconRef">
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
import Clipboard from "clipboard";
import { ElMessage } from "element-plus";

const props = defineProps({
    value: {
        type: String
    },
    copyTips: {
        type: String,
        default: "复制"
    }
});

const elIconRef = ref<HTMLDivElement>();

// 复制操作
const copyTextHandle = function () {
    const clipboard = new Clipboard(elIconRef.value!, {
        text: function () {
            return props.value!;
        }
    });
    clipboard.on("success", () => {
        ElMessage({
            message: "复制成功",
            type: "success",
            duration: 1000
        })
        clipboard.destroy();
    });
    clipboard.on("error", () => {
        ElMessage.error("复制失败");
        clipboard.destroy();
    });
}
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