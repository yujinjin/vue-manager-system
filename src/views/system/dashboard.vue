<template>
	<div class="dashboard">
		<!-- 工作台2 分析与报告 -->
		<page-complex-form v-bind="updatePasswordDialogForm" @input-change="passwordInfoForm = arguments[0]"></page-complex-form>
	</div>
</template>

<script>
export default {
	data() {
		return {
			passwordInfoForm: {},
			updatePasswordDialogForm: {
				form: {},
				submitForm: this.updatePassword,
				fields: [
					{
						division: {
							title: "栏目1内容",
							subTitle: "提示内容1"
						}
					},
					{
						name: "videoUpload",
						type: "videoUpload",
						value: [],
						label: "视频上传",
						option: {}
					},
					{
						name: "filter",
						label: "系统用户"
					},
					{
						name: "filter2",
						label: "系统用户"
					},
					{
						division: "栏目2内容"
					},
					{
						name: "htmlEditor",
						type: "htmlEditor",
						value: "",
						label: "内容"
					},
					{
						division: "栏目3内容"
					},
					{
						name: "htmlEditor2",
						type: "htmlEditor",
						value: "",
						label: "内容"
					},
					{
						division: "栏目4内容"
					},
					{
						name: "htmlEditor3",
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
		updatePassword() {
			return Promise.resolve();
		}
	}
};
</script>

<style lang="less" scoped></style>
