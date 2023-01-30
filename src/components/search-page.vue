<template>
    <div class="search-page" v-loading="isLoadingForInit">
        <search-form
            v-if="searchFormProps"
            v-bind="searchFormProps"
            :pageName="pageName"
            :isSearchLoading="isSearchLoading"
            @search="searchHandle"
            @change="searchValueChangeHandle"
            @fieldsChange="searchFieldsChangeHandle"
            ref="searchFormRef"
        >
            <template v-for="name in distributeSlots.searchForm" #[name]="scope">
                <slot :name="name" v-bind="scope"></slot>
            </template>
        </search-form>
        <action-bar v-if="actionBarProps" v-bind="actionBarProps" :pageName="pageName" :selectRows="selectRows" ref="actionBarRef">
            <template v-for="name in distributeSlots.actionBar" #[name]="scope">
                <slot :name="name" v-bind="scope"></slot>
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
import { onMounted, ref, useSlots, computed, watch, nextTick } from "vue";
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

const emits = defineEmits(["searchValueChange", "searchFieldsChange", "selectRowsChange"]);

const slots = useSlots();

// 当前搜索条件的表单值
const searchFormInput: Ref<Record<string, any>> = ref(extend(true, {}, props.dataTableProps && props.dataTableProps.filters));

// datatable组件ref
const dataTableRef: Ref<Components.DataTableRef | null> = ref(null);

// searchForm组件ref
const searchFormRef: Ref<Components.SearchFormRef | null> = ref(null);

// actionBar组件Ref
const actionBarRef: Ref<Components.ActionBarRef | null> = ref(null);

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

// 搜索表单的值变化事件
const searchValueChangeHandle = function (field, formFields) {
    emits("searchValueChange", field, formFields);
};

// 搜索表单的字段变化事件
const searchFieldsChangeHandle = function (formFields) {
    emits("searchFieldsChange", formFields);
};

// 查询方法
const queryDataList = function (isInit = true) {
    dataTableRef.value?.queryDataList(isInit);
};

// 搜索操作
const searchHandle = function (searchFormValue) {
    extend(true, searchFormInput.value, searchFormValue);
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
            extend(true, searchFormInput.value, searchFormRef.value.getValue());
        }
        await nextTick();
        queryDataList();
    }
);

onMounted(() => {
    if (searchFormRef.value) {
        extend(true, searchFormInput.value, searchFormRef.value.getValue());
    }
    emits("selectRowsChange", selectRows.value);
});

defineExpose({
    // 分页查询
    query: queryDataList,
    // 获取当前搜索表单实时值
    getSearchingValue: function () {
        if (searchFormRef.value) {
            return extend(true, {}, props.dataTableProps && props.dataTableProps.filters, searchFormRef.value.getValue());
        }
        return extend(true, {}, searchFormInput.value);
    },
    // 获取当前已经搜索出来的结果值，与getSearchFormValue区别是当前已经用它查询出来结果的搜索表单值
    getSearchedValue: function () {
        return extend(true, {}, searchFormInput.value);
    },
    // 修改当前form字段的属性
    changeFormFields: function (callback) {
        searchFormRef.value?.changeFormFields(callback);
    },
    // 修改当前生成的button按钮值
    changeButtons: function (callback) {
        actionBarRef.value?.changeButtons(callback);
    }
});
</script>
<style lang="less" scoped>
.search-page {
    display: flex;
    flex-direction: column;
    height: 100%;
}
</style>
