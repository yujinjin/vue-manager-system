<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-12-27 14:05:50
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-12-27 15:43:57
 * @项目的路径: \vue-manager-system\src\views\system\modules\components\info-form-dialog.vue
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
    }
});

const emits = defineEmits(["update:isShow", "refresh"]);

const dialogFormRef = ref<Components.DialogFormRef>();

// 输入表单信息
const inputForm = reactive<Components.InputForm>({
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
const buttons = ref<Components.FormButton[]>([
    {
        text: "取消"
    },
    {
        text: "修改",
        props: { type: "primary" },
        click: async function (inputFormValue) {
            await dialogFormRef.value?.validate();
            await systemAPI.addOrUpdateModule(inputFormValue);
            ElMessage.success("操作");
            emits("refresh");
        }
    }
]);
</script>
