<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2024-01-23 11:53:58
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-01-26 11:54:17
 * @项目的路径: \vue-manager-system\src\views\plays\order-list\components\view-order-details-dialog.vue
 * @描述: 查看订单详情信息弹窗
-->
<template>
    <el-dialog v-model="dialogVisible" title="查看订单详细信息" class="dialog-form" width="800px" @closed="dialogClosed">
        <el-collapse v-model="activeCollapseNames">
            <el-collapse-item name="1">
                <template #title>
                    <div class="title-bar">订单信息</div>
                </template>
                <el-descriptions direction="vertical" :column="3" border>
                    <el-descriptions-item label="订单编号">
                        <el-tag>{{ orderDetails.orderNo }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="订单状态">
                        <el-tag>{{ getEnumText(orderDetails.orderStatus, ORDER_STATUS_ENUM) }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="订单金额(元)">
                        {{ numberFormat(orderDetails.orderAmount, 2) }}
                    </el-descriptions-item>
                    <el-descriptions-item label="订单来源">
                        {{ getEnumText(orderDetails.deviceSource, DEVICE_SOURCE_ENUM) }}
                    </el-descriptions-item>
                    <el-descriptions-item label="下单时间">
                        {{ dateFormat(orderDetails.createTime, "YYYY-MM-DD HH:mm:ss") }}
                    </el-descriptions-item>
                    <el-descriptions-item label="下单用户ID">
                        {{ orderDetails.buyerId }}
                    </el-descriptions-item>
                    <el-descriptions-item label="下单用户名称">
                        {{ orderDetails.buyerName }}
                    </el-descriptions-item>
                    <el-descriptions-item label="下单用户手机号">
                        {{ orderDetails.buyerMobileNumber }}
                    </el-descriptions-item>
                    <el-descriptions-item label="收货人姓名">
                        {{ orderDetails.receiver }}
                    </el-descriptions-item>
                    <el-descriptions-item label="收货人手机号">
                        {{ orderDetails.receiverMobileNumber }}
                    </el-descriptions-item>
                    <el-descriptions-item label="收货地址" :span="3">
                        {{ orderDetails.receiverAddress }}
                    </el-descriptions-item>
                    <el-descriptions-item label="用户备注" :span="3">
                        {{ orderDetails.remark || "-" }}
                    </el-descriptions-item>
                </el-descriptions>
            </el-collapse-item>
            <el-collapse-item name="2">
                <template #title>
                    <div class="title-bar">支付信息</div>
                </template>
                <el-descriptions direction="vertical" :column="2" border v-if="orderDetails.payInfo">
                    <el-descriptions-item label="支付流水号">
                        <el-tag>{{ orderDetails.payInfo.payNo }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="支付金额(元)">
                        {{ numberFormat(orderDetails.payInfo.payAmount, 2) }}
                    </el-descriptions-item>
                    <el-descriptions-item label="支付时间">
                        {{ dateFormat(orderDetails.payInfo.payTime, "YYYY-MM-DD HH:mm:ss") }}
                    </el-descriptions-item>
                    <el-descriptions-item label="支付方式">
                        {{ getEnumText(orderDetails.payInfo.payWay, PAY_WAY_ENUM) }}
                    </el-descriptions-item>
                </el-descriptions>
                <el-tag v-else type="info">无支付信息</el-tag>
            </el-collapse-item>
            <el-collapse-item name="3">
                <template #title>
                    <div class="title-bar">商品列表</div>
                </template>
                <data-table :isShowPagination="false" :props="{ maxHeight: 250 }" :columns="goodsDataTableFields" :query="() => orderDetails.goodsList" />
            </el-collapse-item>
            <el-collapse-item name="4">
                <template #title>
                    <div class="title-bar">使用优惠券列表</div>
                </template>
                <data-table :isShowPagination="false" :props="{ maxHeight: 250 }" :columns="couponDataTableFields" :query="() => orderDetails.couponList" />
            </el-collapse-item>
            <el-collapse-item name="5">
                <template #title>
                    <div class="title-bar">物流信息</div>
                </template>
                <el-tag v-if="!orderDetails.logisticsList || orderDetails.logisticsList.length === 0" type="info">无物流信息</el-tag>
                <el-descriptions
                    v-for="(logisticsItem, index) in orderDetails.logisticsList"
                    :key="logisticsItem.logisticsNumber"
                    :title="'包裹' + (index + 1)"
                    direction="vertical"
                    :column="2"
                    border
                >
                    <el-descriptions-item label="物流单号">
                        <el-tag>{{ logisticsItem.logisticsNumber }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="物流公司">
                        {{ logisticsItem.companyName }}
                    </el-descriptions-item>
                    <el-descriptions-item label="商品列表" :span="2">
                        <data-table
                            :isShowPagination="false"
                            :props="{ maxHeight: 100 }"
                            :columns="goodsDataTableFields.filter(item => ['name', 'img', 'specs', 'code', 'quantity'].includes(item.prop))"
                            :query="() => logisticsItem.goodsList"
                        />
                    </el-descriptions-item>
                </el-descriptions>
            </el-collapse-item>
            <el-collapse-item name="6">
                <template #title>
                    <div class="title-bar">售后信息</div>
                </template>
                <el-tag v-if="!orderDetails.afterSalesList || orderDetails.afterSalesList.length === 0" type="info">无售后信息</el-tag>
                <el-descriptions v-for="(afterSalesItem, index) in orderDetails.afterSalesList" :key="index" :title="'售后' + (index + 1)" direction="vertical" :column="2" border>
                    <el-descriptions-item label="售后类型">
                        <el-tag>{{ afterSalesItem.type }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="提交售后时间">
                        {{ dateFormat(afterSalesItem.createTime, "YYYY-MM-DD HH:mm:ss") }}
                    </el-descriptions-item>
                    <el-descriptions-item label="涉及物流单号">
                        {{ afterSalesItem.logisticsNumbers }}
                    </el-descriptions-item>
                    <el-descriptions-item label="退款金额">
                        {{ (afterSalesItem.refundAmount && numberFormat(afterSalesItem.refundAmount, 2)) || "-" }}
                    </el-descriptions-item>
                    <el-descriptions-item label="售后原因">
                        {{ afterSalesItem.reason || "-" }}
                    </el-descriptions-item>
                    <el-descriptions-item label="用户备注">
                        {{ afterSalesItem.remark || "-" }}
                    </el-descriptions-item>
                    <el-descriptions-item label="涉及商品列表" :span="2">
                        <data-table
                            :isShowPagination="false"
                            :props="{ maxHeight: 100 }"
                            :columns="goodsDataTableFields.filter(item => ['name', 'img', 'specs', 'code', 'quantity'].includes(item.prop))"
                            :query="() => afterSalesItem.goodsList"
                        />
                    </el-descriptions-item>
                </el-descriptions>
            </el-collapse-item>
        </el-collapse>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">关闭弹窗</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { dateFormat, numberFormat } from "@yujinjin/utils";
import demoAPI from "@api/demo";
import { DEVICE_SOURCE_ENUM, ORDER_STATUS_ENUM, PAY_WAY_ENUM } from "../constants";

const props = defineProps({
    row: {
        type: Object
    }
});

const emits = defineEmits(["close"]);

// 当前激活的折叠面板列表
const activeCollapseNames = ref(["1", "2", "3", "4", "5", "6"]);

// 弹窗关闭事件
const dialogClosed = function () {
    emits("close", false);
};

// 弹窗显示状态
const dialogVisible = ref(false);

// 订单详情信息
const orderDetails = ref<Record<string, any>>({});

// 订单商品列表
const goodsDataTableFields = [
    {
        label: "商品名称",
        prop: "name",
        width: 100,
        fixed: true
    },
    {
        label: "参加活动",
        prop: "activity",
        width: 100
    },
    {
        label: "商品图片",
        prop: "img",
        type: "image",
        width: 100
    },
    {
        label: "商品CODE",
        prop: "code",
        width: 100
    },
    {
        label: "商品规格",
        prop: "specs",
        minWidth: 100
    },
    {
        label: "商品数量",
        prop: "quantity",
        type: "number",
        width: 100
    },
    {
        label: "商品金额(元)",
        prop: "price",
        type: "number",
        digit: 2,
        width: 100
    },
    {
        label: "优惠金额(元)",
        prop: "discountPriceInYuan",
        type: "number",
        digit: 2,
        width: 100
    },
    {
        label: "小计(元)",
        prop: "totalAmount",
        type: "number",
        digit: 2,
        formatter: function (row) {
            return row.price * row.quantity;
        },
        width: 100
    }
];

// 使用优惠券列表
const couponDataTableFields = [
    {
        label: "优惠类型",
        prop: "type",
        width: 120
    },
    {
        label: "券名称",
        prop: "name",
        minWidth: 120
    },
    {
        label: "券面优惠金额",
        prop: "amount",
        type: "number",
        digit: 2,
        width: 100
    },
    {
        label: "券数量",
        prop: "quantity",
        type: "number",
        width: 100
    }
];

// 获取枚举值
const getEnumText = function (value: string | number, datas: Array<Record<string, string | number>>) {
    return datas.find(item => item.value === value)?.label || "-";
};

// 初始化
const init = async function () {
    try {
        orderDetails.value = (await demoAPI.queryOrderDetails(props.row!.orderNo, { isShowLoading: true })) as Record<string, any>;
        dialogVisible.value = true;
    } catch (error) {
        dialogClosed();
    }
};

init();
</script>
<style lang="scss" scoped>
.title-bar {
    line-height: 22px;
    padding: 8px 0px 16px 12px;
    position: relative;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    font-size: 16px;

    &::before {
        content: "";
        position: absolute;
        left: 0px;
        top: 11px;
        width: 4px;
        height: 16px;
        background-color: #00b85c;
        border-radius: 2px;
    }
}
</style>
