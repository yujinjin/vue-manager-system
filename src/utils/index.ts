/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-10-27 09:43:46
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-11-09 20:13:23
 * @项目的路径: \vue-manager-system\src\utils\index.ts
 * @描述: 常用工具方法
 */

// 特殊字符替换
export function escapeStringRegexp(string = "") {
    return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}

// 是否是外部菜单链接
export function isExternalLink(url: string) {
    return !!url.match(new RegExp("^http(s?)://")) && !url.match(new RegExp("^http(s?)://" + window.location.host));
}