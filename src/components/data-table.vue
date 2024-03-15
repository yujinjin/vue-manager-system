<template>
    <div class="data-table-panel" ref="dataTablePanelRef">
        <el-table :data="dataList" v-bind="tableProps" v-on="events" @selection-change="selectionChangeHandle" v-loading="isLoadingForSearch" element-loading-text="拼命加载中...">
            <template v-for="(columnItem, index) in columnList">
                <el-table-column v-if="columnItem.isShow" :key="(columnItem.prop || '') + '_' + index" v-bind="columnItem">
                    <template v-if="columnItem.slotHeader" #header="scope">
                        <slot :name="columnItem.slotHeader" v-bind="scope"></slot>
                    </template>
                    <template #default="scope">
                        <slot v-if="columnItem.slot" :name="columnItem.slot" v-bind="scope"></slot>
                        <!-- 日期 -->
                        <table-column-date v-else-if="columnItem.type === 'date'" :value="getCellValue(scope.row, columnItem, scope.$index)" :formate="columnItem.formate" />
                        <!-- 数字 -->
                        <table-column-number v-else-if="columnItem.type === 'number'" :value="getCellValue(scope.row, columnItem, scope.$index)" :digit="columnItem.digit || 0" />
                        <!-- 图片 -->
                        <table-column-image v-else-if="columnItem.type === 'image'" v-bind="columnItem" :value="getCellValue(scope.row, columnItem, scope.$index)" />
                        <!-- 枚举 -->
                        <table-column-enum v-else-if="columnItem.type === 'enum'" v-bind="columnItem" :value="getCellValue(scope.row, columnItem, scope.$index)" />
                        <!-- 操作按钮 -->
                        <table-column-action v-else-if="columnItem.type === 'action'" v-bind="columnItem" :row="scope.row" />
                    </template>
                </el-table-column>
            </template>
        </el-table>
        <div v-if="isShowPagination" class="pagination-wrapper" ref="paginationRef">
            <el-pagination v-bind="paginationData" @size-change="pageSizeChangeHandle" @current-change="currentPageChangeHandle" />
        </div>
    </div>
</template>
<script setup lang="ts">
import type { Components } from "/#/components";
import type { PaginationProps, TableProps } from "element-plus";
import type { Ref, PropType } from "vue";
import { onMounted, onUnmounted, ref, watch, nextTick } from "vue";
import { PAGE_ITEMS } from "@/services/constants";
import tableColumnDate from "./table/table-column-date.vue";
import tableColumnNumber from "./table/table-column-number.vue";
import tableColumnImage from "./table/table-column-image.vue";
import tableColumnEnum from "./table/table-column-enum.vue";
import tableColumnAction from "./table/table-column-action.vue";
import { dataStore } from "@/stores/";
import { extend } from "@yujinjin/utils";
import { debounce } from "@yujinjin/utils";
import type { NotReadonly } from "/#/global";

const props = defineProps({
    // 当前列表查询函数, 可返回Promise
    query: {
        type: Function as PropType<(...args) => Promise<any>>,
        required: true
    },
    // type: "number|action|date|enum|image" // 数据列的自定义类型，可以不传
    // type是action => buttons: [], // 操作按钮列表| maxNumShow: 3, // 最多展示数 (默认是3)
    // type是number => digit: 0, // 数字格式化小数点位数(默认是0)
    // type是date => formate: 0, // 日期格式化字符串(默认是YYYY-MM-DD) | separator 分隔符，多个日期展示用。默认是“-”
    // type是enum => data: [] // 数据枚举列表 | separator: "," // 多个内容的分隔符(默认是",") | valueKey: 枚举列表中value对应的属性值 | textKey: valueKey: 枚举列表中name对应的属性值
    // props: el-table-column 的属性值具体参照element plus Table-column 属性，注意：如果有type有值prop值必传
    columns: {
        type: Array as PropType<Components.TableColumn<any>[]>,
        default() {
            return [];
        },
        required: true
    },
    // 是否自动初始化查询
    autoInitQuery: {
        type: Boolean,
        default: true
    },
    // 当前选中的行数据列表
    selectRows: {
        type: Array,
        default: function () {
            return [];
        }
    },
    // 当前列表查询滤参数
    filters: {
        type: Object,
        default() {
            return {};
        }
    },
    // table 其他属性具体参照element plus table文档
    props: {
        type: Object as PropType<TableProps<any>>,
        default() {
            return {};
        }
    },
    // table 其他事件具体参照element plus table文档
    events: {
        type: Object as PropType<Record<string, (...args: any[]) => any>>,
        default() {
            return {};
        }
    },
    // 查询参数数据加工（查询前参数处理函数）
    queryParametersProcess: {
        type: Function as PropType<(parameters?: any) => any>
    },
    // 查询数据结果加工（查询后数据结果处理函数）
    queryResponseProcess: {
        type: Function as PropType<(reponseData: any) => any>
    },
    // 是否显示分页
    isShowPagination: {
        type: Boolean,
        default: true
    },
    // 数据分页属性
    pagination: {
        type: Object as PropType<Partial<PaginationProps>>,
        default() {
            return {};
        }
    },
    // // dom 重新调整尺寸大小的事件ID
    // resizeId: {
    //     type: Number
    // },
    // 页面名称，用于获取有权限的按钮数据
    pageName: String
});

