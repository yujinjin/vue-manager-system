/**
 * 作者：yujinjin9@126.com
 * 时间：2021-12-29
 * 描述：APP应用配置
 */
import { App } from "/#/app";
import { BuildEnv } from "@/services/enums";

// 全局应用配置信息
export default <App.Config>{
    /** 当前环境模式 */
    buildEnv: <BuildEnv>process.env.NODE_ENV,

    /** 应用名称 */
    appName: process.env.VUE_APP_NAME,

    /** 是否调试模式 */
    isDebug: <BuildEnv>process.env.NODE_ENV !== BuildEnv.PRODUCTION,

    /** 应用的版本 */
    version: process.env.VUE_APP_VERSION,

    /** 请求的API版本号 */
    apiVersion: "0.0.1",

    /** 应该构建时间 */
    buildTime: new Date(process.env.VUE_APP_BUILD_TIME!),

    /** web站点的接口地址 */
    webApiDomain: process.env.VUE_APP_API_DOMAIN,

    /** 资源服务站点的地址 */
    resourceDomain: process.env.VUE_APP_API_DOMAIN,

    /** 上传服务站点的地址 */
    uploadDomain: process.env.VUE_APP_UPLOAD_DOMAIN
};
