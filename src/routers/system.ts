/*
 * @创建者: yujinjin9@126.com
 * @描述: 系统页面路由
 */
import { type RouteRecordRaw } from "vue-router";

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
];
