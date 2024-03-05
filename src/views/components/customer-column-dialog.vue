<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2024-01-17 18:05:57
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-03-04 18:36:03
 * @项目的路径: \vue-manager-system\src\views\components\customer-column-dialog.vue
 * @描述: 自定义数据列弹窗
-->
<template>
    <el-dialog :model-value="isShow" title="自定义列" width="750px" appendToBody destroyOnClose @closed="close" :close-on-click-modal="false" class="custom-column-dialog">
        <div class="search-panel">
            <el-input v-model.trim="keyword" style="width: 360px" clearable placeholder="搜索列名" :prefix-icon="Search" @input="searchHandle" />
        </div>
        <div class="column-list-panel">
            <div class="left-contents">
                <div v-if="searchLoading" class="loading-text">数据匹配中...</div>
                <div v-else-if="noDataForSearch" class="empty-text">未匹配到数据</div>
                <div v-else-if="groupColumnKeys" class="checkbox-list-wrapper">
                    <el-collapse v-model="activeNames">
                        <el-collapse-item v-for="(item, index) in customColumns as CustomerGroupColumnData[]" :key="item.key" :name="item.key" v-show="item.isShow">
                            <template #title>
                                <el-checkbox @click.stop v-model="item.selected" :indeterminate="item.indeterminate" :label="item.key" @change="checkChange(item.selected, true, index)">
                                    {{ item.name }}
                                </el-checkbox>
                            </template>
                            <el-row>
                                <el-col :span="12" v-for="childItem in item.childList" :key="childItem.key" v-show="childItem.isShow">
                                    <el-checkbox v-model="childItem.selected" :label="childItem.key" :disabled="childItem.disabled" @change="checkChange(item.selected, false, index)">
                                        <span class="checkbox-label-text" :title="childItem.name">{{ childItem.name }}</span>
                                    </el-checkbox>
                                </el-col>
                            </el-row>
                        </el-collapse-item>
                    </el-collapse>
                </div>
                <div v-else class="checkbox-list-wrapper">
                    <el-row>
                        <el-col :span="24">
                            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" label="全选" @change="checkChange(checkAll, true)" />
                        </el-col>
                        <el-col v-for="item in customColumns as CustomerColumnData[]" :key="item.key" v-show="item.isShow" :span="12">
                            <el-checkbox v-model="item.selected" :disabled="item.disabled" @change="checkChange(item.selected, false)">
                                <span class="checkbox-label-text" :title="item.name">{{ item.name }}</span>
                            </el-checkbox>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="right-contents">
                <div class="header-row">
                    <div class="label-text">已选指标({{ selectedColumns.length }})</div>
                    <div class="label-text active" @click="restoreColumns">恢复初始</div>
                </div>
                <div class="inner-row">
                    <div class="row-info" v-for="(item, index) in flapCustomColumns" v-show="item.selected" :key="item.key">
                        <div class="name-text" :title="item.name">
                            {{ item.name }}
                        </div>
                        <el-icon v-if="!item.disabled" @click="deleteSelected(index)">
                            <Delete />
                        </el-icon>
                    </div>
                </div>
            </div>
        </div>
        <div class="error-tips">
            <template v-if="selectedColumns.length <= minSelecedNumber!">至少选中{{ minSelecedNumber }}列数据</template>
        </div>
        <template #footer>
            <el-button @click="close">取消</el-button>
            <el-button :disabled="selectedColumns.length <= minSelecedNumber!" type="primary" @click="save">应用</el-button>
        </template>
    </el-dialog>
</template>
<script lang="ts" setup>
import type { PropType } from "vue";
import type { Components } from "/#/components";
import { computed, ref } from "vue";
import { Search, Delete } from "@element-plus/icons-vue";
import { debounce } from "@yujinjin/utils";
import { getValue, setValue } from "@/services/local-storage";

/** 分组的单个数据列(父组件传过来的数值) */
interface GroupColumnData {
    // 组key值
    key: string;

    // 组中文名称
    name: string;

    // 分组数据列的key值集合
    childList: Array<string>;
}

/** 自定义弹窗中定义的数据列（不分组） */
interface CustomerColumnData {
    // 数据列key值
    key: string;

    // 数据列中文名称
    name: string;

    // 数据列是否显示
    isShow: boolean;

    // 数据列是否禁用选择
    disabled: boolean;

    // 数据列是否被选中
    selected: boolean;
}

/** 自定义弹窗中定义的分组数据列（有分组） */
interface CustomerGroupColumnData {
    // 数据列key值
    key: string;

    // 数据列中文名称
    name: string;

    // 数据列是否显示
    isShow: boolean;

    // 数据列是否被选中
    selected: boolean;

    // 复选框的不确定状态
    indeterminate: boolean;

    // 分组数据列的key值集合
    childList: Array<CustomerColumnData>;
}

