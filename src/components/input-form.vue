<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-03-22 14:05:40
 * @项目的路径: \vue-manager-system\src\components\input-form.vue
 * @描述: 数据输入表单
-->
<template>
    <div class="input-form" v-loading="isLoading">
        <el-form v-bind="formProps" :model="inputFormValue" ref="inputFormRef">
            <el-row>
                <el-col v-for="(field, index) in formFields" :key="(field.name || '') + '_' + index" :span="field.span" v-show="field.isShow !== false">
                    <el-form-item v-bind="field.formItemProps">
                        <input-field :field="field" :modelValue="getObjectProperty(inputFormValue, field.name)" @update:modelValue="value => setFieldValue(value, field)">
                            <!-- 自定义插件，插槽 -->
                            <slot
                                v-if="field.slot"
                                :name="field.slot"
                                :field="field"
                                :value="getObjectProperty(inputFormValue, field.name)"
                                :formValue="inputFormValue"
                                :formFields="formFields"
                            ></slot>
                        </input-field>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script setup lang="ts">
import type { Components } from "/#/components";
import type { Ref, PropType } from "vue";
import type { FormInstance, FormProps, FormValidateCallback } from "element-plus";
import { ref, watch } from "vue";
import { INPUT_FORM_FIELD_DEFAULT_ATTRIBUTES } from "@/services/constants";
import { setObjectProperty, getObjectProperty } from "@yujinjin/utils";
import { extend } from "@yujinjin/utils";
import type { NotReadonly } from "/#/global";

const props = defineProps({
    fields: {
        type: Array as PropType<Components.InputFormField[]>,
        default() {
            return [];
        },
        required: true
    },
    isLoading: {
        type: Boolean,
        default: false
    },
    // 一行表单数
    columns: {
        type: Number,
        default: 1
    },
    // form表单属性
    props: {
        type: Object as PropType<Partial<NotReadonly<FormProps>>>
    },
    // form表单事件
    events: {
        type: Object as PropType<Record<string, (...args: any[]) => any>>
    },
    // 表单数据默认值
    value: {
        type: Object as PropType<Record<string, any>>,
        default: function () {
            return {};
        }
    }
});

const emits = defineEmits(["fieldValueChange"]);

// 表单属性
const formProps = ref({});

// form ref
const inputFormRef = ref<FormInstance>();

// 表单数据
const inputFormValue: Ref<Record<string, any>> = ref({});

// 表单字段列表
const formFields: Ref<Components.InputFormField[]> = ref([]);

// 初始化表单数据
const initInputFormValue = function () {
    inputFormValue.value = extend(true, {}, props.value);
    formFields.value.forEach(field => {
        if (!field.name) {
            logs.warn("字段没有属性name值", field);
            return;
        }
        // 设置field 的value值
        let fieldValue = getObjectProperty(inputFormValue.value, field.name);
        if (fieldValue === undefined) {
            fieldValue = Object.prototype.hasOwnProperty.call(field, "value") ? field.value : null;
            setObjectProperty(inputFormValue.value, field.name, fieldValue);
            // emits("fieldValueChange", field, fieldValue, formFields.value, inputFormValue.value);
        }
    });
};

// 生成表单字段列表
const generateFormFields = function () {
    formFields.value = [];
    if (!props.fields || props.fields.length === 0) {
        return;
    }
    const style = { width: "400px" };
    if (props.columns === 2) {
        style.width = "220px";
    }
    props.fields.forEach(field => {
        if (!field.name) {
            logs.warn("字段没有属性name值", field);
            return;
        }
        const newField: Components.InputFormField = extend(true, { isShow: true, type: "input" }, field);
        if (!newField.span) {
            newField.span = 24 / props.columns;
        }
        if (!newField.formItemProps) {
            newField.formItemProps = {};
        }
        if (!newField.props) {
            newField.props = {};
        }
        if (newField.type && INPUT_FORM_FIELD_DEFAULT_ATTRIBUTES[newField.type]) {
            if (newField.type === "datePicker") {
                newField.props = Object.assign({}, INPUT_FORM_FIELD_DEFAULT_ATTRIBUTES[newField.type][newField.props.type || "date"], newField.props);
            } else {
                if (!newField.props.placeholder) {
                    newField.props.placeholder = (INPUT_FORM_FIELD_DEFAULT_ATTRIBUTES[newField.type].placeholder || "") + (newField.label || "");
                }
                newField.props = Object.assign({}, INPUT_FORM_FIELD_DEFAULT_ATTRIBUTES[newField.type], newField.props);
            }
        }
        if (newField.inputWidth) {
            newField.props!.style = newField.props!.style || {};
            newField.props!.style.width = newField.inputWidth + "px";
        } else {
            newField.props!.style = Object.assign({}, style, newField.props!.style);
        }
        if (newField.label) {
            newField.formItemProps.label = newField.label + (newField.label.endsWith("：") ? "" : "：");
        }
        if (newField.labelWidth) {
            newField.formItemProps.labelWidth = newField.labelWidth;
        }
        if (!newField.formItemProps.prop) {
            newField.formItemProps.prop = newField.name;
        }
        if (newField.rules) {
            newField.formItemProps.rules = newField.rules;
        }
        formFields.value.push(newField);
    });
    initInputFormValue();
};

// 设置字段的值
const setFieldValue = function (fieldValue, field: Components.InputFormField) {
    if (field.type === "input") {
        fieldValue = fieldValue.trim();
    }
    setObjectProperty(inputFormValue.value, field.name, fieldValue);
    emits("fieldValueChange", field, fieldValue, formFields.value, inputFormValue.value);
};

watch(
    () => props.fields,
    () => {
        generateFormFields();
    },
    {
        immediate: true,
        deep: true
    }
);

watch(
    () => props.value,
    () => {
        initInputFormValue();
    },
    {
        deep: true
    }
);

watch(
    () => props.props,
    value => {
        formProps.value = Object.assign(
            {
                labelWidth: 120
            },
            value
        );
    },
    {
        immediate: true,
        deep: true
    }
);

defineExpose<Components.InputFormRef>({
    // 获取表单的value
    getInputValue: function () {
        return JSON.parse(JSON.stringify(inputFormValue.value));
    },
    /**
     * 设置表单的属性值
     * @param propertyName 属性名
     * @param value 属性值
     */
    setInputPropertyValue: function (propertyName: string, value: any) {
        const findField = formFields.value.find(field => field.name === propertyName);
        if (findField) {
            setFieldValue(value, findField);
        } else {
            setObjectProperty(inputFormValue.value, propertyName, value);
        }
    },
    // 修改当前form字段的属性
    changeFormFields: function (callback: (formFields: Components.InputFormField[]) => void) {
        if (callback && typeof callback === "function") {
            callback(formFields.value);
        } else {
            logs.warn("callback 必须是一个函数");
        }
    },
    // 获取form Ref
    getFormRef: function () {
        return inputFormRef.value!;
    },
    // 表单验证
    validate(callback?: FormValidateCallback) {
        return inputFormRef.value!.validate(callback);
    }
});
</script>
