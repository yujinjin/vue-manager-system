<template>
	<div class="page-simple-form" :class="{ 'fixed-bottom': isFixedBottom }">
		<el-form v-bind="formAttributes" :model="formInput">
			<el-row :gutter="10" class="input-row" v-for="(groupItem, index) in groupFields" :key="index">
				<el-col class="field-box" :span="fieldItem.span" v-for="(fieldItem, i) in groupItem" :key="i">
					<el-form-item :label="fieldItem.label" :prop="fieldItem.name + ''" :rules="fieldItem.rules">
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
								<el-option v-for="item in fieldItem.data" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
								<el-checkbox v-for="item in fieldItem.data" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
							</el-checkbox-group>
						</template>
						<template v-else-if="fieldItem.type == 'radio'">
							<el-radio-group v-bind="fieldItem.option" :value="getValue(fieldItem.name)" @input="changeValue(fieldItem.name, $event)">
								<el-radio v-for="item in fieldItem.data" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
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
		</el-form>
		<!-- 其他自定义页面内容 -->
		<slot name="other"></slot>
		<div class="footer" v-if="isFixedBottom">
			<el-button v-for="(buttonItem, index) in actionButtons" v-bind="buttonItem.option" :key="index" @click="clickHandle(index)">{{ buttonItem.label }}</el-button>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			formAttributes: {}, // 当前form表单属性
			isSubmiting: false, // 当前数据是否正在提交
			formFields: [], // 表单字段列表
			formInput: {}, // 当前提交的表单数据
			actionButtons: [] // 弹窗底部操作按钮
		};
	},
	props: {
		// 弹窗底部操作按钮，如果是false、null就不展示
		// 针对于按钮的点击事件父级事件，其事件名格式：{action} + 'Click'
		buttons: {
			type: [Boolean, Array],
			default: true
		},
		// 表单字段列表[{name: 表单项名称, label: 选项的标签名称, value: 选项的值, type: 组件的类型,
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
		// 提交表单数据的函数，其函数执行必须返回Promise类型
		submitForm: Function,
		// 表单每栏显示数目，不要初始化后又有变化，这里不做监控
		column: {
			type: Number,
			default: 3
		},
		isShowFooter: {
			type: Boolean,
			default: true
		} // 是否显示底部操作按钮
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
		},
		buttons: {
			handler(val) {
				this.generateButtons();
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
			// 当前分组的二维数据
			let groupFields = [];
			// 当前分组的二维数下标
			let i = 0;
			// 当前行所占的栅格数
			let currentColumnNumber = 0;
			this.formFields.forEach(fields => {
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
			return groupFields;
		},
		isFixedBottom() {
			return this.isShowFooter && this.actionButtons && this.actionButtons.length > 0;
		}
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			this.generateFormAttributes();
			this.generateFormFields();
			this.generateButtons();
		},
		// 生成form表单属性配置
		generateFormAttributes() {
			this.formAttributes = site.utils.extend(true, {}, site.constants.FORM_DEFAULT_ATTRIBUTES, { labelWidth: "100px" }, this.form);
		},
		// 生成form表单字段
		generateFormFields() {
			if (!this.fields || this.fields.length == 0) {
				return;
			}
			let formFields = [];
			this.fields.forEach(field => {
				field = site.utils.extend(true, {}, field);
				// 表单字段列表[{name: 表单项名称, label: 选项的标签名称, value: 选项的值, type: 组件的类型,
				// data: 数据（比如：select的选项值列表）, option: 组件的自定义选项(可无), span: 占用的栅格数（布局）
				// rules: 表单的验证方式, slot: 自定义插槽名称（可无，如有值其他选项无效）}]
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
							field.option.placeholder = site.constants.FORM_FIELD_DEFAULT_ATTRIBUTES[field.type].placeholder + (field.label || "");
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
		generateButtons() {
			if (this.buttons == null || this.buttons == true || this.buttons === undefined) {
				this.actionButtons = [
					{
						label: "取 消",
						action: "cancel",
						click: this.close,
						option: {
							size: "small"
						}
					},
					{
						label: "确 定",
						action: "submit",
						click: this.submit,
						option: {
							size: "small",
							type: "primary"
						}
					}
				];
			} else if (this.buttons !== false && this.buttons.length > 0) {
				this.actionButtons = site.utils.extend(true, {}, this.buttons);
			} else {
				this.actionButtons = [];
			}
		},
		// 获取当前字段的值
		getValue(name) {
			return site.utils.getObjectProperty(this.formInput, name, null);
		},
		// 更改当前字段的值
		changeValue(name, value) {
			this.$set(this.formInput, name, value);
			this.$emit("input-change", this.formInput);
		},
		clickHandle(index) {
			if (typeof this.actionButtons[index].click === "function") {
				this.actionButtons[index].click(index);
			}
			this.$emit(this.actionButtons[index].action + "Click", this.formInfo, index);
		},
		close(index) {
			let action = "cancel";
			if (index != -1) {
				action = this.actionButtons[index].action + "Click";
			}
			this.$emit("close", action);
		},
		submit(index) {
			this.$refs[this.formAttributes.ref].validate(valid => {
				if (!valid) {
					return false;
				}
				if (this.isSubmiting) {
					this.$message({
						message: "当前数据正在提交，请耐心等待!",
						type: "warning"
					});
					return;
				}
				this.isSubmiting = true;
				this.submitForm(this.formInput)
					.then(() => {
						this.close(index);
						this.isSubmiting = false;
					})
					.catch(error => {
						this.isSubmiting = false;
					});
			});
		}
	}
};
</script>
<style lang="less" scoped>
.page-simple-form {
	height: 100%;
	width: 100%;
	padding-top: 15px;
	overflow-y: auto;
	overflow-x: hidden;

	&.fixed-bottom {
		padding-bottom: 50px;
	}

	.footer {
		position: absolute;
		left: -10px;
		right: 0px;
		bottom: 0px;
		padding-bottom: 15px;
		text-align: center;
		background-color: rgba(255, 255, 255, 0.8);
	}
}
</style>
