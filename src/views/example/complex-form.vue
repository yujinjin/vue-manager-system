<template>
	<div class="complex-form">
		<page-complex-form v-bind="pageForm">
			<!-- 自定义数据列表内容 -->
			<template v-slot:table="{ formInput }">
				<el-table :data="tableData" height="250" border style="width: 100%">
					<el-table-column type="selection" width="55"></el-table-column>
					<el-table-column prop="date" label="日期" width="180"> </el-table-column>
					<el-table-column prop="name" label="姓名" width="180"> </el-table-column>
					<el-table-column prop="address" label="地址"> </el-table-column>
				</el-table>
				<div class="table-footer">
					<el-button size="small" @click="deleteGoods">删除</el-button>
					<el-button type="primary" size="small" @click="addGoods(formInput)">添加</el-button>
				</div>
			</template>
		</page-complex-form>
	</div>
</template>
<script>
export default {
	data() {
		return {
			tableData: [
				{
					date: "2016-05-03",
					name: "王小虎",
					address: "上海市普陀区金沙江路 1518 弄"
				},
				{
					date: "2016-05-02",
					name: "王小虎",
					address: "上海市普陀区金沙江路 1518 弄"
				},
				{
					date: "2016-05-04",
					name: "王小虎",
					address: "上海市普陀区金沙江路 1518 弄"
				},
				{
					date: "2016-05-01",
					name: "王小虎",
					address: "上海市普陀区金沙江路 1518 弄"
				},
				{
					date: "2016-05-08",
					name: "王小虎",
					address: "上海市普陀区金沙江路 1518 弄"
				},
				{
					date: "2016-05-06",
					name: "王小虎",
					address: "上海市普陀区金沙江路 1518 弄"
				},
				{
					date: "2016-05-07",
					name: "王小虎",
					address: "上海市普陀区金沙江路 1518 弄"
				}
			],
			pageForm: {
				submitForm: this.submit,
				fields: [
					{
						division: {
							title: "栏目1内容",
							subTitle: "提示内容1"
						}
					},
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
						data: [
							{ label: "激活", value: true },
							{ label: "冻结", value: false }
						]
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
						division: {
							title: "栏目2内容"
						}
					},
					{
						name: "expressNo",
						label: "快递单",
						span: 12,
						type: "imgUpload"
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
						division: {
							title: "商品列表"
						}
					},
					{
						slot: "table",
						span: 24
					},
					{
						division: {
							title: "栏目4内容"
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
		init() {},
		deleteGoods() {},
		addGoods(formInput) {
			console.info(formInput);
		},
		submit(formInput) {
			console.info(formInput);
		}
	}
};
</script>
<style lang="less" scoped>
.complex-form {
	.table-footer {
		padding: 10px 0px;
		text-align: center;
	}
}
</style>
