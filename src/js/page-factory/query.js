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
				init() {},
				// 页面通过手动事件触发的的方法
				triggerResizeChange() {
					this.$nextTick(() => {
						this.$store.dispatch("trigger", {
							eventName: this.resizeChangeEventName,
							args: []
						});
					});
				},
				// 查询表单中的值有变化
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
						filters: {},
						selectRows: [], // 用户选择的列表数据
						resizeChangeEventName: this.$route.name + "resizeChange" // 当前页面通过手动事件触发导致页面尺寸有变化的事件名称
					},
					data
				);
			},
			mounted() {
				if (page.mounted && typeof page.mounted == "function") {
					page.mounted.call(this);
				}
				this.init();
			}
		}
	);
}
