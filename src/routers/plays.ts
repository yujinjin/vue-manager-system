/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2024-01-17 10:20:31
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-01-29 18:15:21
 * @项目的路径: \vue-manager-system\src\routers\plays.ts
 * @描述: 系统示例演示页面路由
 */
import type { RouteRecordRaw } from "vue-router";

export default <Array<RouteRecordRaw>>[
    {
        name: "play-cache", // 验证页面缓存的示例页面
        path: "/play/cache",
        component: () => import("@/views/plays/cache/index.vue")
    },
    {
        name: "play-details", // 验证同一个页面不同参数的缓存示例页面
        path: "/play/details",
        component: () => import("@/views/plays/details/index.vue")
    },
    {
        name: "play-icon-list", // 项目中已经引入的icon列表
        path: "/play/icon-list",
        component: () => import("@views/plays/icon-list/index.vue")
    },
    {
        name: "play-order-list", // 订单列表查询
        path: "/play/order-list",
        component: () => import("@views/plays/order-list/index.vue")
    }
];
