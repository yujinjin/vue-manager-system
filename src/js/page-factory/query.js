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
				},
				// 查询
				search() {
					this.filters.queryId = site.utils.generateGuid();
				},
				/**
				 * 刷新当前列表数据
				 * @param isReset 是否重置当前的查询选项(暂时不用)
				 */
				refresh(isReset = true) {
					// 目前和普通的查询本质其实很是一样的
					this.filters.queryId = site.utils.generateGuid();
				},
				// 确认提示操作
				confirmHandle(yesHandler) {
					// TODO: 实现
				},
				// 批量删除预处理
				preBatchDelete(deleteHandler) {
					if (this.selectRows.length == 0) {
						this.$toastr.warning("请选择需要删除的列表信息");
						return false;
					}
					this.$confirm("确定要删除当前列表信息吗?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					}).then(() => {
						Promise.all(
							this.selectRows.map(item => {
								return deleteHandler(
									{
										id: item.id
									},
									{
										isShowError: false,
										isResultData: false
									}
								)
									.then(() => {
										return true;
									})
									.catch(error => {
										// 自己把异常吃掉,返回到数据提示
										return error;
									});
							})
						).then(results => {
							if (results && results.length) {
								results.forEach((item, index) => {
									if (item == true) {
										this.$toastr.success((this.selectRows[index].name || "") + "删除成功");
									} else {
										this.$toastr.error((this.selectRows[index].name || "") + ((item.error && item.error.message) || "删除失败"));
									}
								});
							} else {
								this.$toastr.success("删除成功");
							}
							this.search(true);
						});
					});
				},

				/**
				 * 批量操作
				 * @param {Function} handerAction 单行操作的Promise
				 * @param {String} handlerName 操作的名称,可以不传默认为"操作"
				 * @param {Function} handerSuccessAction 批量操作成功后的回调函数,可以不传默认为"this.queryList"
				 * @param {handerRows} handerRows 批量操作的列表信息,可以不传,默认为"this.selectRows"当前选中列
				 *
				 */
				// TODO: review
				handlerBatch(handerAction, handlerName, handerSuccessAction, handerRows) {
					if (typeof handerRows === "undefined") {
						handerRows = this.selectRows;
					}
					if (!handerSuccessAction) {
						handerSuccessAction = this.search;
					}
					handlerName = handlerName || "操作";
					if (!handerRows || handerRows.length === 0) {
						this.$toastr.warning("请选择需要" + handlerName + "的列表信息");
						return;
					}
					this.$confirm("确定要对选中列表信息设为" + handlerName + "吗?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
						.then(() => {
							Promise.all(
								handerRows.map(function(item) {
									return handerAction(item)
										.then(result => {
											if (result && result.data) {
												return result.data;
											} else if (result) {
												return result;
											} else {
												return { success: true };
											}
										})
										.catch(error => {
											// 自己把异常吃掉,返回到数据提示
											return error.response.data;
										});
								})
							).then(results => {
								if (results && results.length) {
									results.forEach((item, index) => {
										if (item.success != false) {
											this.$toastr.success((handerRows[index].name || "") + handlerName + "成功", null, { timeOut: 3000 });
										} else {
											this.$toastr.error((handerRows[index].name || "") + item.error.message, null, { timeOut: 3000 });
										}
									});
								} else {
									this.$toastr.success(handlerName + "成功");
								}
								handerSuccessAction();
							});
						})
						.catch(() => {});
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
							queryId: null // 当前查询ID，手动事件会触发前端随机生成此ID。用于手动查询（search-form组件的search事件）
						},
						initParameters: {}, // 初始化时的参数，用于重置查询选项刷新的数据
						selectRows: [], // 用户选择的列表数据
						resizeChangeEventName: this.$route.name + "resize-change" // 当前页面通过手动事件触发导致页面尺寸有变化的事件名称
					},
					data
				);
			},
			mounted() {
				if (page.mounted && typeof page.mounted == "function") {
					page.mounted.call(this);
				}
				this.init();
				this.initParameters = site.utils.extend(true, {}, site.constants.QUERY_TABLE_DEFAULT_PARAMETERS, this.filters);
			}
		}
	);
}
