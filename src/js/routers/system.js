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
			title: "工作台",
			affix: true
		},
		component: resolve => require(["@views/system/dashboard.vue"], pageFactory(resolve, { name: "dashboard" }))
	},
	{
		path: "/system/menu-manager",
		name: "menu-manager",
		meta: {
			title: "菜单与权限"
		},
		component: resolve => require(["@views/system/menu-manager.vue"], pageFactory(resolve, { name: "menu-manager", type: "query" }))
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
		path: "/system/department-list",
		name: "department-list",
		meta: {
			title: "部门管理"
		},
		component: resolve => require(["@views/system/department-list.vue"], pageFactory(resolve, { name: "department-list", type: "query" }))
	},
	{
		path: "/system/user-list",
		name: "user-list",
		meta: {
			title: "用户管理"
		},
		component: resolve => require(["@views/system/user-list.vue"], pageFactory(resolve, { name: "user-list", type: "query" }))
	},
	{
		path: "/system/audit-logs",
		name: "audit-logs",
		meta: {
			title: "审计日志"
		},
		component: resolve => require(["@views/system/audit-logs.vue"], pageFactory(resolve, { name: "audit-logs", type: "query" }))
	},
	{
		path: "/system/settings",
		name: "settings",
		meta: {
			title: "设置"
		},
		component: resolve => require(["@views/system/settings.vue"], pageFactory(resolve, { name: "settings", type: "other" }))
	}
];
