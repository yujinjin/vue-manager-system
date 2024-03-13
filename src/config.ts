/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-10-31 11:51:21
 * @项目的路径: \vue-manager-system\src\config.ts
 * @描述：APP应用配置
 */
/// <reference types="node" />

import type { App } from "/#/app";
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

    /** 当前web是否是hash 模式 */
    isWebHash: process.env.VUE_APP_WEB_HASH === "1",

    /** 当前web项目服务部署根目录（路径） */
    projectContentPath: process.env.VUE_APP_PROJECT_CONTENT_PATH,

    /** 应该构建时间 */
    buildTime: new Date(process.env.VUE_APP_BUILD_TIME!),

    /** 本地web服务地址 */
    localDomain: process.env.VUE_APP_LOCAL_DOMAIN,

    /** web站点的接口地址 */
    webApiDomain: process.env.VUE_APP_API_DOMAIN,

    /** 资源服务站点的地址 */
    resourceDomain: process.env.VUE_APP_API_DOMAIN,

    /** 上传服务站点的地址 */
    uploadDomain: process.env.VUE_APP_UPLOAD_DOMAIN
};
