/*
 * @创建者: yujinjin9@126.com
 * @描述：APP应用配置
 */
/// <reference types="node" />

import { BuildEnv } from "@/services/enums";

/** APP当前环境配置 */
export interface Config {
    /** 当前环境模式 */
    readonly buildEnv: BuildEnv;

    /** 应用名称 */
    readonly appName: string;

    /** 是否调试模式 */
    readonly isDebug: boolean;

    /** 请求的API版本号 */
    readonly apiVersion: string;

    /** 当前web是否是hash 模式 */
    readonly isWebHash: boolean;

    /** 当前web项目服务部署根目录（路径） */
    readonly projectContentPath: string;

    /** 应该构建时间 */
    readonly buildTime: Date;

    /** web站点的接口地址 */
    readonly webApiDomain: string;

    /** 资源服务站点的地址 */
    readonly resourceDomain: string;

    /** 上传服务站点的地址 */
    readonly uploadDomain: string;
}

// 全局应用配置信息
export default <Config>{
    /** 当前环境模式 */
    buildEnv: <BuildEnv>process.env.NODE_ENV,

    /** 应用名称 */
    appName: import.meta.env.VITE_APP_NAME,

    /** 是否调试模式 */
    isDebug: <BuildEnv>process.env.NODE_ENV === BuildEnv.DEVELOPMENT || import.meta.env.MODE === "dev",

    /** 请求的API版本号 */
    apiVersion: "0.0.1",

    /** 当前web是否是hash 模式 */
    isWebHash: import.meta.env.VITE_APP_WEB_HASH === "1",

    /** 当前web项目服务部署根目录（路径） */
    projectContentPath: VITE_APP_PROJECT_CONTENT_PATH,

    /** 应该构建时间 */
    buildTime: new Date(VITE_APP_BUILD_TIME!),

    /** web站点的接口地址 */
    webApiDomain: import.meta.env.VITE_APP_API_DOMAIN,

    /** 资源服务站点的地址 */
    resourceDomain: import.meta.env.VITE_APP_RESOURCE_DOMAIN,

    /** 上传服务站点的地址 */
    uploadDomain: import.meta.env.VITE_APP_UPLOAD_DOMAIN
};
