<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-01-25 21:15:10
 * @项目的路径: \vue-manager-system\src\components\dialog-form.vue
 * @描述: form 弹窗组件
-->
<template>
    <el-dialog v-if="isShow" v-model="dialogVisible" v-bind="dialogInnerProps" class="common-dialog form-dialog" @closed="dialogClosed">
        <input-form v-bind="inputFormProps" @fieldValueChange="inputFormFieldValueChange" ref="inputFormRef">
            <template v-for="name in Object.keys(slots)" #[name]="scope">
                <slot :name="name" v-bind="scope"></slot>
            </template>
        </input-form>
        <template #footer>
            <div class="dialog-footer">
                <template v-for="(button, index) in actionButtons">
                    <slot v-if="button.slot" :name="button.slot" :button="button"></slot>
                    <el-button v-else :key="index" v-bind="button.props" @click="clickHandle(button)" :loading="button.isLoading">
                        <template v-if="button.icon">
                            <i v-if="typeof button.icon === 'string'" :class="[button.icon]"></i>
                            <el-icon v-else><component :is="button.icon" /></el-icon>
                        </template>
                        {{ button.text }}
                    </el-button>
                </template>
            </div>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { useSlots, ref, watch } from "vue";
import type { Ref, PropType } from "vue";
import type { DialogProps, FormValidateCallback } from "element-plus";
import type { NotReadonly } from "/#/global";
import type { Components } from "/#/components";

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

const inputFormRef = ref<Components.InputFormRef>();

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

const inputFormFieldValueChange = function (field: Components.InputFormField, fieldValue: any, formFields: Components.InputFormField[], inputValue: Record<string, any>) {
    emits("fieldValueChange", field, fieldValue, formFields, inputValue);
};

// 按钮点击操作
const clickHandle = async function (button) {
    if (button.isLoading) {
        return;
    }
    button.isLoading = true;
    let canClose = true;
    try {
        if (button.click) {
            canClose = await button.click(inputFormRef.value!.getInputValue(), inputFormRef.value!.getFormRef(), button);
        }
    } catch (error) {
        canClose = false;
        logs.error(error);
    }
    button.isLoading = false;
    if (canClose !== false) {
        dialogVisible.value = false;
    }
};

watch(
    () => props.isShow,
    value => {
        if (value) {
            dialogVisible.value = true;
            dialogInnerProps.value = Object.assign(
                {
                    closeOnClickModal: false,
                    appendToBody: true,
                    destroyOnClose: true,
                    width: "750px"
                },
                props.dialogProps
            );
        }
    },
    {
        immediate: true
    }
);

watch(
    () => props.buttons,
    () => {
        initActionButtons();
    },
    { deep: true, immediate: true }
);

defineExpose<Components.DialogFormRef>({
    // 获取表单的value
    getInputValue: function () {
        return inputFormRef.value?.getInputValue() || {};
    },

    /**
     * 设置表单的属性值
     * @param propertyName 属性名
     * @param value 属性值
     */
    setInputPropertyValue: function (propertyName: string, value: any) {
        inputFormRef.value?.setInputPropertyValue(propertyName, value);
    },

    // 修改当前form字段的属性
    changeFormFields: function (callback: (formFields: Components.InputFormField[]) => void) {
        return inputFormRef.value?.changeFormFields(callback);
    },
    // 修改当前生成的button按钮值
    changeButtons: function (callback: (actionButtons: Components.FormButton[]) => void) {
        if (callback && typeof callback === "function") {
            callback(actionButtons.value);
        } else {
            logs.warn("callback 必须是一个函数");
        }
    },
    // 获取form Ref
    getFormRef: function () {
        return inputFormRef.value!.getFormRef();
    },
    // 表单验证
    validate(callback?: FormValidateCallback) {
        return inputFormRef.value!.validate(callback);
    }
});
</script>
<style lang="scss">
.form-dialog {
}
</style>
