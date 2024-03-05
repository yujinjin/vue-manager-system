<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2024-03-04 16:06:43
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-03-05 17:08:56
 * @项目的路径: \vue-manager-system\src\views\plays\order-list\components\excel-export-dialog.vue
 * @描述: Excel大数据导出弹窗
-->
<template>
    <el-dialog v-model="dialogVisible" title="订单Excel大数据导出" class="common-dialog" width="800px" @closed="dialogClosed">
        <el-collapse v-model="activeCollapseNames" v-show="!progressInfo.isShow" style="border: 0px">
            <el-collapse-item name="1">
                <template #title>
                    <div class="header-content">
                        <div class="title-bar">筛选条件</div>
                        <el-checkbox v-model="isStorageSearchFormValue" @click.stop>记住当前筛选项的值</el-checkbox>
                    </div>
                </template>
                <search-form ref="searchFormRef" :fields="searchFields" :isShowSearchButton="false" :isShowCollapse="false" @fieldsChange="initSearchFieldsValue" />
            </el-collapse-item>
            <el-collapse-item name="2">
                <template #title>
                    <div class="header-content">
                        <div class="title-bar">导入字段</div>
                        <el-input v-model.trim="keyword" @click.stop style="width: 360px" clearable placeholder="搜索字段" :prefix-icon="Search" @input="searchHandle" />
                    </div>
                </template>
                <div v-if="searchLoading" class="loading-text">数据匹配中...</div>
                <div v-else-if="noDataForSearch" class="empty-text">未匹配到数据</div>
                <div v-else class="checkbox-list-wrapper">
                    <el-row>
                        <el-col :span="24">
                            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" label="全选" @change="checkChange(checkAll, true)" />
                        </el-col>
                        <el-col v-for="item in exportFields" :key="item.key" v-show="item.isShow" :span="8">
                            <el-checkbox v-model="item.selected" :disabled="item.disabled" @change="checkChange(item.selected, false)">
                                <span class="checkbox-label-text" :title="item.name">{{ item.name }}</span>
                            </el-checkbox>
                        </el-col>
                    </el-row>
                </div>
            </el-collapse-item>
        </el-collapse>
        <div v-if="progressInfo.isShow" class="virtually-progress-panel">
            <virtually-progress :finished="!progressInfo.isLoading" @after-finished="progressInfo.isShow = false">
                <div class="state-text">正在导出数据，请耐心等待...</div>
            </virtually-progress>
        </div>
        <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button :disabled="selectedFields.length <= minSelecedFields.length" type="primary" :loading="progressInfo.isLoading" @click="submitHandle">确定导出</el-button>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import type { PropType } from "vue";
import type { Components } from "/#/components";
import { ref, watch, computed, reactive } from "vue";
import { Search } from "@element-plus/icons-vue";
import { debounce, getObjectProperty, dateFormat } from "@yujinjin/utils";
import commonApi from "@/api/common";
import virtuallyProgress from "@views/components/virtually-progress.vue";

const props = defineProps({
    isShow: {
        type: Boolean
    },
    // 搜索字段列表
    searchFields: {
        type: Array as PropType<Components.SearchFormField[]>,
        default: function () {
            return [];
        }
    },
    searchFormValue: {
        type: Object,
        default() {
            return {};
        }
    },
    tableColumns: {
        type: Array as PropType<Components.TableColumn<any>[]>,
        default() {
            return [];
        }
    }
});

const emits = defineEmits(["update:isShow"]);

// 弹窗显示状态
const dialogVisible = ref(false);

const activeCollapseNames = ref(["1", "2"]);

// 是否记住当前筛选条件的值
const isStorageSearchFormValue = ref(false);

// 搜索表单实例
const searchFormRef = ref<Components.SearchFormRef>();

// 搜索加载中
const searchLoading = ref(false);

// 沒有数据
const noDataForSearch = ref(false);

// 筛选字段的搜索关键字
const keyword = ref<string>("");

// 筛选字段是否全选
const checkAll = ref<boolean>(true);

// 全选不确定状态
const isIndeterminate = ref(false);

// 导出字段列表
const exportFields = ref<Array<Record<string, any>>>([]);

// 处理信息
const progressInfo = reactive({
    isShow: false, // 是否显示处理进度
    isLoading: false // 是否正在导出数据
});

