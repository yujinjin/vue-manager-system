/**
 * 作者：yujinjin9@126.com
 * 时间：2017-01-19
 * app数据管理
 */

export default {
	state: {
		permissions: [], // 用户的操作权限列表数据
		/* app临时数据*/
		locationInfo: {
			loginUserInfo: null // 当前登录用户信息
		}
	},
	mutations: {
		//修改app临时数据
		updateLocationInfo(state, { key, value }) {
			state.locationInfo[key] = value;
		},
		updatePermissions(state, permissions) {
			state.permissions = permissions;
		}
	},
	actions: {
		// 更新当前站点临时数据
		updateLocationInfo({ commit }, { key, value }) {
			commit("updateLocationInfo", { key, value });
		},
		// 更新权限信息
		updatePermissions({ commit }, permissions) {
			commit("updatePermissions", permissions);
		}
	}
};
