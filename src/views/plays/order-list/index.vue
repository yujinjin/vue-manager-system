<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2024-01-19 16:44:26
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-01-26 12:00:18
 * @项目的路径: \vue-manager-system\src\views\plays\order-list\index.vue
 * @描述: 订单查询页面
-->
<template>
    <search-page v-bind="searchConfigData" ref="searchPageRef" @selectRowsChange="selectRowsChangeHandle">
        <template #dataTable_orderNo="{ row }">
            <table-column-copy :value="row.orderNo" />
        </template>
        <template #actionBar_default>
            <el-radio-group v-model="searchConfigData.dataTableProps.filters.orderStatus" @change="refreshHandle">
                <el-radio-button label="">全部订单({{ orertReportData.allCount }})</el-radio-button>
                <el-radio-button :label="10">待付款({{ orertReportData.pendingCount }})</el-radio-button>
                <el-radio-button :label="20">待发货({{ orertReportData.paidCount }})</el-radio-button>
                <el-radio-button :label="30">已发货({{ orertReportData.deliveredCount }})</el-radio-button>
                <el-radio-button :label="40">已签收({{ orertReportData.completedCount }})</el-radio-button>
                <el-radio-button :label="-1">已取消({{ orertReportData.cancelledCount }})</el-radio-button>
                <el-radio-button :label="-5">已退款({{ orertReportData.refundedCount }})</el-radio-button>
            </el-radio-group>
        </template>
        <template #dataTable_orderStatusHeader>
            <div class="order-status-header">
                订单状态
                <el-popover width="450" trigger="hover" popper-style="padding: 0px">
                    <div class="tips-popover">
                        <div class="title-text">订单状态说明</div>
                        <div class="subtitle-text">1.订单取消</div>
                        <div class="contents-text">订单因为某些原因被取消，比如用户取消订单或者商家无法完成订单。</div>
                        <div class="subtitle-text">2.售后中</div>
                        <div class="contents-text">用户在付款后发货前申请退款，或商家发货后用户申请退款、换货，都会产生这种订单状态。</div>
                        <div class="subtitle-text">3.退款中</div>
                        <div class="contents-text">当买家在待发货的时候，选择了订单中某个商品进行退款，此时订单进入状态“退款中”。</div>
                        <div class="subtitle-text">4.已退款</div>
                        <div class="contents-text">买家已经申请了售后服务退款，并且卖家已经同意退款，款项已经成功退回到买家的账户中。</div>
                        <div class="subtitle-text">5.待付款</div>
                        <div class="contents-text">用户刚提交订单，尚未付款，等待用户支付。由于待付款状态会锁定存，所以一般会设置超时自动取消功能。</div>
                        <div class="subtitle-text">6.待发货</div>
                        <div class="contents-text">用户付款之后，等待仓库出仓发货。</div>
                        <div class="subtitle-text">7.已发货</div>
                        <div class="contents-text">仓库已经将商品发出，用户可以通过物流信息了解商品的运输情况。</div>
                        <div class="subtitle-text">8.已签收</div>
                        <div class="contents-text">商品已经被用户签收，订单完成。</div>
                        <div class="subtitle-text">9.交易关闭</div>
                        <div class="contents-text">当售后完成后的订单状态。“已取消”的订单状态可以合并到“交易关闭”中。</div>
                    </div>
                    <template #reference>
                        <el-icon>
                            <QuestionFilled />
                        </el-icon>
                    </template>
                </el-popover>
            </div>
        </template>
        <customer-column-dialog
            :is-show="isShowCustomerColumnDialog"
            :tableColumns="searchConfigData.dataTableProps.columns"
            localStorageKey="orderListCustomerColumns"
            @close="isShowCustomerColumnDialog = false"
            @save="saveColumnShowStatusHandle"
        />
        <view-order-details-dialog v-if="isShowViewOrderDetailsDialog" :row="selectedRow" @close="isShowViewOrderDetailsDialog = false" />
    </search-page>
