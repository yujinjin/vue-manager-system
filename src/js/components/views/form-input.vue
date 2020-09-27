<template>
	<div class="form-input-components" v-if="formFields && formFields.length > 0">
		<el-form v-bind="formAttributes" :model="formInput">
			<template v-if="groupingShow">
				<div class="card" v-for="(cardItem, cardIndex) in groupFields" :key="cardIndex">
					<div class="header">
						<slot :name="cardItem.slot ? cardItem.slot : 'card' + cardIndex" v-bind:formInput="formInput">
							{{ cardItem.title }}
							<div class="tips-text" v-if="cardItem.subTitle">{{ cardItem.subTitle }}</div>
						</slot>
					</div>
					<div class="body">
						<el-row :gutter="10" class="input-row" v-for="(groupItem, index) in cardItem.fields" :key="index">
							<el-col class="field-box" :span="fieldItem.span" v-for="(fieldItem, i) in groupItem" :key="i">
								<el-form-item :label="fieldItem.label" :label-width="fieldItem.labelWidth || fieldItem.label ? fieldItem.labelWidth || formAttributes.labelWidth : '15px'" :prop="fieldItem.name + ''" :rules="fieldItem.rules">
									<!-- 自定义组件 -->
									<template v-if="fieldItem.slot">
										<slot :name="fieldItem.slot" v-bind:formInput="formInput"></slot>
									</template>
									<template v-else-if="fieldItem.type == 'label'">
										<strong>{{ getValue(fieldItem.name) }}</strong>
									</template>
									<template v-else-if="fieldItem.type == 'input'">
										<el-input v-bind="fieldItem.option" :value="getValue(fieldItem.name)" @input="changeValue(fieldItem.name, $event)"></el-input>
									</template>
									<template v-else-if="fieldItem.type == 'select'">
										<el-select v-bind="fieldItem.option" :value="getValue(fieldItem.name)" @input="changeValue(fieldItem.name, $event)">
											<el-option v-for="item in fieldItem.data" :key="item[fieldItem.option.optionValueKey]" :label="item[fieldItem.option.optionLabelKey]" :value="item[fieldItem.option.optionValueKey]"></el-option>
										</el-select>
									</template>
									<template v-else-if="fieldItem.type == 'timeSelect'">
										<el-time-select v-bind="fieldItem.option" :value="getValue(fieldItem.name)" @input="changeValue(fieldItem.name, $event)"></el-time-select>
									</template>
									<template v-else-if="fieldItem.type == 'datePicker' || fieldItem.type == 'dateTimePicker'">
										<el-date-picker v-bind="fieldItem.option" :value="getValue(fieldItem.name)" @input="changeValue(fieldItem.name, $event)"></el-date-picker>
									</template>
									<template v-else-if="fieldItem.type == 'inputNumber'">
										<el-input-number v-bind="fieldItem.option" :value="getValue(fieldItem.name)" @input="changeValue(fieldItem.name, $event)"></el-input-number>
									</template>
									<template v-else-if="fieldItem.type == 'switch'">
										<el-switch v-bind="fieldItem.option" :value="getValue(fieldItem.name)" @input="changeValue(fieldItem.name, $event)"></el-switch>
									</template>
									<template v-else-if="fieldItem.type == 'checkbox'">
										<el-checkbox-group v-bind="fieldItem.option" :value="getValue(fieldItem.name)" @input="changeValue(fieldItem.name, $event)">
											<el-checkbox v-for="item in fieldItem.data" :key="item[fieldItem.option.optionValueKey]" :label="item[fieldItem.option.optionValueKey]">{{ item[fieldItem.option.optionLabelKey] }}</el-checkbox>
										</el-checkbox-group>
									</template>
									<template v-else-if="fieldItem.type == 'radio'">
										<el-radio-group v-bind="fieldItem.option" :value="getValue(fieldItem.name)" @input="changeValue(fieldItem.name, $event)">
											<el-radio v-for="item in fieldItem.data" :key="item[fieldItem.option.optionValueKey]" :label="item[fieldItem.option.optionValueKey]">{{ item[fieldItem.option.optionLabelKey] }}</el-radio>
										</el-radio-group>
									</template>
									<template v-else-if="fieldItem.type == 'image'">
										<el-image v-bind="fieldItem.option" :src="getValue(fieldItem.name) | imageUrl"></el-image>
									</template>
									<template v-else-if="fieldItem.type == 'imgUpload'">
										<img-upload v-bind="fieldItem.option" :value="getValue(fieldItem.name)" @input="changeValue(fieldItem.name, $event)"></img-upload>
									</template>
									<template v-else-if="fieldItem.type == 'videoUpload'">
										<video-upload v-bind="fieldItem.option" @on-change="changeValue(fieldItem.name, arguments[0])"></video-upload>
									</template>
									<template v-else-if="fieldItem.type == 'rate'">
										<el-rate v-bind="fieldItem.option" :value="getValue(fieldItem.name)" @input="changeValue(fieldItem.name, $event)"></el-rate>
									</template>
									<template v-else-if="fieldItem.type == 'colorPicker'">
										<el-color-picker v-bind="fieldItem.option" :value="getValue(fieldItem.name)" @input="changeValue(fieldItem.name, $event)"></el-color-picker>
									</template>
									<template v-else-if="fieldItem.type == 'htmlEditor'">
										<!-- 富文本框编辑器实现 -->
										<web-editor :editor="fieldItem.option" :value="getValue(fieldItem.name)" @input="changeValue(fieldItem.name, $event)"></web-editor>
									</template>
								</el-form-item>
							</el-col>
						</el-row>
					</div>
				</div>
			</template>
			<template v-else>
				<el-row :gutter="10" class="input-row" v-for="(groupItem, index) in groupFields" :key="index">
					<el-col class="field-box" :span="fieldItem.span" v-for="(fieldItem, i) in groupItem" :key="i">
						<el-form-item :label="fieldItem.label" :label-width="fieldItem.labelWidth || fieldItem.label ? fieldItem.labelWidth || formAttributes.labelWidth : '15px'" :prop="fieldItem.name + ''" :rules="fieldItem.rules">
							<!-- 自定义组件 -->
							<template v-if="fieldItem.slot">
								<slot :name="fieldItem.slot" v-bind:formInput="formInput"></slot>
							</template>
							<template v-else-if="fieldItem.type == 'label'">
								<strong>{{ getValue(fieldItem.name) }}</strong>
							</template>
							<template v-else-if="fieldItem.type == 'input'">
								<el-input v-bind="fieldItem.option" :value="getValue(fieldItem.name)" @input="changeValue(fieldItem.name, $event)"></el-input>
							</template>
							<template v-else-if="fieldItem.type == 'select'">
								<el-select v-bind="fieldItem.option" :value="getValue(fieldItem.name)" @input="changeValue(fieldItem.name, $event)">
									<el-option v-for="item in fieldItem.data" :key="item[fieldItem.option.optionValueKey]" :label="item[fieldItem.option.optionLabelKey]" :value="item[fieldItem.option.optionValueKey]"></el-option>
								</el-select>
							</template>
							<template v-else-if="fieldItem.type == 'timeSelect'">
								<el-time-select v-bind="fieldItem.option" :value="getValue(fieldItem.name)" @input="changeValue(fieldItem.name, $event)"></el-time-select>
							</template>
							<template v-else-if="fieldItem.type == 'datePicker' || fieldItem.type == 'dateTimePicker'">
								<el-date-picker v-bind="fieldItem.option" :value="getValue(fieldItem.name)" @input="changeValue(fieldItem.name, $event)"></el-date-picker>
							</template>
							<template v-else-if="fieldItem.type == 'inputNumber'">
								<el-input-number v-bind="fieldItem.option" :value="getValue(fieldItem.name)" @input="changeValue(fieldItem.name, $event)"></el-input-number>
							</template>
							<template v-else-if="fieldItem.type == 'switch'">
								<el-switch v-bind="fieldItem.option" :value="getValue(fieldItem.name)" @input="changeValue(fieldItem.name, $event)"></el-switch>
							</template>
							<template v-else-if="fieldItem.type == 'checkbox'">
								<el-checkbox-group v-bind="fieldItem.option" :value="getValue(fieldItem.name) || []" @input="changeValue(fieldItem.name, $event)">
									<el-checkbox v-for="item in fieldItem.data" :key="item[fieldItem.option.optionValueKey]" :label="item[fieldItem.option.optionValueKey]">{{ item[fieldItem.option.optionLabelKey] }}</el-checkbox>
								</el-checkbox-group>
							</template>
							<template v-else-if="fieldItem.type == 'radio'">
								<el-radio-group v-bind="fieldItem.option" :value="getValue(fieldItem.name)" @input="changeValue(fieldItem.name, $event)">
									<el-radio v-for="item in fieldItem.data" :key="item[fieldItem.option.optionValueKey]" :label="item[fieldItem.option.optionValueKey]">{{ item[fieldItem.option.optionLabelKey] }}</el-radio>
								</el-radio-group>
							</template>
							<template v-else-if="fieldItem.type == 'image'">
								<el-image v-bind="fieldItem.option" :src="getValue(fieldItem.name) | imageUrl"></el-image>
							</template>
							<template v-else-if="fieldItem.type == 'imgUpload'">
								<img-upload v-bind="fieldItem.option" :value="getValue(fieldItem.name)" @input="changeValue(fieldItem.name, $event)"></img-upload>
							</template>
							<template v-else-if="fieldItem.type == 'videoUpload'">
								<video-upload v-bind="fieldItem.option" @on-change="changeValue(fieldItem.name, arguments[0])"></video-upload>
							</template>
							<template v-else-if="fieldItem.type == 'rate'">
								<el-rate v-bind="fieldItem.option" :value="getValue(fieldItem.name)" @input="changeValue(fieldItem.name, $event)"></el-rate>
							</template>
							<template v-else-if="fieldItem.type == 'colorPicker'">
								<el-color-picker v-bind="fieldItem.option" :value="getValue(fieldItem.name)" @input="changeValue(fieldItem.name, $event)"></el-color-picker>
							</template>
							<template v-else-if="fieldItem.type == 'htmlEditor'">
								<!-- 富文本框编辑器实现 -->
								<web-editor :editor="fieldItem.option" :value="getValue(fieldItem.name)" @input="changeValue(fieldItem.name, $event)"></web-editor>
							</template>
						</el-form-item>
					</el-col>
				</el-row>
			</template>
		</el-form>
	</div>
