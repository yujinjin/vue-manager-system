/*
 * @创建者: yujinjin9@126.com
 * @描述: demo 模块mock数据
 */
import Mock, { type MockjsRequestOptions } from "mockjs";
import wrapResponse from "./wrap-response";

export default [
    // 常用页面demo 分页查询
    {
        url: "/demo/queryPageList",
        type: "post",
        data: function () {
            const time = new Date().getTime();
            return wrapResponse({
                "total|10-1000": 0,
                "rows|50": [
                    {
                        "showPlanCodeName": "@ctitle", // 计划名称
                        "showPlanCode": "ELE@date('yyyyMMddHH')@string('number', 8)", // 计划编码
                        "productName|1": ["360借条", "奇富钱包", "360分期贷", "H5/外部等", "360信用钱包", "360周转灵"], // 所属产品
                        "serviceModuleName": "@cword(2, 8)", // 业务模块
                        "eleTypeName": "@cword(4, 20)", // 资源位名称
                        "activityBelongName": "@cword(4, 12)", // 活动归属
                        "auditStatus|1": ["1", "2", "3", "4", "5", "6", "7", "8"], // 计划状态
                        "priority|0-100": 0, // 优先级
                        "startTime": "@integer(" + (time - 30 * 24 * 60 * 60 * 1000) + ", " + (time + 30 * 24 * 60 * 60 * 1000) + ")", // 开始时间
                        "endTime": function () {
                            return this.startTime + Mock.Random.integer(24 * 60 * 60 * 1000, 30 * 24 * 60 * 60 * 1000);
                        }, // 结束时间
                        "exposurePv|0-1000000": 0, // 最新曝光PV
                        "clickPv|0-1000000": 0, // 最新点击PV
                        "sourceSystem": "ELE",
                        "clickPvRate": "@float(0, 100, 2, 2)", // 点击率-PV
                        "dateUpdated": "@integer(" + (time - 30 * 24 * 60 * 60 * 1000) + ", " + time + ")", // 最近操作时间
                        "createdBy": "@cname()", // 创建人
                        "updatedBy": "@cname()" // 操作人
                    }
                ]
            });
        }
    },
    // 获取配置数据
    {
        url: "/demo/config.do",
        type: "post",
        data: function () {
            return wrapResponse({
                "activities|10-20": [
                    {
                        code: "@string('upper', 2, 4)_@string('upper', 2, 4)",
                        name: "@cword(4, 10)"
                    }
                ],
                "elements": [
                    {
                        "code": "4",
                        "name": "360借条",
                        "serviceModules|5-50": [
                            {
                                code: "@string('upper', 2, 4)_@string('upper', 2, 4)",
                                name: "@cword(4, 10)"
                            }
                        ],
                        "eleSourceTypeBos": function () {
                            return new Array(Mock.Random.integer(10, 200)).fill(0).map(() => ({
                                serviceModule: this.serviceModules[Mock.Random.integer(0, this.serviceModules.length - 1)].code,
                                typeCode: Mock.mock("@string('upper', 6)"),
                                name: Mock.mock("@cword(4, 10)"),
                                code: Mock.mock("@string('number', 8)")
                            }));
                        }
                    },
                    {
                        "code": "20",
                        "name": "奇富钱包",
                        "serviceModules|5-20": [
                            {
                                code: "@string('upper', 2, 4)_@string('upper', 2, 4)",
                                name: "@cword(4, 10)"
                            }
                        ],
                        "eleSourceTypeBos": function () {
                            return new Array(Mock.Random.integer(10, 100)).fill(0).map(() => ({
                                serviceModule: this.serviceModules[Mock.Random.integer(0, this.serviceModules.length - 1)].code,
                                typeCode: Mock.mock("@string('upper', 6)"),
                                name: Mock.mock("@cword(4, 10)"),
                                code: Mock.mock("@string('number', 8)")
                            }));
                        }
                    },
                    {
                        "code": "7",
                        "name": "360分期贷",
                        "serviceModules|1-20": [
                            {
                                code: "@string('upper', 2, 4)_@string('upper', 2, 4)",
                                name: "@cword(4, 10)"
                            }
                        ],
                        "eleSourceTypeBos": function () {
                            return new Array(Mock.Random.integer(10, 40)).fill(0).map(() => ({
                                serviceModule: this.serviceModules[Mock.Random.integer(0, this.serviceModules.length - 1)].code,
                                typeCode: Mock.mock("@string('upper', 6)"),
                                name: Mock.mock("@cword(4, 10)"),
                                code: Mock.mock("@string('number', 8)")
                            }));
                        }
                    },
                    {
                        "code": "19",
                        "name": "H5/外部等",
                        "serviceModules|5-10": [
                            {
                                code: "@string('upper', 2, 4)_@string('upper', 2, 4)",
                                name: "@cword(4, 10)"
                            }
                        ],
                        "eleSourceTypeBos": function () {
                            return new Array(Mock.Random.integer(10, 30)).fill(0).map(() => ({
                                serviceModule: this.serviceModules[Mock.Random.integer(0, this.serviceModules.length - 1)].code,
                                typeCode: Mock.mock("@string('upper', 6)"),
                                name: Mock.mock("@cword(4, 10)"),
                                code: Mock.mock("@string('number', 8)")
                            }));
                        }
                    },
                    {
                        "code": "6",
                        "name": "360信用钱包",
                        "serviceModules|5-10": [
                            {
                                code: "@string('upper', 2, 4)_@string('upper', 2, 4)",
                                name: "@cword(4, 10)"
                            }
                        ],
                        "eleSourceTypeBos": function () {
                            return new Array(Mock.Random.integer(10, 20)).fill(0).map(() => ({
                                serviceModule: this.serviceModules[Mock.Random.integer(0, this.serviceModules.length - 1)].code,
                                typeCode: Mock.mock("@string('upper', 6)"),
                                name: Mock.mock("@cword(4, 10)"),
                                code: Mock.mock("@string('number', 8)")
                            }));
                        }
                    },
                    {
                        "code": "13",
                        "name": "360周转灵",
                        "serviceModules|5-10": [
                            {
                                code: "@string('upper', 2, 4)_@string('upper', 2, 4)",
                                name: "@cword(4, 10)"
                            }
                        ],
                        "eleSourceTypeBos": function () {
                            return new Array(Mock.Random.integer(10, 20)).fill(0).map(() => ({
                                serviceModule: this.serviceModules[Mock.Random.integer(0, this.serviceModules.length - 1)].code,
                                typeCode: Mock.mock("@string('upper', 6)"),
                                name: Mock.mock("@cword(4, 10)"),
                                code: Mock.mock("@string('number', 8)")
                            }));
                        }
                    }
                ]
            });
        }
    },
    // demo订单分页查询
    {
        url: "/demo/queryPageOrderList",
        type: "get",
        data: function ({ body }: MockjsRequestOptions) {
            const pageSize = parseInt(body.pageSize || "50", 10);
            return wrapResponse({
                "total|10-1000": 0,
                "allCount|1-1000": 0, // 全部订单数
                "pendingCount|1-1000": 0, // 待付款订单数
                "paidCount|1-1000": 0, // 待发货订单数
                "deliveredCount|1-1000": 0, // 已发货订单数
                "completedCount|1-1000": 0, // 已签收订单数
                "cancelledCount|1-1000": 0, // 已取消订单数
                "refundedCount|1-1000": 0, // 已退款订单数
                ["rows|" + pageSize]: [
                    {
                        "orderNo": "ON@date('yyyyMMddHH')@string('number', 8)",
                        "orderAmount|1-9999.1-2": 1, // 订单金额
                        "deviceSource|1": ["H5", "WXH5", "WXXCX", "iOSApp", "androidApp"], // 下单来源设备
                        "payAmount|1-9999.1-2": 0, // 实际支付金额
                        "orderStatus|1": [-1, -6, -7, -5, 10, 20, 30, 40, 50], // 订单状态
                        "goodsNumber|1-20": 1, // 商品数量
                        "goodsImgs": function () {
                            return new Array(this.goodsNumber)
                                .fill(0)
                                .map(() => Mock.Random.image("200x200", Mock.Random.color(), "#FFF", "png", Mock.Random.string("upper", 2, 5)))
                                .join(",");
                        }, // 商品图片
                        "buyerId": "UR@string('number', 12)", // 购买人ID（用户ID）
                        "buyerName": "@cname()", // 购买人名称（真实姓名|昵称）
                        "buyerMobileNumber": /1[3456789]\d{9}/, // 购买人手机号（用户手机号）
                        "receiver": "@cname()", // 收货人
                        "receiverMobileNumber": /1[3456789]\d{9}/, // 收货电话
                        "remark": "@csentence(0, 100)", // 备注
                        "payTime": function () {
                            return Mock.mock("@boolean(1, 4, false)") ? new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000) : null;
                        }, // 付款时间
                        "createTime": function () {
                            return new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000);
                        } // 创建时间
                    }
                ]
            });
        }
    },
    // demo 查询订单详情
    {
        url: "/demo/queryOrderDetails",
        type: "get",
        data: function ({ body }: MockjsRequestOptions) {
            const orderNo = body.orderNo;
            return wrapResponse({
                "orderNo": orderNo,
                "orderAmount|1-9999.1-2": 1, // 订单金额
                "deviceSource|1": ["H5", "WXH5", "WXXCX", "iOSApp", "androidApp"], // 下单设备来源
                "orderStatus|1": [-1, -6, -7, -5, 10, 20, 30, 40, 50], // 订单状态
                "buyerId": "UR@string('number', 12)", // 购买人ID（用户ID）
                "buyerName": "@cname()", // 购买人名称（真实姓名|昵称）
                "buyerMobileNumber": /1[3456789]\d{9}/, // 购买人手机号（用户手机号）
                "receiver": "@cname()", // 收货人
                "receiverMobileNumber": /1[3456789]\d{9}/, // 收货电话
                "receiverAddress": "@county(true) @cword(2, 5)路@integer(1,1000)号@integer(1,100)幢@integer(1,33)0@integer(1,4)室", // 收货人地址
                "remark": "@csentence(0, 100)", // 备注
                "createTime": new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000), // 下单时间
                "payInfo": {
                    "payNo": "PY@date('yyyyMMddHH')@string('number', 8)", // 支付流水号
                    "payAmount|1-9999.1-2": 0, // 支付金额
                    "payTime": Mock.mock("@boolean(1, 4, false)") ? new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000) : null, // 支付时间
                    "payWay|1": ["cash", "zfb", "wx", "bankcard", "balance", "free"] // 支付方式
                }, // 支付信息
                "goodsList": new Array(Mock.Random.integer(1, 20)).fill(0).map(() => ({
                    name: Mock.Random.ctitle(), // 商品名称
                    img: Mock.Random.image("200x200", Mock.Random.color(), "#FFF", "png", Mock.Random.string("upper", 2, 5)), // 商品图片
                    code: Mock.Random.string("upper", 4) + Mock.Random.string("number", 5), // 商品CODE
                    specs: new Array(Mock.Random.integer(1, 4))
                        .fill(0)
                        .map(() => Mock.mock("@cword(2, 6)"))
                        .join(";"), // 规格
                    price: Mock.Random.float(1, 1000, 3), // 商品金额
                    quantity: Mock.Random.integer(1, 4), // 商品数量
                    discountPriceInYuan: Mock.Random.float(1, 10), // 优惠金额（元）
                    activity: Mock.Random.pick(["限时抢购", "专题活动", "活动商品", ""]) // 活动名称
                })), // 商品列表
                "couponList": new Array(Mock.Random.integer(0, 3)).fill(0).map(() => ({
                    type: Mock.Random.pick(["满减", "折扣", "抵扣"]),
                    name: Mock.Random.pick(["专题活动满1000减100", "专题活动满200减15", "促销打9折", "限时5元抵扣", "特殊商品3元抵扣"]), // 优惠劵名称
                    amount: Mock.Random.float(1, 1000, 3), // 优惠金额
                    quantity: Mock.Random.integer(1, 4) // 券数量
                })), // 使用优惠券列表
                "logisticsList": new Array(Mock.Random.integer(0, 3)).fill(0).map(() => ({
                    companyName: Mock.Random.ctitle(), // 物流公司名称
                    logisticsNumber: "WL" + Mock.Random.string("number", 10), // 物流单号
                    goodsList: new Array(Mock.Random.integer(1, 3)).fill(0).map(() => ({
                        name: Mock.Random.ctitle(), // 商品名称
                        img: Mock.Random.image("200x200", Mock.Random.color(), "#FFF", "png", Mock.Random.string("upper", 2, 5)), // 商品图片
                        specs: new Array(Mock.Random.integer(1, 4))
                            .fill(0)
                            .map(() => Mock.mock("@cword(2, 6)"))
                            .join(";"), // 规格
                        code: Mock.Random.string("upper", 4) + Mock.Random.string("number", 5), // 商品CODE
                        quantity: Mock.Random.integer(1, 4) // 商品数量
                    })) // 商品列表
                })), // 物流信息列表
                "afterSalesList": new Array(Mock.Random.integer(0, 2)).fill(0).map(() => ({
                    type: Mock.Random.pick(["退款退货", "全部退款", "部分退款", "部分退款退货", "换货", "部分换货"]),
                    createTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000), // 创建时间
                    logisticsNumbers: new Array(Mock.Random.integer(1, 3))
                        .fill(0)
                        .map(() => "WL" + Mock.Random.string("number", 10))
                        .join(","), // 涉及物流单号
                    refundAmount: Mock.Random.float(0, 1000, 3), // 退款金额
                    reason: Mock.Random.pick(["商品质量有问题", "商品快递过程中损坏", "买错规格", "颜色有问题", "其他"]), // 原因
                    remark: Mock.Random.ctitle(), // 用户备注
                    goodsList: new Array(Mock.Random.integer(0, 3)).fill(0).map(() => ({
                        name: Mock.Random.ctitle(), // 商品名称
                        img: Mock.Random.image("200x200", Mock.Random.color(), "#FFF", "png", Mock.Random.string("upper", 2, 5)), // 商品图片
                        specs: new Array(Mock.Random.integer(1, 4))
                            .fill(0)
                            .map(() => Mock.mock("@cword(2, 6)"))
                            .join(";"), // 规格
                        code: Mock.Random.string("upper", 4) + Mock.Random.string("number", 5), // 商品CODE
                        quantity: Mock.Random.integer(1, 4) // 商品数量
                    })) // 商品列表
                })) // 售后信息列表
            });
        }
    },
    // 批量修改订单状态
    {
        url: "/demo/batchUpdateOrderStatus",
        type: "post",
        data: function () {
            return wrapResponse(null, true);
        }
    }
];
