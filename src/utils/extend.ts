/**
 * 作者：yujinjin9@126.com
 * 时间：2020-08-13
 * 描述：对象深复制，创建对象和继承 (完全复制jquery的方法)
 * 示例：extend(true, {a: 1}, {b: 1})
 */
export default (function () {
    const class2type = {};
    const toString = class2type.toString;
    const hasOwn = class2type.hasOwnProperty;
    "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ").forEach(function (item) {
        class2type["[object " + item + "]"] = item.toLowerCase();
    });
    const type = function (obj) {
        if (obj == null) {
            return obj + "";
        }
        return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
    };
    const isFunction = function (obj) {
        return type(obj) === "function";
    };
    const isWindow = function (obj) {
        return obj != null && obj == obj.window;
    };
    const isPlainObject = function (obj) {
        let key;
        // Must be an Object.
        // Because of IE, we also have to check the presence of the constructor property.
        // Make sure that DOM nodes and window objects don't pass through, as well
        if (!obj || type(obj) !== "object" || obj.nodeType || isWindow(obj)) {
            return false;
        }
        try {
            // Not own constructor property must be Object
            if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
        } catch (e) {
            // IE8,9 Will throw exceptions on certain host objects #9897
            return false;
        }
        // Own properties are enumerated firstly, so to speed up,
        // if last one is own, then all properties are own.
        // eslint-disable-next-line no-empty
        for (key in obj) {
        }
        return key === undefined || hasOwn.call(obj, key);
    };
    const isArray =
        Array.isArray ||
        function (obj) {
            return type(obj) === "array";
        };
    const extend = function (...args: any[]) {
        let src,
            copyIsArray,
            copy,
            name,
            options,
            clone,
            target = args[0] || {},
            i = 1,
            deep = false;

        const length = args.length;

        // Handle a deep copy situation
        if (typeof target === "boolean") {
            deep = target;
            // skip the boolean and the target
            target = args[i] || {};
            i++;
        }
        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== "object" && !isFunction(target)) {
            target = {};
        }
        // extend jQuery itself if only one argument is passed
        if (i === length) {
            // target = this;
            i--;
        }
        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = args[i]) != null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }
                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && isArray(src) ? src : [];
                        } else {
                            clone = src && isPlainObject(src) ? src : {};
                        }
                        // Never move original objects, clone them
                        target[name] = extend(deep, clone, copy);
                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        // Return the modified object
        return target;
    };
    return extend;
})();
