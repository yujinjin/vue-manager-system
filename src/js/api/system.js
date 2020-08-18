/**
 * 作者：yujinjin9@126.com
 * 时间：2019-11-28
 * 描述：系统API接口
 */
export default {
	login(ajaxOptions) {
		return new Promise(resolve => {
			resolve(require("@js/data/login.json").result);
		});
	},
	// 查询当前登录用户的操作权限
	queryPermission() {
		// return site.ajax(Object.assign({
		// 	url: "",
		// 	method: "GET",
		// 	params: params
		// }, ajaxOptions || {}));
		return new Promise(resolve => {
			resolve(require("@js/data/permission.json").result);
		});
	},

	// 查询登录用户的菜单权限
	queryMenus() {
		return Promise.resolve(require("@js/data/menu.json").result);
	}
};
