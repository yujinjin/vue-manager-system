/**
 * 作者：yujinjin9@126.com
 * 时间：2022-03-09
 * 描述：注册全局事件
 */
import store from "@/store/";
import { Router } from "vue-router";

export default function () {
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
    store.dispatch("on", {
        eventName: "gotoLogin",
        callback: gotoLogin
    });

    store.dispatch("on", {
        eventName: "gotoLogout",
        callback: gotoLogout
    });
}
