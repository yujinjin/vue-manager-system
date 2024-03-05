/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2024-01-19 10:26:09
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-03-05 17:43:42
 * @项目的路径: \vue-manager-system\src\views\plays\order-list\search-config.ts
 * @描述: 订单查询配置
 */
import type { Components } from "/#/components";
import dayjs from "dayjs";
import demoAPI from "@api/demo";
import { HANDLE_CODES } from "@/services/constants";
import { DEVICE_SOURCE_ENUM, ORDER_STATUS_ENUM } from "./constants";

export default function ({ showDialogHandle, excelExportHandle, cancelOrderHandle, orertReportData }) {
    return {
        searchFormProps: {
            fields: [
                {
                    name: "orderNo",
                    type: "input",
                    label: "订单编号"
                },
                // {
                //     name: "orderStatus",
                //     type: "select",
                //     label: "订单状态",
                //     data: ORDER_STATUS_ENUM
                // },
                {
                    name: "deviceSource",
                    type: "select",
                    label: "下单设备",
                    data: DEVICE_SOURCE_ENUM
                },
                {
                    name: "buyer",
                    type: "input",
                    label: "用户ID/名称"
                },
                {
                    name: "receiver",
                    type: "input",
                    label: "收货人姓名"
                },
                {
                    name: "receiverMobileNumber",
                    type: "input",
                    label: "收货人手机号"
                },
                {
                    name: "dateRange",
                    type: "datePicker",
                    label: "订单日期",
                    props: {
                        type: "daterange"
                    },
                    value: [dayjs().add(-6, "day").format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD")]
                }
            ] as Components.SearchFormField[]
        },
        actionBarProps: {
            align: "right",
            buttons: [
                {
                    text: "新增订单",
                    handleCode: HANDLE_CODES.CREATE,
                    click: showDialogHandle,
                    props: {
                        type: "primary"
                    }
                },
                {
                    text: "批量取消订单",
                    handleCode: HANDLE_CODES.BATCHCANCEL,
                    click: cancelOrderHandle,
                    props: {
                        disabled: true
                    }
                },
                {
                    text: "自定义列",
                    handleCode: HANDLE_CODES.QUERY,
                    click: showDialogHandle
                },
                {
                    text: "导出Excel",
                    handleCode: HANDLE_CODES.EXPORT,
                    click: excelExportHandle
                }
            ]
        },
        dataTableProps: {
            filters: {
                orderStatus: ""
            },
            query: demoAPI.queryPageOrderList,
            // 查询参数处理
            queryParametersProcess(parameters: any) {
                if (parameters.dateRange && parameters.dateRange.length > 0) {
                    parameters.startDate = parameters.dateRange[0];
                    parameters.endDate = parameters.dateRange[1];
                }
                delete parameters.dateRange;
                return parameters;
            },
            queryResponseProcess(queryResult: Record<string, any>) {
                orertReportData.allCount = queryResult.allCount || 0;
                orertReportData.pendingCount = queryResult.pendingCount || 0;
                orertReportData.paidCount = queryResult.paidCount || 0;
                orertReportData.deliveredCount = queryResult.deliveredCount || 0;
                orertReportData.completedCount = queryResult.completedCount || 0;
                orertReportData.cancelledCount = queryResult.cancelledCount || 0;
                orertReportData.refundedCount = queryResult.refundedCount || 0;
                return { total: queryResult.total, rows: queryResult.rows };
            },
            columns: [
                {
                    label: "选择",
                    type: "selection",
                    align: "center",
                    width: 50
                },
                {
                    label: "订单编号",
                    prop: "orderNo",
                    minWidth: 150,
                    slot: "dataTable_orderNo"
                },
                {
                    label: "订单状态",
                    prop: "orderStatus",
                    type: "enum",
                    slotHeader: "dataTable_orderStatusHeader",
                    width: 100,
                    data: ORDER_STATUS_ENUM
                },
                {
                    label: "下单设备",
                    prop: "deviceSource",
                    type: "enum",
                    width: 100,
                    data: DEVICE_SOURCE_ENUM
                },
                {
                    label: "订单金额",
                    prop: "orderAmount",
                    type: "number",
                    digit: 2,
                    width: 100
                },
                {
                    label: "实际支付金额",
                    prop: "payAmount",
                    type: "number",
                    digit: 2,
                    width: 120
                },
                {
                    label: "订单时间",
                    prop: "createTime",
                    type: "date",
                    formate: "YYYY-MM-DD HH:mm:ss",
                    width: 140
                },
                {
                    label: "支付时间",
                    prop: "payTime",
                    type: "date",
                    formate: "YYYY-MM-DD HH:mm:ss",
                    width: 140
                },
                {
                    label: "订单商品数量",
                    prop: "goodsNumber",
                    width: 120
                },
                {
                    label: "订单商品数量",
                    prop: "goodsNumber",
                    width: 120
                },
                {
                    label: "订单商品图片",
                    prop: "goodsImgs",
                    type: "image",
                    separator: ",",
                    minWidth: 150
                },
                {
                    label: "下单用户ID",
                    prop: "buyerId",
                    minWidth: 150
                },
                {
                    label: "下单用户名称",
                    prop: "buyerName",
                    minWidth: 100
                },
                {
                    label: "下单用户手机号",
                    prop: "buyerMobileNumber",
                    minWidth: 120
                },
                {
                    label: "收货人",
                    prop: "receiver",
                    minWidth: 100
                },
                {
                    label: "收货人电话",
                    prop: "receiverMobileNumber",
                    minWidth: 100
                },
                {
                    label: "订单备注",
                    prop: "remark",
                    minWidth: 150,
                    showOverflowTooltip: true
                },
                {
                    type: "action",
                    width: 120,
                    buttons: [
                        {
                            text: "查看",
                            handleCode: HANDLE_CODES.SEARCH,
                            click: showDialogHandle
                        },
                        {
                            text: "取消订单",
                            handleCode: HANDLE_CODES.CANCEL,
                            display: function (row) {
                                return row.orderStatus === 10;
                            },
                            click: cancelOrderHandle
                        }
                    ]
                }
            ] as Components.TableColumn<any>[]
        }
    };
}
