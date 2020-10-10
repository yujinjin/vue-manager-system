<template>
	<!-- 操作列 -->
	<div class="table-column-action">
		<el-button type="text" disabled v-if="!actionButtons || actionButtons.length == 0">无操作</el-button>
		<template v-else>
			<template v-for="(button, index) in showButtons">
				<a v-if="button.link && button.action != 'qrcode'" @click.stop :href="button.link" target="_blank" :key="index">{{ button.label }}</a>
				<a v-else :key="index" @click.stop.prevent="buttonClickEvent(index)">{{ button.label }}</a>
			</template>
			<template v-if="dropdownButtons.length > 0">
				<el-dropdown :hide-on-click="false" @command="dropdownClickEvent" size="small">
					<span class="el-dropdown-link"> 更多<i class="el-icon-arrow-down el-icon--right"></i> </span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item v-for="(button, index) in dropdownButtons" :key="index" :command="index">{{ button.label }}</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</template>
		</template>
		<el-dialog title="移动端二维码预览" :visible.sync="qrcodeDialog.isShow" :append-to-body="true" :close-on-click-modal="false" width="450px">
			<div class="qrcode-box" ref="qrcode">
				<img v-if="qrcodeDialog.isImg" :src="qrcodeDialog.link | imageUrl" />
			</div>
		</el-dialog>
	</div>
</template>
<script>
import QRCode from "@js/lib/qrcode.js";
export default {
	data() {
		return {
			actionButtons: [], // 按钮列表
			qrcodeDialog: {
				isImg: false,
				isShow: false,
				qrcodeInstance: null,
				link: null
			}
		};
	},
	props: {
		// [{
		// label: '文案', route: {} | Function (主要用于内部链接),
		// url: String | Function (主要用于外部链接或通过接口函数得到URL),
		// click: Function（主要用于更复杂的业务逻辑自定义实现）,
		// action: '' (qrcode:移动端二维码预览，url必须有值)
		// isImg: 当前的二维码是否是返回的图片（action是qrcode时才会用到）
		// }]
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
			if (this.actionButtons.length > this.maxShow) {
				return this.actionButtons.slice(0, this.maxShow - 1);
			} else {
				return this.actionButtons;
			}
		},
		dropdownButtons() {
			if (this.actionButtons.length > this.maxShow) {
				return this.actionButtons.slice(this.maxShow - 1);
			} else {
				return [];
			}
		}
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			this.generationButtons();
		},
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
				let actionButton = site.utils.extend(true, {}, button);
				if (actionButton.route) {
					actionButton.link = this.$router.resolve(typeof button.route == "function" ? button.route(this.row) : button.route).href;
					delete actionButton.route;
				} else if (actionButton.url && typeof actionButton.url == "string") {
					actionButton.link = site.utils.stringFormat(button.url, this.row);
					delete actionButton.url;
				}
				this.actionButtons.push(actionButton);
			});
		},
		async genteratorQrcode(index) {
			if (!this.actionButtons[index].link) {
				let link = null;
				if (typeof this.actionButtons[index].url == "string") {
					link = site.utils.stringFormat(this.actionButtons[index].url, this.row);
				} else if (typeof this.actionButtons[index].url == "function") {
					let result = this.actionButtons[index].url(this.row);
					if (result instanceof Promise) {
						link = await result;
					} else {
						link = result;
					}
				}
				this.actionButtons[index].link = link;
			}
			this.qrcodeDialog.isShow = true;
			this.qrcodeDialog.link = this.actionButtons[index].link;
			this.qrcodeDialog.isImg = !!this.actionButtons[index].isImg;
			console.info(this.actionButtons[index].isImg);
			if (this.actionButtons[index].isImg) {
				return;
			}
			this.$nextTick(() => {
				if (this.qrcodeDialog.qrcodeInstance) {
					this.qrcodeDialog.qrcodeInstance.makeCode(this.qrcodeDialog.link);
				} else {
					this.qrcodeDialog.qrcodeInstance = new QRCode(this.$refs["qrcode"], {
						text: this.qrcodeDialog.link,
						width: 350,
						height: 350,
						colorDark: "#000000",
						colorLight: "#ffffff",
						correctLevel: QRCode.CorrectLevel.H
					});
				}
			});
		},
		async buttonClickEvent(index) {
			if (this.actionButtons[index].action == "qrcode") {
				this.genteratorQrcode(index);
				return;
			}
			if (this.actionButtons[index].link) {
				window.open(this.actionButtons[index].link);
			} else if (this.actionButtons[index].url) {
				let result = this.actionButtons[index].url(this.row);
				let link = null;
				if (result instanceof Promise) {
					link = await result;
				} else {
					link = result;
				}
				if (typeof link == "object") {
					link = this.$router.resolve(link).href;
				}
				this.actionButtons[index].link = link;
				window.open(link);
			} else {
				this.actionButtons[index].click(this.row);
			}
		},
		dropdownClickEvent(command) {
			this.buttonClickEvent(this.maxShow - 1 + command);
		}
	}
};
</script>
<style lang="less" scoped>
.table-column-action {
	a {
		display: inline-block;
		cursor: pointer;
		color: #20a0ff;
		&:not(:first-child) {
			padding-left: 5px;
		}
	}

	.el-dropdown-link {
		font-size: 12px;
		color: #20a0ff;
		padding-left: 5px;
		display: inline-block;
	}
}

.qrcode-box {
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