const props = defineProps({
    // 是否显示弹窗
    isShow: {
        type: Boolean
    },
    // 固定展示自定义列的key，如果不传值取tableColumns中的fixed属性值来判断，如果传空数组表示没有固定展示的自定义列
    fixedColumnKeys: {
        type: Array as PropType<string[]>
    },
    // 本地存储列表名称的key值, 如果值为空就不做本地保存
    localStorageKey: {
        type: String
    },
    // 所有的自定义列key数据
    groupColumnKeys: {
        type: Array as PropType<GroupColumnData[]>
    },
    // 数据列表中的列
    tableColumns: {
        type: Array as PropType<Components.TableColumn<any>[]>,
        required: true
    },
    // 至少选择列的数量
    minSelecedNumber: {
        type: Number,
        default: 1
    }
});

const emits = defineEmits(["close", "save"]);

// 自定义列数据
const customColumns = ref<CustomerColumnData[] | CustomerGroupColumnData[]>([]);

// 搜索加载中
const searchLoading = ref(false);

// 沒有数据
const noDataForSearch = ref(false);

// 搜索的关键词
const keyword = ref("");

// 是否全选（未分组有效）
const checkAll = ref(false);

// 全选不确定状态
const isIndeterminate = ref(false);

// 当前折叠面板激活的选项
const activeNames = ref<string[]>([]);

// 拉平后的数据列表
const flapCustomColumns = computed<CustomerColumnData[]>(() => {
    if (props.groupColumnKeys) {
        return customColumns.value.map(item => item.childList).flat();
    }
    return customColumns.value;
});

// 当前选中的数据列表
const selectedColumns = computed<CustomerColumnData[]>(() => {
    return flapCustomColumns.value.filter(item => item.selected);
});

// 初始化
const init = function () {
    // 获取上次保存的自定义列数据
    const columnKeys = props.localStorageKey && getValue(props.localStorageKey);
    if (props.groupColumnKeys) {
        // 当前数据列表有分组
        props.groupColumnKeys.forEach(({ name, key, childList }) => {
            const columnItem: CustomerGroupColumnData = {
                name,
                key,
                isShow: true,
                selected: false,
                indeterminate: false,
                childList: childList.map(key => {
                    const findTableColumn = props.tableColumns.find(tableColumn => tableColumn.prop === key);
                    return {
                        name: findTableColumn?.label || "-",
                        key,
                        disabled: props.fixedColumnKeys ? props.fixedColumnKeys.includes(key) : !!findTableColumn?.fixed || false,
                        isShow: true,
                        selected: !columnKeys || columnKeys.includes(key)
                    };
                })
            };
            const selectedNumber = columnItem.childList.filter(childItem => childItem.selected).length;
            columnItem.selected = columnItem.childList.length === selectedNumber;
            columnItem.indeterminate = selectedNumber > 0 && selectedNumber < columnItem.childList.length;
            (customColumns.value as CustomerGroupColumnData[]).push(columnItem);
            activeNames.value.push(key);
        });
    } else {
        props.tableColumns.forEach(column => {
            if (column.prop && (!column.type || !["index", "selection", "expand", "action"].includes(column.type))) {
                // 排除非正常的数据列且必须定义了prop属性的
                (customColumns.value as CustomerColumnData[]).push({
                    name: column.label || "-",
                    key: column.prop,
                    disabled: column.prop && props.fixedColumnKeys ? props.fixedColumnKeys.includes(column.prop) : !!column?.fixed || false,
                    isShow: true,
                    selected: !columnKeys || columnKeys.includes(column.prop)
                });
            }
        });
        const selectedNumber = customColumns.value.filter(item => item.selected).length;
        checkAll.value = selectedNumber === customColumns.value.length;
        isIndeterminate.value = selectedNumber > 0 && selectedNumber < customColumns.value.length;
    }
    if (columnKeys) {
        // 初始化外部需要隐藏的数据列
        emits("save", columnKeys);
    }
};

// 搜索（防抖）
const searchDebounce = debounce(function () {
    if (props.groupColumnKeys) {
        customColumns.value.forEach((item, index) => {
            item.childList.forEach(childItem => {
                childItem.isShow = childItem.name.includes(keyword.value);
            });
            item.isShow = item.childList.some(childItem => childItem.isShow);
            checkChange(item.selected, false, index);
        });
    } else {
        customColumns.value.forEach(item => {
            item.isShow = item.name.includes(keyword.value);
        });
        checkChange(checkAll.value, false);
    }
    searchLoading.value = false;
    noDataForSearch.value = customColumns.value.every(item => !item.isShow);
}, 200);

// 搜索操作
const searchHandle = function () {
    searchLoading.value = true;
    searchDebounce();
};

const close = function () {
    emits("close");
};

/**
 * 复选框check变化
 * @param selected check的值
 * @param isCheckAll 是否全选
 * @param index 数据列分组的索引
 */