// 当前选中的数据列表
const selectedFields = computed(() => exportFields.value.filter(item => item.selected));

// 至少选择列的数量
const minSelecedFields = computed(() => exportFields.value.filter(item => item.disabled));

// 初始化筛选条件的值
const initSearchFieldsValue = function () {
    if (!isStorageSearchFormValue.value && searchFormRef.value) {
        searchFormRef.value!.changeFormFields(function (formFields: Components.SearchFormField[]) {
            formFields.forEach(fieldItem => {
                if (fieldItem.props) {
                    fieldItem.value = getObjectProperty(props.searchFormValue, fieldItem.name, null);
                }
            });
        });
    }
};

// 初始化导出字段列表
const initExportFields = function () {
    exportFields.value = [];
    props.tableColumns.forEach(column => {
        if (column.prop && (!column.type || !["index", "selection", "expand", "action"].includes(column.type))) {
            exportFields.value.push({
                name: column.label || "-",
                key: column.prop,
                disabled: !!column.fixed,
                isShow: true,
                selected: true
            });
        }
    });
};

// 弹窗关闭事件
const dialogClosed = function () {
    emits("update:isShow", false);
};

/**
 * 复选框check变化
 * @param selected check的值
 * @param isCheckAll 是否全选
 */
const checkChange = function (selected: boolean, isCheckAll: boolean) {
    if (isCheckAll) {
        exportFields.value.forEach(item => {
            if (item.isShow && !item.disabled) {
                item.selected = selected;
            }
        });
        isIndeterminate.value = !selected && exportFields.value.some(item => item.selected);
    } else {
        // 当前未分组，其childList中的数据选择有变化
        const selectedNumber = exportFields.value.filter(item => item.selected && item.isShow).length;
        const totalNumber = exportFields.value.filter(item => item.isShow).length;
        checkAll.value = totalNumber > 0 && selectedNumber === totalNumber;
        isIndeterminate.value = selectedNumber > 0 && selectedNumber < totalNumber;
    }
};

// 搜索（防抖）
const searchDebounce = debounce(function () {
    exportFields.value.forEach(item => {
        item.isShow = (item.name as string).includes(keyword.value);
    });
    checkChange(checkAll.value, false);
    searchLoading.value = false;
    noDataForSearch.value = exportFields.value.every(item => !item.isShow);
}, 200);

// 搜索操作
const searchHandle = function () {
    searchLoading.value = true;
    searchDebounce();
};

// 导出功能
const submitHandle = function () {
    if (progressInfo.isLoading) {
        return;
    }
    progressInfo.isShow = true;
    progressInfo.isLoading = true;
    setTimeout(
        async () => {
            await commonApi.download({
                type: "a",
                url: require("@assets/templates/批量新增菜单模板.xlsx"),
                fileName: "订单数据导出(" + dateFormat(Date.now()) + ").xlsx"
            });
            progressInfo.isLoading = false;
        },
        parseInt((Math.random() * 1000 * 10).toFixed(0), 10)
    );
};

watch(
    () => props.tableColumns,
    () => initExportFields(),
    {
        immediate: true
    }
);

watch(
    () => props.isShow,
    value => {
        if (value) {
            dialogVisible.value = value;
            initSearchFieldsValue();
        }
    }
);
</script>
<style lang="scss" scoped>
.header-content {
    display: flex;
    align-items: center;
    height: 100%;

    .title-bar {
        line-height: 24px;
        padding: 0px 12px;
        // height: 100%;
        // padding: 8px 0px 16px 12px;
        position: relative;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        font-size: 16px;

        &::before {
            content: "";
            position: absolute;
            left: 0px;
            top: 4px;
            width: 4px;
            height: 16px;
            background-color: #00b85c;
            border-radius: 2px;
        }
    }
}

:deep(.search-panel) {
    border-bottom: 0px;
}

.loading-text,
.empty-text {
    padding: 20px;
    text-align: center;
    color: rgba(0, 0, 0, 0.45);
}

.checkbox-list-wrapper {
    padding: 0px 12px;
    .el-checkbox__label {
        display: inline-flex;
    }

    .checkbox-label-text {
        display: inline-block;
        white-space: nowrap;
        word-wrap: normal;
        width: 215px;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 30px;
    }
}

.virtually-progress-panel {
    height: 350px;
    padding: 12px;
    display: flex;
    align-items: center;
}
</style>
