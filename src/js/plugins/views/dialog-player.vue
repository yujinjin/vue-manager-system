<template>
	<!-- 播放器弹窗 -->
	<div class="dialog-palyer" @touchmove.stop.prevent @keyup.esc="close" @click.stop.prevent="close">
		<div class="body-contents">
			<div class="player" ref="palyer"></div>
		</div>
	</div>
</template>
<script>
export default {
	data: function () {
		return {
			videoUrl: "", // 视频地址
			videoCover: "", // 视频封面图地址
			onClose: null, // 关闭回调函数
			playerInstance: null, // 播放器实例
			playerOptions: {
				fitVideoSize: "auto",
				fluid: true,
				autoplay: true
			} // 播放器选项
		};
	},
	watch: {
		videoUrl(val) {
			this.initPlayer();
		}
	},
	mounted() {
		this.initPlayer();
	},
	methods: {
		async initPlayer() {
			if (!this.videoUrl) {
				return;
			}
			if (this.playerInstance) {
				this.playerInstance.start(this.videoUrl);
				return;
			}
			let playerOptions = Object.assign(
				{
					fitVideoSize: "auto",
					fluid: true
				},
				this.playerOptions
			);
			playerOptions.el = this.$refs["palyer"];
			playerOptions.url = this.videoUrl;
			playerOptions.poster = this.videoCover;
			this.playerInstance = await this.$player(playerOptions);
		},
		close() {
			this.isShow = false;
			this.destroy();
			if (this.onClose && typeof this.onClose == "function") {
				this.onClose();
			}
		},
		destroy() {
			if (this.playerInstance) {
				this.playerInstance.destroy();
				this.playerInstance = null;
			}
		}
	}
};
</script>
<style lang="less" scoped>
.dialog-palyer {
	position: fixed;
	z-index: 9998;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: opacity 0.3s ease;
	background-color: rgba(0, 0, 0, 0.5);

	.body-contents {
		width: 50%;
		// height: 50%;
		background-color: #ffffff;
		border-radius: 10px;
	}
}
</style>