const checkChange = function (selected: boolean, isCheckAll: boolean, index?: number) {
    if (isCheckAll && !props.groupColumnKeys) {
        // 当前没有分组，全选check触发
        customColumns.value.forEach(item => {
            if (item.isShow && !item.disabled) {
                item.selected = selected;
            }
        });
        isIndeterminate.value = !selected && customColumns.value.some(item => item.selected);
    } else if (isCheckAll && props.groupColumnKeys) {
        // 当前有分组，全选check触发
        (customColumns.value[index!] as CustomerGroupColumnData).childList.forEach(item => {
            if (item.isShow && !item.disabled) {
                item.selected = selected;
            }
        });
        (customColumns.value[index!] as CustomerGroupColumnData).indeterminate = !selected && (customColumns.value[index!] as CustomerGroupColumnData).childList.some(item => item.selected);
    } else if (props.groupColumnKeys) {
        // 当前是分组，其childList中的数据选择有变化
        const selectedNumber = (customColumns.value[index!] as CustomerGroupColumnData).childList.filter(childItem => childItem.selected && childItem.isShow).length;
        const totalNumber = (customColumns.value[index!] as CustomerGroupColumnData).childList.filter(childItem => childItem.isShow).length;
        (customColumns.value[index!] as CustomerGroupColumnData).selected = totalNumber > 0 && selectedNumber === totalNumber;
        (customColumns.value[index!] as CustomerGroupColumnData).indeterminate = selectedNumber > 0 && selectedNumber < totalNumber;
    } else {
        // 当前未分组，其childList中的数据选择有变化
        const selectedNumber = customColumns.value.filter(item => item.selected && item.isShow).length;
        const totalNumber = customColumns.value.filter(item => item.isShow).length;
        checkAll.value = totalNumber > 0 && selectedNumber === totalNumber;
        isIndeterminate.value = selectedNumber > 0 && selectedNumber < totalNumber;
    }
};

// 恢复初始
const restoreColumns = function () {
    if (props.groupColumnKeys) {
        customColumns.value.forEach(item => {
            item.selected = true;
            item.indeterminate = false;
            item.childList.forEach(childItem => {
                childItem.selected = true;
            });
        });
    } else {
        customColumns.value.forEach(item => {
            item.selected = true;
        });
        checkAll.value = true;
        isIndeterminate.value = false;
    }
};

// 删除当前选中的数据
const deleteSelected = function (index) {
    flapCustomColumns.value[index].selected = false;
    if (props.groupColumnKeys) {
        const key = flapCustomColumns.value[index].key;
        const findIndex = customColumns.value.findIndex(item => item.childList.findIndex(childItem => childItem.key === key) !== -1);
        checkChange(false, false, findIndex);
    } else {
        checkChange(false, false);
    }
};

// 保存
const save = function () {
    const columnKeys = flapCustomColumns.value.filter(item => item.selected).map(item => item.key);
    if (props.localStorageKey) {
        setValue(props.localStorageKey, columnKeys, 0);
    }
    emits("save", columnKeys);
    emits("close");
};

init();
</script>
<style lang="scss">
.custom-column-dialog {
    --el-checkbox-height: 32px;

    .el-dialog__header {
        border-bottom: 1px solid #eeeeee;
        padding: 0px 12px 12px;
        margin-right: 0px;

        .el-dialog__title {
            font-size: 16px;
            font-weight: 500;
            color: #262626;
            line-height: 24px;
            display: inline-block;
        }

        .el-dialog__headerbtn {
            top: 1px;
            right: 5px;
        }
    }

    .el-dialog__footer {
        border-top: 1px solid #eeeeee;
        padding: 12px 24px;

        .el-button {
            width: 80px;
        }
    }

    .el-dialog__body {
        padding: 12px 20px 4px;
    }

    .el-collapse-item__header .el-checkbox__label {
        font-weight: bold;
    }

    .search-panel {
        padding-bottom: 8px;
    }

    .column-list-panel {
        display: flex;
        color: rgba(0, 0, 0, 0.65);

        .left-contents {
            width: 75%;
            padding-left: 16px;
            border: 1px solid #d9d9d9;
            border-radius: 2px;
            flex: 1;

            .loading-text,
            .empty-text {
                padding: 20px;
                text-align: center;
                color: rgba(0, 0, 0, 0.45);
            }

            .checkbox-list-wrapper {
                max-height: 284px;
                overflow-y: auto;

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
        }

        .right-contents {
            width: 25%;
            margin-left: 10px;
            border: 1px solid #d9d9d9;

            .header-row {
                display: flex;
                justify-content: space-between;
                justify-content: space-between;
                line-height: 37px;
                font-size: 12px;
                font-weight: 400;
                border-bottom: 1px solid #d9d9d9;
                padding: 0px 12px;

                .label-text.active {
                    cursor: pointer;
                    color: #00a64d;
                }
            }

            .inner-row {
                overflow-y: auto;
                max-height: 240px;
                padding: 0px 12px;

                .row-info {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    line-height: 32px;
                    height: 32px;
                    font-size: 12px;
                    padding: 0px 5px;

                    &:hover {
                        background-color: #fafafa;
                    }

                    .name-text {
                        font-weight: 400;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }

                    .el-icon {
                        cursor: pointer;
                    }
                }
            }
        }
    }

    .error-tips {
        padding-top: 4px;
        color: red;
        font-size: 12px;
        height: 20px;
    }
}
</style>
