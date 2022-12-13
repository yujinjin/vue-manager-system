<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-12-07 18:48:46
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2022-12-13 09:43:44
 * @项目的路径: \vue-manager-system\src\components\table\table-column-img.vue
 * @描述: 图片数据列
-->
<template>
    <div class="table-column-img">
        <el-image :src="value" :preview-src-list="imgList" fit="contain">
            <template #error>
                <div class="image-slot">
                    <el-icon v-if="value"><icon-picture /></el-icon>
                    <span v-else>没有图片</span>
                </div>
            </template>
        </el-image>
    </div>
</template>
<script setup lang="ts">
import { computed } from "vue";

// TODO: 支持SVGA 图片格式
const props = defineProps({
    value: {
        type: String
    }
});

const imgList = computed(() => {
    return props.value ? [props.value] : null;
});
</script>
<style lang="less" scoped>
.table-column-img {
}
</style>
