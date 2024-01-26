<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-12-07 18:48:46
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-01-22 15:03:26
 * @项目的路径: \vue-manager-system\src\components\table\table-column-image.vue
 * @描述: 图片数据列
-->
<template>
    <div class="table-column-img">
        <div class="no-image" v-if="!previewImgList || previewImgList.length === 0">没有图片</div>
        <template v-else>
            <el-image v-for="(img, index) in previewImgList" @click="initialIndex = index" :key="img + '_' + index" :src="img" :initial-index="initialIndex" :preview-src-list="previewImgList" fit="contain" :preview-teleported="true">
                <template #error>
                    <div class="error-box">
                        <el-icon><Picture /></el-icon>
                    </div>
                </template>
            </el-image>
        </template>
    </div>
</template>
<script setup lang="ts">
import type { PropType } from "vue";
import { ref, computed } from "vue";
import { Picture } from "@element-plus/icons-vue";

// TODO: 支持SVGA 图片格式
const props = defineProps({
    value: {
        type: [String, Array] as PropType<string | Array<string>>
    },
    // value 是string,分隔符传值才有效
    separator: {
        type: String
    }
});

// 图片预览列表
const previewImgList = computed<string[]>(() => {
    if (!props.value) return [];
    if (Array.isArray(props.value)) {
        return props.value;
    }
    return props.separator ? props.value.split(props.separator) : [props.value];
});

// 初始预览图像索引
const initialIndex = ref(0);

</script>
<style lang="less" scoped>
.table-column-img {
    height: 50px;
    display: flex;
    overflow: hidden;
    width: 100%;
    .no-image {
        height: 50px;
        width: 60px;
        border-radius: 4px;
        background: #f5f7fa;
        color: #909399;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
    }

    .el-image {
        height: 50px;
        flex-shrink: 0;

        &:not(:first-child) {
            margin-left: 4px;
        }
    }
}
</style>
