/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-12-14 11:37:37
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2022-12-14 15:05:47
 * @项目的路径: \vue-manager-system\mock\data\modules.js
 * @描述: 模块列表
 */
const Mock = require("mockjs");

module.exports = [
    {
        id: Mock.mock("@id"),
        name: "基础平台",
        code: "BASE",
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - parseInt(30 * 24 * 60 * 60 * 1000, 10)
    },
    {
        id: Mock.mock("@id"),
        name: "数据分析",
        code: "DATA",
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - parseInt(30 * 24 * 60 * 60 * 1000, 10)
    },
    {
        id: Mock.mock("@id"),
        name: "商城管理系统",
        code: "MALL",
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - parseInt(30 * 24 * 60 * 60 * 1000, 10)
    },
    {
        id: Mock.mock("@id"),
        name: "供应链管理系统",
        code: "SUPPLY-CHAIN",
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - parseInt(30 * 24 * 60 * 60 * 1000, 10)
    },
    {
        id: Mock.mock("@id"),
        name: "支付系统",
        code: "PAY",
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - parseInt(30 * 24 * 60 * 60 * 1000, 10)
    }
];
