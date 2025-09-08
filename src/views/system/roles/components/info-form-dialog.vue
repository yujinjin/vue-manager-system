<!--
 * @创建者: yujinjin9@126.com
 * @描述: 角色信息弹窗
-->
<template>
    <dialog-form
        ref="dialogFormRef"
        :is-show="isShow"
        :buttons="buttons"
        :input-form-props="inputForm"
        :dialog-props="{ title: row ? '编辑角色信息' : '新增角色信息', width: '600px' }"
        @close="emits('update:isShow', false)"
    />
</template>
<script setup lang="ts">
import { type DialogFormButton, type DialogFormRef, type InputFormProps } from "@yujinjin/cms-components";
import { type PropType, ref, reactive } from "vue";
import { ElMessage } from "element-plus";
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

const dialogFormRef = ref<DialogFormRef>();

// 输入表单信息
const inputForm = reactive<InputFormProps>({
    value: props.row && JSON.parse(JSON.stringify(props.row)),
    fields: [
        {
            name: "moduleCode",
            label: "所属模块",
            type: "select",
            data: props.moduleList.map(item => ({ label: item.name, value: item.code })),
            rules: [{ required: true, message: "请填写" }]
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
            formItemProps: {
                rules: [{ required: true, message: "请填写" }]
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
            await systemAPI.addOrUpdateRole(inputFormValue);
            ElMessage.success("操作成功");
            emits("refresh");
        }
    }
]);
</script>
