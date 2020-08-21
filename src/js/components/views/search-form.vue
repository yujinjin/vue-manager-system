<template>
	<!--
        作者：yujinjin9@126.com
        时间：2020-08-20
        描述：查询搜索表单
    -->
	<div class="search-panel" v-if="groupFilters.length > 0">
		<div class="search-form">
			<el-row :gutter="10" class="search-row" v-for="(groupItem, index) in groupFilters" :key="index" v-show="index == 0 || isShowMore">
				<el-col class="field-box" :span="6" v-for="(filter, i) in groupItem" :key="i">
					<div class="label-text" v-if="filter.label">{{ filter.label }}</div>
					<div class="input-box">
						<!-- 自定义组件 -->
						<template v-if="filter.slot">
							<slot :name="filter.slot" v-bind:formFields="{ formFields }"></slot>
						</template>
						<template v-else-if="filter.type == 'input'">
							<el-input v-bind="filter.option" v-model="filter.value" @keyup.enter="change(filter)" @change="change(filter)"></el-input>
						</template>
						<template v-else-if="filter.type == 'select'">
							<el-select v-model="filter.value" v-bind="filter.option" @change="change(filter)">
								<el-option v-for="item in filter.data" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</template>
						<template v-else-if="filter.type == 'timeSelect'">
							<el-time-select v-model="filter.value" v-bind="filter.option" @change="change(filter)"></el-time-select>
						</template>
						<template v-else-if="filter.type == 'datePicker' || filter.type == 'dateTimePicker'">
							<el-date-picker v-model="filter.value" v-bind="filter.option" @change="change(filter)"></el-date-picker>
						</template>
					</div>
				</el-col>
				<el-col class="field-box" :span="6" v-if="isInsideForButton">
					<el-button size="small" @click="search" type="primary" icon="el-icon-search">查询</el-button>
				</el-col>
			</el-row>
		</div>
		<div class="button-box" v-if="!isInsideForButton">
			<el-button size="small" @click="search" type="primary" icon="el-icon-search">查询</el-button>
			<el-button size="small" v-if="groupFilters.length > 1" icon="el-icon-more" @click="isShowMore = !isShowMore">{{ isShowMore ? "隐藏" : "更多" }}</el-button>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			formFields: [], // form表单选项
			isShowMore: false, // 是否显示更多选项
			components: {
				input: {
					size: "small",
					placeholder: "请输入"
				}, // input 输入框默认配置选项(具体见element Input 输入框文档)
				select: {
					clearable: true,
					size: "small",
					placeholder: "请选择"
				}, // select 选择器默认配置选项（具体见element Select 选择器文档）
				timeSelect: {
					clearable: true,
					size: "small",
					placeholder: "请选择"
				}, // TimePicker 时间选择器默认配置（具体见TimePicker 时间选择器文档）
				datePicker: {
					clearable: true,
					size: "small",
					placeholder: "请选择",
					type: "date"
				}, // DatePicker 日期选择器默认配置（具体见DatePicker 日期选择器文档）
				dateTimePicker: {
					clearable: true,
					size: "small",
					placeholder: "请选择",
					type: "datetime"
				} // DateTimePicker 日期时间选择器（具体见DateTimePicker 日期时间文档）
			} // 查询表单所支持的组件默认配置
		};
	},
	props: {
		searchForm: {
			type: Array,
			default() {
				return [];
			}
		}, // 查询表单项 [{name: 查询项的名称，同时也是父级组件的字段属性, label: 选项的标签名称, value: 选项的值, type: 组件的类型, data: 数据（比如：select的选项值列表）, option: 组件的自定义选项(可无), slot: 自定义插槽名称（可无，如有值其他选项无效）}]
		filterProperty: {
			type: [Boolean, String],
			default() {
				return "filters";
			}
		} // 过滤器字段的属性值，用于双向绑定表单字段的值
	},
	watch: {
		searchForm: {
			handler(val) {
				this.generateFormFields();
			},
			deep: true
		}
	},
	computed: {
		// 把formFields分成4个一组的二维数组，便于嵌套循环
		groupFilters() {
			let groupFilters = [];
			this.formFields.forEach((filter, index) => {
				let i = parseInt(index / 4, 10);
				if (!groupFilters[i]) {
					groupFilters[i] = [];
				}
				groupFilters[i].push(filter);
			});
			return groupFilters;
		},
		// 查询按钮是否在布局内展示（如果直接放在布局内展示24栅格，它得占4个空间，这样就占的太多了。
		// 当查询项少于4个的时候操作按钮会放在最后面，显得太难看这样得放在栅格里面）
		isInsideForButton() {
			return this.searchForm.length < 3;
		},
		// 计算过滤器字段的属性值转换成String
		filterPropertyString() {
			let filterProperty = this.filterProperty;
			if (filterProperty === "true") {
				filterProperty = true;
			} else if (filterProperty === "false") {
				filterProperty = false;
			}
			if (typeof filterProperty == "boolean") {
				filterProperty = filterProperty ? "filters" : null;
			}
			return filterProperty;
		}
	},
	created() {
		this.init();
	},
	methods: {
		init() {
			this.generateFormFields();
		},
		generateFormFields() {
			if (!this.searchForm || this.searchForm.length == 0) {
				this.formFields = [];
				return;
			}
			let formFields = [];
			this.searchForm.forEach(filter => {
				// 深拷贝过滤选项
				filter = site.utils.extend(true, {}, filter);
				if (!filter.type) {
					// 默认输入框
					filter.type = "input";
				}
				if (this.components[filter.type]) {
					if (!filter.option) {
						filter.option = {};
					}
					if (!filter.option.placeholder) {
						filter.option.placeholder = this.components[filter.type].placeholder + (filter.label || "");
					}
					if (filter.label) {
						filter.label = filter.label + "：";
					}
					filter.option = site.utils.extend(true, {}, this.components[filter.type], filter.option || {});
				}
				if (!Object.prototype.hasOwnProperty.call(filter, "value")) {
					filter.value = null;
				}
				formFields.push(filter);
			});
			this.formFields = formFields;
		},
		search() {
			this.$emit("search");
		},
		change(filter) {
			this.$emit("change", filter, this.filterPropertyString);
		}
	}
};
</script>
<style lang="less" scoped>
.search-panel {
	display: flex;
	border-bottom: 1px solid #ddd;
	line-height: 34px;
	max-width: 100%;
	overflow: hidden;
	padding: 12px;

	.search-form {
		flex: 1;

		.search-row {
			&:not(:first-child) {
				padding-top: 12px;
			}

			.field-box {
				display: flex;

				.label-text {
					width: 60px;
					font-size: 12px;
				}

				.input-box {
					flex: 1;
				}
			}
		}
	}

	.button-box {
		padding-left: 10px;
	}
}
</style>
