<template>
    <div class="search-panel" :class="{ collapse: !collapseStatus }" :style="{ paddingRight: collapseStatus ? '' : buttonBoxWidth + 'px' }">
        <div class="field-box" v-for="(field, index) in formFields" :key="(field.name || '') + '_' + index">
            <div class="label-text" :style="{ width: (field.labelWidth || labelWidth) + 'px' }" v-if="field.label">{{ field.label }}</div>
            <div class="input-box" :style="{ width: (field.inputWidth || inputWidth) + 'px' }">
                <!-- 自定义插件，插槽 -->
                <slot v-if="field.slot" :name="field.slot" :field="field" :formFields="formFields"></slot>

                <!-- input -->
                <el-input v-else-if="field.type === 'input'" v-model.trim="field.value" @change="changeHandle(field)" v-bind="field.props || {}" v-on="field.events || {}" />

                <!-- select -->
                <el-select v-else-if="field.type === 'select'" v-model="field.value" @change="changeHandle(field)" v-bind="field.props || {}" v-on="field.events || {}">
                    <el-option
                        v-for="(item, index) in field.data"
                        :key="(item[field.optionValueKey || 'value'] || '') + '_' + index"
                        :label="item[field.optionLabelKey || 'label']"
                        :value="item[field.optionValueKey || 'value']"
                        :disabled="item.disabled === true"
                    />
                </el-select>

                <!-- date-picker -->
                <el-date-picker v-else-if="field.type === 'datePicker'" v-model="field.value" @change="changeHandle(field)" v-bind="field.props || {}" v-on="field.events || {}" />
            </div>
        </div>
        <!-- 占位 -->
        <div class="placeholder-button-box" :style="{ width: buttonBoxWidth + 'px' }" v-show="isShowCollapse && collapseStatus"></div>
        <div class="button-box" ref="buttonBoxRef">
            <el-button
                v-for="(button, index) in extendButtons"
                :key="(button.handleCode || '') + '_' + index"
                v-permission="{ value: button.handleCode, pageName }"
                v-bind="button.props || {}"
                @click="extendButtonClickHandle(button)"
                :loading="button.isLoading"
                type="primary"
            >
                {{ button.text }}
            </el-button>
            <el-button @click="searchHandle" :loading="isSearchLoading" type="primary">查询</el-button>
            <el-button @click="resetHandle">重置</el-button>
            <el-button v-if="isShowCollapse" type="primary" link @click="collapseStatus = !collapseStatus">{{ collapseStatus ? "收起" : "展开" }}</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Components } from "/#/components";
import type { Ref, PropType } from "vue";
import { onMounted, ref, watch, nextTick } from "vue";
import { SEARCH_FORM_FIELD_DEFAULT_ATTRIBUTES } from "@/services/constants";
import { setObjectProperty } from "@/utils/others";
import extend from "@/utils/extend";

const props = defineProps({
    // 查询表单字段列表 [{name: 查询项的名称，同时也是父级组件的字段属性, label: 选项的标签名称, value: 选项的值, type: 组件的类型, labelWidth: label宽度,  inputWidth: 表单宽度, data: 数据（比如：select的选项值列表）, props: 组件的自定义选项(可无), events: 组件自定义事件 slot: 自定义插槽名称（可无，如有值其他选项无效）}]
    fields: {
        type: Array as PropType<Components.SearchFormField[]>,
        default() {
            return [];
        },
        required: true
    },
    // 是否正在搜索加载
    isSearchLoading: {
        type: Boolean,
        default: false
    },
    // 是否显示折叠
    isShowCollapse: {
        type: Boolean,
        default: true
    },
    // label宽度
    labelWidth: {
        type: Number,
        default: 107
    },
    // 表单宽度
    inputWidth: {
        type: Number,
        default: 185
    },
    // 操作按钮
    buttons: {
        type: Array as PropType<Components.Button[]>,
        default() {
            return [];
        }
    },
    // 页面名称，配合buttons权限使用
    pageName: String
});

const emits = defineEmits(["generateFormFields", "search", "update:isShowCollapse", "change", "collapseStatusChange"]);

// search 表单字段列表
const formFields: Ref<Components.SearchFormField[]> = ref([]);

// 扩展按钮列表
const extendButtons: Ref<Components.Button[]> = ref([]);

// 展开状态
const collapseStatus: Ref<boolean> = ref(true);

// 按钮容器ref
const buttonBoxRef: Ref<HTMLDivElement | null> = ref(null);

// 操作按钮长度
const buttonBoxWidth: Ref<number> = ref(0);

