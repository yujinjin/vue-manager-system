/*
 * @创建者: yujinjin9@126.com
 * @描述: 常用工具方法
 */
import { changeUrlParameter } from "@yujinjin/utils";

// 特殊字符替换
export function escapeStringRegexp(string = "") {
    return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}

// 是否是外部菜单链接
export function isExternalLink(url: string) {
    // return !!url.match(new RegExp("^http(s?)://")) && !url.match(new RegExp("^http(s?)://" + window.location.host));
    return new RegExp("^http(s?)://").test(url) || !new RegExp("^/").test(url);
}

/**
 * 外部链接路由路径
 * @params menuId 菜单ID
 * @params pageId 页面ID
 */
export function externalRoutePath({ menuId, pageId }: { menuId?: string; pageId?: string }) {
    if (menuId) {
        return "/external/" + menuId;
    }
    return "/external?pageId=" + pageId;
}

/**
 * 中转页链接路由路径
 * @params menuId 菜单ID
 * @params pageId 页面ID
 */
export function transitRoutePath({ pageIndex, fromRoutePath }: { pageIndex?: number; fromRoutePath?: string }) {
    if (pageIndex || pageIndex === 0) {
        return "/transit?fromPageIndex=" + pageIndex;
    }
    return "/external?fromRoutePath=" + fromRoutePath;
}

/**
 * 内部链接路由路径
 * @params url 当前地址
 * @params menuId 菜单ID
 * @params pageId 页面ID
 */
export function innerRoutePath(url: string, { menuId, pageId }: { menuId?: string; pageId?: string }) {
    url = url.replace(new RegExp("^http(s?)://" + window.location.host), "");
    if (menuId) {
        url = changeUrlParameter(url, "menuId", menuId);
    } else {
        url = changeUrlParameter(url, "pageId", pageId);
    }
    return url;
}
