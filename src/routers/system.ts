/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2024-01-11 20:22:00
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-01-17 10:25:53
 * @项目的路径: \vue-manager-system\src\routers\system.ts
 * @描述: 系统页面路由
 */
import type { RouteRecordRaw } from "vue-router";

export default <Array<RouteRecordRaw>>[
    {
        name: "system-modules", // 中台模块管理
        path: "/system/modules",
        component: () => import("@views/system/modules/index.vue")
    },
    {
        name: "system-menus", // 中台菜单管理
        path: "/system/menus",
        component: () => import("@views/system/menus/index.vue")
    },
    {
        name: "system-roles", // 中台角色管理
        path: "/system/roles",
        component: () => import("@views/system/roles/index.vue")
    },
    {
        name: "system-users", // 中台用户管理
        path: "/system/users",
        component: () => import("@views/system/users/index.vue")
    },
    {
        name: "system-messages", // 中台消息管理
        path: "/system/messages",
        component: () => import("@views/system/messages/index.vue")
    }
]