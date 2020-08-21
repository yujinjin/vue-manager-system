/**
 * 作者：yujinjin9@126.com
 * 时间：2017-01-19
 * 描述：站点页面表单验证框架工具类
 */
import extend from "./extend";

export default {
	// 日期时间段显示格式化，1小时以内：mm 分钟前|24小时以内：hh 小时前|1-30天：dd 天前|30天以上：mm/dd|如果30天以上，并且跨年：yyyy/mm/dd
	timeDifferenceFormat(date, separator = "/") {
		if (!date) return "";
		let currentTime = new Date(),
			compareTime = new Date(date);
		let timeDifference = (currentTime.getTime() - compareTime.getTime()) / 1000;
		if (timeDifference < 60) {
			return "刚刚之前";
		} else if (timeDifference < 3600) {
			return parseInt(timeDifference / 60, 10) + "分钟前";
		} else if (timeDifference < 60 * 60 * 24) {
			return parseInt(timeDifference / 3600, 10) + "小时前";
		} else if (timeDifference < 60 * 60 * 24 * 30) {
			return parseInt(timeDifference / (60 * 60 * 24), 10) + "天前";
		} else if (compareTime.getFullYear() == currentTime.getFullYear()) {
			return this.dateFormat(compareTime, `MM${separator}dd`);
		} else {
			return this.dateFormat(compareTime, `yyyy${separator}MM${separator}dd`);
		}
	},

	//日期格式化
	dateFormat(date, fmt = "yyyy-MM-dd") {
		// TODO: 没有经过测试
		if (!date) {
			return "";
		} else if (typeof date === "string") {
			date = new Date(date);
		}
		let o = {
			"M+": date.getMonth() + 1, // 月份
			"d+": date.getDate(), // 日
			"h+": date.getHours(), // 小时
			"m+": date.getMinutes(), // 分
			"s+": date.getSeconds(), // 秒
			"q+": Math.floor((date.getMonth() + 3) / 3), // 季度
			S: date.getMilliseconds() // 毫秒
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (let k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		return fmt;
	},

	/**
	 * 将数值四舍五入(保留2位小数)后格式化成金额形式
	 *
	 * @param num 数值(Number或者String)
	 * @param digit 保留小数点几位
	 * @return 金额格式的字符串,如'1,234,567.45'
	 * @type String
	 */
	//数据格式化
	numberFormat(num, digit) {
		num = num.toString().replace(/\$|,/g, "");
		if (isNaN(num)) num = "0";
		if (typeof digit != "number" || digit < 0) {
			digit = 0;
		}
		//最大支持11位小数
		if (digit > 11) {
			return;
		}
		// 绝对值
		let sign = num == (num = Math.abs(num)),
			cents = null;
		num = Math.floor(num * Math.pow(10, digit) + 0.50000000001);
		if (digit > 0) {
			//小数位
			cents = num % Math.pow(10, digit);
			cents = ("00000000000" + num).substr(-digit);
		}
		num = Math.floor(num / Math.pow(10, digit)).toString();
		for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) num = num.substring(0, num.length - (4 * i + 3)) + "," + num.substring(num.length - (4 * i + 3));
		if (cents) {
			return (sign ? "" : "-") + num + "." + cents;
		} else {
			return (sign ? "" : "-") + num;
		}
	},

	//将数字转换成大写汉字
	changeNumMoneyToChinese(money) {
		let cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //汉字的数字
		let cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位
		let cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位
		let cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位
		let cnInteger = "整"; //整数金额时后面跟的字符
		let cnIntLast = "元"; //整型完以后的单位
		let maxNum = 999999999999999.9999; //最大处理的数字
		let IntegerNum; //金额整数部分
		let DecimalNum; //金额小数部分
		let ChineseStr = ""; //输出的中文金额字符串
		let parts; //分离金额后用的数组，预定义
		if (money == "") {
			return "";
		}
		money = parseFloat(money);
		if (money >= maxNum) {
			alert("超出最大处理数字");
			return "";
		}
		if (money == 0) {
			ChineseStr = cnNums[0] + cnIntLast + cnInteger;
			return ChineseStr;
		}
		money = money.toString(); //转换为字符串
		if (money.indexOf(".") == -1) {
			IntegerNum = money;
			DecimalNum = "";
		} else {
			parts = money.split(".");
			IntegerNum = parts[0];
			DecimalNum = parts[1].substr(0, 4);
		}
		if (parseInt(IntegerNum, 10) > 0) {
			//获取整型部分转换
			let zeroCount = 0;
			let IntLen = IntegerNum.length;
			for (let i = 0; i < IntLen; i++) {
				let n = IntegerNum.substr(i, 1);
				let p = IntLen - i - 1;
				let q = p / 4;
				let m = p % 4;
				if (n == "0") {
					zeroCount++;
				} else {
					if (zeroCount > 0) {
						ChineseStr += cnNums[0];
					}
					zeroCount = 0; //归零
					ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
				}
				if (m == 0 && zeroCount < 4) {
					ChineseStr += cnIntUnits[q];
				}
			}
			ChineseStr += cnIntLast;
			//整型部分处理完毕
		}
		if (DecimalNum != "") {
			//小数部分
			let decLen = DecimalNum.length;
			for (let i = 0; i < decLen; i++) {
				let n = DecimalNum.substr(i, 1);
				if (n != "0") {
					ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
				}
			}
		}
		if (ChineseStr == "") {
			ChineseStr += cnNums[0] + cnIntLast + cnInteger;
		} else if (DecimalNum == "") {
			ChineseStr += cnInteger;
		}
		return ChineseStr;
	},

	parseUrl(url) {
		if (!url) {
			return;
		}
		let _a_el = document.createElement("a");
		_a_el.href = url;
		return {
			sources: url,
			protocol: _a_el.protocol.replace(":", ""), //协议
			host: _a_el.hostname, //域名
			port: _a_el.port,
			query: (function() {
				if (_a_el.search) {
					return _a_el.search;
				}
				//兼容http://xxxx/#/id=xxx这种格式
				if (url.indexOf("?") != -1) {
					return url.substring(url.indexOf("?"));
				}
				return "";
			})(),
			params: (function() {
				let ret = {},
					seg = _a_el.search;
				//兼容http://xxxx/#/id=xxx这种格式
				if (!seg && url.indexOf("?") != -1) {
					seg = url.substring(url.indexOf("?"));
				}
				seg = seg.replace(/^\?/, "").split("&");
				let len = seg.length,
					i = 0,
					s;
				for (; i < len; i++) {
					if (!seg[i]) {
						continue;
					}
					s = seg[i].split("=");
					ret[s[0]] = s[1];
				}
				return ret;
			})(), //参数对象
			file: (_a_el.pathname.match(/\/([^/?#]+)$/i) || ["", ""])[1],
			hash: _a_el.hash.replace("#", ""),
			path: _a_el.pathname.replace(/^([^/])/, "/$1"),
			relative: (_a_el.href.match(/tps?:\/\/[^/]+(.+)/) || ["", ""])[1],
			segments: _a_el.pathname.replace(/^\//, "").split("/")
		};
	},

	generateGuid() {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
			let r = (Math.random() * 16) | 0,
				v = c == "x" ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	},

	//动态加载JS
	loadScript(url, id, callback) {
		//如果URL不存在或者该ID已经加载过了
		if (!url || document.getElementById(id)) return;
		let script = document.createElement("script");
		script.type = "text/javascript";
		if (id) script.id = id;
		if (typeof callback == "function") {
			//默认10S超时就立即执行回调函数
			let timer = setTimeout(function() {
				callback(false);
				timer = null;
			}, 10000);
			if (script.readyState) {
				script.onreadystatechange = function() {
					if (script.readyState == "loaded" || script.readyState == "complete") {
						script.onreadystatechange = null;
						if (timer) {
							clearTimeout(timer);
							callback(true);
						}
					}
				};
			} else {
				script.onload = function() {
					if (timer) {
						clearTimeout(timer);
						callback(true);
					}
				};
			}
		}
		script.src = url;
		document.body.appendChild(script);
	},

	// 验证手机号
	validateMobile(mobile) {
		if (!mobile) {
			return false;
		}
		mobile = mobile.trim().replace(/\s/g, "");
		if (!/^1[0-9]{10}$/.test(mobile.trim())) {
			return false;
		} else {
			return true;
		}
	},

	//验证邮箱
	validateEmail(email) {
		var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if (filter.test(email)) {
			return true;
		} else {
			return false;
		}
	},

	/**
	 * 验证身份证号
	 *
	 * 验证规则是：18位校验规则 6位地址编码+8位出生日期+3位顺序号+1位校验位
	 **/
	validateIDCard(IDCard) {
		if (/^[a-zA-Z][0-9]{6}((（|\()[0-9aA](\)|）))$/.test(IDCard.trim())) {
			// 香港
			return true;
		} else if (/^[a-zA-Z][0-9]{9}$/.test(IDCard.trim())) {
			// 台湾
			let gender_sex = IDCard.trim().substring(1, 2);
			if (gender_sex === "1" || gender_sex === "2") {
				return true;
			}
			return false;
		} else if (/^[157]\d{6}((（|\()[0-9](\)|）))$/.test(IDCard.trim())) {
			// 澳门
			return true;
		} else if (/^[1-9][0-9]{5}(18|19|20)?[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/.test(IDCard.trim())) {
			// 大陆身份证
			// 18位身份证需要验证最后一位校验位
			IDCard = IDCard.split("");
			// ∑(ai×Wi)(mod 11)
			// 加权因子
			let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
			// 校验位
			let parity = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];
			let sum = 0,
				ai = 0,
				wi = 0;
			for (let i = 0; i < 17; i++) {
				ai = IDCard[i];
				wi = factor[i];
				sum += ai * wi;
			}
			let last = parity[sum % 11];
			if (last != IDCard[17].toLocaleUpperCase()) {
				return false;
			}
			return true;
		}
		return false;
	},

	/**
	 * 验证银行卡
	 *
	 * 验证规则是：全数字，长度必须在5到24之间
	 */
	validateBankCard(bankCard) {
		if (!bankCard) return false;
		return /^[0-9]{5,25}$/.test(bankCard);
	},

	//获取图片地址，如果地址带有 http://那么就认为是绝对地址，然后直接返回
	perfectImageUrl(url, size, height) {
		if (!url) {
			return site.config.errorDefaultImg;
		}
		if (((url.match(/http:\/\//) || url.match(/https:\/\//) || url.match(/\/\//)) && url.indexOf(config.resourceDomain) == -1) || url.startsWith("data:image")) {
			// 外部域名的地址
			return url;
		}
		// 清除图片后缀
		if (typeof url === "string" && /(.+\.(jpeg|png|bmp|jpg|gif))\?.+/g.test(url)) {
			url = RegExp.$1;
		}
		// 获取图片压缩质量样式
		let style = "";
		if (size || height) {
			if (typeof size === "string") {
				// 兼容以前的图片版本
				style = "?x-oss-process=style/" + size;
			} else {
				// 小图不需要压缩质量
				const q = (size || height) <= 100 ? 100 : 90;
				style = "?" + "x-oss-process=image/resize,m_lfit," + (size ? `w_${size},` : "") + (height ? `h_${height},` : "") + `limit_1/auto-orient,1/quality,q_${q}`;
			}
		}
		//全站统一配置
		if (url.match(/http:\/\//) || url.match(/https:\/\//) || url.match(/\/\//)) {
			return url + style;
		} else {
			return config.resourceDomain + url + style;
		}
	},

	/**
	 * 作者：yujinjin9@126.com
	 * 时间：2020-04-09
	 *
	 * @param url 图片地址
	 * @param size 图片尺寸(number: 表示宽和高一样，{width: number|boolean-宽或不限宽，height: number|boolean-高或不限制高})
	 * @return 返回修改后的图片地址（String）
	 * 描述：完善头像图片地址，如果是相对地址加上资源域名，如果有指定尺寸就通过阿里云裁剪，如果地址带有 http://那么就认为是绝对地址，然后直接返回
	 */
	perfectAvatarImageUrl(url, size) {
		if (!url) {
			return config.avatarDefaultImg;
		}
		return this.perfectImageUrl(url, size);
	},

	/**
	 * 根据路由名称,参数反射出URL地址
	 *
	 * @param {String} name 路由名称
	 * @param {String} query 路由参数,包含了 动态片段 和 全匹配片段
	 * @param {String} params 路由参数,URL 查询参数。例如，对于路径 /foo?user=1
	 * @param {Object} $router 当前路由对象,如果没有指定当前路由就用指定当前路由
	 */
	getUrlByRouterReflect(name, query = {}, params = {}, $router) {
		if (!$router) {
			$router = site.vueApp.$router;
		}
		if (!$router || !name) {
			return null;
		}
		return site.config.localDomain + $router.resolve({ name, query, params }).href;
	},

	// 判断2个值是否相等
	isEqual(value, targetValue) {
		if (value === targetValue) return true;
		// 判断数据类型
		let valueClassName = toString.call(value),
			targetValueClassName = toString.call(targetValue);
		if (valueClassName != targetValueClassName) return false;
		switch (valueClassName) {
			case "[object RegExp]":
			case "[object String]":
				//进行字符串转换比较
				return "" + value === "" + targetValue;
			case "[object Number]":
				//进行数字转换比较,判断是否为NaN
				if (+value !== +value) {
					return +targetValue !== +targetValue;
				}
				//判断是否为0或-0
				return +value === 0 ? 1 / +value === 1 / targetValue : +value === +targetValue;
			case "[object Date]":
			case "[object Boolean]":
				return +value === +targetValue;
		}
		//如果是对象类型
		if (valueClassName == "[object Object]") {
			let valuePropertyNames = Object.getOwnPropertyNames(value),
				targetValuePropertyNames = Object.getOwnPropertyNames(targetValue);
			if (valuePropertyNames.length != targetValuePropertyNames.length) {
				return false;
			}
			for (let i = 0; i < valuePropertyNames.length; i++) {
				if (!this.isEqual(value[valuePropertyNames[i]], targetValue[valuePropertyNames[i]])) {
					return false;
				}
			}
			return true;
		} else if (valueClassName == "[object Array]") {
			//如果是数组类型
			if (value.length != targetValue.length) {
				return false;
			}
			for (let i = 0; i < value.length; i++) {
				if (!this.isEqual(value[i], targetValue[i])) {
					return false;
				}
			}
			return true;
		}
	},

	// 设置 object对象中对应 path 属性路径上的值，如果path不存在，则创建。 缺少的索引属性会创建为数组，而缺少的属性会创建为对象。
	setObjectProperty(object, path, value) {
		if (!path) {
			throw new Error("path 属性路径上的值不能为空");
		} else if (!object || typeof object !== "object") {
			throw new Error("设置的目标必须是对象类型");
		}
		let keyArray = [];
		if (typeof path == "string") {
			//将a[b].c转换为a.b.c
			path = path.replace(/\[(\w+)\]/g, ".$1");
			path = path.replace(/^\./, "");
			//将.a.b转换为a.b
			keyArray = path.split(".");
		} else if (path instanceof Array) {
			keyArray = path;
		} else {
			throw new Error("path 属性路径只能为字符串类型或数组类型");
		}
		if (keyArray.length == 1) {
			object[keyArray[0]] = value;
			return { rootName: keyArray[0], rootValue: value, propertyName: null };
		}
		const getValue = function(targetObject, key, isArray) {
			let value = targetObject[key];
			if (value == undefined || value == null || typeof value != "object") {
				targetObject[key] = value = isArray ? [] : {};
			}
			return value;
		};

		let targetValue = getValue(object, keyArray[0], /^\d+$/.test(keyArray[1]));
		let rootName = keyArray[0];
		let rootValue = targetValue;
		for (let i = 1; i < keyArray.length - 1; i++) {
			targetValue = getValue(targetValue, keyArray[i], /^\d+$/.test(keyArray[i + 1]));
		}
		targetValue[keyArray[keyArray.length - 1]] = value;
		return { rootName, rootValue, propertyName: keyArray[1] };
	},

	// 根据 object对象的path路径获取值。 如果解析 value 是 undefined 会以 defaultValue 取代。
	getObjectProperty(object, path, defaultValue) {
		if (!path) {
			throw new Error("path 属性路径上的值不能为空");
		} else if (!object || typeof object !== "object") {
			throw new Error("设置的目标必须是对象类型");
		}
		let keyArray = [];
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
		let targetValue = object;
		for (let i = 0; i < keyArray.length; i++) {
			if (targetValue.hasOwnProperty(keyArray[i])) {
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
	},
	extend
};
