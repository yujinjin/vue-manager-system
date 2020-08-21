/**
 * 作者：yujinjin9@126.com
 * 时间：2020-08-13
 * @param module 页面模块
 * @param name 名称
 * 描述：查询页面基类
 */
import extend from "../utils/extend";

export default function(page, name) {
	if (!page.name && name) {
		page.name = name;
	}
	return extend(
		true,
		{
			methods: {
				// 当前页面初始化
				init() {
					this.queryList();
					site.log.warn("路由名称:" + this.$route.name + "的数据初始化没有具体实现，系统默认自动初始化");
				},
				// 数据列表查询，业务放要覆盖的
				queryList() {
					site.log.error("路由名称:" + this.$route.name + "的数据查询项没有具体实现");
				},
				edit() {
					site.log.error("路由名称:" + this.$route.name + "的编辑操作没有具体实现");
				},
				delete() {
					site.log.error("路由名称:" + this.$route.name + "的删除操作没有具体实现");
				},
				filterChange(filter, filterProperty) {
					if (filterProperty) {
						this.$set(this[filterProperty], filter.name, filter.value);
					} else {
						let propertyObject = site.utils.setObjectProperty(this, filter.name, filter.value);
						if (propertyObject.propertyName != null) {
							this.$set(this[propertyObject.rootName], propertyObject.propertyName, propertyObject.rootValue[propertyObject.propertyName]);
						} else {
							this[propertyObject.rootName] = propertyObject.rootValue;
						}
					}
				}
			}
		},
		page,
		{
			data() {
				let data = {};
				if (page.data && typeof page.data == "function") {
					data = page.data.call(this);
				}
				return extend(
					true,
					{
						filters: {
							filter: "", //默认关键词搜索名称
							maxResultCount: site.constants.PAGE_ITEMS, //最大结果集（等同每页记录数）
							skipCount: 0,
							sorting: "creationTime desc" //默认按时间降序排序
						},
						tableData: [], // 数据列表
						pagination: {
							total: 0, // 总记录数
							pageSize: 10, // 每页记录数
							currentPage: 1 //当前页记录数
						}, //分页信息
						selectRows: [], // 用户选择的列表数据
						hideCarefulConfirms: {} // 是否隐藏列操作确认框提示(根据列名来判断)
					},
					data
				);
			},
			watch: {
				// 监控当前过滤项的值
				filters: {
					handler(val) {
						this.queryList();
					},
					deep: true
				}
			},
			mounted() {
				// 判断当前的分页数据是否和查询的结果集是否相同
				if (this.pagination.pageSize != this.filters.maxResultCount) {
					this.filters.maxResultCount = this.pagination.pageSize;
				}
				if (page.mounted && typeof page.mounted == "function") {
					page.mounted.call(this);
				}
				this.init();
			}
		}
	);
}
