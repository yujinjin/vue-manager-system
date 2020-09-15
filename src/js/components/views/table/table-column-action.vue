<template>
	<!-- 操作列 -->
	<div class="table-column-action">
		<el-button type="text" disabled v-if="!actionButtons || actionButtons.length == 0">无操作</el-button>
		<template v-else>
			<template v-for="(button, index) in showButtons">
				<a v-if="button.url" :href="button.url" target="_blank" :key="index">{{ button.label }}</a>
				<a v-else :key="index" @click="buttonClickEvent(index)">{{ button.label }}</a>
			</template>
			<template v-if="dropdownButtons.length > 0">
				<el-dropdown :hide-on-click="false" @command="dropdownClickEvent">
					<span class="el-dropdown-link"> 更多操作<i class="el-icon-arrow-down el-icon--right"></i> </span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item v-for="(button, index) in dropdownButtons" :key="index" :command="index">{{ button.label }}</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</template>
		</template>
	</div>
</template>
<script>
export default {
	data() {
		return {
			actionButtons: [] // 按钮列表
		};
	},
	props: {
		// [{label: '文案', route: {} | Function, url: String | Function, click: Function}]
		// 其中route、url、click只能有一个
		buttons: [Array, Function],
		row: Object,
		maxShow: {
			type: Number,
			default: 4
		} // 最多显示操作的按钮，超过之后就会隐藏起来
	},
	computed: {
		showButtons() {
			if (this.actionButtons > this.maxShow) {
				return this.actionButtons.slice(0, this.maxShow - 1);
			} else {
				return this.actionButtons;
			}
		},
		dropdownButtons() {
			return this.actionButtons.slice(this.maxShow - 1);
		}
	},
	methods: {
		init() {},
		generationButtons() {
			if (!this.buttons || !this.row) {
				return;
			}
			let buttons = null;
			if (typeof this.buttons == "function") {
				// 当前的按钮生成是通过回调方法
				buttons = this.buttons(this.row);
			} else {
				buttons = this.buttons;
			}
			this.actionButtons = [];
			if (!buttons) {
				return;
			}
			buttons.forEach(button => {
				let actionButton = { label: button.label };
				if (button.route) {
					actionButton.url = site.config.localDomain + this.$router.resolve(typeof button.route == "function" ? button.route(row) : button.route).href;
				} else if (button.url) {
					actionButton.url = typeof button.url == "function" ? button.url(row) : button.url;
				} else {
					actionButton.click = button.click;
				}
				this.actionButtons.push(actionButton);
			});
		},
		buttonClickEvent(index) {
			if (this.actionButtons[index].url) {
				window.open(this.actionButtons[index].url);
			} else {
				this.actionButtons[index].click(row);
			}
		},
		dropdownClickEvent(command) {
			this.buttonClickEvent(this.maxShow - 1 + command);
		}
	}
};
</script>
<style lang="less" scoped></style>
