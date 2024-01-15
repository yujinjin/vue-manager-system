/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-12-13 14:33:59
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-01-15 09:45:52
 * @项目的路径: \vue-manager-system\mock\data\menus.js
 * @描述: 用户菜单列表
 * { id: 菜单ID, parentId: 父级菜单ID(null表示顶级菜单), name: 菜单名称, icons: 菜单图标, url: 菜单地址(可为null), moduleCode: 菜单所属模块code }
 */
const Mock = require("mockjs");

const icons = [
    "icomoon-home",
    "icomoon-home2",
    "icomoon-home3",
    "icomoon-office",
    "icomoon-newspaper",
    "icomoon-pencil",
    "icomoon-pencil2",
    "icomoon-quill",
    "icomoon-pen",
    "icomoon-blog",
    "icomoon-eyedropper",
    "icomoon-droplet",
    "icomoon-paint-format",
    "icomoon-images",
    "icomoon-image",
    "icomoon-camera",
    "icomoon-headphones",
    "icomoon-music",
    "icomoon-play",
    "icomoon-film",
    "icomoon-video-camera",
    "icomoon-dice",
    "icomoon-pacman",
    "icomoon-spades",
    "icomoon-clubs",
    "icomoon-diamonds",
    "icomoon-bullhorn",
    "icomoon-connection",
    "icomoon-podcast",
    "icomoon-feed",
    "icomoon-mic",
    "icomoon-book",
    "icomoon-books",
    "icomoon-library",
    "icomoon-file-text",
    "icomoon-profile",
    "icomoon-file-empty",
    "icomoon-files-empty",
    "icomoon-file-text2",
    "icomoon-file-picture",
    "icomoon-file-music",
    "icomoon-file-play",
    "icomoon-file-video",
    "icomoon-file-zip",
    "icomoon-copy",
    "icomoon-paste",
    "icomoon-stack",
    "icomoon-folder"
];

