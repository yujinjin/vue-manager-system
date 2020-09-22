/**
 * 作者：yujinjin9@126.com
 * 时间：2017-01-19
 * app数据管理
 */
import utils from "@js/utils/";

export default {
	state: {
		permissions: [], // 用户的操作权限列表数据
		tabBarViews: [], // 标签页栏 {name, title, fullPath, query, params, active, keepAlive}
		cachedViews: [], // 当前可缓存的路由列表
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
		},
		addVisitedRoute(state, { name, title, fullPath, query, params, keepAlive }) {
			if (state.tabBarViews.length == 0) {
				state.tabBarViews.push({ name, title, fullPath, query: JSON.stringify(query), params: JSON.stringify(params), active: true });
			} else {
				let repeatNameNumber = 0,
					activeIndex = -1,
					findIndex = -1;
				for (let i = 0; i < state.tabBarViews.length; i++) {
					if (state.tabBarViews[i].active) activeIndex = i;
					if (state.tabBarViews[i].name === name) {
						++repeatNameNumber;
						if (state.tabBarViews[i].fullPath === fullPath || utils.isEqual(query, JSON.parse(state.tabBarViews[i].query))) {
							findIndex = i;
						}
					}
					if (activeIndex != -1 && findIndex != -1) {
						break;
					}
				}
				if (activeIndex != -1) {
					state.tabBarViews[activeIndex].active = false;
				}
				if (findIndex != -1) {
					state.tabBarViews[findIndex].active = true;
				} else {
					title = repeatNameNumber > 0 ? title + "(" + repeatNameNumber + ")" : title;
					state.tabBarViews.push({ name, title, fullPath, query: JSON.stringify(query), params: JSON.stringify(params), active: true });
				}
			}
			if (keepAlive !== false && state.cachedViews.length == 0) {
				state.cachedViews.push(name);
			} else if (keepAlive !== false) {
				let findIndex = state.cachedViews.findIndex(value => {
					return value === name;
				});
				if (findIndex === -1) {
					state.cachedViews.push(name);
				}
			}
		},
		// 删除所有的路由
		deleteAllRoute(state) {
			state.tabBarViews = [];
			state.cachedViews = [];
		},
		// 删除其他的路由
		deleteOtherRoute(state) {
			let view = state.tabBarViews.find(item => item.active);
			if (view) {
				state.tabBarViews = [view];
				state.cachedViews = [view.name];
			} else {
				site.log.info("未找到当前激活的路由！");
			}
		},
		deleteRoute(state, { name, fullPath, query, active }) {
			let repeatNameNumber = -1,
				findIndex = -1;
			state.tabBarViews.forEach((view, i) => {
				if (view.name === name) {
					++repeatNameNumber;
					if (state.tabBarViews[i].fullPath === fullPath || utils.isEqual(query, JSON.parse(state.tabBarViews[i].query))) {
						findIndex = i;
					}
				}
			});
			if (findIndex != -1) {
				state.tabBarViews.splice(findIndex, 1);
				if (active && state.tabBarViews.length > 0) {
					// 如果删除的是当前正在激活的路由，就选择激活最后一个路由
					state.tabBarViews[state.tabBarViews.length - 1].active = true;
				}
			}
			if (repeatNameNumber === 0) {
				state.cachedViews.splice(
					state.cachedViews.findIndex(value => value === name),
					1
				);
			}
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
		},
		// 添加路由
		addVisitedRoute({ commit }, { name, title, fullPath, query, params, keepAlive }) {
			commit("addVisitedRoute", { name, title, fullPath, query, params, keepAlive });
		},
		// 删除所有的路由
		deleteAllRoute({ commit }) {
			commit("deleteAllRoute");
		},
		// 除了当前激活的路由删除其他路由
		deleteOtherRoute({ commit }) {
			commit("deleteOtherRoute");
		},
		// 删除路由
		deleteRoute({ commit }, { name, title, fullPath, query, params, active }) {
			commit("deleteRoute", { name, title, fullPath, query, params, active });
		}
	}
};
