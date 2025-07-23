<!--
 * @创建者: yujinjin9@126.com
 * @描述: 模块表单信息弹窗
-->
<template>
    <dialog-form
        ref="dialogFormRef"
        :isShow="isShow"
        :buttons="buttons"
        :inputFormProps="inputForm"
        :dialogProps="{ title: row ? '修改模块' : '新增模块', width: '600px' }"
        @close="emits('update:isShow', false)"
    />
</template>
<script setup lang="ts">
import type { DialogFormButton, DialogFormRef, InputFormProps } from "@yujinjin/cms-components";
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
    }
});

const emits = defineEmits(["update:isShow", "refresh"]);

const dialogFormRef = ref<DialogFormRef>();

// 输入表单信息
const inputForm = reactive<InputFormProps>({
    value: props.row && JSON.parse(JSON.stringify(props.row)),
    fields: [
        {
            name: "code",
            label: "模块编码",
            type: "input",
            props: {
                disabled: !!props.row,
                maxlength: 20
            },
            rules: [{ required: true, message: "请填写" }]
        },
        {
            name: "name",
            label: "模块名称",
            type: "input",
            props: {
                maxlength: 20
            },
            rules: [{ required: true, message: "请填写" }]
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
            await systemAPI.addOrUpdateModule(inputFormValue);
            ElMessage.success("操作");
            emits("refresh");
        }
    }
]);
</script>
