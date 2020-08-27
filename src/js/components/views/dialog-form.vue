<template>
	<!-- 
        弹窗form表单封装
    -->
	<el-dialog v-bind="dialogDefaultAttributes" :visible.sync="isShow" @close="close(-1)">
		<el-form v-bind="formAttributes">
			<el-row :gutter="10" class="input-row" v-for="(groupItem, index) in groupFields" :key="index">
				<el-col class="field-box" :span="fieldItem.span" v-for="(fieldItem, i) in groupItem" :key="i">
					<el-form-item label="fieldItem.label" :prop="fieldItem.name" :rules="fieldItem.rules">
						<!-- 自定义组件 -->
						<template v-if="fieldItem.slot">
							<slot :name="fieldItem.slot" v-bind:formInput="{ formInput }"></slot>
						</template>
						<template v-else-if="fieldItem.type == 'label'">
							{{ getValue(fieldItem.name) }}
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
						<template v-else-if="fieldItem.type == 'rate'">
							<el-rate v-bind="fieldItem.option" :value="getValue(fieldItem.name)" @input="changeValue(fieldItem.name, $event)"></el-rate>
						</template>
						<template v-else-if="fieldItem.type == 'colorPicker'">
							<el-color-picker v-bind="fieldItem.option" :value="getValue(fieldItem.name)" @input="changeValue(fieldItem.name, $event)"></el-color-picker>
						</template>
						<template v-else-if="fieldItem.type == 'htmlEditor'">
							<!-- TODO：富文本框编辑器实现 -->
							<!-- <el-color-picker v-bind="fieldItem.option" :value="getValue(fieldItem.name)" @input="changeValue(fieldItem.name, $event)"></el-color-picker> -->
						</template>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<!-- 表单底部默认内容 -->
		<slot name="form-bottom"></slot>
		<!-- Dialog 按钮操作区的内容 -->
		<div slot="footer" class="dialog-footer" v-if="buttons && buttons.length > 0">
			<el-button v-for="(buttonItem, index) in buttons" :key="index" @click="clickHandle(index)">{{ buttonItem.label }}</el-button>
		</div>
	</el-dialog>
</template>
<script>
export default {
	data() {
		return {
			dialogAttributes: {}, // 当前dialog属性
			formAttributes: {}, // 当前form表单属性
			isSubmiting: false, // 当前数据是否正在提交
			formFields: [], // 表单字段列表
			formInput: {} // 当前提交的表单数据
		};
	},
	props: {
		// dialog的属性（具体见Elemnet Dialog 对话框文档）
		dialog: {
			type: Object,
			default() {
				return null;
			}
		},
		// 是否显示弹窗
		isShow: {
			type: Boolean,
			default: false
		},
		// 弹窗底部操作按钮，如果是false、null就不展示
		// 针对于按钮的点击事件父级事件，其事件名格式：{action} + 'Click'
		buttons: {
			type: [Boolean, Array],
			default() {
				return [
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
			}
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
			default: 1
		}
	},
	watch: {
		dialog: {
			handler(val) {
				this.generateDialogAttributes();
			},
			deep: true
		},
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
			return groupFilters;
		}
	},
	methods: {
		init() {
			this.generateDialogAttributes();
			this.generateFormAttributes();
			this.generateFormFields();
		},
		// 生成dialog属性配置
		generateDialogAttributes() {
			this.dialogAttributes = site.utils.extend(true, {}, site.constants.FORM_DIALOG_DEFAULT_ATTRIBUTES, this.dialog);
		},
		// 生成dialog属性配置
		generateFormAttributes() {
			this.formAttributes = site.utils.extend(true, {}, site.constants.FORM_DEFAULT_ATTRIBUTES, this.form);
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
						if (field.label) {
							field.label = field.label + "：";
						}
						field.option = site.utils.extend(true, {}, site.constants.FORM_FIELD_DEFAULT_ATTRIBUTES[field.type], field.option || {});
					}
				}
				if (!field.span) {
					// 计算当前字段所占的栅格数
					field.span = parseInt(24 / this.column, 10);
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
		},
		clickHandle(index) {
			if (typeof this.buttons[index].click === "function") {
				this.buttons[index].click(index);
			}
			this.$emit(this.buttons[index].action + "Click", this.formInfo, index);
		},
		close(index) {
			let action = "cancel";
			if (index != -1) {
				action = this.buttons[index].action + "Click";
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
				this.submitForm().then(() => {
					this.close(index);
				});
			});
		}
	}
};
</script>
<style lang="less" scoped></style>
