/**
 * 作者：yujinjin9@126.com
 * 时间：2020-12-28
 * 描述：APP命名空间
 */
import { BuildEnv } from "/@/services/enums";

declare namespace App {
    /** APP当前环境配置 */
    interface Config {
        /** 当前环境模式 */
        readonly buildEnv: BuildEnv;

        /** 应用名称 */
        readonly appName: string;

        /** 是否调试模式 */
        readonly isDebug: boolean;

        /** 应用的版本 */
        readonly version: string;

        /** 请求的API版本号 */
        readonly apiVersion: string;

        /** 应该构建时间 */
        readonly buildTime: Date;

        /** web站点的接口地址 */
        readonly webApiDomain: string;

        /** 资源服务站点的地址 */
        readonly resourceDomain: string;

        /** 上传服务站点的地址 */
        readonly uploadDomain: string;
    }

    /** 站点本地存储 */
    interface Storage {
        /** 获取站点本地存储信息 */
        getSiteLocalStorage(key: string): undefined | Record<string, any>;

        /** 设置站点本地存储信息 */
        setSiteLocalStorage(key: string, value: Record<string, any>): void;

        /** 本地存储 */
        localStorage(key: string, value?: string);
    }

    interface StoreStateType {
        data: {
            locationInfo: LocationInfo;
            loginUserInfo: LoginUserInfo;
        };
        event: {
            events: Record<string, Array<Function>>;
            onceEvents: Record<string, Array<Function>>;
        };
    }

    /** 站点数据 */
    interface LocationInfo {
        /** 是否显示侧边栏 */
        isShowSideBar: boolean;
    }

    /** 当前登录用户信息 */
    interface LoginUserInfo {
        /** 是否登录 */
        isLogin: boolean;

        /** 用户编号 */
        userNo: string;

        /** 用户授权码 */
        authAccessCode: string;
    }

    /** 日志 */
    interface Logs {
        debug(...contents: any[]): void;
        info(...contents: any[]): void;
        warn(...contents: any[]): void;
        error(...contents: any[]): void;
        fatal(...contents: any[]): void;
    }
}
