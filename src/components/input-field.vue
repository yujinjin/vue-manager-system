<template>
    <!-- 自定义插件，插槽 -->
    <slot v-if="field.slot"></slot>

    <!-- 标签内容 -->
    <div class="label-contents" v-else-if="field.type === 'label'">{{ modelValue }}</div>

    <!-- 图片上传 -->
    <img-upload v-else-if="field.type === 'imgUpload'" :modelValue="modelValue" @update:modelValue="value => changeValue(value.trim())" v-bind="field.props || {}" />

    <!-- 富文本框 -->
    <web-editor v-else-if="field.type === 'webEditor'" :modelValue="modelValue" @update:modelValue="value => changeValue(value)" v-bind="field.props || {}" />

    <!-- select -->
    <el-select v-else-if="field.type === 'select'" :modelValue="modelValue" @update:modelValue="value => changeValue(value)" v-bind="field.props || {}" v-on="field.events || {}">
        <el-option
            v-for="(item, index) in field.data"
            :key="(item[field.optionValueKey || 'value'] || '') + '_' + index"
            :label="item[field.optionLabelKey || 'label']"
            :value="item[field.optionValueKey || 'value']"
            :disabled="item.disabled === true"
        />
    </el-select>

    <!-- checkbox-select -->
    <checkbox-select v-else-if="field.type === 'checkboxSelect'" :modelValue="field.value" @update:modelValue="changeValue" v-bind="field.props || {}" v-on="field.events || {}" />

    <!-- checkbox -->
    <el-checkbox-group v-else-if="field.type === 'checkbox'" :modelValue="modelValue" @update:modelValue="value => changeValue(value)" v-bind="field.props || {}" v-on="field.events || {}">
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
    <el-radio-group v-else-if="field.type === 'radio'" :modelValue="modelValue" @update:modelValue="value => changeValue(value)" v-bind="field.props || {}" v-on="field.events || {}">
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
    <component v-else :is="getElComponentName(field)" :modelValue="modelValue" @update:modelValue="value => changeValue(value)" v-bind="field.props || {}" v-on="field.events || {}" />
</template>
<script setup lang="ts">
import type { Components } from "/#/components";
import type { PropType } from "vue";

defineProps({
    modelValue: {
        type: [String, Number, Object, Boolean, Array]
    },
    field: {
        type: Object as PropType<Components.InputFormField>,
        required: true
    }
});

const emits = defineEmits(["update:modelValue"]);

// 获取elment 组件名称
const getElComponentName = function (field) {
    return "el-" + field.type.replace(/([A-Z])/g, "-$1").toLowerCase();
};

const changeValue = function (value) {
    emits("update:modelValue", value);
};
</script>
