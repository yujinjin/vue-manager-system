/**
 * 作者：yujinjin9@126.com
 * 时间：2021-12-30
 * 描述：站点常用格式化方法
 */

//日期格式化
export function dateFormat(date: Date | number | string, format = "YYYY-MM-DD"): string {
    if (date instanceof String || date instanceof Number) {
        date = new Date(date);
    }
    const dateConfig = {
        "(Y|y)+": (<Date>date).getFullYear(), // 月份
        "M+": (<Date>date).getMonth() + 1, // 月份
        "(d|D)+": (<Date>date).getDate(), // 日
        "h+": (<Date>date).getHours() > 12 ? (<Date>date).getHours() - 12 : (<Date>date).getHours(), // 小时
        "H+": (<Date>date).getHours(), // 24小时
        "m+": (<Date>date).getMinutes(), // 分
        "s+": (<Date>date).getSeconds(), // 秒
        "q+": Math.floor(((<Date>date).getMonth() + 3) / 3), // 季度
        "S+": (<Date>date).getMilliseconds() // 毫秒
    };
    Object.keys(dateConfig).forEach(key => {
        if (new RegExp(key).test(format)) {
            format.replace(new RegExp("(" + key + ")"), function (match) {
                if (match.length > String(dateConfig[key]).length) {
                    return new Array(match.length - String(dateConfig[key]).length).fill("0").join("") + String(dateConfig[key]);
                }
                return String(dateConfig[key]);
            });
        }
    });
    return format;
}

/**
 * @param date 当前需要转换的日期
 * @param separator 日期格式的分隔符，默认：/
 * 描述：日期时间段显示格式化，1小时以内：mm 分钟前|24小时以内：hh 小时前|1-30天：dd 天前|30天以上：mm/dd|如果30天以上，并且跨年：yyyy/mm/dd
 */
export function timeDifferenceFormat(date: Date | number | string, separator = "/") {
    // if (date instanceof String || date instanceof number) {
    //     date = new Date(date);
    // }
    const currentTime = new Date(),
        compareTime = new Date(date);
    const timeDifference = (currentTime.getTime() - compareTime.getTime()) / 1000;
    if (timeDifference < 60) {
        return "刚刚之前";
    } else if (timeDifference < 3600) {
        return parseInt(String(timeDifference / 60), 10) + "分钟前";
    } else if (timeDifference < 60 * 60 * 24) {
        return parseInt(String(timeDifference / 3600), 10) + "小时前";
    } else if (timeDifference < 60 * 60 * 24 * 30) {
        return parseInt(String(timeDifference / (60 * 60 * 24)), 10) + "天前";
    } else if (compareTime.getFullYear() == currentTime.getFullYear()) {
        return dateFormat(compareTime, `MM${separator}DD`);
    } else {
        return dateFormat(compareTime, `YYYY${separator}MM${separator}DD`);
    }
}

/**
 * 将数值格式化
 *
 * @param value 数值(Number或者String)
 * @param digit 保留小数点几位
 * @return 格式的字符串,如'1,234,567.45'
 * @type String
 */
export function numberFormat(value: number | string, digit = 0): string {
    if (typeof value === "string") {
        value = (<string>value).replace(/\$|,/g, "");
        value = parseFloat(value);
    }
    if (digit < 0) {
        digit = 0;
    } else if (digit > 11) {
        throw new Error("最大支持11位小数格式化");
    }
    value = value.toFixed(digit);
    if (value.indexOf(".") === -1) {
        // 整数
        value = value.replace(/\B(?=(?:\d{3})+$)/g, ",");
    } else {
        value = value.substring(0, value.indexOf(".")).replace(/\B(?=(?:\d{3})+$)/g, ",") + value.substring(value.indexOf("."), value.length);
    }
    return <string>value;
}

/**
 * 字符串内容格式化
 * @param contents 字符串内容（格式：我是{0}，今年{1}了|我是{name}，今年{age}了）
 * @param parameters 参数内容
 */
export function stringFormat(contents: string, parameters?: Array<any> | Record<string, any>): string {
    if (!parameters || !contents) {
        return contents;
    }
    if (parameters.length > 0) {
        (<Array<any>>parameters).forEach((value, index) => {
            contents = contents.replace(new RegExp("\\{" + index + "\\}", "g"), value === null ? "" : value);
        });
    } else {
        Object.keys(parameters).forEach(key => {
            contents = contents.replace(new RegExp("\\{" + key + "\\}", "g"), (<Record<string, any>>parameters)[key] === null ? "" : (<Record<string, any>>parameters)[key]);
        });
    }
    return contents;
}
