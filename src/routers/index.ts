/**
 * 作者：yujinjin9@126.com
 * 时间：2022-01-07
 * 描述：路由配置
 * meta: {
 * 	requiresAuth: boolean, // 是否需要登录
 * 	title: "首页" // 页面标题
 * }
 */
import store from "@/store/";
import { createRouter, createWebHistory, RouteRecordRaw, Router } from "vue-router";

export default function (): Router {
    const router: Router = createRouter({
        history: createWebHistory("/"), // HTML5 history模式
        routes: <Array<RouteRecordRaw>>[
            {
                path: "/",
                name: "home", // 首页
                meta: {
                    requireAuth: false
                },
                component: () => import("@views/home.vue")
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
            }
        ],
        scrollBehavior: () => ({ left: 0, top: 0 }),
        strict: true
    });
    // 注册一个全局前置守卫
    router.beforeEach(to => {
        if (to.meta.requireAuth !== false && !store.state.data.loginUserInfo.isLogin) {
            // 未登录的用户进入了需要登录的页面, 全局触发去登录事件
            store.dispatch("trigger", { eventName: "gotoLogin", args: [router] });
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