module.exports = [
    {
        id: "10",
        parentId: null,
        name: "示例",
        icons: "icomoon-accessibility",
        code: "10",
        url: null,
        moduleCode: "BASE",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "1001",
        parentId: "10",
        name: "页面查询",
        icons: "icomoon-stats-dots",
        code: "1001",
        url: "/example/query-search",
        moduleCode: "BASE",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "11",
        parentId: null,
        name: "数据分析",
        icons: "icomoon-database",
        code: "11",
        url: null,
        moduleCode: "DATA",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "1101",
        parentId: "11",
        name: "订单数据分析",
        icons: "icomoon-stats-dots",
        code: "1101",
        url: "https://wwww." + Mock.mock("@word") + ".com",
        moduleCode: "DATA",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "1102",
        parentId: "11",
        name: "用户行为分析",
        icons: Mock.Random.pick(icons),
        code: "1102",
        url: "https://wwww." + Mock.mock("@word") + ".com",
        moduleCode: "DATA",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "1103",
        parentId: "11",
        name: "商品销量分析",
        icons: Mock.Random.pick(icons),
        code: "1103",
        url: "https://wwww." + Mock.mock("@word") + ".com",
        moduleCode: "DATA",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "12",
        parentId: null,
        name: "商城管理",
        icons: "icomoon-cart",
        code: "12",
        url: null,
        moduleCode: "MALL",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "1201",
        parentId: "12",
        name: "商品管理",
        icons: Mock.Random.pick(icons),
        code: "1201",
        url: null,
        moduleCode: "MALL",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "120101",
        parentId: "1201",
        name: "品牌管理",
        icons: Mock.Random.pick(icons),
        code: "120101",
        url: "https://wwww." + Mock.mock("@word") + ".com",
        moduleCode: "MALL",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "120102",
        parentId: "1201",
        name: "赠品管理",
        icons: Mock.Random.pick(icons),
        code: "120102",
        url: "https://wwww." + Mock.mock("@word") + ".com",
        moduleCode: "MALL",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "120103",
        parentId: "1201",
        name: "商品管理",
        icons: "icomoon-mail",
        code: "120103",
        url: "https://wwww." + Mock.mock("@word") + ".com",
        moduleCode: "MALL",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "120104",
        parentId: "1201",
        name: "商品标签管理",
        icons: Mock.Random.pick(icons),
        code: "120104",
        url: "https://wwww." + Mock.mock("@word") + ".com",
        moduleCode: "MALL",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "1202",
        parentId: "12",
        name: "营销中心",
        icons: Mock.Random.pick(icons),
        code: "1202",
        url: null,
        moduleCode: "MALL",
        status: Mock.mock("@pick([\"0\", \"1\"])") // 状态
    },
    {
        id: "120201",
        parentId: "1202",
        name: "优惠券管理",
        icons: Mock.Random.pick(icons),
        code: "120201",
        url: "https://wwww." + Mock.mock("@word") + ".com",
        moduleCode: "MALL",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "12020101",
        parentId: "120201",
        name: "券管理",
        icons: Mock.Random.pick(icons),
        code: "12020101",
        url: "https://wwww." + Mock.mock("@word") + ".com",
        moduleCode: "MALL",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "12020102",
        parentId: "120201",
        name: "标签管理",
        icons: Mock.Random.pick(icons),
        code: "12020102",
        url: "https://wwww." + Mock.mock("@word") + ".com",
        moduleCode: "MALL",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "12020103",
        parentId: "120201",
        name: "黑名单管理",
        icons: Mock.Random.pick(icons),
        code: "12020103",
        url: "https://wwww." + Mock.mock("@word") + ".com",
        moduleCode: "MALL",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "12020104",
        parentId: "120201",
        name: "白名单管理",
        icons: Mock.Random.pick(icons),
        code: "12020104",
        url: "https://wwww." + Mock.mock("@word") + ".com",
        moduleCode: "MALL",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "12020105",
        parentId: "120201",
        name: "领取查询",
        icons: Mock.Random.pick(icons),
        code: "12020105",
        url: "https://wwww." + Mock.mock("@word") + ".com",
        moduleCode: "MALL",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "12020106",
        parentId: "120201",
        name: "发放配置",
        icons: Mock.Random.pick(icons),
        code: "12020106",
        url: "https://wwww." + Mock.mock("@word") + ".com",
        moduleCode: "MALL",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "120202",
        parentId: "1202",
        name: "素材管理",
        icons: Mock.Random.pick(icons),
        code: "120202",
        url: "https://wwww." + Mock.mock("@word") + ".com",
        moduleCode: "MALL",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "120203",
        parentId: "1202",
        name: "广告位管理",
        icons: Mock.Random.pick(icons),
        code: "120203",
        url: "https://wwww." + Mock.mock("@word") + ".com",
        moduleCode: "MALL",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "120204",
        parentId: "1202",
        name: "限时抢购管理",
        icons: Mock.Random.pick(icons),
        code: "120204",
        url: "https://wwww." + Mock.mock("@word") + ".com",
        moduleCode: "MALL",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "1203",
        parentId: "12",
        name: "售后管理",
        icons: Mock.Random.pick(icons),
        code: "1203",
        url: "https://wwww." + Mock.mock("@word") + ".com",
        moduleCode: "MALL",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "120301",
        parentId: "1203",
        name: "售后列表",
        icons: Mock.Random.pick(icons),
        code: "120301",
        url: "https://wwww." + Mock.mock("@word") + ".com",
        moduleCode: "MALL",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "13",
        parentId: null,
        name: "核算中心",
        icons: "icomoon-calculator",
        code: "400000",
        url: null,
        moduleCode: "ACCOUNTING",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "1301",
        parentId: "13",
        name: "财务核算查询",
        icons: "icomoon-coin-yen",
        code: "1301",
        url: "https://wwww." + Mock.mock("@word") + ".com",
        moduleCode: "ACCOUNTING",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "14",
        parentId: null,
        name: "支付中心",
        icons: "icomoon-paypal",
        code: "14",
        url: null,
        moduleCode: "PAY",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "1401",
        parentId: "14",
        name: "订单查询",
        icons: "icomoon-paypal",
        code: "1401",
        url: "https://wwww." + Mock.mock("@word") + ".com",
        moduleCode: "PAY",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "15",
        parentId: null,
        name: "系统管理",
        icons: "icomoon-cog",
        code: "15",
        url: null,
        moduleCode: "BASE",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "1501",
        parentId: "15",
        name: "模块管理",
        icons: "icomoon-stack",
        code: "1501",
        url: "/system/modules",
        moduleCode: "BASE",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "1502",
        parentId: "15",
        name: "用户管理",
        icons: "icomoon-users",
        code: "1502",
        url: "/system/users",
        moduleCode: "BASE",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "1503",
        parentId: "15",
        name: "角色管理",
        icons: "icomoon-user-tie",
        code: "1503",
        url: "/system/roles",
        moduleCode: "BASE",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "1504",
        parentId: "15",
        name: "菜单管理",
        icons: "icomoon-menu",
        code: "1504",
        url: "/system/menus",
        moduleCode: "BASE",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "16",
        parentId: null,
        name: "路由测试",
        icons: "icomoon-connection",
        code: "16",
        url: null,
        moduleCode: "BASE",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "1601",
        parentId: "16",
        name: "缓存路由",
        icons: "icomoon-play",
        code: "1601",
        url: "/play-input",
        moduleCode: "BASE",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "1602",
        parentId: "16",
        name: "详情路由1",
        icons: "icomoon-book",
        code: "1602",
        url: "/play-details?id=0001",
        moduleCode: "BASE",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "1603",
        parentId: "16",
        name: "详情路由2",
        icons: "icomoon-book",
        code: "1603",
        url: "/play-details?id=0003",
        moduleCode: "BASE",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "1604",
        parentId: "16",
        name: "外链路由1",
        icons: "icomoon-bell",
        code: "1604",
        url: "http://10.96.144.203:8080/",
        moduleCode: "BASE",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: "1605",
        parentId: "16",
        name: "外链路由2",
        icons: "icomoon-stopwatch",
        code: "1605",
        url: "http://10.96.144.203:8080/about",
        moduleCode: "BASE",
        status: Mock.mock("@pick([\"0\", \"1\"])"), // 状态
        updated: Mock.mock("@first()"),
        updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
    }
];
