/**
 * 作者：yujinjin9@126.com
 * 时间：2017-01-19
 * app数据管理入口文件
 */
import Vue from "vue";
import Vuex from "vuex";
import data from "./data";
import pageTabs from "./page-tabs";
import event from "./event";

Vue.use(Vuex);

export default new Vuex.Store({
	strict: config.ENV !== "PRD", //在非生产环境下，使用严格模式
	modules: {
		data,
		event,
		pageTabs
	}
	// getters: {
	// 	visitedViews: state => state.tagsView.visitedViews,
	// 	cachedViews: state => state.tagsView.cachedViews
	// }
});
