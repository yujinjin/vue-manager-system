<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2024-01-10 15:05:55
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-01-10 15:16:47
 * @项目的路径: \vue-manager-system\src\views\system\roles\components\info-form-dialog.vue
 * @描述: 角色信息弹窗
-->
<template>
    <dialog-form
        ref="dialogFormRef"
        :isShow="isShow"
        :buttons="buttons"
        :inputFormProps="inputForm"
        :dialogProps="{ title: row ? '编辑角色信息' : '新增角色信息', width: '600px' }"
        @close="emits('update:isShow', false)"
    />
</template>
<script setup lang="ts">
import type { PropType } from "vue";
import type { Components } from "/#/components";
import { ref, reactive } from "vue";
import systemAPI from "@api/system";
import { ElMessage } from "element-plus";

const props = defineProps({
    // 是否显示弹窗
    isShow: {
        type: Boolean,
        default: false
    },
    row: {
        type: Object
    },
    moduleList: {
        type: Array as PropType<Record<string, any>[]>,
        default: function () {
            return [];
        }
    }
});

const emits = defineEmits(["update:isShow", "refresh"]);

const dialogFormRef = ref<Components.DialogFormRef>();

// 输入表单信息
const inputForm = reactive<Components.InputForm>({
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
const buttons = ref<Components.FormButton[]>([
    {
        text: "取消"
    },
    {
        text: "保存",
        props: { type: "primary" },
        click: async function (inputFormValue) {
            await dialogFormRef.value?.validate();
            await systemAPI.addOrUpdateRole(inputFormValue);
            ElMessage.success("操作成功");
            emits("refresh");
        }
    }
]);
</script>
