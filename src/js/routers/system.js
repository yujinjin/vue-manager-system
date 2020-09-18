/**
 * 作者：yujinjin9@126.com
 * 时间：2018-02-23
 * 描述：系统管理路由配置
 */
// import modules from "../utils/modules";
import pageFactory from "@js/page-factory/";

export default [
	{
		path: "/",
		name: "home",
		meta: {
			title: "工作台"
		},
		component: resolve => require(["@views/system/dashboard.vue"], pageFactory(resolve, { name: "dashboard" }))
	},
	{
		path: "/system/role-list",
		name: "role-list",
		meta: {
			title: "角色管理"
		},
		component: resolve => require(["@views/system/role-list.vue"], pageFactory(resolve, { name: "role-list", type: "query" }))
	},
	{
		path: "/system/user-list",
		name: "user-list",
		meta: {
			title: "用户管理"
		},
		component: resolve => require(["@views/system/user-list.vue"], pageFactory(resolve, { name: "user-list", type: "query" }))
	}
];
