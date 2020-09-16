<template>
	<div class="data-table">
		<table-toggle-column v-if="isShowToggleColumnButton" :cloumns="toggleColumnList" @change="changeColumnState" />
		<div class="data-table-box">
			<el-table ref="data-table" :height="tableHeight" v-bind="tableOptions" :data="data" v-if="tableColumnList && tableColumnList.length > 0" :row-class-name="rowClassName" @row-click="rowClickEvent" @row-dblclick="rowDbClickEvent" @selection-change="change" style="width: 100%;" v-loading="isLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
				<template v-for="(column, index) in tableColumnList">
					<el-table-column v-bind="column.options" :key="index" v-if="toggleColumnList[index].isShow">
						<template v-if="column.slot" v-slot="{ row, $index, column }">
							<!-- 自定义列 -->
							<slot :name="column.slot" v-bind="{ row, $index, column }" />
						</template>
						<template v-else-if="column.type == 'expand'" v-slot="{ row, $index, column }">
							<!-- 展开列 -->
							<el-table-column type="expand">
								<slot name="expand" v-bind="{ row, $index, column }" />
							</el-table-column>
						</template>
						<template v-else-if="column.type == 'action'" v-slot="{ row }">
							<!-- 按钮操作列 -->
							<table-column-action :buttons="column.buttons" :row="row" />
						</template>
						<template v-else-if="column.type == 'image'" v-slot="{ row }">
							<!-- 图片列 -->
							<table-column-img :imgs="getColumnValue(index, row)"></table-column-img>
						</template>
						<template v-else-if="column.type == 'tags'" v-slot="{ row }">
							<!-- 标签列 -->
							<table-column-tags :value="getColumnValue(index, row)"></table-column-tags>
						</template>
						<template v-else-if="column.type == 'enum'" v-slot="{ row }">
							<!-- 枚举列 -->
							<table-column-enum v-bind="column.enumOptions" @change-show-confirm-tips="column.enumOptions.isShowConfirmTips = arguments[0]" @input="setColumnValue(index, row, $event)" :value="getColumnValue(index, row)"></table-column-enum>
						</template>
					</el-table-column>
				</template>
			</el-table>
		</div>
		<div class="pagination-box">
			<el-pagination class="pagination-box" v-bind="pagination" @size-change="pageSizeChange" @current-change="handleCurrentChange" />
		</div>
	</div>
</template>
<script>
import tableToggleColumn from "./table/table-toggle-column";
import tableColumnImg from "./table/table-column-img";
import tableColumnTags from "./table/table-column-tags";
import tableColumnEnum from "./table/table-column-enum";
import tableColumnAction from "./table/table-column-action";

