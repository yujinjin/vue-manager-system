<template>
	<div class="complex-form">
		<page-form v-bind="pageForm" ref="page-form">
			<!-- 自定义数据列表内容 -->
			<template v-slot:table="{ formInput }">
				<el-table v-if="formInput && formInput.table" :data="formInput.table" border style="width: 100%" height="300">
					<el-table-column label="日期">
						<template slot-scope="{ $index }">
							<div class="form-column">
								<el-form-item :prop="'table.' + $index + '.date'" :rules="{ required: true, message: '请选择日期' }">
									<el-date-picker v-model="formInput.table[$index].date" type="date" placeholder="选择日期"></el-date-picker>
								</el-form-item>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="姓名">
						<template slot-scope="{ $index }">
							<div class="form-column">
								<el-form-item :prop="'table.' + $index + '.name'" :rules="{ required: true, message: '请输入姓名' }">
									<el-input v-model="formInput.table[$index].name" placeholder="请输入姓名"></el-input>
								</el-form-item>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="地址">
						<template slot-scope="{ $index }">
							<div class="form-column">
								<el-form-item :prop="'table.' + $index + '.address'" :rules="{ required: true, message: '请输入地址' }">
									<el-input v-model="formInput.table[$index].address" placeholder="请输入地址"></el-input>
								</el-form-item>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="{ $index }">
							<el-button size="small" @click="moveButton(formInput.table, $index, -1)" v-if="$index != 0">上移</el-button>
							<el-button size="small" @click="moveButton(formInput.table, $index, 1)" v-if="$index != formInput.table.length - 1">下移</el-button>
							<el-button size="small" @click="gotoAdd(formInput.table)" type="primary" v-else>添加</el-button>
						</template>
					</el-table-column>
				</el-table>
			</template>
		</page-form>
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
						name: "table",
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
	mounted() {
		this.init();
	},
	methods: {
		init() {
			this.$refs["page-form"].setFieldValue("table", [
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
					date: "",
					name: "",
					address: ""
				}
			]);
		},
		moveButton(table, index, number) {
			if (number > 0) {
				table.splice(index + number + 1, 0, table[index]);
				table.splice(index, 1);
			} else if (number < 0) {
				table.splice(index + number, 0, table[index]);
				table.splice(index + 1, 1);
			}
		},
		gotoAdd(table) {
			table.push({
				date: "",
				name: "",
				address: ""
			});
		},
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
	.form-column {
		padding-top: 18px;
	}
}
</style>
