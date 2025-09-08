<template>
    <dialog-form
        ref="dialogFormRef"
        :is-show="isShow"
        :buttons="buttons"
        :input-form-props="inputForm"
        :dialog-props="{ title: '新增订单数据', width: '800px' }"
        @close="emits('update:isShow', false)"
    >
        <template #remark="{ formValue }">
            <web-editor v-model="formValue.remark">
                <el-tooltip content="全屏源码编辑">
                    <i class="svg-icon full-screen-icon" @click.stop.prevent="toggleHtmlEditorDialogShowStatus(true)">
                        <icon-full-screen />
                    </i>
                </el-tooltip>
            </web-editor>
        </template>
    </dialog-form>
    <html-editor-dialog v-if="isShowHtmlEditorDialog" v-model="htmlEditorValue" @close="toggleHtmlEditorDialogShowStatus(false)" />
</template>
<script setup lang="ts">
import { type DialogFormRef, type InputFormProps, type DialogFormButton } from "@yujinjin/cms-components";
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import demoAPI from "@api/demo";
import htmlEditorDialog from "@views/components/html-editor-dialog.vue";
import { IconFullScreen } from "@/components/icon-svg";

defineProps({
    // 是否显示弹窗
    isShow: {
        type: Boolean,
        default: false
    }
});

const emits = defineEmits(["update:isShow", "refresh"]);

const dialogFormRef = ref<DialogFormRef>();

// 是否显示HTML编辑器弹窗
const isShowHtmlEditorDialog = ref(false);

// html编辑器值
const htmlEditorValue = ref("");

// 输入表单信息
const inputForm = reactive<InputFormProps>({
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
                },
                uploadRequest: () => ""
            }
        },
        {
            name: "remark",
            label: "备注",
            slot: "remark",
            span: 24
            // type: "webEditor"
        }
    ]
});

// 底部按钮列表
const buttons = ref<DialogFormButton[]>([
    {
        contents: "取消"
    },
    {
        contents: "保存",
        type: "primary",
        click: async function (inputFormValue) {
            await dialogFormRef.value?.validate();
            await demoAPI.addOrder(inputFormValue);
            ElMessage.success("操作成功");
            emits("update:isShow", false);
            emits("refresh");
        }
    }
]);

// 切换HTML编辑器弹窗显示状态
const toggleHtmlEditorDialogShowStatus = function (isShow: boolean) {
    if (isShow) {
        htmlEditorValue.value = dialogFormRef.value?.getInputValue()?.remark;
    } else {
        dialogFormRef.value?.setInputPropertyValue("remark", htmlEditorValue.value);
    }
    isShowHtmlEditorDialog.value = isShow;
};
</script>
<style lang="scss" scoped>
.full-screen-icon {
    position: absolute;
    bottom: 1px;
    right: 1px;
    z-index: 99;
    cursor: pointer;
    font-size: 16px;
    line-height: 16px;
    height: 16px;
    width: 16px;
    color: #999;

    &:hover {
        color: var(--el-color-primary);
    }
}
</style>
