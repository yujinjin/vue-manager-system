const Mock = require("mockjs");
const wrapResponse = require("./wrap-response");

module.exports = function (app) {
    // 常用页面demo 分页查询
    app.post("/demo/queryPageList", function (request, response) {
        const time = new Date().getTime();
        response.json(
            wrapResponse({
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
            })
        );
    });

    // 获取配置数据
    app.post("/demo/config.do", function (request, response) {
        response.json(
            wrapResponse({
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
            })
        );
    });

    // 常用页面demo 分页查询
    app.post("/demo/queryPageListForOrder", function (request, response) {
        const time = new Date().getTime();
        response.json(
            wrapResponse({
                "total|10-1000": 0,
                "rows|50": [
                    {
                        "orderNo": "ON@date('yyyyMMddHH')@string('number', 8)", // 订单编号
                        "orderAmount|1-9999.1-2": 1, // 订单金额
                        "orderStatus|1": [1, 2, 3, 10, 20, 30], // 订单状态
                        "createTime": "@integer(" + (time - 30 * 24 * 60 * 60 * 1000) + ", " + (time + 30 * 24 * 60 * 60 * 1000) + ")", // 订单创建时间
                        "goodsImgs": function () {
                            const imgs = [
                                "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
                                "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
                                "https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg",
                                ...new Array(20).fill(0).map(() => Mock.Random.image(null, Mock.Random.color(), Mock.Random.color()))
                            ];
                            return new Array(Mock.mock("@integer(0, 5)"))
                                .fill(0)
                                .map(() => Mock.Random.pick(imgs))
                                .join("|");
                        }, // 商品图片
                        "goodsNumber|1-20": 1, // 商品数量
                        "receiveMan": "@cname()", // 收货人
                        "receiveMobileNumber": /1[3456789]\d{9}/, // 收货电话
                        "remark": "@csentence(0, 100)" // 备注
                    }
                ]
            })
        );
    });
};
