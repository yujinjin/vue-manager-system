<template>
    <dialog-form
        ref="dialogFormRef"
        :isShow="isShow"
        :buttons="buttons"
        :inputFormProps="inputForm"
        :dialogProps="{ title: '发送站内信', width: '600px' }"
        @fieldValueChange="fieldValueChangeHandle"
        @close="emits('update:isShow', false)"
    />
</template>
<script setup lang="ts">
import type { PropType } from "vue";
import type { Components } from "/#/components";
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import systemAPI from "@api/system";
import { HANDLE_CODES } from "@/services/constants";

const props = defineProps({
    // 是否显示弹窗
    isShow: {
        type: Boolean,
        default: false
    },
    moduleList: {
        type: Array as PropType<Record<string, any>[]>,
        default: function () {
            return [];
        }
    },
    roleList: {
        type: Array as PropType<Record<string, any>[]>,
        default: function () {
            return [];
        }
    },
    actionType: {
        type: String
    },
    row: {
        type: Object
    }
});

const emits = defineEmits(["update:isShow", "refresh"]);

const dialogFormRef = ref<Components.DialogFormRef>();

// 输入表单信息
const inputForm = reactive<Components.InputForm>({
    value: Object.assign({}, props.row, { roles: props.row?.roles ? props.row?.roles.split(",") : [] }),
    props: {
        disabled: props.actionType === HANDLE_CODES.VIEW
    },
    fields: [
        {
            name: "moduleCode",
            label: "所属模块",
            type: "select",
            data: props.moduleList.map(item => ({ label: item.name + "(" + item.code + ")", value: item.code }))
        },
        {
            name: "roles",
            label: "角色",
            type: "select",
            props: {
                multiple: true
            },
            data: props.roleList.map(item => ({ label: item.name + "(" + item.code + ")", value: item.code }))
        },
        {
            name: "title",
            label: "标题",
            type: "input",
            props: {
                maxlength: 20
            },
            rules: [{ required: true, message: "请填写" }]
        },
        {
            name: "content",
            label: "内容",
            type: "input",
            props: {
                rows: 4,
                type: "textarea"
            },
            rules: [{ required: true, message: "请填写" }]
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
            if (inputFormValue.roles) {
                inputFormValue.roles = inputFormValue.roles.join(",");
            }
            await systemAPI.insertMessage(inputFormValue);
            ElMessage.success("操作成功");
            emits("refresh");
        }
    }
]);
// 表单字段变化
const fieldValueChangeHandle = async function (field: Components.InputFormField, fieldValue: string, formFields: Components.InputFormField[], inputValue: Record<string, any>) {
    if (field.name === "moduleCode") {
        // 所属模块数据变化
        inputValue.roles = [];
        if (fieldValue) {
            formFields.find(field => field.name === "roles")!.data = props.roleList
                .filter(item => item.moduleCode === fieldValue)
                .map(item => ({ label: item.name + "(" + item.code + ")", value: item.code }));
        } else {
            formFields.find(field => field.name === "roles")!.data = [];
        }
    }
};
</script>
