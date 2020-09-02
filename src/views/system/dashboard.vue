<template>
	<div class="dashboard">
		工作台2 分析与报告
		<web-editor v-model="content"></web-editor>
	</div>
</template>

<script>
export default {
	data() {
		return {
			content: '<p><br></p><div data-v-c37a9a52="" data-id="fb735db0-3799-4443-9004-fde0c6b08091" data-video-url="dddd" data-cover-url="" contenteditable="false" class="video-container" style="display: none;"></div><p><br></p>'
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
