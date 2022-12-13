/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2022-12-09 09:56:26
 * @项目的路径: \vue-manager-system\src\utils\others.ts
 * @描述: 站点其他常用工具类方法
 */

/**
 * @param url JS文件的路径
 * @param id 当前加载js文件标签的ID，防止同一个文件重复加载
 * @param callback JS文件加载成功或失败后的回调函数
 * 描述：页面动态加载JS文件，如果超过10S文件还未加载表示超时
 */
export function loadScript(url: string, id: string): Promise<boolean> {
    return new Promise(resolve => {
        //如果URL不存在或者该ID已经加载过了
        if (document.getElementById(id)) {
            resolve(true);
            return;
        }
        const script: HTMLScriptElement = document.createElement("script");
        script.type = "text/javascript";
        script.id = id;
        //默认10S超时就立即执行回调函数
        let timer: number | null = window.setTimeout(function () {
            timer = null;
            resolve(false);
        }, 10000);
        script.onload = function () {
            if (timer) {
                clearTimeout(timer);
                resolve(true);
            }
        };
        script.src = url;
        document.body.appendChild(script);
    });
}

/**
 * 函数节流，提升性能,用于操作函数节流，节流就间隔时间段 时间内执行一次，也就是降低频率，将高频操作优化成低频操作。
 * @param {function} func 要执行的函数（不能是匿名函数）
 * @param {number} wait 函数执行的最小间隔
 * @param {object} options {leading: true,trailing: true}, leading代表是否开头执行，tailing代表是否结尾执行
 * @example let cb=app.utils.throttle(fnName,250); window.addEventListener('scroll', cb, false); ;
 */
export function throttle(fn: (...args: any[]) => any, wait: number, options?: { leading?: boolean; trailing?: boolean }) {
    let timeout: null | number = null;
    let previous = 0;
    if (!options) options = {};
    return function (this: any, ...args: any[]) {
        const now = Date.now();
        if (!previous && options!.leading === false) previous = now;
        const remaining = wait - (now - previous);
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            fn.apply(this, args);
        } else if (!timeout && options!.trailing !== false) {
            timeout = window.setTimeout(() => {
                previous = options!.leading === false ? 0 : Date.now();
                timeout = null;
                fn.apply(this, args);
            }, remaining);
        }
    };
}

/**
 *
 * 函数防抖
 * @param callback 执行的函数
 * @param wait 等待的时间
 * @returns Function
 */
export function debounce(callback, wait) {
    let timeout;
    return function (this: any, ...args: any[]) {
        clearTimeout(timeout);
        timeout = window.setTimeout(() => {
            callback.apply(this, args);
        }, wait);
    };
}

/**
 * 设置 object对象中对应 path 属性路径上的值，如果path不存在，则创建。 缺少的索引属性会创建为数组，而缺少的属性会创建为对象。
 */
export function setObjectProperty(object: Record<string, any>, path: string | string[], value) {
    if (!path) {
        throw "path 属性路径上的值不能为空";
    } else if (!object || typeof object !== "object") {
        throw "设置的目标必须是对象类型";
    }
    let keyArray: string[] = [];
    if (typeof path == "string") {
        //将a[b].c转换为a.b.c
        path = path.replace(/\[(\w+)\]/g, ".$1");
        path = path.replace(/^\./, "");
        //将.a.b转换为a.b
        keyArray = path.split(".");
    } else if (Array.isArray(path)) {
        keyArray = path;
    } else {
        throw "path 属性路径只能为字符串类型或数组类型";
    }
    if (keyArray.length == 1) {
        object[keyArray[0]] = value;
        return { rootObject: { [keyArray[0]]: value } };
    }
    const getValue = function (targetObject, key, isArray) {
        let value = targetObject[key];
        if (value == undefined || value == null || typeof value != "object") {
            targetObject[key] = value = isArray ? [] : {};
        }
        return value;
    };

    let targetValue = getValue(object, keyArray[0], /^\d+$/.test(keyArray[1]));
    const rootName = keyArray[0];
    const rootValue = targetValue;
    for (let i = 1; i < keyArray.length - 1; i++) {
        targetValue = getValue(targetValue, keyArray[i], /^\d+$/.test(keyArray[i + 1]));
    }
    targetValue[keyArray[keyArray.length - 1]] = value;
    return { rootObject: { [rootName]: rootValue } };
}

/**
 * 根据 object对象的path路径获取值。 如果解析 value 是 undefined 会以 defaultValue 取代。
 */
export function getObjectProperty(object: Record<string, any>, path: string | string[], defaultValue?) {
    if (!path) {
        throw "path 属性路径上的值不能为空";
    } else if (!object || typeof object !== "object") {
        throw "设置的目标必须是对象类型";
    }
    let keyArray: string[] = [];
    if (typeof path == "string") {
        //将a[b].c转换为a.b.c
        path = path.replace(/\[(\w+)\]/g, ".$1");
        path = path.replace(/^\./, "");
        //将.a.b转换为a.b
        keyArray = path.split(".");
    } else if (path instanceof Array) {
        keyArray = path;
    } else {
        throw "path 属性路径只能为字符串类型或数组类型";
    }
    let targetValue: any = object;
    for (let i = 0; i < keyArray.length; i++) {
        if (Object.prototype.hasOwnProperty.call(targetValue, keyArray[i])) {
            targetValue = targetValue[keyArray[i]];
            if (targetValue == null) return null;
        } else {
            targetValue = undefined;
        }
        if (targetValue == undefined) {
            return defaultValue;
        }
    }
    return targetValue;
}
