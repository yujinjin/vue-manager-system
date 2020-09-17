<template>
	<!--
        作者：yujinjin9@126.com
        时间：2020-08-20
        描述：查询搜索表单
    -->
	<div class="search-panel" v-if="groupFields.length > 0">
		<div class="search-form">
			<el-row :gutter="10" class="search-row" v-for="(groupItem, index) in groupFields" :key="index" v-show="index == 0 || isShowMore">
				<el-col class="field-box" :span="field.span" v-for="(field, i) in groupItem" :key="i">
					<div class="label-text" v-if="field.label">{{ field.label }}</div>
					<div class="input-box">
						<!-- 自定义组件 -->
						<template v-if="field.slot">
							<slot :name="field.slot" v-bind:formFields="{ formFields }"></slot>
						</template>
						<template v-else-if="field.type == 'input'">
							<el-input v-bind="field.option" v-model="field.value" @keyup.enter="change(field)" @change="change(field)"></el-input>
						</template>
						<template v-else-if="field.type == 'select'">
							<el-select v-model="field.value" v-bind="field.option" @change="change(field)">
								<el-option v-for="item in field.data" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</template>
						<template v-else-if="field.type == 'timeSelect'">
							<el-time-select v-model="field.value" v-bind="field.option" @change="change(field)"></el-time-select>
						</template>
						<template v-else-if="field.type == 'datePicker' || field.type == 'dateTimePicker'">
							<el-date-picker v-model="field.value" v-bind="field.option" @change="change(field)"></el-date-picker>
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
			<el-button size="small" v-if="groupFields.length > 1" icon="el-icon-more" @click="changeShowMoreState">{{ isShowMore ? "隐藏" : "更多" }}</el-button>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			formFields: [], // form表单选项
			isShowMore: false // 是否显示更多选项
		};
	},
	props: {
		fields: {
			type: Array,
			default() {
				return [];
			}
		}, // 查询表单字段列表 [{name: 查询项的名称，同时也是父级组件的字段属性, label: 选项的标签名称, value: 选项的值, type: 组件的类型, data: 数据（比如：select的选项值列表）, option: 组件的自定义选项(可无), slot: 自定义插槽名称（可无，如有值其他选项无效）}]
		filterProperty: {
			type: [Boolean, String],
			default() {
				return "filters";
			}
		}, // 过滤器字段的属性值，用于双向绑定表单字段的值
		column: {
			type: Number,
			default: 4
		}
	},
	watch: {
		fields: {
			handler(val) {
				this.generateFormFields();
			},
			deep: true
		}
	},
	computed: {
		// 把formFields分成4个一组的二维数组，便于嵌套循环
		groupFields() {
			let groupFields = [];
			this.formFields.forEach((field, index) => {
				let i = parseInt(index / 4, 10);
				if (!groupFields[i]) {
					groupFields[i] = [];
				}
				groupFields[i].push(field);
			});
			return groupFields;
		},
		// 查询按钮是否在布局内展示（如果直接放在布局内展示24栅格，它得占4个空间，这样就占的太多了。
		// 当查询项少于4个的时候操作按钮会放在最后面，显得太难看这样得放在栅格里面）
		isInsideForButton() {
			return this.fields.length < 3;
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
			if (!this.fields || this.fields.length == 0) {
				this.formFields = [];
				return;
			}
			let formFields = [];
			this.fields.forEach(field => {
				// 深拷贝过滤选项
				field = site.utils.extend(true, {}, field);
				if (!field.slot) {
					if (!field.type) {
						// 默认输入框
						field.type = "input";
					}
					if (site.constants.SEARCH_FORM_FIELD_DEFAULT_ATTRIBUTES[field.type]) {
						if (!field.option) {
							field.option = {};
						}
						if (!field.option.placeholder) {
							field.option.placeholder = (site.constants.SEARCH_FORM_FIELD_DEFAULT_ATTRIBUTES[field.type].placeholder || "") + (field.label || "");
						}
						field.option = site.utils.extend(true, {}, site.constants.SEARCH_FORM_FIELD_DEFAULT_ATTRIBUTES[field.type], field.option || {});
					}
					if (!Object.prototype.hasOwnProperty.call(field, "value")) {
						field.value = null;
					}
				}
				if (field.label) {
					field.label = field.label + "：";
				}
				if (!field.span) {
					// 计算当前字段所占的栅格数
					field.span = parseInt(24 / this.column, 10);
				}
				formFields.push(field);
			});
			this.formFields = formFields;
		},
		search() {
			this.$emit("search");
		},
		change(field) {
			this.$emit("change", field, this.filterPropertyString);
		},
		changeShowMoreState() {
			this.isShowMore = !this.isShowMore;
			this.$parent.triggerResizeChange();
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
					text-align: right;
					flex-shrink: 0;
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
