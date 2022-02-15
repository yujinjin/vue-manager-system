<template>
	<div class="simple-form">
		<page-form v-bind="pageForm"></page-form>
	</div>
</template>
<script>
export default {
	data() {
		return {
			pageForm: {
				submitForm: this.submit,
				fields: [
					{
						name: "filter",
						label: "系统用户"
					},
					{
						name: "orderNo",
						label: "编号"
					},
					{
						name: "state",
						label: "状态",
						type: "select",
						data: site.constants.ENUM["ACTIVE_FROZEN"]
					},
					{
						name: "videoUpload",
						type: "videoUpload",
						span: 12,
						value: [],
						label: "视频上传",
						option: {}
					},
					{
						name: "expressNo",
						label: "快递单",
						span: 12,
						type: "imgUpload",
						option: {
							cropp: true
						}
					},
					{
						name: "sendMan",
						label: "联系人"
					},
					{
						name: "payDate",
						label: "时间",
						type: "datePicker",
						option: {
							type: "datetime"
						}
					},
					{
						name: "orderNumber",
						label: "数量",
						type: "inputNumber"
					},
					{
						name: "isActive",
						label: "是否开启",
						type: "switch"
					},
					{
						name: "reciveCity",
						label: "接收城市",
						type: "checkbox",
						data: [
							{ label: "上海", value: 1 },
							{ label: "北京", value: 2 },
							{ label: "广州", value: 3 }
						],
						option: {
							optionValueKey: "value",
							optionLabelKey: "label"
						}
					},
					{
						name: "sendCity",
						label: "发货城市",
						type: "radio",
						data: [
							{ label: "上海", value: 1 },
							{ label: "北京", value: 2 },
							{ label: "广州", value: 3 }
						],
						option: {
							optionValueKey: "value",
							optionLabelKey: "label"
						}
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
		submit(form) {
			console.info(form);
			return Promise.resolve(true);
		}
	}
};
</script>
<style lang="less" scoped></style>
