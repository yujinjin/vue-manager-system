/**
 * 作者：yujinjin9@126.com
 * 时间：2020-09-15
 * 描述：页面示例
 */
import pageFactory from "@js/page-factory/";

export default [
	{
		path: "/simple-query",
		name: "simple-query",
		meta: {
			title: "页面普通查询示例"
		},
		component: resolve => require(["@views/example/simple-query.vue"], pageFactory(resolve, { name: "simple-query", type: "query" }))
	},
	{
		path: "/complex-query",
		name: "complex-query",
		meta: {
			title: "页面复杂查询示例"
		},
		component: resolve => require(["@views/example/complex-query.vue"], pageFactory(resolve, { name: "complex-query", type: "query" }))
	},
	{
		path: "/simple-form",
		name: "simple-form",
		meta: {
			title: "普通页面示例"
		},
		component: resolve => require(["@views/example/simple-form.vue"], pageFactory(resolve, { name: "simple-form", type: "form" }))
	}
];
