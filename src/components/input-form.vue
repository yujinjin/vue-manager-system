<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-01-03 17:21:00
 * @项目的路径: \vue-manager-system\src\components\input-form.vue
 * @描述: 数据输入表单
-->
<template>
    <div class="input-form" v-loading="isLoading">
        <el-form v-bind="formProps" v-model="inputFormValue">
            <el-row>
                <el-col v-for="(field, index) in formFields" :key="(field.name || '') + '_' + index" :span="field.span">
                    <el-form-item v-bind="field.formItemProps">
                        <!-- 自定义插件，插槽 -->
                        <slot v-if="field.slot" :name="field.slot" :field="field" :formFields="formFields"></slot>

                        <!-- 标签内容 -->
                        <div class="label-contents" v-if="field.type === 'label'">{{ getObjectProperty(inputFormValue, field.name) }}</div>

                        <!-- 图片上传 -->
                        <img-upload
                            v-if="field.type === 'imgUpload'"
                            :modelValue="getObjectProperty(inputFormValue, field.name)"
                            @update:modelValue="value => setFieldValue(value.trim(), field)"
                            v-bind="field.props || {}"
                        />

                        <!-- 富文本框 -->
                        <web-editor
                            v-if="field.type === 'webEditor'"
                            :modelValue="getObjectProperty(inputFormValue, field.name)"
                            @update:modelValue="value => setFieldValue(value.trim(), field)"
                            v-bind="field.props || {}"
                        />

                        <!-- select -->
                        <el-select
                            v-else-if="field.type === 'select'"
                            :modelValue="getObjectProperty(inputFormValue, field.name)"
                            @update:modelValue="value => setFieldValue(value, field)"
                            v-bind="field.props || {}"
                            v-on="field.events || {}"
                        >
                            <el-option
                                v-for="(item, index) in field.data"
                                :key="(item[field.optionValueKey || 'value'] || '') + '_' + index"
                                :label="item[field.optionLabelKey || 'label']"
                                :value="item[field.optionValueKey || 'value']"
                                :disabled="item.disabled === true"
                            />
                        </el-select>

                        <!-- checkbox -->
                        <el-checkbox-group
                            v-else-if="field.type === 'checkbox'"
                            :modelValue="getObjectProperty(inputFormValue, field.name)"
                            @update:modelValue="value => setFieldValue(value, field)"
                            v-bind="field.props || {}"
                            v-on="field.events || {}"
                        >
                            <el-checkbox
                                v-for="(item, index) in field.data"
                                :key="(item[field.optionValueKey || 'value'] || '') + '_' + index"
                                :label="item[field.optionValueKey || 'value']"
                                :disabled="item.disabled === true"
                            >
                                {{ item[field.optionLabelKey || "label"] }}
                            </el-checkbox>
                        </el-checkbox-group>

                        <!-- radio -->
                        <el-radio-group
                            v-else-if="field.type === 'radio'"
                            :modelValue="getObjectProperty(inputFormValue, field.name)"
                            @update:modelValue="value => setFieldValue(value, field)"
                            v-bind="field.props || {}"
                            v-on="field.events || {}"
                        >
                            <el-radio-button
                                v-for="(item, index) in field.data"
                                :key="(item[field.optionValueKey || 'value'] || '') + '_' + index"
                                :label="item[field.optionValueKey || 'value']"
                                :disabled="item.disabled === true"
                            >
                                {{ item[field.optionLabelKey || "label"] }}
                            </el-radio-button>
                        </el-radio-group>

                        <!-- element 组件 -->
                        <component
                            v-else
                            :is="getElComponentName(field)"
                            :modelValue="getObjectProperty(inputFormValue, field.name)"
                            @update:modelValue="value => setFieldValue(value, field)"
                            v-bind="field.props || {}"
                            v-on="field.events || {}"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script setup lang="ts">
import type { Components } from "/#/components";
import type { Ref, PropType } from "vue";
import type { FormProps } from "element-plus";
import { ref, watch } from "vue";
import { INPUT_FORM_FIELD_DEFAULT_ATTRIBUTES } from "@/services/constants";
import { setObjectProperty, getObjectProperty } from "@/utils/others";
import extend from "@/utils/extend";
import { NotReadonly } from "/#/global";

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
        type: Object as PropType<Record<string, Function>>
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

// 表单数据
const inputFormValue: Ref<Record<string, any>> = ref({});

// 表单字段列表
const formFields: Ref<Components.InputFormField[]> = ref([]);

// 生成表单字段列表
const generateFormFields = function () {
    formFields.value = [];
    if (!props.fields || props.fields.length === 0) {
        return;
    }
    props.fields.forEach(field => {
        const newField: Components.InputFormField = extend(true, {}, field);
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
        }
        if (newField.label) {
            newField.formItemProps.label = newField.label + newField.label.endsWith("：") ? "" : "：";
        }
        if (newField.labelWidth) {
            newField.formItemProps.labelWidth = newField.labelWidth;
        }
        if (!newField.formItemProps.prop) {
            newField.formItemProps.prop = newField.name;
        }
        formFields.value.push(newField);
    });
    initInputFormValue();
};

// 初始化表单数据
const initInputFormValue = function () {
    inputFormValue.value = extend(true, {}, props.value);
    formFields.value.forEach(field => {
        // 设置field 的value值
        let fieldValue = getObjectProperty(props.value, field.name);
        if (fieldValue === undefined) {
            fieldValue = Object.prototype.hasOwnProperty.call(field, "value") ? field.value : null;
            setObjectProperty(inputFormValue.value, field.name, fieldValue);
            emits("fieldValueChange", field, fieldValue, formFields.value);
        }
    });
};

// 获取elment 组件名称
const getElComponentName = function (field: Components.InputFormField) {
    return "el-" + field.name.replace(/([A-Z])/g, "-$1").toLowerCase();
};

// 设置字段的值
const setFieldValue = function (fieldValue, field: Components.InputFormField) {
    if (field.type === "input") {
        fieldValue = fieldValue.trim();
    }
    setObjectProperty(inputFormValue.value, field.name, fieldValue);
    emits("fieldValueChange", field, fieldValue, formFields.value);
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

defineExpose({ inputFormValue: inputFormValue.value });
</script>
<style lang="less" scoped>
.input-form {
}
</style>
