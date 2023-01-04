/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-12-13 14:03:34
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-01-04 14:34:40
 * @项目的路径: \vue-manager-system\mock\wrap-response.js
 * @描述: 接口的外部封装
 */
const Mock = require("mockjs");

/**
 * @param template data的数据模板
 * @param randomFlag 数据返回成功或失败是否用随机的方式
 * @param dataSize data数据的数组长度
 * @param codes 返回的异常CODES
 */
module.exports = function (template, randomFlag = false, dataSize, codes) {
    const wrapTemplate = {
        success: randomFlag ? Mock.Random.boolean(1, 9, false) : true,
        error: function () {
            if (this.success) {
                return null;
            } else {
                return {
                    code: !codes ? "" : Object.prototype.toString.call([]) === "[object Array]" ? codes[Mock.Random.integer(0, codes.length)] : codes,
                    message: Mock.Random.ctitle(5, 20)
                };
            }
        }
    };
    if (dataSize) {
        wrapTemplate["data|" + dataSize] = template;
    } else {
        wrapTemplate.data = template;
    }
    return Mock.mock(wrapTemplate);
};