</template>
<script setup lang="ts">
import type { Components } from "/#/components";
import { ref, reactive, nextTick } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { QuestionFilled } from "@element-plus/icons-vue";
import { dateFormat } from "@yujinjin/utils";
import { HANDLE_CODES } from "@/services/constants";
import searchConfig from "./search-config";
import commonApi from "@/api/common";
import demoAPI from "@api/demo";
import customerColumnDialog from "@views/components/customer-column-dialog.vue";
import tableColumnCopy from "./components/table-column-copy.vue";
import viewOrderDetailsDialog from "./components/view-order-details-dialog.vue";

// search page 组件
const searchPageRef = ref<Components.SearchPageRef>();

// 是否显示自定义列信息弹窗
const isShowCustomerColumnDialog = ref(false);

// 是否显示订单详情信息弹窗
const isShowViewOrderDetailsDialog = ref(false);

// 当前选中数据列
const selectedRow = ref();

// 当前订单统计数据
const orertReportData = reactive({
    allCount: 0,
    pendingCount: 0,
    paidCount: 0,
    deliveredCount: 0,
    completedCount: 0,
    cancelledCount: 0,
    refundedCount: 0
});

// 数据刷新操作
const refreshHandle = async function () {
    await searchPageRef.value!.query();
};

// 当前选择的数据变化事件
const selectRowsChangeHandle = function (rows) {
    searchPageRef.value?.changeButtons((actionButtons: Components.TableButton[]) => {
        const button = actionButtons.find(button => button.handleCode === HANDLE_CODES.BATCHCANCEL);
        if (!button) {
            return;
        }
        if (!button.props) {
            button.props = {};
        }
        button.props.disabled = rows.length === 0 || rows.some(row => row.orderStatus !== 10);
    });
};

// 显示菜单相关操作信息弹
const showDialogHandle = function (rows, { handleCode }) {
    if (HANDLE_CODES.QUERY === handleCode) {
        // 展示自定义列弹窗
        selectedRow.value = null;
        isShowCustomerColumnDialog.value = true;
    } else if (HANDLE_CODES.SEARCH === handleCode) {
        // 查看订单详情
        selectedRow.value = rows;
        isShowViewOrderDetailsDialog.value = true;
    }
};

// 渠道订单操作
const cancelOrderHandle = async function (rows, { handleCode }) {
    let tips = "确定要取消当前选中的订单信息吗?";
    if (handleCode === HANDLE_CODES.CANCEL) {
        rows = [rows];
    } else {
        tips = "确定要取消当前选中的" + rows.length + "个订单信息吗?";
    }
    await ElMessageBox.confirm(tips, "信息确认", {
        customClass: "custom-confirm",
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
    });
    await demoAPI.batchUpdateOrderStatus({ orderNoList: rows.map(row => row.orderNo), status: 10 });
    ElMessage({
        customClass: "custom-message",
        message: "操作成功",
        type: "success"
    });
    refreshHandle();
};

// excel 导出
const excelExportHandle = function () {
    commonApi.download({
        type: "a",
        url: require("@assets/templates/批量新增菜单模板.xlsx"),
        fileName: "订单数据导出(" + dateFormat(Date.now()) + ").xlsx"
    });
};

// 修改数据列展示状态操作
const saveColumnShowStatusHandle = async function (columnKeys: string[]) {
    if (!searchPageRef.value) {
        await nextTick();
    }
    searchPageRef.value?.updateTableColumnsShowStatus(columnKeys);
};

// 搜索页配置数据
const searchConfigData = reactive(searchConfig({ showDialogHandle, excelExportHandle, cancelOrderHandle, orertReportData }));
</script>
<style lang="scss" scoped>
.order-status-header {
    display: flex;
    align-items: center;

    .el-icon {
        color: #999;
        font-size: 16px;
        margin-left: 4px;
    }
}
.tips-popover {
    padding: 12px 24px;
    max-height: 300px;
    overflow-y: auto;

    .title-text {
        text-align: center;
        padding-bottom: 5px;
        line-height: 30px;
        font-size: 18px;
        color: #000;
    }

    .subtitle-text {
        padding: 5px 0px;
        line-height: 25px;
        font-size: 15px;
        color: #000;
    }

    .contents-text {
        line-height: 20px;
        font-size: 13px;
    }
}
</style>
