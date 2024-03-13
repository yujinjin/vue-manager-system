/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-03-12 19:12:05
 * @项目的路径: \vue-manager-system\src\routers\index.ts
 * @描述: 路由配置
 * meta: {
 *  requiresAuth: boolean, // 是否需要登录
 *  title: "首页" // 页面标题
 * }
 */
import { storageStore, eventsStore } from "@/stores";
import type { RouteRecordRaw, Router } from "vue-router";
import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import { changeUrlParameter } from "@yujinjin/utils";
import system from "./system";
import others from "./others";
import plays from "./plays";

export default function (): Router {
    const dataStorages = storageStore();
    const dataEvents = eventsStore();
    const router: Router = createRouter({
        history: config.isWebHash ? createWebHashHistory(config.projectContentPath ? (config.projectContentPath + "/") : "") : createWebHistory(config.projectContentPath || "/"), // HTML5 hash模式 |history模式
        routes: <Array<RouteRecordRaw>>[
            {
                path: "/",
                component: () => import("@views/home/index.vue"),
                children: [...system, ...others, ...plays]
            },
            {
                path: "/login",
                name: "login", // 登录页
                meta: {
                    requireAuth: false
                },
                component: () => import("@views/login.vue")
            },
            {
                path: "/*",
                name: "not-found", // 未发现该页面
                meta: {
                    requireAuth: false
                },
                component: () => import("@views/error/not-found.vue")
            },
            {
                path: "/outside/home",
                name: "outside-home", // 外部页面（测试专用）
                meta: {
                    requireAuth: false
                },
                component: () => import("@views/outside/home.vue")
                // component: outsideHome
            },
            {
                path: "/outside/about",
                name: "outside-about", // 外部页面（测试专用）
                meta: {
                    requireAuth: false
                },
                component: () => import("@views/outside/about.vue")
            }
        ],
        scrollBehavior: () => ({ left: 0, top: 0 }),
        strict: true
    });
    // 注册一个全局前置守卫
    router.beforeEach(to => {
        if (to.meta.requireAuth !== false && !dataStorages.isLogin()) {
            console.info("...........");
            // 未登录的用户进入了需要登录的页面, 全局触发去登录事件
            dataEvents.trigger({ eventName: "gotoLogin", args: [to.fullPath] });
            // 取消当前的导航
            return false;
        }
        return true;
    });
    // 注册全局后置钩子
    router.afterEach(() => {
        // TODO: 根据业务需要添加
    });
    return router;
}

/**
 * 外部链接路由路径
 * @params menuId 菜单ID
 * @params pageId 页面ID
 */
export function externalRoutePath({ menuId, pageId }: { menuId?: string; pageId?: string }) {
    if (menuId) {
        return "/external/" + menuId;
    }
    return "/external?pageId=" + pageId;
}

/**
 * 中转页链接路由路径
 * @params menuId 菜单ID
 * @params pageId 页面ID
 */
export function transitRoutePath({ pageIndex, fromRoutePath }: { pageIndex?: number; fromRoutePath?: string }) {
    if (pageIndex || pageIndex === 0) {
        return "/transit?fromPageIndex=" + pageIndex;
    }
    return "/external?fromRoutePath=" + fromRoutePath;
}

/**
 * 内部链接路由路径
 * @params url 当前地址
 * @params menuId 菜单ID
 * @params pageId 页面ID
 */
export function innerRoutePath(url: string, { menuId, pageId }: { menuId?: string; pageId?: string }) {
    url = url.replace(new RegExp("^http(s?)://" + window.location.host), "");
    if (menuId) {
        url = changeUrlParameter(url, "menuId", menuId);
    } else {
        url = changeUrlParameter(url, "pageId", pageId);
    }
    return url;
}
