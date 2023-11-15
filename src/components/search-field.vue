<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-10-27 11:53:51
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-10-27 18:24:49
 * @项目的路径: \vue-manager-system\src\components\search-field.vue
 * @描述: 搜索表单字段
-->
<template>
    <div class="input-box">
        <!-- 自定义插件，插槽 -->
        <slot></slot>

        <!-- input -->
        <el-input v-if="field.type === 'input'" :modelValue="field.value" @update:modelValue="value => changeValue(value.trim())" v-bind="field.props || {}" v-on="field.events || {}" />

        <!-- input-number -->
        <el-input-number v-else-if="field.type === 'inputNumber'" :modelValue="field.value" @update:modelValue="changeValue" v-bind="field.props || {}" v-on="field.events || {}" />

        <!-- select -->
        <el-select v-else-if="field.type === 'select'" :modelValue="field.value" @update:modelValue="changeValue" v-bind="field.props || {}" v-on="field.events || {}">
            <el-option
                v-for="(item, index) in field.data"
                :key="(item[field.props?.valueKey || field.optionValueKey || 'value'] || '') + '_' + index"
                :label="item[field.optionLabelKey || 'label']"
                :value="item[field.optionValueKey || 'value']"
                :disabled="item.disabled === true"
            />
        </el-select>

        <!-- checkbox-select -->
        <checkbox-select v-else-if="field.type === 'checkboxSelect'" :modelValue="field.value" @update:modelValue="changeValue" v-bind="field.props || {}" v-on="field.events || {}" />

        <!-- date-picker -->
        <el-date-picker v-else-if="field.type === 'datePicker'" :modelValue="field.value" @update:modelValue="changeValue" v-bind="field.props || {}" v-on="field.events || {}" />
    </div>
</template>
<script setup lang="ts">
import type { Components } from "/#/components";
import type { PropType } from "vue";

const props = defineProps({
    field: {
        type: Object as PropType<Components.SearchFormField>,
        required: true
    }
});

const emits = defineEmits(["update:modelValue", "change"]);

const changeValue = function (value) {
    emits("update:modelValue", value);
    emits("change", props.field);
};
</script>
<style lang="less" scoped>
.input-box {
    :deep(.el-select) {
        .el-select__tags-text {
            max-width: 120px !important;
        }
    }
}
</style>