// 生成表单字段列表
const generateFormFields = function () {
    formFields.value = [];
    if (!props.fields || props.fields.length === 0) {
        return;
    }
    props.fields.forEach(field => {
        const newField = extend(true, {}, field);
        if (!Object.prototype.hasOwnProperty.call(newField, "value")) {
            newField.value = null;
        }
        if (newField.type && SEARCH_FORM_FIELD_DEFAULT_ATTRIBUTES[newField.type]) {
            if (!newField.props) {
                newField.props = {};
            }
            if (newField.type === "datePicker") {
                newField.props = Object.assign({}, SEARCH_FORM_FIELD_DEFAULT_ATTRIBUTES[newField.type][newField.props.type || "date"], newField.props);
            } else {
                if (!newField.props.placeholder) {
                    newField.props.placeholder = (SEARCH_FORM_FIELD_DEFAULT_ATTRIBUTES[newField.type].placeholder || "") + (newField.label || "");
                }
                newField.props = Object.assign({}, SEARCH_FORM_FIELD_DEFAULT_ATTRIBUTES[newField.type], newField.props);
            }
        }
        if (newField.label && !newField.label.endsWith("：")) {
            newField.label = newField.label + "：";
        }
        formFields.value.push(newField);
    });
    emits("generateFormFields", getSearchFormValue(), formFields.value);
};

// 生成扩展按钮列表
const generateExtendButtons = function () {
    extendButtons.value = [];
    if (!props.buttons || props.buttons.length === 0) {
        return [];
    }
    props.buttons.forEach(button => {
        extendButtons.value.push(extend(true, { loading: false }, button));
    });
};

// 触发window resize 事件，通常是为了让datatable最大高度重新计算
const triggerResizeEvent = async function () {
    // let resizeEvent = new Event('resize');
    // resizeEvent.initEvent('resize', true, true)
    await nextTick();
    window.dispatchEvent(new Event("resize"));
};

const init = function () {
    buttonBoxWidth.value = buttonBoxRef.value!.offsetWidth;
};

// 获取当前搜索表单的数据对象
const getSearchFormValue = function () {
    const formValue = {};
    formFields.value.forEach(field => {
        setObjectProperty(formValue, field.name, field.value);
    });
    return formValue;
};

// 搜索操作
const searchHandle = function () {
    emits("search", getSearchFormValue());
};

// 重置操作
const resetHandle = function () {
    props.fields.forEach((field, index) => {
        if (!Object.prototype.hasOwnProperty.call(field, "value")) {
            formFields.value[index].value = null;
        } else {
            formFields.value[index].value = field.value;
        }
    });
    searchHandle();
};

// 查询表单数值变化
const changeHandle = function (field) {
    emits("change", field, formFields.value);
};

// 扩展按钮点击事件
const extendButtonClickHandle = async function (button) {
    if (!button.click || button.loading) {
        return;
    }
    button.loading = true;
    await button.click();
    button.loading = false;
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
    () => props.buttons,
    () => {
        generateExtendButtons();
    },
    {
        immediate: true,
        deep: true
    }
);

watch(
    () => collapseStatus.value,
    () => {
        emits("collapseStatusChange", collapseStatus.value);
        triggerResizeEvent();
    }
);

onMounted(async () => {
    await nextTick();
    init();
    triggerResizeEvent();
});

defineExpose({ formFields, getSearchFormValue });
</script>

<style lang="less" scoped>
.search-panel {
    --el-component-size: 28px;
    --el-input-icon-color: #babac2;
    --el-text-color-regular: #595959;
    padding: 8px 0px;
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid #ebebeb;
    font-size: 12px;
    color: #595959;
    position: relative;

    &.collapse {
        height: 60px;
        overflow: hidden;
    }

    .field-box {
        display: flex;
        padding: 8px 0px;

        .label-text {
            text-align: right;
            line-height: 28px;
        }
        .input-box {
            flex: 1;

            :deep(.el-range-separator) {
                color: #bfbfbf;
            }

            :deep(.el-radio) {
                height: 28px;
            }
        }
    }

    .placeholder-button-box {
        height: 44px;
    }

    .button-box {
        padding: 8px 25px;
        position: absolute;
        right: 0px;
        bottom: 8px;
        z-index: 1;

        // &.placeholder::after {
        //     content: "";
        //     left: 0px;
        //     right: 0px;
        //     top: 0px;
        //     bottom: 0px;
        //     z-index: 1;
        // }

        .el-button {
            height: 28px;
            width: 72px;

            &.is-link {
                width: auto;
            }

            + .el-button {
                margin-left: 8px;
            }
        }
    }
}
</style>
