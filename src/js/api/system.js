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
	queryUserPermission() {
		// return site.ajax(Object.assign({
		// 	url: "",
		// 	method: "GET",
		// 	params: params
		// }, ajaxOptions || {}));
		return new Promise(resolve => {
			resolve(require("@js/data/role-permissions.json").result);
		});
	},

	// 查询当前系统的所有菜单及操作列表，用于设置角色的权限
	queryAllPermissions() {
		return new Promise(resolve => {
			resolve(require("@js/data/permissions.json").result);
		});
	},

	// 查询登录用户的菜单权限
	queryMenus() {
		return Promise.resolve(require("@js/data/menu.json").result);
	},

	queryRoleList(inputData, ajaxOptions) {
		return Promise.resolve(require("@js/data/role-list.json").result);
	}
};
