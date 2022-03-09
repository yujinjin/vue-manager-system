/**
 * 作者：yujinjin9@126.com
 * 时间：2022-03-08
 * 描述：系统自定义插件入口
 */
import { App } from "vue";
import loading from "./loading";

export default function (vueAppInstance: App) {
    // Loading 全局插件引入
    vueAppInstance.use(function (app) {
        app.config.globalProperties.$showLoading = loading.show;
        app.config.globalProperties.$hideLoading = loading.hide;
    });
}