export default {
	components: { tableToggleColumn, tableColumnImg, tableColumnTags, tableColumnEnum, tableColumnAction },
	data() {
		return {
			data: [], // 当前列表数据
			isLoading: true, // 当前数据是否正在加载
			initParameters: {}, // 初始化时的参数，用于重置查询选项刷新的数据
			parameters: {
				filter: "", //默认关键词搜索名称
				maxResultCount: site.constants.PAGE_ITEMS, //最大结果集（等同每页记录数）
				skipCount: 0,
				sorting: "creationTime desc" //默认按时间降序排序
			}, // 当前查询列表参数
			selectRows: [], // 所选中列的数据
			pagination: {
				total: 0, // 总记录数
				pageSize: site.constants.PAGE_ITEMS, // 每页记录数
				currentPage: 1, //当前页记录数
				layout: "total, sizes, prev, pager, next, jumper",
				pageSizes: [10, 30, 50, 100]
			}, //分页信息
			tableOptions: {
				height: 0
			}, // 当前element的数据列表组件的配置属性
			tableColumnList: [], // 当前数据表中的列
			tableInstance: null, // 当前element的数据列表组件实例
			tableHeight: 0, // 当前数据列表的高度
			toggleColumnList: [] // 当前数据列显示或隐藏的状态列表
		};
	},
	props: {
		filters: Object, // 当前列表查询滤参数
		query: Function, // 当前列表查询函数
		dbClick: Function, // 数据列表双击时间函数
		columns: {
			type: Array,
			deault: []
		}, // 当前数据表的列
		table: Object, // 当前element的数据列表组件的配置属性
		name: String, // 当前数据表的名称，可以不传（用于保存数据列显示或隐藏状态的方式，如果isShowToggleColumnButton为false，则无需提供name值）
		isShowToggleColumnButton: Boolean // 是否显示切换列展示或隐藏的按钮，如果不传会自动判断
	},
	watch: {
		// 监控当前过滤项的值
		filters: {
			handler(val) {
				this.generateParameters();
			},
			deep: true
		},
		parameters: {
			handler(val) {
				this.queryList();
			},
			deep: true
		}
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			this.initParameters = site.utils.extend(true, {}, site.constants.QUERY_TABLE_DEFAULT_PARAMETERS, this.filters);
			this.initTableHeight();
			this.generateTableOptions();
			this.generateParameters();
			this.generateColumns();
			this.$store.dispatch("on", {
				eventName: this.$parent.resizeChangeEventName,
				callback: this.initTableHeight
			});
		},
		// 初始化数据列表的高度
		initTableHeight() {
			this.tableHeight = $(".data-table > .data-table-box").height() - 2 + "px";
		},
		// 生成element的数据列表组件的配置属性
		generateTableOptions() {
			this.tableOptions = site.utils.extend(true, {}, site.constants.QUERY_TABLE_DEFAULT_ATTRIBUTES, this.table);
		},
		// 生成参数
		generateParameters() {
			this.parameters = site.utils.extend(true, {}, site.constants.QUERY_TABLE_DEFAULT_PARAMETERS, this.filters);
		},
		// 生成数据列表
		generateColumns() {
			// type: 除了elemem 提供的selection/index/expand三个选项，多扩展了date/datetime/time/image/性别/标签/年龄/boolean(是否，激活|冻结，上下架、成功|失败、启用|禁用)/四个自动格式化的选项
			// isShow: 增加该属性用于太多列展示时，默认是否显示该列的状态。（isShowToggleColumnButton必须为true）
			// 针对于操作列的属性，type: action, buttons: Array|Function-[{label: "按钮文案", click: Function | null}]
			if (!this.columns || this.columns.length == 0) {
				return;
			}
			let tableColumnList = [];
			this.columns.forEach(column => {
				if (typeof column == "string") {
					// slot 插槽
					column = { slot: column, options: {} };
				} else {
					column = { options: site.utils.extend(true, column) };
				}
				if (Object.prototype.hasOwnProperty.call(column.options, "isShow")) {
					column.isShow = column.options.isShow;
					delete column.options.isShow;
				}
				column.label = column.options.label;
				if (column.options.type) {
					column.type = column.options.type;
					if (column.type == "action") {
						column.buttons = column.options.buttons || [];
						delete column.options.buttons;
					} else if (column.type == "date") {
						column.options.formatter = column.options.formatter || this.dateFormat;
						column.options.width = column.options.width || "";
					} else if (column.type == "datetime") {
						column.options.formatter = column.options.formatter || this.dateTimeFormat;
						column.options.width = column.options.width || "";
					} else if (column.type == "time") {
						column.options.formatter = column.options.formatter || this.timeFormat;
						column.options.width = column.options.width || "";
					} else if (column.type == "money") {
						column.options.formatter = column.options.formatter || this.moneyFormat;
					} else if (column.type == "image") {
						// column.options.minWidth = column.options.minWidth || "100px";
						column.options.align = column.options.align || "center";
					} else if (column.type == "enum") {
						// 枚举列(布尔值的枚举列，非布尔值的枚举列)
						// 1.click: 点击事件，
						// 2.list:enum枚举值（如果是String类型，从constants中的enum对象里取值, 否则就是Array类型)
						// 3.permissionValue:操作权限
						// 4.tips 修改操作列的提示内容，内容格式："【{0}】该文章"
						let enumOptions = {};
						["click", "list", "permissionValue", "tips"].forEach(key => {
							if (column.options[key]) {
								enumOptions[key] = column.options[key];
								delete column.options[key];
							}
						});
						// 5.isShowConfirmTips 是否显示当前操作的提示框
						enumOptions.isShowConfirmTips = true;
						// 6.columnLabel 当前数据列的label
						enumOptions.columnLabel = column.options.label;
						// 7.value 当前数据列的数值
						column.enumOptions = enumOptions;
						if (enumOptions.list == "SEX") {
							column.options.width = column.options.width || "50px";
						} else {
							column.options.width = column.options.width || "70px";
						}
						column.options.align = column.options.align || "center";
					} else if (column.type == "selection") {
						column.options.width = column.options.width || "43px";
						column.options.align = column.options.align || "center";
						column.label = column.label || "选择";
					} else if (column.type == "index") {
						column.options.width = column.options.width || "50px";
						column.label = column.label || "序号";
					} else if (column.type == "expand") {
						column.options.width = column.options.width || "30px";
						column.label = column.label || "详细";
					}
					if (column.options.value) {
						column.value = column.options.value;
						delete column.options.value;
					}
					if (!["selection", "index", "expand"].includes(column.options.type)) {
						delete column.options.type;
					}
				}
				tableColumnList.push(column);
			});
			this.tableColumnList = tableColumnList;
			if (this.isShowToggleColumnButton) {
				let toggleColumnList = [];
				this.tableColumnList.forEach((column, i) => {
					toggleColumnList.push({
						name: (column.options.prop || column.options.type || "name") + i, // 加序号是为了name的唯一性
						label: column.label,
						isShow: typeof column.isShow == "boolean" ? column.isShow : true
					});
				});
				this.toggleColumnList = toggleColumnList;
			}
		},
		// 数据查询列表
		queryList() {
			this.isLoading = true;
			return this.query(this.parameters)
				.then(data => {
					this.isLoading = false;
					let totalPageSize = data.totalCount / this.pagination.pageSize;
					if (data.totalCount % this.pagination.pageSize != 0) {
						++totalPageSize;
					}
					if (this.pagination.currentPage > totalPageSize) {
						// 由于查询的页面总数和分页数对应不上，所以再次重新查询数据，使用正确的数据分页
						this.pagination.currentPage = totalPageSize;
						this.parameters.skipCount = this.pagination.pageSize * (this.pagination.currentPage - 1);
						return;
					}
					this.data = data.items;
					this.pagination.total = data.totalCount;
				})
				.catch(error => {
					this.isLoading = false;
				});
		},
		// 日期格式化
		dateFormat(row, column, cellValue, index) {
			return site.utils.dateFormat(cellValue);
		},
		// 日期时间格式化
		dateTimeFormat(row, column, cellValue, index) {
			return site.utils.dateFormat(cellValue, "yyyy-MM-dd hh:mm:ss");
		},
		// 时间格式化
		timeFormat(row, column, cellValue, index) {
			return site.utils.dateFormat(cellValue, "hh:mm:ss");
		},
		moneyFormat(row, column, cellValue, index) {
			return site.utils.numberFormat(cellValue, 2);
		},
		// 创建当前列的值
		getColumnValue(columnIndex, row) {
			return row[this.tableColumnList[columnIndex].options.prop];
		},
		// 设置当前列的值
		setColumnValue(columnIndex, row, value) {
			row[this.tableColumnList[columnIndex].options.prop] = value;
		},
		// 渲染行样式
		rowClassName({ row, rowIndex }) {
			return this.selectRows.length == 0 || this.selectRows.findIndex(item => item == row) === -1 ? "" : "selected";
		},
		// 行单击事件
		rowClickEvent(row, column, event) {
			event.stopPropagation();
			event.preventDefault();
			// 鼠标滑动点击获取到的column是undefined
			if (!column || column.type == "selection" || column.type == "expand") {
				return;
			}
			let isChecked = this.selectRows.length > 0 && this.selectRows.findIndex(item => item == row) !== -1;
			this.$refs["data-table"].clearSelection();
			this.$refs["data-table"].toggleRowSelection(row, !isChecked);
		},
		// 行双击事件
		rowDbClickEvent(row, column, event) {
			if (this.dbClick) {
				this.dbClick(row, column, event);
			}
		},
		// 当前数据表有变化
		change(rows, oldRows) {
			this.selectRows = rows;
			this.$emit("selection-change", rows);
		},
		// 分页中每页条目数据变换
		pageSizeChange(val) {
			if (val > this.pagination.pageSize) {
				let currentPage = parseInt((this.pagination.currentPage * this.pagination.pageSize) / val, 10);
				if (currentPage == 0) {
					currentPage == 1;
				}
				this.pagination.currentPage = currentPage;
			}
			this.parameters.maxResultCount = this.pagination.pageSize = val;
			this.parameters.skipCount = this.pagination.pageSize * (this.pagination.currentPage - 1);
		},
		// 分页中的当前页码变换
		handleCurrentChange(val) {
			this.pagination.currentPage = val;
			this.parameters.skipCount = this.pagination.pageSize * (this.pagination.currentPage - 1);
		},
		// 刷新当前列表数据
		refresh(isReset = true) {
			if (this.isReset) {
				// 重置过滤项的数据
				this.parameters = site.utils.extend(true, {}, this.initParameters);
			} else {
				this.queryList();
			}
		},
		// 修改当前数据表中列的显示或隐藏状态
		changeColumnState(i, isShow) {
			if (this.toggleColumnList[i].isShow == isShow) {
				return;
			}
			this.toggleColumnList[i].isShow = isShow;
			this.$nextTick(() => {
				this.$refs["data-table"].doLayout();
			});
		}
	},
	beforeDestroy(){
		this.$store.dispatch("off", {
			eventName: this.$parent.resizeChangeEventName,
			callback: this.initTableHeight
		});
	}
};
</script>
<style lang="less" scoped>
.data-table {
	position: relative;
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	overflow: hidden;

	.data-table-box {
		flex: 1;
		overflow-y: auto;
	}

	.pagination-box {
		padding: 8px 5px;
		height: 60px;
	}
}
</style>
