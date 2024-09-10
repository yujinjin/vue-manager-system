/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-07-31 14:51:41
 * @项目的路径: \vue-manager-system\src\services\register-events.ts
 * @描述: 注册全局事件
 */
import type { Router } from "vue-router";
import { eventsStore, storageStore } from "@/stores";

export default function (router: Router) {
    const events = eventsStore();

    const storage = storageStore()

    // 去定义跳转登录函数方法
    const gotoLogin = function (toFullPath?: string) {
        // 当前路由信息放在URL上，方便登录回来时自动打开
        if (!toFullPath) {
            toFullPath = router.currentRoute.value.fullPath;
        }
        router.push({ name: "login", query: { toFullPath: encodeURIComponent(toFullPath) } });
    };

    // 去定义退出登录函数方法
    const gotoLogout = function () {
        // 清理本地存储登录信息或者设置当前登录的信息为失效状态
        storage.logout();
        router.push({ name: "login" });
    };

    // 跳转登录全局事件
    events.on({
        eventName: "gotoLogin",
        callback: gotoLogin
    });

    // 退出登录全局事件
    events.on({
        eventName: "gotoLogout",
        callback: gotoLogout
    });
}
