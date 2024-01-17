/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2024-01-17 10:23:14
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-01-17 10:28:04
 * @项目的路径: \vue-manager-system\src\routers\others.ts
 * @描述: 其他页面路由
 */

import type { RouteRecordRaw } from "vue-router";

export default <Array<RouteRecordRaw>>[
    {
        name: "welcome", // 中台默认的欢迎页面
        path: "/",
        component: () => import("@views/others/welcome.vue")
    },
    {
        name: "external", // 中台承接外部链接的页面
        path: "/external/:menuId(\\d+)?",
        component: () => import("@views/others/external.vue")
    },
    {
        name: "transit", // 中台中转页面（主要用来做菜单权限判断等功能）
        path: "/transit",
        component: () => import("@views/others/transit.vue")
    }
]