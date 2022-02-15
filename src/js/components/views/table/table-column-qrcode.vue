<template>
	<!-- qrcode二维码 -->
	<div class="table-column-qrcode">
		<a @click="gotoShowQrcodeDialog">
			<slot v-bind="{ row }">{{ label }}</slot>
		</a>
		<el-dialog title="移动端二维码预览" :visible.sync="isShow" :append-to-body="true" :close-on-click-modal="false" width="450px">
			<div class="qrcode-box" ref="qrcode">
				<img v-if="isImg" :src="link | imageUrl" />
			</div>
		</el-dialog>
	</div>
</template>
<script>
import QRCode from "@js/lib/qrcode.js";
export default {
	data() {
		return {
			link: null,
			qrcodeInstance: null,
			isShow: false
		};
	},
	props: {
		url: {
			type: [String, Function],
			require: true
		},
		label: String,
		isImg: {
			type: Boolean,
			default: false
		}, // 返回的URL是图片地址还是URL地址
		row: Object
	},
	methods: {
		async genteratorLink() {
			if (!this.url) {
				this.link = "";
				return;
			}
			if (typeof this.url == "string") {
				this.link = site.utils.stringFormat(this.url, this.row);
			} else if (typeof this.url == "function") {
				let result = this.url(this.row);
				if (result instanceof Promise) {
					this.link = await result;
				} else {
					this.link = result;
				}
			}
		},
		async gotoShowQrcodeDialog() {
			if (!this.link) {
				await this.genteratorLink();
			}
			this.isShow = true;
			if (this.isImg) {
				return;
			}
			this.$nextTick(() => {
				if (this.qrcodeInstance) {
					this.qrcodeInstance.makeCode(this.link);
				} else {
					this.qrcodeInstance = new QRCode(this.$refs["qrcode"], {
						text: this.link,
						width: 350,
						height: 350,
						colorDark: "#000000",
						colorLight: "#ffffff",
						correctLevel: QRCode.CorrectLevel.H
					});
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
.qrcode-box {
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
