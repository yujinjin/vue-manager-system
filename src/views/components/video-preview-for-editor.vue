<!-- 
    作者：yujinjin9@126.com
    时间：2020-09-02
    描述：在富文本框中的插入的自定义视频预览组件 
-->
<template>
	<div class="video-container" :class="{ active: isHover }" :data-id="dataId" @mouseover="isHover = true" @mouseout="isHover = false" :data-video-url="videoUrl" @click.stop.prevent :data-cover-url="coverImgUrl" contenteditable="false">
		<div class="close-box" @click="deleteNode" v-show="isHover">
			<i class="i-cross"></i>
		</div>
		<div class="cover-box">
			<img class="cover" @mousedown.stop.prevent :src="previewImgUrl" />
			<i class="i-play-sign"></i>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			id: null,
			isHover: false
		};
	},
	props: {
		dataId: {
			type: String,
			default() {
				return site.utils.generateGuid();
			}
		},
		videoUrl: {
			type: String,
			require: true
		},
		coverImgUrl: String
	},
	computed: {
		previewImgUrl() {
			if (this.coverImgUrl) {
				return site.utils.perfectImageUrl(this.coverImgUrl);
			} else {
				return require("@imgs/test/default-vedio.jpg");
			}
		}
	}
};
</script>
<style lang="less" scoped>
.video-container {
	position: relative;
	text-align: center;
	padding: 10px;
	width: 100%;

	&.active {
		background-color: #e2e2e2;
	}

	.close-box {
		position: absolute;
		cursor: pointer;
		top: 10px;
		right: 10px;
		padding: 15px;
	}

	.cover-box {
		display: inline-block;
		position: relative;

		img {
			max-width: 100%;
			max-height: 400px;
		}

		i.i-play-sign {
			font-size: 50px;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}
	}
}
</style>
