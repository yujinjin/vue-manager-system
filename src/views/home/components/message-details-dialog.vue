<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2024-03-14 17:04:22
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-03-14 17:49:16
 * @项目的路径: \vue-manager-system\src\views\home\components\message-details-dialog.vue
 * @描述: 站内信详细内容查看
-->
<template>
    <dialog-form ref="dialogFormRef" :isShow="true" :inputFormProps="inputForm" :dialogProps="{ title: '查看站内信', width: '600px' }" @close="emits('close')" />
</template>
<script setup lang="ts">
import type { Components } from "/#/components";
import { reactive } from "vue";

const props = defineProps({
    messageInfo: {
        type: Object
    }
});

const emits = defineEmits(["close"]);

// 输入表单信息
const inputForm = reactive<Components.InputForm>({
    value: props.messageInfo,
    fields: [
        {
            name: "created",
            label: "发送人",
            type: "label"
        },
        {
            name: "sendTime",
            label: "发送时间",
            type: "label"
        },
        {
            name: "title",
            label: "标题",
            type: "label"
        },
        {
            name: "content",
            label: "内容",
            type: "label"
        }
    ]
});
</script>
