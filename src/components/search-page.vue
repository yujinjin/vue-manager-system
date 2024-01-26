<template>
    <div class="search-page" v-loading="isLoadingForInit">
        <search-form v-if="searchFormProps" v-bind="searchFormProps" :pageName="pageName" :isSearchLoading="isSearchLoading" @search="searchHandle" @change="searchValueChangeHandle"
            @fieldsChange="searchFieldsChangeHandle" ref="searchFormRef">
            <template v-for="name in distributeSlots.searchForm" #[name]="scope">
                <slot :name="name" v-bind="scope"></slot>
            </template>
        </search-form>
        <action-bar v-if="actionBarProps" v-bind="actionBarProps" :pageName="pageName" :selectRows="selectRows" ref="actionBarRef">
            <template v-for="name in distributeSlots.actionBar" #[name]="scope">
                <slot :name="name" v-bind="scope"></slot>
            </template>
            <template v-if="distributeSlots.actionBarDefault" #default>
                <slot :name="distributeSlots.actionBarDefault"></slot>
            </template>
        </action-bar>
        <data-table v-if="dataTableProps" v-bind="dataTableProps" :pageName="pageName" :filters="dataTableFilters" ref="dataTableRef" v-model:selectRows="selectRows" :autoInitQuery="!isLoadingForInit"
            @search="isLoading => (isSearchLoading = isLoading)">
            <template v-for="name in distributeSlots.dataTable" #[name]="scope">
                <slot :name="name" v-bind="scope"></slot>
            </template>
        </data-table>
        <slot></slot>
    </div>
</template>
<script setup lang="ts">
import type { Components } from "/#/components";
import type { Ref, PropType } from "vue";
import { onMounted, ref, useSlots, computed, watch, nextTick } from "vue";
import { extend } from "@yujinjin/utils";

const props = defineProps({
    // 初始化时正在加载
    isLoadingForInit: {
        type: Boolean,
        default: false
    },
    searchFormProps: {
        type: Object as PropType<Components.SearchForm>
    },
    actionBarProps: {
        type: Object as PropType<Components.ActionBar>
    },
    dataTableProps: {
        type: Object as PropType<Components.DataTable>
    },
    // 页面名称，用于获取有权限的按钮数据
    pageName: String
});

const emits = defineEmits(["searchValueChange", "searchFieldsChange", "selectRowsChange"]);

const slots = useSlots();

// 当前数据表格的筛选参数值（searchFormValue和props.dataTableProps.filters的并集）
const dataTableFilters: Ref<Record<string, any>> = ref({});

// 当前搜索条件的筛选参数值
const searchFormValue: Ref<Record<string, any>> = ref({});

// datatable组件ref
const dataTableRef = ref<Components.DataTableRef>();

// searchForm组件ref
const searchFormRef = ref<Components.SearchFormRef>();

// actionBar组件Ref
const actionBarRef = ref<Components.ActionBarRef>();

// 当前搜索是否正在加载中
const isSearchLoading = ref(false);

// 选择的数据列
const selectRows = ref([]);

// 把插槽分组放入对应的组件里。以searchForm_开头放入到searchForm组件，actionBar_开头放入到actionBar组件，dataTable_开头放入到dataTable组件
const distributeSlots = computed(() => {
    const typeSlotList = {
        searchForm: [] as string[],
        actionBar: [] as string[],
        dataTable: [] as string[],
        actionBarDefault: ""
    };
    Object.keys(slots).forEach(key => {
        if (key.startsWith("searchForm_")) {
            typeSlotList.searchForm.push(key);
        } else if (key === "actionBar_default") {
            typeSlotList.actionBarDefault = "actionBar_default";
        } else if (key.startsWith("actionBar_")) {
            typeSlotList.actionBar.push(key);
        } else if (key.startsWith("dataTable_")) {
            typeSlotList.dataTable.push(key);
        }
    });
    return typeSlotList;
});

// 搜索表单的值变化事件
const searchValueChangeHandle = function (field, formFields) {
    emits("searchValueChange", field, formFields);
};

// 搜索表单的字段变化事件
const searchFieldsChangeHandle = function (formFields) {
    emits("searchFieldsChange", formFields);
};

// 查询方法
const queryDataList = async function (isInit = true) {
    if (props.dataTableProps?.filters) {
        dataTableFilters.value = extend(true, {}, searchFormValue.value, props.dataTableProps.filters);
    } else {
        dataTableFilters.value = searchFormValue.value;
    }
    await nextTick();
    return dataTableRef.value?.queryDataList(isInit);
};

// 搜索操作
const searchHandle = function (formValue) {
    searchFormValue.value = formValue;
    queryDataList();
};

watch(
    () => selectRows.value,
    () => {
        emits("selectRowsChange", selectRows.value);
    },
    {
        deep: true
    }
);

const unwatch = watch(
    () => props.isLoadingForInit,
    async value => {
        unwatch();
        if (value) return;
        if (searchFormRef.value) {
            searchFormValue.value = searchFormRef.value.getValue();
        }
        queryDataList();
    }
);

onMounted(() => {
    if (searchFormRef.value) {
        searchFormValue.value = searchFormRef.value.getValue();
    }
    if (props.dataTableProps?.filters) {
        dataTableFilters.value = extend(true, {}, searchFormValue.value, props.dataTableProps.filters);
    } else {
        dataTableFilters.value = searchFormValue.value;
    }
    if (selectRows.value && selectRows.value.length > 0) {
        emits("selectRowsChange", selectRows.value);
    }
});

defineExpose<Components.SearchPageRef>({
    // 分页查询
    query: queryDataList,

    // 获取当前搜索表单实时值
    getSearchingValue: function () {
        if (searchFormRef.value) {
            return extend(true, {}, props.dataTableProps && props.dataTableProps.filters, searchFormRef.value.getValue());
        }
        return extend(true, {}, props.dataTableProps && props.dataTableProps.filters);
    },

    // 获取当前已经搜索出来的结果值，与getSearchFormValue区别是当前已经用它查询出来结果的搜索表单值
    getSearchedValue: function () {
        return extend(true, {}, dataTableFilters.value);
    },

    // 修改当前form字段的属性
    changeFormFields: function (callback: (formFields: Components.InputFormField[]) => void) {
        searchFormRef.value?.changeFormFields(callback);
    },

    // 修改当前生成的button按钮值
    changeButtons: function (callback: (actionButtons: Components.TableButton[]) => void) {
        actionBarRef.value?.changeButtons(callback);
    },

    /**
     * 更新数据列显示状态
     * @param columnKeys 显示列key值数组（不传值表示都展示）
     */
    updateTableColumnsShowStatus(columnKeys?: string[]) {
        dataTableRef.value?.updateTableColumnsShowStatus(columnKeys);
    }
});
</script>
<style lang="scss" scoped>
.search-page {
    display: flex;
    flex-direction: column;
    height: 100%;
}
</style>
