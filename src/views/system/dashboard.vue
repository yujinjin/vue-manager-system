<template>
	<div class="dashboard">
		工作台2 分析与报告
		<video-upload :fileList="fileList" :limit="3" @on-change="change"></video-upload>
	</div>
</template>

<script>
export default {
	data() {
		return {
			fileList: []
		};
	},
	methods: {
		change(fileList) {
			console.info(fileList);
		}
	}
};
</script>

<style lang="less" scoped></style>
