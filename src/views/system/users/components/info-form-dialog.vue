<template>
    <dialog-form
        ref="dialogFormRef"
        :isShow="isShow"
        :buttons="buttons"
        :inputFormProps="inputForm"
        :dialogProps="{ title: row ? '编辑用户信息' : '新增用户信息', width: '600px' }"
        @close="emits('update:isShow', false)"
    >
        <template #avatar="{ formValue }">
            <img-upload v-model="formValue.avatar" :uploadProps="{ showFileList: false, class: 'upload-avatar', limit: 1 }">
                <div class="avatar-box" :class="{ empty: !formValue.avatar }">
                    <template v-if="formValue.avatar">
                        <img :src="formValue.avatar" class="avatar-pic" />
                        <div class="status-label">
                            <el-icon class="icon-check"><Check /></el-icon>
                            <el-icon class="icon-close" @click.stop="formValue.avatar = null"><Close /></el-icon>
                        </div>
                    </template>
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </div>
            </img-upload>
        </template>
    </dialog-form>
</template>
<script setup lang="ts">
import type { Components } from "/#/components";
import { ref, reactive } from "vue";
import systemAPI from "@api/system";
import { ElMessage } from "element-plus";
import { Plus, Check, Close } from "@element-plus/icons-vue";

const props = defineProps({
    // 是否显示弹窗
    isShow: {
        type: Boolean,
        default: false
    },
    row: {
        type: Object
    }
});

const emits = defineEmits(["update:isShow", "refresh"]);

const dialogFormRef = ref<Components.DialogFormRef>();

// 输入表单信息
const inputForm = reactive<Components.InputForm>({
    value: props.row && JSON.parse(JSON.stringify(props.row)),
    fields: [
        {
            name: "loginName",
            label: "用户名",
            type: "input",
            props: {
                disabled: !!props.row,
                maxlength: 20
            },
            rules: [{ required: true, message: "请填写" }]
        },
        {
            name: "name",
            label: "姓名",
            type: "input",
            props: {
                maxlength: 20
            },
            rules: [{ required: true, message: "请填写" }]
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
            ]
        },
        {
            name: "avatar",
            label: "头像",
            slot: "avatar"
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
            }
        },
        {
            name: "phoneNumber",
            label: "手机号",
            type: "input",
            formItemProps: {
                rules: [
                    // { required: true, message: "请输入手机号" },
                    { pattern: /^1[3456789]\d{9}$/, message: "请输入正确格式的手机号" }
                ]
            }
        }
    ]
});

// 底部按钮列表
const buttons = ref<Components.FormButton[]>([
    {
        text: "取消"
    },
    {
        text: "修改",
        props: { type: "primary" },
        click: async function (inputFormValue) {
            await dialogFormRef.value?.validate();
            await systemAPI.addOrUpdateUser(inputFormValue);
            ElMessage.success("操作成功");
            emits("refresh");
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
