<template>
	<!-- 数据列表中图片列，最大120px -->
	<div class="table-column-img" @click.stop.prevent>
		<template v-if="imgList && imgList.length > 0">
			<el-image class="img-column" :src="img" :preview-src-list="imgList" fit="cover" v-for="(img, index) in imgList" :key="index" />
		</template>
		<div class="no-date" v-else>没有图片</div>
	</div>
</template>
<script>
export default {
	data() {
		return {};
	},
	props: {
		imgs: [Array, String]
	},
	computed: {
		imgList() {
			if (!this.imgs) {
				return null;
			} else if (typeof this.imgs == "string") {
				let imgList = this.imgs.split("|");
				return imgList.map(img => site.utils.perfectImageUrl(img));
			} else {
				return this.imgs.map(img => site.utils.perfectImageUrl(img));
			}
		}
	}
};
</script>
<style lang="less" scoped>
.table-column-img {
	// max-width: 120px;
	overflow-x: auto;
	display: flex;

	&::-webkit-scrollbar {
		display: none;
	}

	.img-column {
		flex-shrink: 0;
		width: 60px;
		height: 50px;
		margin-right: 5px;
	}

	.no-date {
		height: 80px;
		max-width: 80px;
		width: 100%;
		background-color: #f5f7fa;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 12px;
		color: #c0c4cc;
		vertical-align: middle;
	}
}
</style>
