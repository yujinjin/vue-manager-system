<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-10-27 14:17:32
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-11-05 11:50:41
 * @项目的路径: \vue-manager-system\src\components\checkbox-select.vue
 * @描述: 下拉选项带复选框的选项
-->
<template>
    <el-select v-model="modelValue" ref="checkboxSelectRef" @change="value => emits('change', value)" v-bind="selectProps || {}" v-on="events || {}">
        <el-option v-if="isShowCheckAll" :created="true" value="" label="">
            <div class="option-inner" @click.stop.prevent="checkAllChangeHandle">
                <el-checkbox :model-value="checkAllStatus.isCheckAll" :indeterminate="checkAllStatus.isIndeterminate" />
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
                <el-checkbox
                    :model-value="modelValue && modelValue.includes(item[optionValueKey || 'value'])"
                    :disabled="item.disabled === true"
                    @change="isCheck => checkChangeHandle(isCheck, item[optionValueKey || 'value'])"
                />
                <span>{{ item[optionLabelKey || "label"] }}</span>
            </div>
        </el-option>
    </el-select>
</template>
<script setup lang="ts">
import { ElSelect } from "element-plus";
import { type PropType, type ComputedRef, ref, computed, nextTick } from "vue";

const props = defineProps({
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

const emits = defineEmits(["change"]);

const modelValue = defineModel({ type: Array as PropType<Array<object | string | number>> });

// select 实例
const checkboxSelectRef = ref<InstanceType<typeof ElSelect>>();

const selectDataList: ComputedRef<Array<Record<string, any>>> = computed(() => {
    if (!props.data || props.data.length === 0) {
        return [];
    }
    if (typeof props.data[0] === "string" || typeof props.data[0] === "number") {
        return props.data.map(item => ({ label: item, value: item }));
    }
    return props.data as Array<Record<string, any>>;
});

const selectProps = computed(() => {
    return Object.assign(
        {
            collapseTags: true,
            collapseTagsTooltip: true,
            filterable: true
        },
        props.props || {},
        { multiple: true }
    );
});

const isShowCheckAll = computed(() => {
    if (selectDataList.value.length === 0 || !checkboxSelectRef.value) {
        return false;
    }
    let isShow = false;
    checkboxSelectRef.value!.states.options.forEach(item => {
        if (item.isDisabled !== true && item.visible && !item.created) {
            isShow = true;
        }
    });
    return isShow;
});

// 初始化全选状态
const checkAllStatus = computed(() => {
    const status = {
        isCheckAll: false,
        isIndeterminate: false
    };
    if (!isShowCheckAll.value || !modelValue.value || modelValue.value.length === 0 || !checkboxSelectRef.value?.states) {
        return status;
    }
    checkboxSelectRef.value.states.options.forEach(item => {
        if (!item.visible || item.created || (!status.isCheckAll && status.isIndeterminate)) {
            return;
        }
        if (item.itemSelected) {
            status.isCheckAll = true;
        } else if (status.isCheckAll) {
            status.isIndeterminate = true;
            status.isCheckAll = false;
        }
    });
    return status;
});

const checkAllChangeHandle = async function () {
    await nextTick();
    const values = modelValue.value || [];
    checkboxSelectRef.value?.states.options.forEach(item => {
        if (!item.visible || item.created) {
            return;
        }
        const findIndex = values.indexOf(item.value);
        if (checkAllStatus.value.isCheckAll && findIndex !== -1) {
            values.splice(findIndex, 1);
        } else if (!checkAllStatus.value.isCheckAll && findIndex === -1) {
            values.push(item.value);
        }
    });
    modelValue.value = values;
    emits("change", values);
};

const checkChangeHandle = function (isCheck, value) {
    const values = modelValue.value || [];
    if (isCheck) {
        values.splice(
            values.findIndex(item => item === value),
            1
        );
    } else {
        values.push(value);
    }
    modelValue.value = values;
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
