/**
 * 作者：yujinjin9@126.com
 * 时间：2022-01-10
 * 描述：URL常用工具类方法
 */

/**
 * 作者：yujinjin9@126.com
 * 时间：2022-01-14
 *
 * @param url 当前要修改的URL
 * @param name 参数名，如果参数名(name)在URL中不存在有value值且可以增加就表示增加该参数
 * @param value 参数值，如果value为null或者空字符串就表示删除该参数
 * @param isAdd 如果没有该参数时是否可以增加该参数，默认为true.
 * @return 返回新的URL
 * 描述：修改url中的参数值，如果参数名(name)在URL中不存在且有value值就表示增加该参数，如果value为null或者空字符串就表示删除该参数
 */

export function changeUrlParameter(url: string, name: string, value?: string | number, isAdd = true): string {
    if (!url && !name) return "";
    if (value === undefined || value === null) {
        // 删除参数
        return url.replace(eval("/(\\?|\\&)(" + name + "=)([^&]*)(&*)/gi"), function (matchWord, parame1, parame2, parame3, parame4) {
            if (parame4 != "&") {
                return "";
            } else {
                return parame1;
            }
        });
    } else {
        let _is_has_name = false; // 是否有该参数
        let _new_url = url.replace(eval("/(\\?|\\&)(" + name + "=)([^&]*)(&*)/gi"), function (matchWord, parame1, parame2, parame3, parame4) {
            _is_has_name = true;
            return parame1 + parame2 + value + parame4;
        });
        if (!_is_has_name && isAdd) {
            let symbol_character = "?";
            if (_new_url.indexOf("?") !== -1 && (_new_url.indexOf("#/") === -1 || _new_url.substring(_new_url.indexOf("#/")).indexOf("?") !== -1)) {
                // 兼容http://xxxx/?orderNo=xxx#/?id=xxx这种格式
                symbol_character = "&";
            }
            _new_url += symbol_character + name + "=" + value;
        }
        return _new_url;
    }
}

/**
 * 作者：yujinjin9@126.com
 * 时间：2022-02-26
 *
 * @param url 需要解析的目标url
 * 描述：解析URL的参数、域名、协议、端口等对象
 */
export function parseUrl(url: string): Record<string, any> {
    const _a_el = document.createElement("a");
    _a_el.href = url;
    return {
        sources: url,
        protocol: _a_el.protocol.replace(":", ""), //协议
        host: _a_el.hostname, //域名
        port: _a_el.port,
        query: (function () {
            let search: string = _a_el.search || "";
            if (!search) {
                //兼容http://xxxx/#/?id=xxx这种格式
                search = url.indexOf("?") === -1 ? "" : url.substring(url.indexOf("?"));
            } else if (url.indexOf("?") !== url.lastIndexOf("?")) {
                // 兼容http://xxxx/?orderNo=xxx#/?id=xxx这种格式
                search += (search.indexOf("?") === -1 ? "?" : "&") + url.substring(url.lastIndexOf("?") + 1);
            }
            return search;
        })(),
        params: (function () {
            const params: Record<string, any> = {};
            let search: string | string[] = _a_el.search || "";
            if (!search) {
                //兼容http://xxxx/#/?id=xxx这种格式
                search = url.indexOf("?") === -1 ? "" : url.substring(url.indexOf("?"));
            } else if (url.indexOf("?") !== url.lastIndexOf("?")) {
                // 兼容http://xxxx/?orderNo=xxx#/?id=xxx这种格式
                search += (search.indexOf("?") === -1 ? "?" : "&") + url.substring(url.lastIndexOf("?") + 1);
            }
            search = (<string>search).replace(/^\?/, "").split("&");
            const len = search.length;
            for (let i = 0; i < len; i++) {
                if (!search[i]) {
                    continue;
                }
                const paramsString: string[] = search[i].split("=");
                params[paramsString[0]] = paramsString[1];
            }
            return params;
        })(), //参数对象
        file: (_a_el.pathname.match(/\/([^/?#]+)$/i) || ["", ""])[1],
        hash: _a_el.hash.replace("#", ""),
        path: _a_el.pathname.replace(/^([^/])/, "/$1"),
        relative: (_a_el.href.match(/tps?:\/\/[^/]+(.+)/) || ["", ""])[1],
        segments: _a_el.pathname.replace(/^\//, "").split("/")
    };
}
