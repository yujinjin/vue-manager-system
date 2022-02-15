/**
 * 作者：yujinjin9@126.com
 * 时间：2020-08-13
 * @param module 页面模块
 * @param name 名称
 * 描述：表单页面基类
 */
import extend from "../utils/extend";

export default function (page, name) {
	if (!page.name && name) {
		page.name = name;
	}
	return extend({}, page, {});
}
