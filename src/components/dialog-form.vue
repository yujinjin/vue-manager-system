<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-01-04 10:58:05
 * @项目的路径: \vue-manager-system\src\components\dialog-form.vue
 * @描述: 头部注释配置模板
-->
<template>
    <el-dialog v-if="isShow" v-model="dialogVisible" v-bind="dialogInnerProps" @closed="dialogClosed">
        <input-form v-bind="inputFormProps" @fieldValueChange="inputFormFieldValueChange" ref="inputFormRef">
            <template v-for="name in Object.keys(slots)" #[name]="scope">
                <slot :name="name" v-bind="scope"></slot>
            </template>
        </input-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button v-for="(button, index) in actionButtons" :key="index" v-bind="button.props" @click="clickHandle(button)" :loading="button.isLoading">
                    {{ button.text }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { useSlots, ref, watch } from "vue";
import type { Ref, PropType } from "vue";
import type { DialogProps } from "element-plus";
import type { NotReadonly } from "/#/global";
import type { Components } from "/#/components";
// import { Router, useRouter } from "vue-router";
// import { storageStore, eventsStore } from "@/stores";
// 全局路由对象
// const router: Router = useRouter();
// vuex
// const storageData = storageStore();

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false
    },
    dialogProps: {
        type: Object as PropType<Partial<NotReadonly<DialogProps>>>
    },
    buttons: {
        type: Array as PropType<Components.FormButton[]>
    },
    inputFormProps: {
        type: Object as PropType<Components.InputForm>
    }
});

const emits = defineEmits(["fieldValueChange", "close"]);

// 弹窗显示状态
const dialogVisible: Ref<boolean> = ref(false);

const slots = useSlots();

const inputFormRef: Ref<null | { inputFormValue: Record<string, any> }> = ref(null);

// 弹窗内部属性
const dialogInnerProps: Ref<Partial<NotReadonly<DialogProps>>> = ref({});

// 实际数据列中的操作按钮列表
// isLoading: 当前按钮是否正在加载
// handleCode: 用户操作CODE
// text: 按钮操作文案
// click: 按钮点击事件
const actionButtons: Ref<Components.FormButton[]> = ref([]);

// 初始化操作按钮列表
const initActionButtons = function () {
    if (!props.buttons || props.buttons.length === 0) {
        return;
    }
    actionButtons.value = [];
    props.buttons.forEach(button => {
        if (button.isShow !== false) {
            button = Object.assign({ isLoading: false }, button);
            button.props = Object.assign({}, button.props);
            actionButtons.value.push(button);
        }
    });
};

// 弹窗关闭
const dialogClosed = function () {
    emits("close");
};

const inputFormFieldValueChange = function (field: Components.InputFormField, fieldValue: any, formFields: Components.InputFormField[]) {
    emits("fieldValueChange", field, fieldValue, formFields);
};

// 按钮点击操作
const clickHandle = async function (button) {
    if (button.isLoading) {
        return;
    }
    button.isLoading = true;
    let canColse = true;
    try {
        if (button.click) {
            canColse = await button.click(inputFormRef.value!.inputFormValue, button);
        }
    } catch (error) {
        logs.error(error);
    }
    button.isLoading = false;
    if (canColse !== false) {
        dialogVisible.value = false;
    }
};

watch(
    () => props.isShow,
    value => {
        if (value) {
            dialogVisible.value = true;
        }
    }
);

watch(
    () => props.dialogProps,
    () => {
        dialogInnerProps.value = Object.assign(
            {
                class: "dialog-form",
                closeOnClickModal: false
            },
            props.dialogProps
        );
    },
    { immediate: true, deep: true }
);

watch(
    () => props.buttons,
    () => {
        initActionButtons();
    },
    { deep: true, immediate: true }
);
</script>
<style lang="less" scoped>
.dialog-form {
}
</style>
