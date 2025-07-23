/*
 * @创建者: yujinjin9@126.com
 * @描述: 模块列表
 */
import Mock from "mockjs";

export default [
    {
        id: Mock.mock("@id"),
        name: "基础平台",
        code: "BASE",
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: Mock.mock("@id"),
        name: "数据分析",
        code: "DATA",
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: Mock.mock("@id"),
        name: "商城管理系统",
        code: "MALL",
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: Mock.mock("@id"),
        name: "供应链管理系统",
        code: "SUPPLY-CHAIN",
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: Mock.mock("@id"),
        name: "支付系统",
        code: "PAY",
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    }
];
