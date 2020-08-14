/**
 * 作者：yujinjin9@126.com
 * 时间：2018-02-23
 * 描述：系统管理路由配置
 */
// import modules from "../utils/modules";

export default [
	{
		path: "/",
		name: "home",
		meta: {
			title: "dashboard"
		},
		component: resolve => require(["../../views/system/dashboard.vue"], component => resolve(component.default))
	},
	{
		path: "/demo/common-table",
		name: "commonTable",
		meta: {
			title: "commonTable"
		},
		component: resolve => require(["../../views/demo/common-table.vue"], component => resolve(component.default))
	},
	{
		path: "/demo/common-form",
		name: "commonForm",
		meta: {
			title: "commonForm"
		},
		component: resolve => require(["../../views/demo/common-form.vue"], component => resolve(component.default))
	},
	{
		path: "/demo/customer-menu",
		name: "customerMenu",
		meta: {
			title: "customerMenu"
		},
		component: resolve => require(["../../views/demo/customer-menu.vue"], component => resolve(component.default))
	}
];
