<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-01-04 15:28:44
 * @项目的路径: \vue-manager-system\src\views\home\components\login-info-dialog.vue
 * @描述: 登录用户信息弹窗
-->
<template>
    <dialog-form :isShow="isShow" :buttons="buttons" :inputFormProps="inputForm">
        <template #avatar="{ field }">
            <img-upload v-model="field.value" :cropperProps="true">
                <img v-if="field.value" :src="field.value" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </img-upload>
        </template>
    </dialog-form>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import type { Ref } from "vue";
import type { Components } from "/#/components";
import { storageStore } from "@/stores";
import { Plus } from "@element-plus/icons-vue";
import systemAPI from "@api/system";

defineProps({
    // 是否显示弹窗
    isShow: {
        type: Boolean,
        default: false
    }
});

// 存储data
const storageData = storageStore();

// 输入表单信息
const inputForm = reactive({
    dialogProps: {
        title: "修改用户信息"
    },
    fields: [
        {
            name: "userName",
            label: "用户名",
            type: "label",
            value: storageData.loginUserInfo.userName
        },
        {
            name: "avatar",
            label: "头像",
            slot: "avatar",
            value: storageData.loginUserInfo.avatar
        },
        {
            name: "email",
            label: "EMAIL",
            type: "input",
            formItemProps: {
                rules: [
                    { required: true, message: "请输入EMAIL" },
                    { type: "email", message: "请输入正确格式的邮箱" }
                ]
            },
            value: storageData.loginUserInfo.email
        },
        {
            name: "phoneNumber",
            label: "手机号",
            type: "input",
            formItemProps: {
                rules: [
                    { required: true, message: "请输入手机号" },
                    { pattern: /1[3456789]\d{9}/, message: "请输入正确格式的手机号" }
                ]
            },
            value: storageData.loginUserInfo.email
        },
        {
            name: "gender",
            label: "性别",
            type: "radio",
            data: [
                {
                    value: "1",
                    label: "男"
                },
                {
                    value: "2",
                    label: "女"
                }
            ],
            value: storageData.loginUserInfo.gender
        }
    ]
} as Components.InputForm);

// 底部按钮列表
const buttons: Ref<Components.FormButton[]> = ref([
    {
        text: "取消"
    },
    {
        text: "修改",
        props: { type: "primary" },
        click: async function (inputFormValue) {
            await systemAPI.updateLoginUserInfo(inputFormValue);
            storageData.$patch(state => {
                state.loginUserInfo.avatar = inputFormValue.avatar;
                state.loginUserInfo.email = inputFormValue.email;
                state.loginUserInfo.phoneNumber = inputFormValue.phoneNumber;
                state.loginUserInfo.gender = inputFormValue.gender;
            });
        }
    }
] as Components.FormButton[]);
</script>
<style lang="less" scoped>
.login-info-dialog {
}
</style>
