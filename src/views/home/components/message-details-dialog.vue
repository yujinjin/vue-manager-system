<!--
 * @创建者: yujinjin9@126.com
 * @描述: 站内信详细内容查看
-->
<template>
    <dialog-form ref="dialogFormRef" :is-show="true" :input-form-props="inputForm" :dialog-props="{ title: '查看站内信', width: '600px' }" @close="emits('close')" />
</template>
<script setup lang="ts">
import { type InputFormProps } from "@yujinjin/cms-components";
import { reactive } from "vue";

const props = defineProps({
    messageInfo: {
        type: Object,
        default: () => ({})
    }
});

const emits = defineEmits(["close"]);

// 输入表单信息
const inputForm = reactive<InputFormProps>({
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
