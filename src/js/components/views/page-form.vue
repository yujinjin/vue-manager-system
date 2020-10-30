<template>
	<div class="page-form-components" :class="{ 'fixed-bottom': isFixedBottom }">
		<form-input :fields="fields" :form="form" :column="column" ref="form-input" @input-change="formInputChange">
			<template v-for="slotName in formInputSlotNameList" v-slot:[slotName]="{ formInput }">
				<slot :name="slotName" v-bind:formInput="formInput"></slot>
			</template>
		</form-input>
		<div class="footer" v-if="isFixedBottom">
			<el-button v-for="(buttonItem, index) in actionButtons" v-bind="buttonItem.option" :key="index" @click="clickHandle(index)">{{ buttonItem.label }}</el-button>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			formInputSlotNameList: [], // form-input组件中的插槽名称列表
			isSubmiting: false, // 当前数据是否正在提交
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
		buttons: {
			handler(val) {
				this.generateButtons();
			},
			deep: true
		},
		fields: {
			handler(val) {
				if (this.$refs["form-input"]) {
					this.formInputSlotNameList = this.$refs["form-input"].getSlotNameList();
				}
			},
			deep: true
		}
	},
	computed: {
		isFixedBottom() {
			return this.isShowFooter && this.actionButtons && this.actionButtons.length > 0;
		}
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			this.generateButtons();
			if (this.$refs["form-input"]) {
				this.formInputSlotNameList = this.$refs["form-input"].getSlotNameList();
			}
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
			this.$emit("close");
		},
		formInputChange(formInput, name, value) {
			this.$emit("input-change", formInput, name, value);
		},
		async submit(index) {
			let formInput = await this.$refs["form-input"].validate();
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
					this.close();
					this.isSubmiting = false;
				})
				.catch(error => {
					this.isSubmiting = false;
				});
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
				this.$refs["form-input"].setFieldValue(name, value);
			});
		}
	}
};
</script>
<style lang="less" scoped>
.page-form-components {
	height: 100%;
	width: 100%;
	overflow-y: auto;
	overflow-x: hidden;
	padding: 10px 10px 0px 0px;

	&.fixed-bottom {
		padding-bottom: 50px;
	}

	.footer {
		position: absolute;
		left: 0px;
		right: 0px;
		bottom: 0px;
		padding: 8px 0px;
		text-align: center;
		// background-color: rgba(239, 243, 248, 0.8);
		// background-color: rgba(51, 122, 183, 0.3);
		background-color: rgba(247, 247, 249, 0.8);
		box-shadow: 4px 2px 4px 4px rgba(0, 0, 0, 0.1);
		// border-top-left-radius: 10px;
		// border-top-right-radius: 10px;
	}
}
</style>
