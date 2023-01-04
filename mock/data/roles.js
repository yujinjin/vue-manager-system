/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-12-14 11:45:48
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2022-12-14 18:34:19
 * @项目的路径: \vue-manager-system\mock\data\roles.js
 * @描述: 角色列表
 */
const Mock = require("mockjs");

module.exports = [
    {
        id: Mock.mock("@id"),
        moduleCode: "BASE",
        code: "admin",
        name: "基础平台超级管理员",
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - parseInt(30 * 24 * 60 * 60 * 1000, 10),
        status: 1
    },
    {
        id: Mock.mock("@id"),
        moduleCode: "DATA",
        code: "data_admin",
        name: "数据分析超级管理员",
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - parseInt(30 * 24 * 60 * 60 * 1000, 10),
        status: 1
    },
    {
        id: Mock.mock("@id"),
        moduleCode: "DATA",
        code: "data_product_manager",
        name: "数据分析产品经理",
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - parseInt(30 * 24 * 60 * 60 * 1000, 10),
        status: 1
    },
    {
        id: Mock.mock("@id"),
        moduleCode: "MALL",
        code: "mall_admin",
        name: "商城超级管理员",
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - parseInt(30 * 24 * 60 * 60 * 1000, 10),
        status: 1
    },
    {
        id: Mock.mock("@id"),
        moduleCode: "MALL",
        code: "mall_operation_manager",
        name: "商城运营人员",
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - parseInt(30 * 24 * 60 * 60 * 1000, 10),
        status: 1
    },
    {
        id: Mock.mock("@id"),
        moduleCode: "MALL",
        code: "mall_audit_manager",
        name: "商城审核人员",
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - parseInt(30 * 24 * 60 * 60 * 1000, 10),
        status: 1
    },
    {
        id: Mock.mock("@id"),
        moduleCode: "MALL",
        code: "mall_customer_service",
        name: "商城客服人员",
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - parseInt(30 * 24 * 60 * 60 * 1000, 10),
        status: 1
    },
    {
        id: Mock.mock("@id"),
        moduleCode: "SUPPLY-CHAIN",
        code: "supply_chain_admin",
        name: "供应链超级管理员",
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - parseInt(30 * 24 * 60 * 60 * 1000, 10),
        status: 1
    },
    {
        id: Mock.mock("@id"),
        moduleCode: "SUPPLY-CHAIN",
        code: "supply_chain_retrieval_admin",
        name: "供应链出库管理员",
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - parseInt(30 * 24 * 60 * 60 * 1000, 10),
        status: 1
    },
    {
        id: Mock.mock("@id"),
        moduleCode: "PAY",
        code: "pay_admin",
        name: "支付系统超级管理员",
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - parseInt(30 * 24 * 60 * 60 * 1000, 10),
        status: 1
    }
];
