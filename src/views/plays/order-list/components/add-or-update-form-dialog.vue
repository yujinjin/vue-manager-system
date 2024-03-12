<template>
    <dialog-form ref="dialogFormRef" :isShow="isShow" :buttons="buttons" :inputFormProps="inputForm" :dialogProps="{ title: '新增订单数据', width: '800px' }" @close="emits('update:isShow', false)" />
</template>
<script setup lang="ts">
import type { Components } from "/#/components";
import { ref, reactive } from "vue";
import demoAPI from "@api/demo";
import { ElMessage } from "element-plus";

defineProps({
    // 是否显示弹窗
    isShow: {
        type: Boolean,
        default: false
    }
});

const emits = defineEmits(["update:isShow", "refresh"]);

const dialogFormRef = ref<Components.DialogFormRef>();

// 输入表单信息
const inputForm = reactive<Components.InputForm>({
    columns: 2,
    fields: [
        {
            name: "orderNo",
            label: "订单号",
            rules: [{ required: true, message: "请填写订单号" }]
        },
        {
            name: "receiveMan",
            label: "收货人",
            rules: [{ required: true, message: "请填写收货人" }]
        },
        {
            name: "price",
            label: "价格"
        },
        {
            name: "receiveManTel",
            label: "收货人手机号"
        },
        {
            name: "sendMan",
            label: "购买人"
        },
        {
            name: "fromAbroad",
            label: "是否跨境",
            type: "select",
            data: [
                { label: "是", value: true },
                { label: "否", value: false }
            ]
        },
        {
            name: "tags",
            label: "标签",
            props: {
                placeholder: "标签，多个用'|'分割"
            }
        },
        {
            name: "sex",
            label: "性别",
            type: "radio",
            data: [
                { label: "男", value: 1 },
                { label: "女", value: 2 }
            ]
        },
        {
            name: "activeStatus",
            label: "状态",
            type: "select",
            data: [
                { label: "激活", value: true },
                { label: "冻结", value: false }
            ]
        },
        {
            name: "imgs",
            label: "图片",
            type: "imgUpload",
            span: 24,
            props: {
                uploadProps: {
                    multiple: true
                }
            }
        },
        {
            name: "remark",
            label: "备注",
            span: 24,
            type: "webEditor"
        }
    ]
});

// 底部按钮列表
const buttons = ref<Components.FormButton[]>([
    {
        text: "取消"
    },
    {
        text: "保存",
        props: { type: "primary" },
        click: async function (inputFormValue) {
            await dialogFormRef.value?.validate();
            await demoAPI.addOrder(inputFormValue);
            ElMessage.success("操作成功");
            emits("update:isShow", false);
            emits("refresh");
        }
    }
]);
</script>
