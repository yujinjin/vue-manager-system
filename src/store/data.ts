/**
 * 作者：yujinjin9@126.com
 * 时间：2021-12-30
 * app数据管理入口文件
 */
import { App } from "/#/app";

export default {
    state: {
        loginUserInfo: <App.LoginUserInfo>{
            isLogin: false, // 是否登录
            userNo: "", // 用户编号
            authAccessCode: "" // 用户授权码
        },
        /* 站点临时数据*/
        locationInfo: <App.LocationInfo>{
            isShowSideBar: true
        }
    },
    mutations: {
        //修改站点临时数据
        updateLocationInfo(state, data: Array<{ key; value }>) {
            data.forEach(item => {
                state.locationInfo[item.key] = item.value;
            });
        },
        //用户登录
        login(state, { userNo, authAccessCode }: App.LoginUserInfo) {
            state.loginUserInfo.userNo = userNo;
            state.loginUserInfo.authAccessCode = authAccessCode;
            state.loginUserInfo.isLogin = true;
        },
        // 用户登出
        logout(state) {
            state.loginUserInfo.userNo = "";
            state.loginUserInfo.authAccessCode = "";
            state.loginUserInfo.isLogin = false;
        }
    },
    actions: {
        // 更新当前站点临时数据
        updateLocationInfo({ commit }, { key, value }) {
            commit("updateLocationInfo", [{ key, value }]);
        },
        // 批量更新当前站点临时数据
        batchUpdateLocationInfo({ commit }, data: Array<{ key; value }>) {
            commit("updateLocationInfo", data);
        },
        //用户登录
        login({ commit }, { userNo, authAccessCode }: App.LoginUserInfo) {
            commit("login", { userNo, authAccessCode });
        },
        //用户登出
        logout({ commit }) {
            commit("logout");
        }
    }
};
