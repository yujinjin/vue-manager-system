<template>
	<!-- 
        弹窗form表单封装
    -->
	<el-dialog v-bind="dialogAttributes" :visible="isShow" @close="close">
		<div class="dialog-form-body">
			<form-input :fields="fields" :form="form" :column="column" ref="form-input" @input-change="formInputChange">
				<template v-for="slotName in formInputSlotNameList" v-slot:[slotName]="{ formInput }">
					<slot :name="slotName" v-bind:formInput="formInput"></slot>
				</template>
			</form-input>
			<!-- 表单底部默认内容 -->
			<slot name="form-bottom"></slot>
		</div>
		<!-- Dialog 按钮操作区的内容 -->
		<div slot="footer" class="dialog-footer" v-if="actionButtons && actionButtons.length > 0">
			<el-button v-for="(buttonItem, index) in actionButtons" v-bind="buttonItem.option" :key="index" @click="clickHandle(index)">{{ buttonItem.label }}</el-button>
		</div>
	</el-dialog>
</template>
<script>
export default {
	data() {
		return {
			formInput: {}, // 当前表单的值
			formInputSlotNameList: [], // form-input组件中的插槽名称列表
			dialogAttributes: {}, // 当前dialog属性
			isSubmiting: false, // 当前数据是否正在提交
			actionButtons: [] // 弹窗底部操作按钮
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
		buttons: {
			handler(val) {
				this.generateButtons();
			},
			deep: true
		},
		fields: {
			handler(val) {
				this.$nextTick(() => {
					if (this.$refs["form-input"]) {
						this.formInputSlotNameList = this.$refs["form-input"].getSlotNameList();
					}
				});
			},
			deep: true
		},
		isShow(val) {
			if (val) {
				this.$nextTick(() => {
					if (this.$refs["form-input"]) {
						this.formInputSlotNameList = this.$refs["form-input"].getSlotNameList();
					}
				});
			}
		}
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			this.generateDialogAttributes();
			this.generateButtons();
		},
		// 生成dialog属性配置
		generateDialogAttributes() {
			this.dialogAttributes = site.utils.extend(true, {}, site.constants.FORM_DIALOG_DEFAULT_ATTRIBUTES, this.dialog);
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
				this.actionButtons = site.utils.extend(true, this.buttons);
			} else {
				this.actionButtons = [];
			}
		},
		clickHandle(index) {
			if (this.isSubmiting) {
				this.$message({
					message: "当前数据正在提交，请耐心等待!",
					type: "warning"
				});
				return;
			}
			this.isSubmiting = true;
			let formInput = this.$refs["form-input"].getFormInput();
			let result = null;
			if (typeof this.actionButtons[index].click === "function") {
				result = this.actionButtons[index].click(formInput, this.$refs["form-input"].validate, index);
			}
			this.$emit(this.actionButtons[index].action + "Click", formInput, this.$refs["form-input"].validate, index);
			if (result instanceof Promise) {
				result
					.then(() => {
						this.isSubmiting = false;
					})
					.catch(error => {
						this.isSubmiting = false;
					});
			} else {
				this.isSubmiting = false;
			}
		},
		close() {
			this.$emit("update:isShow", false);
		},
		formInputChange(formInput, name, value) {
			this.$emit("input-change", formInput, name, value);
		},
		async submit(index) {
			try {
				let formInput = await this.$refs["form-input"].validate();
				await this.submitForm(formInput);
				this.close();
			} catch (error) {
				site.log.error(error);
			}
		},
		/**
		 * 设置当前表单的字段数据（外部应用方法）
		 * @param {Object} fieldsValue 设置的字段数据对象，如果该对象为null就设置所有的字段为null，
		 * 注意：如果fieldsValue中的的属性值是个对象，会被直接引用，因而跟踪其值的变化，设置此值时要注意
		 * @param {Boolean} setAll 是否把fieldsValue的值全部重置到当前的数据值中
		 */
		setFieldsValue(fieldsValue, setAll = true) {
			this.$nextTick(() => {
				this.$refs["form-input"].setFieldsValue(fieldsValue, setAll);
			});
		},
		/**
		 * 设置某个字段的数值（外部应用方法）
		 * @param {String} name 字段名，比如："orderNo", "goods[0].id"
		 * @param {any} value 字段的数值
		 */
		setFieldValue(name, value) {
			this.$nextTick(() => {
				this.$refs["form-input"].setFieldsValue(name, value);
			});
		}
	}
};
</script>
<style lang="less" scoped>
.form-dialog .dialog-form-body {
	overflow-y: auto;
	overflow-x: hidden;
	max-height: 500px;
}
</style>
