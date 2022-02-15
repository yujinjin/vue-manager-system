/**
 * 作者：yujinjin9@126.com
 * 时间：2020-08-13
 * 描述：对象深复制，创建对象和继承 (完全复制jquery的方法)
 */
export default (function () {
	let class2type = {};
	let toString = class2type.toString;
	let hasOwn = class2type.hasOwnProperty;
	"Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ").forEach(function (item) {
		class2type["[object " + item + "]"] = item.toLowerCase();
	});
	let type = function (obj) {
		if (obj == null) {
			return obj + "";
		}
		return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
	};
	let isFunction = function (obj) {
		return type(obj) === "function";
	};
	let isWindow = function (obj) {
		return obj != null && obj == obj.window;
	};
	let isPlainObject = function (obj) {
		var key;
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
		for (key in obj) {
		}
		return key === undefined || hasOwn.call(obj, key);
	};
	let isArray =
		Array.isArray ||
		function (obj) {
			return type(obj) === "array";
		};
	let extend = function () {
		var src,
			copyIsArray,
			copy,
			name,
			options,
			clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if (typeof target === "boolean") {
			deep = target;
			// skip the boolean and the target
			target = arguments[i] || {};
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
			if ((options = arguments[i]) != null) {
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
