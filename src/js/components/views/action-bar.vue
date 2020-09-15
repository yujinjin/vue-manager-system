<template>
	<!--
        说明：列表操作栏，超出一行默认隐藏
    -->
	<div class="action-bar" v-if="actionButtons && actionButtons.length > 0" ref="action-bar">
		<div class="button-list" :class="{ more: isShowMore }">
			<div v-for="(buttonItem, index) in actionButtons" :key="index" class="button-box" v-show="startHideButtonIndex == -1 || isShowMore || index <= startHideButtonIndex">
				<template v-if="buttonItem.slot">
					<!-- 自定义组件 -->
					<slot :name="buttonItem.slot"></slot>
				</template>
				<el-button v-else v-bind="buttonItem.option" @click="clickHandle(index)">{{ buttonItem.label }}</el-button>
			</div>
		</div>
		<div class="more-box" v-if="startHideButtonIndex != -1 || isShowTableToggleColumn">
			<el-button type="success" v-if="startHideButtonIndex != -1" @click="isShowMore = !isShowMore" size="small" icon="el-icon-more">{{ isShowMore ? "隐藏" : "更多" }}</el-button>
			<div v-show="isShowTableToggleColumn && !isShowMore" style="width: 60px;"></div>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			actionButtons: [], // 按钮列表
			isShowMore: false, // 是否显示更多操作按钮
			startHideButtonIndex: -1 // 开始隐藏按钮的起始位置
		};
	},
	props: {
		buttons: {
			type: Array,
			default() {
				return [];
			}
		}, // 操作按钮列表 [{action: 动作名称, click: 自定义函数, label: 按钮文案, permission: 操作权限, option: 按钮的自定义选项(可无), slot: 自定义插槽名称（可无，如有值其他选项无效）}]
		isShowTableToggleColumn: {
			type: Boolean,
			default: false
		} // 是否显示数据table的列操作栏
	},
	created() {
		this.init();
	},
	watch: {
		buttons(val) {
			this.generateButtons();
		}
	},
	methods: {
		init() {
			this.generateButtons();
		},
		generateButtons() {
			if (!this.buttons || this.buttons.length == 0) {
				return;
			}
			let actionButtons = [];
			this.buttons.forEach(buttonItem => {
				if (!this.isShowButtonByPermission(buttonItem.permission)) {
					return;
				}
				buttonItem = site.utils.extend(true, {}, { option: site.constants.ACTION_BAR_BUTTON_DEFAULT_ATTRIBUTES }, buttonItem);
				actionButtons.push(buttonItem);
			});
			// 如果第一个按钮没有设置type，就默认设置为primary
			if (!actionButtons[0].option.type) {
				actionButtons[0].option.type = "primary";
			}
			this.actionButtons = actionButtons;
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
						if (realWidth - $(buttonBoxs[i]).outerWidth() + 80 + (this.isShowTableToggleColumn ? 55 : 0) < allWidth) {
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
			if (typeof this.actionButtons[i].click == "function") {
				this.actionButtons[i].click();
			}
			this.$emit("click", this.actionButtons[i].action);
		}
	}
};
</script>
<style lang="less" scoped>
.action-bar {
	width: 100%;
	display: flex;
	padding: 4px 0px;
	// border-bottom: 1px solid #ddd;

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
		// width: 100px;
		height: 40px;
		padding: 4px 0px;
		text-align: center;
		display: flex;
	}
}
</style>
