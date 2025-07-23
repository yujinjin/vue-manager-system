/*
 * @创建者: yujinjin9@126.com
 * @描述: 订单常量数据
 */

// 下单设备来源枚举值
export const DEVICE_SOURCE_ENUM = [
    {
        value: "H5",
        label: "移动端H5"
    },
    {
        value: "WXH5",
        label: "微信H5"
    },
    {
        value: "WXXCX",
        label: "微信小程序"
    },
    {
        value: "iOSApp",
        label: "iOS App"
    },
    {
        value: "androidApp",
        label: "android App"
    }
];

// 订单状态枚举值
export const ORDER_STATUS_ENUM = [
    {
        label: "订单取消",
        value: -1
    },
    {
        label: "售后中",
        value: -6
    },
    {
        label: "退款中",
        value: -7
    },
    {
        label: "已退款",
        value: -5
    },
    {
        label: "待付款",
        value: 10
    },
    {
        label: "待发货",
        value: 20
    },
    {
        label: "已发货",
        value: 30
    },
    {
        label: "已签收",
        value: 40
    },
    {
        label: "交易关闭",
        value: 50
    }
];

// 支付方式
export const PAY_WAY_ENUM = [
    {
        label: "现金",
        value: "cash"
    },
    {
        label: "支付宝",
        value: "zfb"
    },
    {
        label: "微信",
        value: "wx"
    },
    {
        label: "银行卡",
        value: "bankcard"
    },
    {
        label: "账户余额",
        value: "balance"
    },
    {
        label: "0元订单",
        value: "free"
    }
];
