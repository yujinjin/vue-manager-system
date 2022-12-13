<template>
    <div class="search-page" v-loading="isLoadingForInit">
        <search-form
            v-if="searchFormProps"
            v-bind="searchFormProps"
            :pageName="pageName"
            :isSearchLoading="isSearchLoading"
            @search="searchHandle"
            @change="searchValueChangeHandle"
            @generateFormFields="initSearchFormValue"
            ref="searchFormRef"
        >
            <template v-for="name in distributeSlots.searchForm" #[name]="scope">
                <slot :name="name" v-bind="scope"></slot>
            </template>
        </search-form>
        <action-bar v-if="actionBarProps" v-bind="actionBarProps" :pageName="pageName" :selectRows="selectRows" @selectRowsChange="selectRowsChangeInActionBar">
            <!-- action bar组件只有一个slot -->
            <template v-if="distributeSlots.actionBar.length > 0" #default="scope">
                <slot :name="distributeSlots.actionBar[0]" v-bind="scope"></slot>
            </template>
        </action-bar>
        <data-table
            v-if="dataTableProps"
            v-bind="dataTableProps"
            :pageName="pageName"
            :filters="searchFormInput"
            ref="dataTableRef"
            v-model:selectRows="selectRows"
            :autoInitQuery="!isLoadingForInit"
            @search="isLoading => (isSearchLoading = isLoading)"
        >
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
import { ref, useSlots, computed, watch, nextTick } from "vue";
import extend from "@/utils/extend";

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

const emits = defineEmits(["searchValueChange", "selectRowsChangeInActionBar", "searchFormFieldsChange"]);

const slots = useSlots();

// 当前搜索条件的表单值
const searchFormInput: Ref<Record<string, any>> = ref(extend(true, {}, props.dataTableProps && props.dataTableProps.filters));

// datatable组件ref
const dataTableRef: Ref<Components.DataTableRef | null> = ref(null);

// searchForm组件ref
const searchFormRef: Ref<Components.SearchFormRef | null> = ref(null);

// 当前搜索是否正在加载中
const isSearchLoading = ref(false);

// 选择的数据列
const selectRows = ref([]);

// 把插槽分组放入对应的组件里。以searchForm_开头放入到searchForm组件，actionBar_开头放入到actionBar组件，dataTable_开头放入到dataTable组件
const distributeSlots = computed(() => {
    const typeSlotList = {
        searchForm: [] as string[],
        actionBar: [] as string[],
        dataTable: [] as string[]
    };
    Object.keys(slots).forEach(key => {
        if (key.startsWith("searchForm_")) {
            typeSlotList.searchForm.push(key);
        } else if (key.startsWith("actionBar_")) {
            typeSlotList.actionBar.push(key);
        } else if (key.startsWith("dataTable_")) {
            typeSlotList.dataTable.push(key);
        }
    });
    return typeSlotList;
});

// 初始化搜索表单的值
const initSearchFormValue = function (searchFormValue, formFields) {
    extend(true, searchFormInput.value, searchFormValue);
    emits("searchFormFieldsChange", searchFormValue, formFields);
};

// 在action bar 组件中监控selectRows的数据变化，目前应用场景是如果没有数据列表，部分按钮置为disable
const selectRowsChangeInActionBar = function (selectRows, actionButtons) {
    emits("selectRowsChangeInActionBar", selectRows, actionButtons);
};

// 搜索表单的值变化事件
const searchValueChangeHandle = function (field, formFields) {
    // setObjectProperty(searchFormInput.value, field.name, field.value);
    emits("searchValueChange", field, formFields);
};

// 查询方法
const queryDataList = function () {
    if (dataTableRef.value) {
        dataTableRef.value.queryDataList();
    }
};

// 展开/收起状态更改操作
// const collapseStatusChangeHandle = function () {
//     if (dataTableRef.value) {
//         dataTableRef.value.initTableMaxHeight();
//     }
// };

// 搜索操作
const searchHandle = function (searchFormValue) {
    extend(true, searchFormInput.value, searchFormValue);
    queryDataList();
};

// 获取当前搜索表单的实时值
const getSearchFormValue = function () {
    if (searchFormRef.value) {
        return extend(true, {}, props.dataTableProps && props.dataTableProps.filters, searchFormRef.value.getSearchFormValue());
    }
    return extend(true, {}, searchFormInput.value);
};

const unwatch = watch(
    () => props.isLoadingForInit,
    async value => {
        unwatch();
        if (value) return;
        await nextTick();
        queryDataList();
    }
);

defineExpose({ searchFormInput, getSearchFormValue });
</script>
<style lang="less" scoped>
.search-page {
    display: flex;
    flex-direction: column;
    height: 100%;
}
</style>
