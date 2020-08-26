<template>
	<!-- 
        弹窗form表单
    -->
	<el-dialog v-bind="dialogDefaultAttributes" :visible.sync="isShow">
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
			dialog: {}, // 当前dialog属性,TODO: 测试isShow重复的情况时以哪个属性为准
			isSubmiting: false, // 当前数据是否正在提交
			formFields: [], // 表单字段列表
			formInput: {} // 当前提交的表单数据
		};
	},
	props: {
		// dialog的属性（具体见Elemnet Dialog 对话框文档）
		dialogAttributes: {
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
		// 弹窗底部操作按钮，如果是false、null
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
		formAttributes: {
			type: Object,
			deault() {
				return null;
			}
		},
		// 提交表单数据的函数，其函数执行必须返回Promise类型
		submitForm: Function,
		// 表单每栏显示数目
		column: {
			type: Number,
			default: 1
		}
	},
	methods: {
		init() {},
		clickHandle(index) {
			if (typeof this.buttons[index].click === "function") {
				this.buttons[index].click();
			}
			this.$emit(this.buttons[index].action + "Click", this.formInfo);
		},
		close() {
			this.$emit("close");
		},
		submit() {}
	}
};
</script>
<style lang="less" scoped></style>
