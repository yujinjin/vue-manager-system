/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2024-03-07 16:10:04
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-03-07 16:17:38
 * @项目的路径: \vue-manager-system\src\mock\wrap-response.ts
 * @描述: 接口的外部封装
 */
import Mock from "mockjs";

/**
 * @param template data的数据模板
 * @param randomFlag 数据返回成功或失败是否用随机的方式
 * @param dataSize data数据的数组长度
 * @param codes 返回的异常CODES
 */
export default function (template: string | Record<string, any> | null, randomFlag = false, dataSize?: number, codes?: string[] | string) {
    const wrapTemplate: Record<string, any> = {
        success: randomFlag ? Mock.Random.boolean(1, 9, false) : true,
        error: function () {
            if (this.success) {
                return null;
            }
            return {
                code: !codes ? "" : Object.prototype.toString.call(codes) === "[object Array]" ? codes[Mock.Random.integer(0, codes.length)] : codes,
                message: Mock.Random.ctitle(5, 20)
            };
        }
    };
    if (dataSize) {
        wrapTemplate["data|" + dataSize] = template;
    } else {
        wrapTemplate.data = template;
    }
    return Mock.mock(wrapTemplate);
}
