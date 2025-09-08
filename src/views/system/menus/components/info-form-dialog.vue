<!--
 * @创建者: yujinjin9@126.com
 * @描述: 菜单新增或修改弹窗
-->
<template>
    <dialog-form
        ref="dialogFormRef"
        class="menu-info-form"
        :is-show="isShow"
        :buttons="buttons"
        :input-form-props="inputForm"
        :dialog-props="{ title: row ? '编辑菜单信息' : '新增菜单信息', width: '600px' }"
        @field-value-change="fieldValueChangeHandle"
        @close="emits('update:isShow', false)"
    >
        <template #icons="{ formValue }">
            <div class="icons-box" :class="{ empty: !formValue.icons }" @click="isShowIconsSelectDialog = true">
                <template v-if="formValue.icons">
                    <i v-if="formValue.icons?.startsWith('icomoon')" class="icon" :class="formValue.icons"></i>
                    <img v-else :src="formValue.icons" class="icons-pic" />
                    <div class="status-label">
                        <el-icon class="icon-check"><Check /></el-icon>
                        <el-icon class="icon-close" @click.stop="formValue.icons = null"><Close /></el-icon>
                    </div>
                </template>
                <el-icon v-else class="icons-uploader-icon"><Plus /></el-icon>
            </div>
        </template>
    </dialog-form>
    <icons-select-dialog v-model:is-show="isShowIconsSelectDialog" @save="updateIconHandle" />
</template>
<script setup lang="ts">
import { type InputFormProps, type DialogFormRef, type DialogFormButton, type InputFormField } from "@yujinjin/cms-components";
import { type PropType, ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { Plus, Check, Close } from "@element-plus/icons-vue";
import iconsSelectDialog from "./icons-select-dialog.vue";
import systemAPI from "@api/system";

const props = defineProps({
    // 是否显示弹窗
    isShow: {
        type: Boolean,
        default: false
    },
    row: {
        type: Object,
        default: function () {
            return null;
        }
    },
    moduleList: {
        type: Array as PropType<Record<string, any>[]>,
        default: function () {
            return [];
        }
    }
});

const emits = defineEmits(["update:isShow", "refresh"]);

// 是否显示选择图标弹窗
const isShowIconsSelectDialog = ref(false);

const dialogFormRef = ref<DialogFormRef>();

// 输入表单信息
const inputForm = reactive<InputFormProps>({
    value: props.row && JSON.parse(JSON.stringify(props.row)),
    fields: [
        {
            name: "moduleCode",
            label: "所属模块",
            type: "select",
            data: props.moduleList.map(item => ({ label: item.name + "(" + item.code + ")", value: item.code })),
            rules: [{ required: true, message: "请填写" }]
        },
        {
            name: "parentId",
            label: "父级菜单",
            type: "select",
            data: []
        },
        {
            name: "code",
            label: "编码",
            type: "input",
            props: {
                disabled: !!props.row,
                maxlength: 20
            },
            rules: [{ required: true, message: "请填写" }]
        },
        {
            name: "name",
            label: "名称",
            type: "input",
            props: {
                maxlength: 20
            },
            rules: [{ required: true, message: "请填写" }]
        },
        {
            name: "icons",
            label: "图标",
            slot: "icons"
        },
        {
            name: "url",
            label: "菜单URL",
            type: "input"
        },
        {
            name: "index",
            label: "排序",
            type: "inputNumber",
            props: {
                controls: false,
                precision: 0
            }
        },
        {
            name: "status",
            label: "状态",
            type: "radio",
            value: "0",
            data: [
                {
                    value: "0",
                    label: "正常"
                },
                {
                    value: "1",
                    label: "锁定"
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
        contents: "保存",
        type: "primary",
        click: async function (inputFormValue) {
            await dialogFormRef.value?.validate();
            await systemAPI.addOrUpdateMenu(inputFormValue);
            ElMessage.success("操作成功");
            emits("refresh");
        }
    }
]);

// 初始化父级菜单下拉选项值
const initParentSelectOptions = async function (formFields: InputFormField[], moduleCode: string) {
    if (moduleCode) {
        const moduleList = ((await systemAPI.queryMenuList({ moduleCode })) as Record<string, any>[]) || [];
        formFields.find(field => field.name === "parentId")!.data = moduleList.map(item => ({ label: item.name + "(" + item.code + ")", value: item.code }));
    } else {
        formFields.find(field => field.name === "parentId")!.data = [];
    }
};

// 表单字段变化
const fieldValueChangeHandle = async function (field: InputFormField, fieldValue: string, formFields: InputFormField[], inputValue: Record<string, any>) {
    if (field.name === "moduleCode") {
        // 所属模块数据变化
        inputValue.parentId = null;
        initParentSelectOptions(formFields, fieldValue);
    }
};

// 修改icon操作
const updateIconHandle = function (value: string) {
    dialogFormRef.value?.setInputPropertyValue("icons", value);
};

initParentSelectOptions(inputForm.fields, props.row?.moduleCode);
</script>

<style lang="scss" scoped>
.icons-box {
    width: 50px;
    height: 50px;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
    border: 1px solid var(--el-border-color);
    display: flex;
    &.empty:hover {
        border-color: var(--el-color-primary);
    }

    .icons-pic {
        object-fit: contain;
        width: 100%;
        height: 100%;
    }

    i.icon {
        width: 100%;
        height: 100%;
        line-height: 100%;
        font-size: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
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
        z-index: 1;

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

    .el-icon.icons-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100%;
        height: 100%;
        text-align: center;
    }
}
</style>
<style lang="scss">
.menu-info-form {
    .el-input-number.is-without-controls {
        .el-input__inner {
            text-align: left;
        }
    }
}
</style>
