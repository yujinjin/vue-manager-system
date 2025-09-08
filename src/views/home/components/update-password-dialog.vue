<!--
 * @创建者: yujinjin9@126.com
 * @描述: 修改密码弹窗
-->
<template>
    <dialog-form ref="dialogFormRef" :is-show="isShow" :buttons="buttons" :input-form-props="inputForm" :dialog-props="{ title: '修改密码', width: '500px' }" @close="emits('update:isShow', false)" />
</template>
<script setup lang="ts">
import { type DialogFormRef, type InputFormProps, type DialogFormButton } from "@yujinjin/cms-components";
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import systemAPI from "@api/system";
import { storageStore } from "@/stores";

defineProps({
    // 是否显示弹窗
    isShow: {
        type: Boolean,
        default: false
    }
});

const emits = defineEmits(["update:isShow"]);

const dialogFormRef = ref<DialogFormRef>();

// 存储data
const storageData = storageStore();

// 输入表单信息
const inputForm = reactive<InputFormProps>({
    fields: [
        {
            name: "userName",
            label: "用户名",
            type: "label",
            value: storageData.loginUserInfo.userName
        },
        {
            name: "password",
            label: "旧密码",
            type: "input",
            props: {
                type: "password",
                maxlength: 20
            },
            rules: [{ required: true, message: "请填写" }]
        },
        {
            name: "newPassword",
            label: "新密码",
            type: "input",
            props: {
                type: "password",
                maxlength: 20
            },
            rules: [
                { required: true, message: "请输入新密码" },
                {
                    pattern: /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s])^([0-9A-Za-z]|[^\w\s]){8,20}$/,
                    message: "密码内容长度8-20位，且必须是数字、小写字母、大写字母、特殊字符这四种组合",
                    trigger: ["blur"]
                }
            ]
        },
        {
            name: "repeatPassword",
            label: "确认密码",
            type: "input",
            props: {
                type: "password",
                maxlength: 20
            },
            rules: [
                { required: true, message: "请输入确认密码" },
                {
                    validator: function (rule, value, callback) {
                        const formValue = dialogFormRef.value!.getInputValue();
                        if (formValue.newPassword && value !== formValue.newPassword) {
                            callback(new Error("两次密码输入的不一样"));
                        } else {
                            callback();
                        }
                    }
                }
            ]
        }
    ]
});

// 底部按钮列表
const buttons = ref<DialogFormButton[]>([
    {
        contents: "取消"
    },
    {
        contents: "修改",
        type: "primary",
        click: async function (inputFormValue) {
            await dialogFormRef.value?.validate();
            await systemAPI.updateLoginPassword(inputFormValue);
            ElMessage.success("密码修改成功");
            emits("update:isShow", false);
        }
    }
]);
</script>
