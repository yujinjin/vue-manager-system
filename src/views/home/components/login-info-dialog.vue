<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-11-15 17:02:53
 * @项目的路径: \vue-manager-system\src\views\home\components\login-info-dialog.vue
 * @描述: 登录用户信息弹窗
-->
<template>
    <dialog-form :isShow="isShow" ref="dialogFormRef" :buttons="buttons" :inputFormProps="inputForm" :dialogProps="dialogProps" @close="emits('update:isShow', false)">
        <template #avatar="{ field }">
            <img-upload v-model="field.value" :uploadProps="{ showFileList: false, class: 'upload-avatar' }" :cropperProps="true">
                <div class="avatar-box" :class="{ empty: !field.value }">
                    <template v-if="field.value">
                        <img :src="field.value" class="avatar-pic" />
                        <div class="status-label">
                            <el-icon class="icon-check"><Check /></el-icon>
                            <el-icon class="icon-close" @click.stop="field.value = null"><Close /></el-icon>
                        </div>
                    </template>
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </div>
            </img-upload>
        </template>
    </dialog-form>
</template>
<script setup lang="ts">
import type { Ref } from "vue";
import type { Components } from "/#/components";
import type { DialogProps } from "element-plus";
import type { NotReadonly } from "/#/global";
import { ref, reactive } from "vue";
import { storageStore } from "@/stores";
import { Plus, Check, Close } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import systemAPI from "@api/system";

defineProps({
    // 是否显示弹窗
    isShow: {
        type: Boolean,
        default: false
    }
});

const emits = defineEmits(["update:isShow"]);

const dialogFormRef = ref<Components.DialogFormRef>();

// 存储data
const storageData = storageStore();

// 弹窗属性
const dialogProps = reactive<Partial<NotReadonly<DialogProps>>>({
    title: "修改用户信息"
});

// 输入表单信息
const inputForm = reactive<Components.InputForm>({
    fields: [
        {
            name: "userName",
            label: "用户名",
            type: "label",
            value: storageData.loginUserInfo.userName
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
                    { pattern: /^1[3456789]\d{9}$/, message: "请输入正确格式的手机号" }
                ]
            },
            value: storageData.loginUserInfo.phoneNumber
        }
    ]
});

// 底部按钮列表
const buttons: Ref<Components.FormButton[]> = ref([
    {
        text: "取消"
    },
    {
        text: "修改",
        props: { type: "primary" },
        click: async function (inputFormValue) {
            await dialogFormRef.value?.validate();
            await systemAPI.updateLoginUserInfo(inputFormValue);
            // 这里更新一下store中登录的用户信息（根据实际业务考虑也更新一下本地localstorage存储的用户信息，这里就不做更新了）
            storageData.$patch(state => {
                state.loginUserInfo.avatar = inputFormValue.avatar;
                state.loginUserInfo.email = inputFormValue.email;
                state.loginUserInfo.phoneNumber = inputFormValue.phoneNumber;
                state.loginUserInfo.gender = inputFormValue.gender;
            });
            ElMessage.success("用户信息修改成功");
        }
    }
]);
</script>
<style lang="scss" scoped>
:deep(.upload-avatar) {
    .avatar-box {
        width: 100px;
        height: 100px;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
        border: 1px solid var(--el-border-color);
        &.empty:hover {
            border-color: var(--el-color-primary);
        }

        .avatar-pic {
            object-fit: contain;
            width: 100%;
            height: 100%;
        }

        .status-label {
            right: -15px;
            top: -6px;
            width: 40px;
            height: 24px;
            background: var(--el-color-primary);
            text-align: center;
            transform: rotate(45deg);
            position: absolute;
            line-height: inherit;
            justify-content: center;
            align-items: center;
            transition: opacity var(--el-transition-duration);

            i {
                font-size: 12px;
                margin-top: 11px;
                transform: rotate(-45deg);
                color: #fff;
            }

            i.icon-close {
                display: none;
            }

            &:hover {
                background-color: rgba(0, 0, 0, 0.5);
                i.icon-check {
                    display: none;
                }

                i.icon-close {
                    display: inline-flex;
                }
            }
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 100%;
            height: 100%;
            text-align: center;
        }
    }
}
</style>
