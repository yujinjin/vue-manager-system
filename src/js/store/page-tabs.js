/**
 * 作者：yujinjin9@126.com
 * 时间：2020-10-20
 * 站点页面标签数据管理
 */
import utils from "@js/utils/";

export default {
	state: {
		cachedViews: ["home"], // 当前可缓存的路由列表
		tabBarViews: [{ name: "home", title: "首页", fullPath: "/", query: "{}", params: "{}", active: true, keepAlive: true }] // 标签页栏 {name, title, fullPath, query, params, active, keepAlive}
	},
	mutations: {
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
						if (state.tabBarViews[i].fullPath === fullPath || (utils.isEqual(query, JSON.parse(state.tabBarViews[i].query)) && utils.isEqual(params, JSON.parse(state.tabBarViews[i].params)))) {
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
			state.tabBarViews = [state.tabBarViews[0]];
			state.cachedViews = [state.cachedViews[0]];
		},
		// 删除其他的路由
		deleteOtherRoute(state) {
			let index = state.tabBarViews.findIndex(item => item.active);
			if (index == -1 || index == 0) {
				state.cachedViews = [state.tabBarViews[0].name];
				state.tabBarViews = [state.tabBarViews[0]];
			} else {
				state.cachedViews = [state.tabBarViews[0].name, state.tabBarViews[index].name];
				state.tabBarViews = [state.tabBarViews[0], state.tabBarViews[index]];
			}
		},
		deleteRoute(state, { name, fullPath, query, params }) {
			let repeatNameNumber = -1,
				findIndex = -1;
			state.tabBarViews.forEach((view, i) => {
				if (view.name === name) {
					++repeatNameNumber;
					if (state.tabBarViews[i].fullPath === fullPath || (utils.isEqual(query, JSON.parse(state.tabBarViews[i].query)) && utils.isEqual(params, JSON.parse(state.tabBarViews[i].params)))) {
						findIndex = i;
					}
				}
			});
			if (findIndex != -1) {
				state.tabBarViews.splice(findIndex, 1);
			}
			if (repeatNameNumber === 0) {
				state.cachedViews.splice(
					state.cachedViews.findIndex(value => value === name),
					1
				);
			}
		},
		deleteRouteByIndex(state, index) {
			if (index < 1) {
				return;
			}
			let repeatNameNumber = -1;
			let name = state.tabBarViews[index].name;
			state.tabBarViews.forEach(view => {
				if (view.name === name) {
					++repeatNameNumber;
				}
			});
			state.tabBarViews.splice(index, 1);
			if (repeatNameNumber === 0) {
				state.cachedViews.splice(
					state.cachedViews.findIndex(value => value === name),
					1
				);
			}
		}
	},
	actions: {
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
		},
		// 删除路由
		deleteRouteByIndex({ commit }, index) {
			commit("deleteRouteByIndex", index);
		}
	}
};
