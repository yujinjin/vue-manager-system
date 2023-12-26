/**
 * 作者：yujinjin9@126.com
 * 时间：2020-12-28
 * 描述：APP命名空间
 */
import type { BuildEnv } from "/@/services/enums";

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

        /** 本地web服务地址 */
        readonly localDomain: string;

        /** web站点的接口地址 */
        readonly webApiDomain: string;

        /** 资源服务站点的地址 */
        readonly resourceDomain: string;

        /** 上传服务站点的地址 */
        readonly uploadDomain: string;
    }

    /** 站点数据 */
    interface LocationInfo {
        /** 是否显示侧边栏 */
        isShowSideBar: boolean;
    }

    /** 当前登录用户信息 */
    interface LoginUserInfo {
        /** 登录用户号 */
        userName: string;

        /** 手机号 */
        phoneNumber: string;

        /** 邮箱 */
        email: string;

        /** 头像 */
        avatar: string;

        /** 性别 */
        gender: string;

        /** 过期时间 */
        expiredTime: number;

        /** 用户授权码 */
        authAccessCode: string;
    }

    /** 访问的页面视图 */
    interface PageView {
        /** 页面视图ID(自动生成唯一值) */
        id: string;

        /** 菜单ID(如果当前页面来自左边的菜单) */
        menuId?: string;

        /** 来自页面视图ID(如果当前页面通过已经点开的页面内部触发的) */
        fromPageId?: string;

        // 路由的名称(考虑到useRouter只能适用在组件setup里而且只是用来判断路由的keep alive，所以这里不在保存而是放在home里动态生成)
        // routeName: string;

        /** 当前页面路由地址 /#/XXX?menuId(来自菜单ID参数)|pageId（来自页面ID参数） */
        routePath: string;

        /** 页面的标题 */
        title: string;

        /** 页面实际全路径地址(如果当前页面是外部页面，指实际iframe的url地址) */
        fullPath: string;

        /** 是否是iframe页面 */
        isIframe: boolean;

        /** 是否固定展示(每次登录都自动展示出来，由于权限问题只能固定来自menuId的page) */
        isFixed: boolean;
    }

    interface StoreStateType {
        data: {
            locationInfo: LocationInfo;
            loginUserInfo: LoginUserInfo;
        };
        event: {
            events: Record<string, Array<(...args: any[]) => any>>;
            onceEvents: Record<string, Array<(...args: any[]) => any>>;
        };
        pageViews: {
            cachedViews: string[];
            visitedViews: PageView[];
        };
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
