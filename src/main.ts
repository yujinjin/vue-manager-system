import { type Pinia } from "pinia";
import { type Router } from "vue-router";
import { createApp, type App as VueApplication } from "vue";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import CMSComponents from "@yujinjin/cms-components";
import Appvue from "@/views/app.vue";
import config, { type Config } from "@/config";
import logs, { type Logs } from "@/services/logs";
import routers from "@/routers/";
import store from "@/stores/index";
// import components from "@/components/index";
import directives from "@/services/directives";
import plugins from "@/plugins/index";
import registerEvents from "@/services/register-events";
// import "../mock/test.js";
import "@style/element-variables.scss";
import "@yujinjin/cms-components/dist/index.css";
import "@style/index.scss";
import "@style/icomoon.css";

/** App Main类 */
class AppMain {
    // 项目配置
    config: Config;

    // 日志
    logs: Logs;

    // 当前vue实例
    vueAppInstance: VueApplication | null;

    // VUE存储状态
    store: Pinia;

    // VUE 路由
    router: Router | null;

    constructor() {
        this.initConfig();
        this.config = config;
        this.logs = logs;
        this.store = store;
        this.router = null;
        this.vueAppInstance = null;
    }

    // 初始化项目配置
    initConfig() {
        // TODO:
    }

    // 初始化
    async init() {
        if (VITE_MOCK_DATA === "1") {
            await import("@/mock/index");
        }
        this.vueAppInstance = this.initVue();
        this.mount("#app");
    }

    // 初始化vue
    initVue(): VueApplication {
        const vueAppInstance = createApp(Appvue);
        // 是否启用对组件初始化、编译、渲染和更新的性能追踪
        vueAppInstance.config.performance = config.isDebug;
        // 非debug 模式
        if (!config.isDebug) {
            /**
             * @param {String}  errorMessage   错误信息
             * @param {String}  scriptURI      出错的文件
             * @param {Long}    lineNumber     出错代码的行号
             * @param {Long}    columnNumber   出错代码的列号
             * @param {Object}  errorObj       错误的详细信息，Anything
             */
            window.onerror = function (errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
                logs.error({ errorMessage, scriptURI, lineNumber, columnNumber, errorObj });
            };
            vueAppInstance.config.errorHandler = function (err, vm, info) {
                logs.error(JSON.stringify({ message: "Vue errorHandler:" + err, type: info }));
            };
        }
        vueAppInstance.use(this.store);
        vueAppInstance.use(ElementPlus, { locale: zhCn });
        vueAppInstance.use(CMSComponents);
        this.router = routers();
        vueAppInstance.use(this.router);
        // 注册全局指令
        Object.keys(directives).forEach(key => {
            vueAppInstance.directive(key, directives[key]);
        });
        // 注册全局插件
        plugins(vueAppInstance);
        // 注册全局组件
        // components(vueAppInstance);
        // 注册全局事件
        registerEvents(this.router);
        return vueAppInstance;
    }

    // 挂载dom
    mount(container: string | HTMLElement) {
        this.vueAppInstance!.mount(typeof container === "string" ? container : container.querySelector("#app"));
    }

    // 卸载组件实例
    unmount() {
        this.vueAppInstance!.unmount();
    }
}
// 初始化APP
const appMain = new AppMain();
appMain.init();

if (config.isDebug) {
    // 调试模式加全局模式
    window.appMain = appMain;
}
