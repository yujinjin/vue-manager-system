/**
 * 作者：yujinjin9@126.com
 * 时间：2015-08-04
 * 描述：APP 全局业务逻辑
 */
import store from "../store";
import constants from "./constants";

export default (function() {
	let localStorage = {
		// 本地存储的key值(轻易不要改值，会影响线上业务)
		LOCAL_STORAGE_KEY: {
			// 整个站点的存储对象
			SITE: "siteLocalStorage_" + config.env,
			// 本地登录用户存储的信息
			LOGIN_USER_INFO: "loginUserInfo",
			// 数据表中的列状态列表
			TABLE_COLUMN_STATE_List: "tableColumnStateList"
		},
		//获取站点本地存储信息
		getSiteLocalStorage(key) {
			var _site_local_storage = localStorage.localStorage(localStorage.LOCAL_STORAGE_KEY.SITE);
			if (_site_local_storage) {
				try {
					_site_local_storage = JSON.parse(_site_local_storage);
				} catch (e) {
					// site.log.error(e);
				}
			}
			if (_site_local_storage == null || typeof _site_local_storage != "object") {
				_site_local_storage = {};
			}
			if (key !== null && typeof key != "undefined") {
				return _site_local_storage[key];
			} else {
				return _site_local_storage;
			}
		},

		//设置站点本地存储信息
		setSiteLocalStorage(key, value) {
			let _site_local_storage = this.getSiteLocalStorage();
			if (value !== null && typeof value != "undefined") {
				_site_local_storage[key] = value;
			} else if (key in _site_local_storage || _site_local_storage.hasOwnProperty(key)) {
				delete _site_local_storage[key];
			}
			localStorage.localStorage(localStorage.LOCAL_STORAGE_KEY.SITE, JSON.stringify(_site_local_storage));
		},

		//本地存储
		localStorage(key, value) {
			if (arguments.length === 0) {
				console.warn("没有参数");
				return;
			}
			if (!window || !window.localStorage) {
				//TODO: 修改弹窗提示
				alert("您开启了秘密浏览或无痕浏览模式，请关闭!");
				return;
			}
			if (arguments.length === 1 || typeof value === "undefined") {
				return window.localStorage.getItem(key);
			} else if (value === null || value === "") {
				window.localStorage.removeItem(key);
			} else if (typeof value === "object") {
				window.localStorage.setItem(key, JSON.stringify(value));
			} else {
				window.localStorage.setItem(key, value);
			}
		}
	};

	let controler = {
		//判断当前用户信息是否登录
		isLogin() {
			return !!(store.state.data.locationInfo.loginUserInfo && store.state.data.locationInfo.loginUserInfo.token && store.state.data.locationInfo.loginUserInfo.expiredTime > new Date().getTime());
		},

		logOut() {
			store.dispatch("updateLocationInfo", { key: "loginUserInfo", value: null });
			controler.setLoginUserInfo({});
		},

		// 设置当前用户的权限
		setPermissionValue(key, value) {
			// TODO: 实现
		},

		// 根据权限值判断当前是否有权限
		hasPermission(permissionValue) {
			// TODO: 实现
			return true;
		},

		// 获取当前登录用户的token
		getLoginUserToken() {
			if (controler.isLogin()) {
				return store.state.data.locationInfo.loginUserInfo.token;
			} else {
				return null;
			}
		},

		// 获取缓存中的登录信息
		getStoreLoginUserInfo() {
			if (store.state.data.locationInfo.loginUserInfo && store.state.data.locationInfo.loginUserInfo.expiredTime > new Date().getTime()) {
				return {
					token: store.state.data.locationInfo.loginUserInfo.token,
					expiredTime: store.state.data.locationInfo.loginUserInfo.expiredTime,
					userId: store.state.data.locationInfo.loginUserInfo.userId,
					name: store.state.data.locationInfo.loginUserInfo.name,
					headImgURL: store.state.data.locationInfo.loginUserInfo.headImgURL
				};
			} else {
				return {};
			}
		},

		// 获取本地存储的用户登录信息
		getLocalLoginUserInfo() {
			return localStorage.getSiteLocalStorage(localStorage.LOCAL_STORAGE_KEY.LOGIN_USER_INFO);
		},

		//退出登录
		logOut() {
			controler.setLoginUserInfo({});
		},

		//设置用户信息
		setLoginUserInfo({ token, userId, name, headImgURL, expiredIn = -1 } = {}) {
			let _login_user_info = localStorage.getSiteLocalStorage(localStorage.LOCAL_STORAGE_KEY.LOGIN_USER_INFO);
			if (expiredIn > 0) {
				if (_login_user_info == null || typeof _login_user_info != "object") {
					_login_user_info = {};
				}
				let expiredTime = new Date().getTime() + (expiredIn - 60) * 1000;
				Object.assign(_login_user_info, { token, userId, name, headImgURL, expiredTime });
				localStorage.setSiteLocalStorage(localStorage.LOCAL_STORAGE_KEY.LOGIN_USER_INFO, _login_user_info);
				store.dispatch("updateLocationInfo", {
					key: "loginUserInfo",
					value: { token, userId, name, headImgURL, expiredTime }
				});
			} else {
				_login_user_info = {};
				localStorage.setSiteLocalStorage(localStorage.LOCAL_STORAGE_KEY.LOGIN_USER_INFO);
				store.dispatch("updateLocationInfo", { key: "loginUserInfo", value: null });
			}
		},

		// 设置数据表列状态
		setTableColumnState(value, { tableName = null, fullTableName = null } = {}) {
			if (!fullTableName) {
				if (!controler.isLogin()) {
					// 如果没有指定数据列表全称，需要判断当前用户登录状态
					site.log.error("当前用户还未登录，不能设置数据列表状态~");
					return;
				}
				// 当前的userId最好是int类型，如果是guid那最好就换个
				fullTableName = config.env + "_" + this.getStoreLoginUserInfo().userId + "_" + site.vueApp.$route.name + "_table-column-state" + (tableName ? "_" + tableName : "");
			} else {
				fullTableName = config.env + "_" + fullTableName;
			}
			let tableColumnStateList = localStorage.getSiteLocalStorage(localStorage.LOCAL_STORAGE_KEY.TABLE_COLUMN_STATE_List);
			if (!tableColumnStateList) {
				tableColumnStateList = [];
			}
			let min = 0,
				max = 0,
				minIndex = -1,
				findIndex = -1;
			if (value) {
				if (tableColumnStateList.length > 0) {
					tableColumnStateList.forEach((item, index) => {
						if (index == 0) {
							min = max = item.order;
							minIndex = 0;
						} else if (item.order > max) {
							max = item.order;
						} else if (item.order < min) {
							min = item.order;
							minIndex = index;
						}
						if (item.fullTableName == fullTableName) {
							findIndex = index;
						}
					});
				}
				if (findIndex == -1) {
					tableColumnStateList.push({
						fullTableName,
						order: max + 1,
						value
					});
				} else {
					tableColumnStateList[findIndex].value = value;
					tableColumnStateList[findIndex].order = max + 1;
				}
				if (tableColumnStateList.length > constants.MAX_NUMBER_TABLE_OLUMN_STATE) {
					tableColumnStateList.splice(minIndex, 1);
				}
			} else {
				// 删除数据列表状态
				findIndex = tableColumnStateList.findIndex(item => item.fullTableName == fullTableName);
				if (findIndex != -1) {
					tableColumnStateList.splice(findIndex, 1);
				}
			}
			localStorage.setSiteLocalStorage(localStorage.LOCAL_STORAGE_KEY.TABLE_COLUMN_STATE_List, tableColumnStateList);
		},

		// 设置数据表列状态
		getTableColumnState({ tableName = null, fullTableName = null } = {}) {
			if (!fullTableName) {
				if (!controler.isLogin()) {
					// 如果没有指定数据列表全称，需要判断当前用户登录状态
					site.log.error("当前用户还未登录，不能设置数据列表状态~");
					return;
				}
				// 当前的userId最好是int类型，如果是guid那最好就换个
				fullTableName = config.env + "_" + this.getStoreLoginUserInfo().userId + "_" + site.vueApp.$route.name + "table-column-state" + (tableName ? "_" + tableName : "");
			} else {
				fullTableName = config.env + "_" + fullTableName;
			}
			let tableColumnStateList = localStorage.getSiteLocalStorage(localStorage.LOCAL_STORAGE_KEY.TABLE_COLUMN_STATE_List);
			if (!tableColumnStateList || tableColumnStateList.length == 0) {
				return null;
			}
			let max = 0,
				findIndex = -1;
			tableColumnStateList.forEach((item, index) => {
				if (item.order > max) {
					max = item.order;
				}
				if (item.fullTableName == fullTableName) {
					findIndex = index;
				}
			});
			if (findIndex == -1) {
				return null;
			} else {
				tableColumnStateList[findIndex].order = max + 1;
				return tableColumnStateList[findIndex].value;
			}
		}
	};

	return controler;
})();
