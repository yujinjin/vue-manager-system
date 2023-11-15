<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-12-07 18:46:03
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-10-27 11:47:02
 * @项目的路径: \vue-manager-system\src\components\table\table-column-date.vue
 * @描述: 日期格式化数据列
-->
<template>
    <div class="table-column-date">{{ dateText }}</div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { dateFormat } from "@yujinjin/utils";

const props = defineProps({
    // 日期值
    value: {
        type: [String, Number, Array]
    },
    // 日期格式化字符串
    formate: {
        type: String,
        default: "YYYY-MM-DD"
    },
    // 分隔符，多个value时用到
    separator: {
        type: String,
        default: "-"
    }
});

const dateText = computed(() => {
    if (!props.value) {
        return "-";
    }
    if (Object.prototype.toString.call(props.value) === "[object Array]") {
        return (props.value as Array<string>).map(item => (item ? dateFormat(item, props.formate) : "")).join(props.separator);
    } 
        return props.value ? dateFormat(props.value as number | string, props.formate) : "-";
    
});
</script>
<style lang="less" scoped>
.table-column-date {
}
</style>