</template>
<script>
export default {
	data() {
		return {
			formAttributes: {}, // 当前form表单属性
			formFields: [], // 表单字段列表
			formInput: {} // 当前提交的表单数据
		};
	},
	props: {
		// 表单字段列表[{division: { title: "分组后的卡片标题", subTitle: "分组后的卡片标题"}--组分割栏, name: 表单项名称, label: 选项的标签名称, value: 选项的值, type: 组件的类型,
		// data: 数据（比如：select的选项值列表）, option: 组件的自定义选项(可无), span: 占用的栅格数（布局）
		// rules: 表单的验证方式, slot: 自定义插槽名称（可无，如有值其他选项无效）}]
		fields: {
			type: Array,
			default() {
				return [];
			}
		},
		// 表单属性
		form: {
			type: Object,
			deault() {
				return null;
			}
		},
		// 表单每栏显示数目，不要初始化后又有变化，这里不做监控
		column: {
			type: Number,
			default: 2
		}
	},
	watch: {
		fields: {
			handler(val) {
				this.generateFormFields();
			},
			deep: true
		},
		form: {
			handler(val) {
				this.generateFormAttributes();
			},
			deep: true
		}
	},
	computed: {
		// 把formFields分成二维数组，便于嵌套循环
		groupFields() {
			if (!this.formFields || this.formFields.length == 0) {
				return;
			}
			// 当前表单字段生成卡片数组
			let cards = [];
			// 当前分组的二维数据
			let groupFields = [];
			// 当前分组的二维数下标
			let i = 0;
			// 当前行所占的栅格数
			let currentColumnNumber = 0;
			this.formFields.forEach(fields => {
				if (fields.division) {
					// 当前字段信息是分隔栏
					groupFields = [];
					i = 0;
					currentColumnNumber = 0;
					if (typeof fields.division == "string") {
						cards.push({
							title: fields.division,
							fields: groupFields
						});
					} else {
						cards.push(Object.assign(fields.division, { fields: groupFields }));
					}
					return;
				}
				currentColumnNumber += fields.span;
				if (currentColumnNumber > 24) {
					++i;
					currentColumnNumber = fields.span;
				}
				if (!groupFields[i]) {
					groupFields[i] = [];
				}
				groupFields[i].push(fields);
			});
			return cards.length == 0 ? groupFields : cards;
		},
		// 当前展示的信息是否分组方式展示,如果有division就代表着分栏展示
		groupingShow() {
			if (!this.fields || this.fields.length == 0) {
				return false;
			}
			return this.fields.findIndex(item => !!item.division) != -1;
		},
		formLabelWidth() {
			if (this.form && this.form.labelWidth) {
				return this.form.labelWidth;
			} else if (this.column == 1) {
				return "200px";
			} else if (this.column == 2) {
				return "150px";
			} else {
				return "100px";
			}
		}
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			this.generateFormAttributes();
			this.generateFormFields();
		},
		// 生成dialog属性配置
		generateFormAttributes() {
			this.formAttributes = site.utils.extend(true, {}, site.constants.FORM_DEFAULT_ATTRIBUTES, { labelWidth: this.formLabelWidth }, this.form);
		},
		// 生成form表单字段
		generateFormFields() {
			if (!this.fields || this.fields.length == 0) {
				return;
			}
			let formFields = [];
			this.fields.forEach(field => {
				field = site.utils.extend(true, {}, field);
				// 表单字段列表[{division: { title: "分组后的卡片标题", subTitle: "分组后的卡片标题"} || "" --组分割栏,
				// {name: 表单项名称, label: 选项的标签名称, value: 选项的值, type: 组件的类型,
				// data: 数据（比如：select的选项值列表）, option: 组件的自定义选项(可无), span: 占用的栅格数（布局）
				// rules: 表单的验证方式, slot: 自定义插槽名称（可无，如有值其他选项无效）}]
				if (field.division) {
					// 当前字段分隔栏
					formFields.push(field);
					return;
				}
				if (field.name) {
					this.$set(this.formInput, field.name, field.value === undefined ? null : field.value);
				}
				if (!field.slot) {
					if (!field.type) {
						// 默认输入框
						field.type = "input";
					}
					if (site.constants.FORM_FIELD_DEFAULT_ATTRIBUTES[field.type]) {
						if (!field.option) {
							field.option = {};
						}
						if (!field.option.placeholder) {
							field.option.placeholder = (site.constants.FORM_FIELD_DEFAULT_ATTRIBUTES[field.type].placeholder || "") + (field.label || "");
						}
						field.option = site.utils.extend(true, {}, site.constants.FORM_FIELD_DEFAULT_ATTRIBUTES[field.type], field.option || {});
					}
				}
				if (field.label) {
					field.label = field.label + "：";
				}
				if (!field.span) {
					// 计算当前字段所占的栅格数
					if (field.type == "htmlEditor") {
						field.span = 24;
					} else {
						field.span = parseInt(24 / this.column, 10);
					}
				}
				formFields.push(field);
			});
			this.formFields = formFields;
		},
		// 获取当前字段的值
		getValue(name) {
			return site.utils.getObjectProperty(this.formInput, name, null);
		},
		// 更改当前字段的值
		changeValue(name, value) {
			this.$set(this.formInput, name, value);
			this.$emit("input-change", this.formInput, name, value);
		},
		/**
		 * 设置当前表单的字段数据（外部应用方法）
		 * @param {Object} fieldsValue 设置的字段数据对象，如果该对象为null就设置所有的字段为null，
		 * 注意：如果fieldsValue中的的属性值是个对象，会被直接引用，因而跟踪其值的变化，设置此值时要注意
		 * @param {Boolean} setAll 是否把fieldsValue的值全部重置到当前的数据值中
		 */
		setFieldsValue(fieldsValue, setAll = true) {
			if (!fieldsValue) {
				for (let key in this.formInput) {
					this.formInput[key] = null;
				}
				return;
			}
			fieldsValue = JSON.parse(JSON.stringify(fieldsValue));
			if (setAll) {
				this.formInput = {};
			}
			for (let key in fieldsValue) {
				this.$set(this.formInput, key, fieldsValue[key]);
			}
		},
		/**
		 * 设置某个字段的数值（外部应用方法）
		 * @param {String} name 字段名，比如："orderNo", "goods[0].id"
		 * @param {any} value 字段的数值
		 */
		setFieldValue(name, value) {
			this.$set(this.formInput, name, value);
		},
		// 验证当前表单数据（外部应用方法）
		validate(callbackFun) {
			if (callbackFun) {
				return this.$refs[this.formAttributes.ref].validate((valid, object) => {
					callbackFun(valid, this.formInput, object);
				});
			} else {
				return this.$refs[this.formAttributes.ref].validate().then(() => this.formInput);
			}
		},
		// 获取当前slot的name列表,用于进一步封装（外部应用方法）
		getSlotNameList() {
			if (!this.formFields || this.formFields.length == 0) {
				return [];
			}
			let nameList = [];
			if (this.groupingShow) {
				this.groupFields.forEach((cardItem, cardIndex) => {
					nameList.push(cardItem.slot ? cardItem.slot : "card" + cardIndex);
				});
			}
			this.formFields.forEach(fieldItem => {
				if (fieldItem.slot) {
					nameList.push(fieldItem.slot);
				}
			});
			return nameList;
		},
		getFormInput() {
			return this.formInput;
		}
	}
};
</script>
<style lang="less" scoped>
.form-input-components {
	.card {
		border: 1px solid #dfe6ec;
		border-radius: 5px;
		margin: 10px;
		overflow: hidden;

		&:hover {
			box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
		}

		.header {
			background: #eef1f6;
			line-height: 40px;
			padding-left: 10px;
			font-size: 16px;
			font-weight: bold;

			.tips-text {
				font-weight: normal;
				font-size: 12px;
				display: inline-block;
				padding-left: 5px;
				color: #f56c6c;
			}
		}

		.body {
			padding-top: 15px;
			padding-right: 15px;
		}
	}
}
</style>