const emits = defineEmits(["update:selectRows", "search"]);

// table 默认属性
const tableProps: Ref<Partial<TableProps<any>>> = ref({});

// 数据列表
const dataList = ref([]);

// 处理后的数据列表
const columnList: Ref<Components.TableColumn<any>[]> = ref([]);

// 查询是否正在加载
const isLoadingForSearch: Ref<boolean> = ref(false);

// 数据分页属性
const paginationData: Ref<Partial<NotReadonly<PaginationProps>>> = ref({
    total: 0, // 总记录数
    currentPage: 1 // 当前页数
});

const dataTablePanelRef: Ref<HTMLDivElement | null> = ref(null);

const paginationRef: Ref<HTMLDivElement | null> = ref(null);

const store = dataStore();

// 当选择项发生变化时会触发该事件
const selectionChangeHandle = function (selectRows) {
    emits("update:selectRows", selectRows);
};

// 初始化分页数据
const initPaginationData = function () {
    if (!props.isShowPagination) {
        return;
    }
    const { total, currentPage } = paginationData.value;
    paginationData.value = Object.assign(
        {
            pageSize: PAGE_ITEMS,
            layout: "total, sizes, prev, pager, next, jumper",
            pageSizes: [10, 20, 30, 50, 100],
            // background: true,
            small: true
        },
        props.pagination,
        { total, currentPage }
    );
};

// TODO: 收起/展开事件触发
// 初始化table 最大高度
const initTableMaxHeight = async function () {
    if (props.props && (props.props.height || props.props.maxHeight)) {
        // 当前数据表格已经指定高度，就不再自动计算了
        return;
    }
    await nextTick();
    tableProps.value.maxHeight = dataTablePanelRef.value!.clientHeight - (paginationRef.value ? paginationRef.value.offsetHeight : 0) - 15;
    if (tableProps.value.maxHeight < 100) {
        tableProps.value.maxHeight = 100;
    }
    // console.info("=========initTableMaxHeight", dataTablePanelRef.value.clientHeight, paginationRef.value.offsetHeight);
};

// 初始化table属性
const initTableProps = function () {
    tableProps.value = Object.assign(
        {
            stripe: true, // 隔行变色
            border: false, // 是否带有纵向边框
            rowKey: "id",
            size: "small",
            scrollbarAlwaysOn: true,
            tooltipEffect: "light",
            tooltipOptions: {
                popperClass: "ellipsis-table-tooltip-popover"
            },
            style: {
                width: "100%"
            },
            maxHeight: tableProps.value.maxHeight
        },
        props.props || {}
    );
};

// TODO: selectRows 事件

// 初始化columns 数据
const initColumns = function () {
    columnList.value = [];
    props.columns.forEach(columnItem => {
        const newColumnItem = extend(true, { isShow: true }, columnItem);
        if (newColumnItem.type === "action" && newColumnItem.buttons && newColumnItem.buttons.length > 0) {
            if (props.pageName) {
                newColumnItem.buttons = newColumnItem.buttons.filter(button => {
                    return !button.handleCode || (store.buttonPermissions[props.pageName!] && store.buttonPermissions[props.pageName!].includes(button.handleCode));
                });
            }
            if (newColumnItem.fixed === undefined) {
                newColumnItem.fixed = "right";
            }
            if (!newColumnItem.label) {
                newColumnItem.label = "操作";
            }
        } else if (newColumnItem.type === "index" && !newColumnItem.index) {
            newColumnItem.index = function (index) {
                if (props.isShowPagination) {
                    return (paginationData.value.currentPage! - 1) * paginationData.value.pageSize! + index + 1;
                }
                return index + 1;
            };
        } else if (!newColumnItem.type && !newColumnItem.formatter) {
            newColumnItem.formatter = function (row, column, cellValue) {
                return cellValue === null || cellValue === undefined ? "-" : cellValue;
            };
        }
        columnList.value.push(newColumnItem);
    });
};

