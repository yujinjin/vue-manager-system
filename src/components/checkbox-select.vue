<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-10-27 14:17:32
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-10-31 16:04:39
 * @项目的路径: \vue-manager-system\src\components\checkbox-select.vue
 * @描述: 下拉选项带复选框的选项
-->
<template>
    <el-select
        :modelValue="modelValue"
        @update:modelValue="value => emits('update:modelValue', value)"
        ref="checkboxSelectRef"
        @change="value => emits('change', value)"
        v-bind="selectProps || {}"
        v-on="events || {}"
    >
        <el-option v-if="isShowCheckAll" :created="true" value="" label="">
            <div class="option-inner" @click.stop.prevent="checkAllChangeHandle">
                <el-checkbox :modelValue="checkAllStatus.isCheckAll" :indeterminate="checkAllStatus.isIndeterminate" />
                <span>全选</span>
            </div>
        </el-option>
        <el-option
            v-for="(item, index) in data"
            :key="(item[selectProps.valueKey || optionValueKey || 'value'] || '') + '_' + index"
            :label="item[optionLabelKey || 'label']"
            :value="item[optionValueKey || 'value']"
            :disabled="item.disabled === true"
        >
            <div class="option-inner">
                <el-checkbox :modelValue="modelValue && modelValue.includes(item[optionValueKey || 'value'])" @change="isCheck => checkChangeHandle(isCheck, item[optionValueKey || 'value'])" />
                <span>{{ item[optionLabelKey || "label"] }}</span>
            </div>
        </el-option>
    </el-select>
</template>
<script setup lang="ts">
import type { PropType } from "vue";
import { ElSelect } from "element-plus";
import { ref, computed } from "vue";
import { escapeStringRegexp } from "@/utils/index";

const props = defineProps({
    modelValue: {
        type: Array as PropType<Array<object | string | number>>
    },
    data: {
        type: Array as PropType<Array<Record<string, any>>>,
        required: true
    },
    optionValueKey: {
        type: String,
        default: "value"
    },
    optionLabelKey: {
        type: String,
        default: "label"
    },
    props: {
        type: Object as PropType<Record<string, any>>
    },
    events: {
        type: Object as PropType<Record<string, (...args: any[]) => any>>
    }
});

const emits = defineEmits(["update:modelValue", "change"]);

// select 实例
const checkboxSelectRef = ref<InstanceType<typeof ElSelect>>();

const selectProps = computed(() => {
    return Object.assign(
        {
            collapseTags: true,
            filterable: true
        },
        props.props || {},
        { multiple: true }
    );
});

const isShowCheckAll = computed(() => {
    if (!props.data || props.data.length === 0 || !checkboxSelectRef.value || !checkboxSelectRef.value.query) {
        return false;
    }
    const regexp = new RegExp(escapeStringRegexp(checkboxSelectRef.value.query), "i");
    return props.data.findIndex(item => regexp.test(item[props.optionLabelKey])) !== -1;
});

// 初始化全选状态
const checkAllStatus = computed(() => {
    const status = {
        isCheckAll: false,
        isIndeterminate: false
    };
    if (!isShowCheckAll.value || !props.modelValue || props.modelValue.length === 0) {
        return status;
    }
    const regexp = new RegExp(escapeStringRegexp(checkboxSelectRef.value!.query), "i");
    props.data.find(item => {
        if (!regexp.test(item[props.optionLabelKey])) {
            return false;
        }
        if (props.modelValue?.includes(item[props.optionValueKey])) {
            status.isCheckAll = true;
        } else if (status.isCheckAll) {
            status.isCheckAll = false;
            status.isIndeterminate = true;
        }
        return status.isIndeterminate;
    });
    return status;
});

const checkAllChangeHandle = function () {
    const values = (props.modelValue || []).slice();
    const regexp = new RegExp(escapeStringRegexp(checkboxSelectRef.value!.query), "i");

    props.data.find(item => {
        if (!regexp.test(item[props.optionLabelKey])) {
            return false;
        }
        const findIndex = values.indexOf(item[props.optionValueKey]);
        if (checkAllStatus.value.isCheckAll && findIndex !== -1) {
            values.splice(findIndex, 1);
        } else if (!checkAllStatus.value.isCheckAll && findIndex === -1) {
            values.push(item[props.optionValueKey]);
        }
    });
    emits("update:modelValue", values);
    emits("change", values);
};

const checkChangeHandle = function (isCheck, value) {
    const values = (props.modelValue || []).slice();
    if (isCheck) {
        values.splice(
            values.findIndex(item => item === value),
            1
        );
    } else {
        values.push(value);
    }
    emits("update:modelValue", values);
    emits("change", values);
};
</script>
<style lang="less" scoped>
.option-inner {
    display: flex;
    align-items: center;

    span {
        margin-left: 4px;
    }
}
</style>
