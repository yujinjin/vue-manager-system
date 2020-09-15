/**
 * 作者：yujinjin9@126.com
 * 时间：2020-09-15
 * 描述：页面示例
 */
import pageFactory from "@js/page-factory/";

export default [
	{
		path: "/complex-query",
		name: "complex-query",
		meta: {
			title: "页面复杂示例"
		},
		component: resolve => require(["@views/example/complex-query.vue"], pageFactory(resolve, { name: "complex-query", type: "query" }))
	}
];
