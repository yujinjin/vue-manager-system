<template>
	<!-- 数据列表中图片列，最大120px -->
	<div class="table-column-img">
		<template v-if="imgList">
			<div class="no-date">没有图片</div>
		</template>
		<template v-else>
			<el-image style="width: 80px; height: 50px;" :src="img" :preview-src-list="imgList" fit="cover" v-for="(img, index) in imgList" :key="index" />
		</template>
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
	max-width: 120px;
	overflow-x: auto;

	&::-webkit-scrollbar {
		display: none;
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
