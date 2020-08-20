import "@style/less/site.less";
import "@style/scss/element-variables.scss";
import "element-ui/lib/theme-chalk/index.css";
import Vue from "vue";
import VueRouter from "vue-router";
import ElementUI from "element-ui";
import vueApp from "@views/site";
import constants from "@js/services/constants";
import store from "@js/store/"; // site.log
import utils from "./utils"; // site.log
import log from "@js/services/log"; // site.config
import directives from "@js/services/directives";
import filters from "@js/services/filters";
import globalService from "@js/services/global-service";
import ajax from "@js/services/ajax";
import api from "@js/api/";
import routers from "@js/routers/";
import components from "@js/components/";
import plugins from "@js/plugins/";

export default (function() {
	// 初始化配置
	let initConfig = function() {
		// 只要不是生产环境的build，全部认为是调试版本
		site.config.isDebug = process.env.NODE_ENV === "development" || process.env.VUE_APP_ENV != "PRD";
		if (site.config.isDebug) {
			window.site = site;
			window.$ = jQuery;
		}
		if (process.env.NODE_ENV == "production") {
			// 开发模式
			site.config.isRunMode = false;
		}
		Object.assign(site.config, config);
	};

	// 初始化本地存储
	let initInfo = function() {
		// 把当前localstorage存储登录用户信息放入内存里
		let loginUserInfo = globalService.getLocalLoginUserInfo();
		if (loginUserInfo && loginUserInfo.token) {
			store.dispatch("updateLocationInfo", {
				key: "loginUserInfo",
				value: {
					token: loginUserInfo.token,
					expiredTime: loginUserInfo.expiredTime,
					userId: loginUserInfo.userId,
					name: loginUserInfo.name,
					headImgURL: loginUserInfo.headImgURL
				}
			});
		}
	};

	// 设置APP对象
	let setSite = function() {
		// 设置app 对象下的constants常量对象
		site.constants = constants;
		// 设置app对象下的logs日志
		site.log = log();
		// 设置app对象下的utils工具
		site.utils = utils;
		// 设置app对象下globalService全局对象
		site.globalService = globalService;
		// 设置app对象下的ajax
		site.ajax = ajax();
		// 设置app对象下的api
		site.api = api;
	};

	// 初始化vue
	let initVue = function() {
		let vueDebugger = site.config.isDebug;
		// 是否取消 Vue 所有的日志与警告。
		Vue.config.silent = !vueDebugger;
		// 配置是否允许 vue-devtools 检查代码。开发版本默认为 true，生产版本默认为 false。生产版本设为 true 可以启用检查。
		Vue.config.devtools = vueDebugger;
		// 设置为 true 以在浏览器开发工具的性能/时间线面板中启用对组件初始化、编译、渲染和打补丁的性能追踪。
		Vue.config.performance = vueDebugger;

		if (!site.config.isDebug) {
			/**
			 * @param {String}  errorMessage   错误信息
			 * @param {String}  scriptURI      出错的文件
			 * @param {Long}    lineNumber     出错代码的行号
			 * @param {Long}    columnNumber   出错代码的列号
			 * @param {Object}  errorObj       错误的详细信息，Anything
			 */
			window.onerror = function(errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
				logs.error({ errorMessage, scriptURI, lineNumber, columnNumber, errorObj });
			};
			Vue.config.errorHandler = function(err, vm, info) {
				logs.error(JSON.stringify({ message: "Vue errorHandler:" + err.message, stack: err.stack, type: info }));
			};
		}
		Vue.use(ElementUI, { size: "small", zIndex: 3000 });
		Vue.use(VueRouter);
		Object.keys(directives).forEach(key => {
			Vue.directive(key, directives[key]);
		});
		Object.keys(filters).forEach(key => {
			Vue.filter(key, filters[key]);
		});
		plugins();
		components();
		let router = routers.createRouter(VueRouter, store);
		let VueApp = Vue.extend(vueApp);
		site.vueApp = new VueApp({ router, name: "site", store }).$mount("#site");
	};

	// 初始化
	let init = function() {
		initConfig();
		initInfo();
		setSite();
		initVue();
	};

	init();
})();
