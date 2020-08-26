<template>
	<!--
        说明：列表操作栏，超出一行默认隐藏
    -->
	<div class="action-bar" v-if="buttons && buttons.length > 0" ref="action-bar">
		<div class="button-list" :class="{ more: isShowMore }" @resize="test">
			<div v-for="(buttonItem, index) in buttons" :key="index" class="button-box" v-show="startHideButtonIndex == -1 || isShowMore || index <= startHideButtonIndex">
				<template v-if="buttonItem.slot">
					<!-- 自定义组件 -->
					<slot :name="buttonItem.slot"></slot>
				</template>
				<el-button v-else v-bind="buttonItem.option" @click="clickHandle(index)">{{ buttonItem.label }}</el-button>
			</div>
		</div>
		<div class="more-box" v-if="startHideButtonIndex != -1">
			<el-button type="success" @click="isShowMore = !isShowMore" size="small" icon="el-icon-more">{{ isShowMore ? "隐藏" : "更多" }}</el-button>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			defaultAttribute: {
				size: "small"
			}, // 按钮默认属性
			buttons: [], // 按钮列表
			isShowMore: false, // 是否显示更多操作按钮
			startHideButtonIndex: -1 // 开始隐藏按钮的起始位置
		};
	},
	props: {
		actionButtons: {
			type: Array,
			default() {
				return [];
			}
		} // 操作按钮列表 [{action: 动作名称, click: 自定义函数, label: 按钮文案, permission: 操作权限, option: 按钮的自定义选项(可无), slot: 自定义插槽名称（可无，如有值其他选项无效）}]
	},
	created() {
		this.init();
	},
	watch: {
		actionButtons(val) {
			this.generateButtons();
		}
	},
	methods: {
		init() {
			this.generateButtons();
		},
		generateButtons() {
			if (!this.actionButtons || this.actionButtons.length == 0) {
				return;
			}
			let buttons = [];
			this.actionButtons.forEach(buttonItem => {
				if (!this.isShowButtonByPermission(buttonItem.permission)) {
					return;
				}
				buttonItem = site.utils.extend(true, {}, { option: this.defaultAttribute }, buttonItem);
				buttons.push(buttonItem);
			});
			this.buttons = buttons;
			this.$nextTick(this.calculationButtons);
		},
		isShowButtonByPermission(permission) {
			// TODO: 实现
			return true;
		},
		// 计算当前操作按钮的列表所占的宽度
		calculationButtons() {
			this.isShowMore = false;
			this.startHideButtonIndex = -1;
			this.$nextTick(() => {
				let allWidth = $(this.$refs["action-bar"]).outerWidth();
				let buttonBoxs = $(this.$refs["action-bar"]).find(".button-box");
				let realWidth = 0;
				for (let i = 0; i < buttonBoxs.length; i++) {
					realWidth += $(buttonBoxs[i]).outerWidth();
					if (realWidth > allWidth) {
						if (realWidth - $(buttonBoxs[i]).outerWidth() + 80 < allWidth) {
							this.startHideButtonIndex = i - 1;
						} else {
							this.startHideButtonIndex = i - 2;
						}
						break;
					}
				}
			});
		},
		clickHandle(i) {
			if (typeof this.buttons[i].click == "function") {
				this.buttons[i].click();
			}
			this.$emit("click", this.buttons[i].action);
		},
		test(){
			console.info("..............")
		}
	}
};
</script>
<style lang="less" scoped>
.action-bar {
	width: 100%;
	display: flex;
	padding: 4px 0px;
	border-bottom: 1px solid #ddd;
	overflow: hidden;

	.button-list {
		flex: 1;
		display: flex;
		overflow: hidden;

		&.more {
			flex-wrap: wrap;
		}

		.button-box {
			padding: 4px 8px;
		}
	}

	.more-box {
		width: 100px;
		padding: 4px 0px;
		text-align: center;
	}
}
</style>
