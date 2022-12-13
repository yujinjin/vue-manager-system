/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2022-12-07 10:58:10
 * @项目的路径: \vue-manager-system\src\services\register-events.ts
 * @描述: 注册全局事件
 */
import { eventsStore } from "@/stores";
import { Router } from "vue-router";

export default function () {
    const store = eventsStore();

    // 去定义登录函数
    const gotoLogin = function (router: Router) {
        //TODO: 当前路由信息放在URL上，方便登录回来时自动打开
        // router.currentRoute
        router.push({ name: "login" });
    };

    // 去定义登出函数
    const gotoLogout = function (router: Router) {
        //TODO: 清理本地存储登录信息或者设置当前登录的信息为失效状态
        router.push({ name: "login" });
    };

    // 注册全局事件
    store.on({
        eventName: "gotoLogin",
        callback: gotoLogin
    });

    store.on({
        eventName: "gotoLogout",
        callback: gotoLogout
    });
}
