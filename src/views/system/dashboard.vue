<template>
	<div class="dashboard">
		工作台2 分析与报告
		<el-button type="primary" @click="show">主要按钮</el-button>
		<dialog-form v-bind="updatePasswordDialogForm" @close="updatePasswordDialogForm.isShow = false" @input-change="passwordInfoForm = arguments[0]"></dialog-form>
	</div>
</template>

<script>
export default {
	data() {
		return {
			content: '<p><br></p><div data-v-c37a9a52="" data-id="fb735db0-3799-4443-9004-fde0c6b08091" data-video-url="dddd" data-cover-url="" contenteditable="false" class="video-container" style="display: none;"></div><p><br></p>',
			updatePasswordDialogForm: {
				dialog: {
					title: "修改我的登录密码"
				},
				isShow: false,
				form: {},
				submitForm: this.updatePassword,
				fields: [
					{
						name: "videoUpload",
						type: "videoUpload",
						value: [],
						label: "视频上传测试",
						option: {}
					},
					{
						name: "htmlEditor",
						type: "htmlEditor",
						value: "",
						label: "内容"
					}
				]
			}
		};
	},
	methods: {
		change(fileList) {
			console.info(fileList);
		},
		show() {
			this.updatePasswordDialogForm.isShow = true;
		},
		updatePassword(){
			return Promise.resolve();
		}
	}
};
</script>

<style lang="less" scoped></style>