// 查询数据
const queryDataList = async function (isInit = true) {
    if (isLoadingForSearch.value) {
        return;
    }
    isLoadingForSearch.value = true;
    emits("search", true);
    try {
        if (isInit && props.isShowPagination) {
            paginationData.value.currentPage = 1;
        }
        let parameters = Object.assign({}, props.filters, props.isShowPagination ? { pageNo: paginationData.value.currentPage, pageSize: paginationData.value.pageSize } : {});
        if (props.queryParametersProcess) {
            parameters = props.queryParametersProcess(parameters);
        }
        let queryResult = await props.query(parameters);
        if (props.queryResponseProcess) {
            queryResult = props.queryResponseProcess(queryResult);
        }
        if (props.isShowPagination) {
            dataList.value = queryResult.rows || [];
            paginationData.value.total = queryResult.total || 0;
        } else {
            dataList.value = queryResult || [];
        }
    } catch (error) {
        logs.error(error);
    }
    isLoadingForSearch.value = false;
    emits("search", false);
};

// 获取当前数据列的值
const getCellValue = function (row, columnItem, index: number) {
    if (columnItem.formatter) {
        return columnItem.formatter(row, columnItem, columnItem.prop ? row[columnItem.prop] : null, index);
    }
    if (!columnItem.prop) {
        return null;
    }
    if (columnItem.prop.split(",").length > 1) {
        return columnItem.prop.split(",").map(key => row[key]);
    }
    return row[columnItem.prop];
};

// 分页中每页条目数据变换
const pageSizeChangeHandle = function (pageSize: number) {
    paginationData.value.pageSize = pageSize;
    queryDataList();
};

// 分页中的当前页码变换
const currentPageChangeHandle = function (currentPage) {
    paginationData.value.currentPage = currentPage;
    queryDataList(false);
};

watch(
    () => props.pagination,
    () => {
        initPaginationData();
    },
    { deep: true, immediate: true }
);

watch(
    () => props.props,
    () => {
        initTableProps();
    },
    { deep: true, immediate: true }
);

watch(
    () => props.columns,
    () => {
        initColumns();
    },
    { deep: true, immediate: true }
);

// window resize 事件函数
let resizeHandle: (e: UIEvent) => any;

if (!props.props || (!props.props.height && !props.props.maxHeight)) {
    resizeHandle = debounce(initTableMaxHeight, 100);
    // 当前数据表格已经指定高度，就不再自动计算了
    window.addEventListener("resize", resizeHandle);
}

onMounted(async () => {
    await initTableMaxHeight();
    if (props.autoInitQuery) {
        queryDataList();
    }
});

onUnmounted(() => {
    if (resizeHandle) {
        window.removeEventListener("resize", resizeHandle);
    }
});

defineExpose<Components.DataTableRef>({
    /** 初始化表格最大高度 */
    initTableMaxHeight,

    /** 查询数据列表 */
    queryDataList,

    /**
     * 更新数据列显示状态
     * @param columnKeys 显示列key值数组（不传值表示都展示）
     */
    updateTableColumnsShowStatus(columnKeys?: string[]) {
        columnList.value.forEach(column => {
            if (column.prop) {
                column.isShow = !columnKeys || columnKeys.includes(column.prop);
            }
        });
    }
});
</script>
<style lang="less" scoped>
.data-table-panel {
    padding: 12px 16px 0px;
    flex: 1;
    overflow-y: auto;

    :deep(.el-table) {
        // --el-border-color-lighter: #ebeef5;

        .el-table__header {
            thead tr {
                background-color: #f7f7fa;
                box-shadow: 0px 1px 0px 0px #f5f5f5;
                border-radius: 4px 4px 0px 0px;

                th {
                    background-color: #f5f5f5;

                    &.el-table__cell {
                        padding: 10px 0px;
                    }

                    &:first-child {
                        border-top-left-radius: 4px;
                    }

                    &:last-child {
                        border-top-right-radius: 4px;
                    }
                    .cell {
                        font-weight: 500;
                        color: #262626;
                        line-height: 20px;
                    }
                }
            }
        }

        .el-table__body {
            tbody tr {
                td {
                    &.el-table__cell {
                        padding: 10px 0;
                    }
                    .cell {
                        font-weight: 400;
                        color: #595959;
                    }
                }
            }
        }

        .el-table-column--selection .cell {
            .el-checkbox__inner {
                width: 16px;
                height: 16px;
            }
            .el-checkbox__inner::after {
                height: 8px;
                left: 5px;
            }
        }
    }

    .pagination-wrapper {
        display: flex;
        justify-content: flex-end;
        padding-top: 10px;
    }
}
</style>
<style lang="scss">
.el-popper.ellipsis-table-tooltip-popover {
    max-width: 500px;
    background-color: #fff;
    border: 0px;
    box-shadow:
        0px 9px 28px 8px rgba(0, 0, 0, 0.05),
        0px 6px 16px 0px rgba(0, 0, 0, 0.08),
        0px 3px 6px -4px rgba(0, 0, 0, 0.12);
    color: #121736;
    padding: 8px;
    font-weight: 400;
    color: #121736;
    font-size: 14px;
    line-height: 22px;
}
</style>
