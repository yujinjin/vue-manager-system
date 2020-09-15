/**
 * 作者：yujinjin9@126.com
 * 时间：2018-02-23
 * 描述：路由配置
 * meta: {
 *  title: 页面标题
 *  auth: 当前页面的登录权限，默认情况下是true
 *  keepAlive: 是否是需要缓存的页面，默认情况下是true
 *  menuPath: 当前页面所属的菜单，默认情况下是当前路由的path。主要用于部分页面（特别是详情页）无法找到左边对应的菜单所处理。也可以手动处理home中的currentSelectMenuPath属性
 * }
 */
import globalService from "@js/services/global-service";
import pageFactory from "@js/page-factory/";
import system from "./system";
import example from "./example";

let routers = {
	// 当前路由存放在site.vue下的路由
	routes: [
		{
			path: "/", //首页
			meta: {
				title: "首页"
			},
			component: resolve => require(["@views/home.vue"], pageFactory(resolve, { name: "home" })),
			children: []
		},
		{
			path: "/login",
			name: "login",
			meta: {
				auth: false,
				title: "登录"
			},
			component: resolve => require(["@views/login.vue"], pageFactory(resolve, { name: "login" }))
			// component: pageFactory("login.vue", { name: "login", type: "test" })
			// component: resolve => require(["@views/login.vue"], component => resolve(component.default))
		},
		{
			path: "*", //未发现该页面
			name: "not-found",
			meta: {
				auth: false,
				title: "未发现该页面"
			},
			component: resolve => require(["@views/error/not-found.vue"], pageFactory(resolve, { name: "not-found" }))
		}
	],

	//使用前端路由，当切换到新路由时，想要页面滚到顶部，或者是保持原先的滚动位置，就像重新加载页面那样。
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition;
		} else {
			return {
				x: 0,
				y: 0
			};
		}
	},

	//创建路由
	createRouter(VueRouter) {
		var router = new VueRouter({
			//路由列表
			routes: this.routes,
			//使用前端路由，当切换到新路由时，想要页面滚到顶部，或者是保持原先的滚动位置，就像重新加载页面那样。
			scrollBehavior: this.scrollBehavior,
			//hash: 使用 URL hash 值来作路由。支持所有浏览器，包括不支持 HTML5 History Api 的浏览器。
			//history: 依赖 HTML5 History API 和服务器配置。查看 HTML5 History 模式.
			//abstract: 支持所有 JavaScript 运行环境，如 Node.js 服务器端。如果发现没有浏览器的 API，路由会自动强制进入这个模式。
			//mode: 'history',
			//应用的基路径。例如，如果整个单页应用服务在 /app/ 下，然后 base 就应该设为 "/app/"。
			base: "/",
			//全局配置 <router-link> 的默认『激活 class 类名』。参考 router-link.
			linkActiveClass: "router-link-active"
		});
		router.beforeEach((to, from, next) => this.beforeEach(to, from, next));
		router.afterEach(router => this.afterEach(router));
		return router;
	},

	//访问之前的函数
	beforeEach(to, from, next) {
		if (to.meta.auth !== false && !globalService.isLogin()) {
			next({
				name: "login",
				query: { toName: to.name, toQuery: JSON.stringify(to.query), toParams: JSON.stringify(to.params) }
			});
			return;
		}
		switch (to.name) {
			case "home":
				break;
			default:
				break;
		}
		next();
	},

	//可以记录访问路径
	afterEach(router) {
		if (router.meta.title) {
			document.title = "平台管理系统-" + router.meta.title;
		} else {
			document.title = "平台管理系统";
		}
	}
};
routers.routes[0].children.push(...system);
routers.routes[0].children.push(...example);
export default routers;
