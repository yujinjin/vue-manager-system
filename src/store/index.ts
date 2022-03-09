/**
 * 作者：yujinjin9@126.com
 * 时间：2021-12-30
 * app数据管理入口文件
 */
import { createStore, createLogger } from "vuex";
import event from "./event";
import data from "./data";
import { App } from "/#/app";

export default createStore<App.StoreStateType>({
    strict: !config.isDebug, // 严格模式，禁止在actions中修改state中的数据
    plugins: config.isDebug ? [createLogger()] : [], // 增加日志插件用于调试，仅在开发环境使用
    modules: {
        data,
        event
    }
});
