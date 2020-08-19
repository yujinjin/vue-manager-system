/**
 * 作者：yujinjin9@126.com
 * 时间：2020-08-13
 * @param path 加载文件路径
 * @param options 配置选项 type: query-列表查询（默认），form-数据表单,name: 页面名称
 * 描述：页面工厂
 */
import query from "./query";
import form from "./form";

export default function(resolve, { type = "other", name = null } = {}) {
	if (type == "query") {
		// return function(resolve) {
		// 	return require([path], component => resolve(query(component.default, name)));
		// };
		return function(component) {
			return resolve(query(component.default, name));
		};
	} else if (type == "form") {
		// return function(resolve) {
		// 	return require([path], component => resolve(form(component.default, name)));
		// };
		return function(component) {
			return resolve(form(component.default, name));
		};
	} else {
		return function(component) {
			return resolve(component.default);
		};
	}
}
