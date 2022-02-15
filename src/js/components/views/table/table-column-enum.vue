<template>
	<!-- 带有枚举的信息列，支持改变值状态操作 -->
	<div class="table-column-enum">
		<el-tag @click="clickEvent" v-bind="tag">{{ label }}</el-tag>
		<el-dialog :title="isHasCheckbox ? '确认消息提示' : tipsText" :visible.sync="isShow" :append-to-body="true">
			<div class="careful-container">
				<template v-if="isHasCheckbox">
					<div class="message-contents">{{ tipsText }}</div>
					<div class="choose">
						<el-checkbox v-model="checked">本页操作不再显示该提示确认信息!</el-checkbox>
					</div>
				</template>
				<el-radio-group v-model="inputValue" v-else>
					<el-radio :label="item.key" v-for="(item, index) in enumList" :key="index">{{ item.name }}</el-radio>
				</el-radio-group>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click.stop.prevent="isShow = false">取 消</el-button>
				<el-button type="primary" @click.stop.prevent="changeValue">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
export default {
	data() {
		return {
			label: "",
			tag: {
				size: "small",
				effect: "dark"
			},
			isShow: false,
			checked: false, // 本页操作不再显示该提示确认信息复选框
			inputValue: null, // 输入的值
			enumList: [], // 枚举值列表
			isSubmiting: false
		};
	},
	props: {
		value: [Boolean, String, Number], // 当前的值
		click: Function, // 点击事件,返回Promise类型，如果没有有点击事件设置标签的鼠标悬浮样式为手型
		permissionValue: String, // 操作权限
		tips: String, // 修改操作列的提示内容，内容格式："【{0}】该文章"
		isShowConfirmTips: {
			type: Boolean,
			default: true
		}, // 是否显示当前操作的提示框
		list: {
			type: [String, Array],
			require: true
		}, // enum枚举值（如果是String类型，从constants中的enum对象里取值, 否则就是Array类型)
		columnLabel: String // 当前数据列的label
	},
	computed: {
		isBooleanEnum() {
			// 是否是boolean的枚举
			return this.enumList.length == 2;
		},
		hasPermission() {
			if (!this.permissionValue) {
				return true;
			}
			return site.globalService.hasPermission(this.permissionValue);
		},
		tipsText() {
			if (!this.isBooleanEnum) {
				return this.tips ? this.tips : "修改当前" + this.columnLabel + "值";
			}
			let i = this.enumList.findIndex(item => item.key == this.value);
			if (i == -1) {
				return "修改当前" + this.columnLabel + "值";
			} else {
				i = i == 0 ? 1 : 0;
				return this.tips ? "确定要" + site.utils.stringFormat(this.tips, this.enumList[i].name) + "吗?" : "确定要修改当前" + this.columnLabel + "值为" + this.enumList[i].name + "吗?";
			}
		},
		isHasCheckbox() {
			if (!this.isBooleanEnum) {
				return false;
			}
			let i = this.enumList.findIndex(item => item.key == this.value);
			return i != -1;
		}
	},
	watch: {
		isBooleanEnum() {
			this.generateTag();
		},
		value() {
			this.generateTag();
		}
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			let list;
			if (typeof this.list == "string") {
				list = site.constants.ENUM[this.list];
			} else {
				list = this.list;
			}
			if (!list || list.length == 0) {
				throw Error("没有相应的枚举值列表!");
			}
			this.enumList = site.utils.extend(true, list);
			this.generateTag();
		},
		// 生成标签
		generateTag() {
			this.inputValue = this.value;
			this.tag.effect = this.isBooleanEnum ? "dark" : "light";
			let i = this.enumList.findIndex(item => item.key == this.value);
			if (i == -1) {
				this.label = "未知";
				this.tag.type = "info";
			} else {
				this.label = this.enumList[i].name;
				this.tag.type = this.isBooleanEnum && i == 0 ? "success" : "";
			}
		},
		// 状态点击事件
		clickEvent(e) {
			if (!this.click || !this.hasPermission) {
				return;
			}
			e.preventDefault();
			e.stopPropagation();
			if (this.isShowConfirmTips || !this.isHasCheckbox) {
				this.isShow = true;
			} else {
				this.changeValue();
			}
		},
		// 更改数值
		changeValue() {
			if (this.isSubmiting == true) {
				this.$message.error("当前数据正在提交，请稍后！");
				return;
			}
			let selectValue = null;
			if (this.isHasCheckbox) {
				// 变成另外一个值
				let i = this.enumList.findIndex(item => item.key == this.value);
				if (i == 0) {
					i = 1;
				} else {
					i = 0;
				}
				selectValue = this.enumList[i].key;
			} else {
				selectValue = this.inputValue;
			}
			if (this.value == selectValue) {
				this.$message.error("需要修改的数值没有变化，请选择！");
				return;
			}
			this.isSubmiting = true;
			this.click(selectValue)
				.then(result => {
					this.$emit("input", selectValue);
					if (this.isShowConfirmTips) {
						this.$emit("change-show-confirm-tips", !this.checked);
					}
					this.isShow = false;
					this.isSubmiting = false;
				})
				.catch(error => {
					this.isSubmiting = false;
				});
		}
	}
};
</script>
<style lang="less" scoped>
.el-tag {
	cursor: pointer;
}
/** 谨慎操作提示信息 **/
.careful-container {
	padding-left: 20px;

	.message-contents {
		color: #000;
	}

	.choose {
		margin-top: 25px;

		.el-checkbox__label {
			font-size: 12px;
			color: #48576a;
		}
	}
}
</style>
