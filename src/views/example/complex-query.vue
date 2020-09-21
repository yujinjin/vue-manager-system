<template>
	<!--
        作者：yujinjin9@126.com
        时间：2020-09-14
        描述：复杂查询列表页面
    -->
	<div class="user-list">
		<!--
            作者：yujinjin9@126.com
            时间：2020-09-14
            描述：列表过滤栏
        -->
		<search-form :fields="queryFields" @search="search" @change="filterChange">
			<template v-slot:other>
				<el-radio-group v-model="filters.fromAbroad">
					<el-radio :label="true">是</el-radio>
					<el-radio :label="false">否</el-radio>
				</el-radio-group>
			</template>
		</search-form>
		<!--
            作者：yujinjin9@126.com
            时间：2020-09-14
            描述：列表操作栏
        -->
		<action-bar :buttons="handleButtons" @click="handleButtonEvent" :isShowTableToggleColumn="true"></action-bar>

		<!--
            作者：yujinjin9@126.com
            时间：2020-09-14
            描述：数据列表栏
        -->
		<data-table v-bind="dataTable" :filters="filters" :select-rows.sync="selectRows">
			<template v-slot:expand="{ row }">
				<div>订单备注：{{ row["remark"] }}</div>
			</template>
		</data-table>
	</div>
</template>
<script>
export default {
	data() {
		return {
			// 查询表单字段
			queryFields: [
				{
					name: "filter",
					label: "关键词"
				},
				{
					label: "是否跨境",
					slot: "other"
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
					name: "orderNo",
					label: "联系人"
				},
				{
					name: "orderNo",
					type: "datePicker",
					label: "时间范围",
					span: 12,
					option: {
						type: "daterange",
						rangeSeparator: "至",
						startPlaceholder: "开始日期",
						endPlaceholder: "结束日期"
					}
				}
			],
			handleButtons: [
				{
					action: "add",
					label: "新增",
					click: this.add
				},
				{
					action: "refuse",
					label: "拒绝",
					click: this.refuse
				},
				{
					action: "delete",
					label: "删除",
					click: this.delete
				}
			],
			filters: {
				fromAbroad: true
			},
			dataTable: {
				query: site.api.common.queryList,
				dbClick: this.gotoEdit,
				columns: [
					{
						type: "expand"
					},
					{
						type: "selection"
					},
					{
						type: "action",
						label: "操作",
						buttons: row => {
							return [
								{
									label: "编辑",
									click: this.edit
								},
								{
									label: "查看",
									route: { name: "home" }
								},
								{
									label: "查看2",
									route: { name: "home" }
								},
								{
									label: "查看3",
									route: { name: "home" }
								},
								{
									label: "查看5",
									click: this.edit
								}
							];
						}
					},
					{
						prop: "activeStatus",
						label: "状态",
						type: "enum",
						list: "ACTIVE_FROZEN",
						click: this.changeStatus,
						tips: "【{0}】该内容"
					},
					{
						prop: "receiveMan",
						label: "收件人"
					},
					{
						prop: "price",
						label: "价格",
						type: "money"
					},
					{
						prop: "orderNo",
						label: "订单编号"
					},
					{
						prop: "receiveManTel",
						label: "手机号"
					},
					{
						prop: "sendMan",
						label: "购买人"
					},
					{
						prop: "fromAbroad",
						label: "是否跨境",
						type: "enum",
						list: "YES_NO"
					},
					{
						prop: "tags",
						label: "订单标签",
						type: "tags"
					},
					{
						prop: "imgs",
						label: "图片",
						type: "image"
					},
					{
						prop: "sex",
						label: "性别",
						type: "enum",
						list: "SEX"
					},
					{
						prop: "createTime",
						label: "时间",
						type: "datetime"
					}
				],
				table: null,
				isShowToggleColumnButton: true
			}
		};
	},
	methods: {
		init() {
			for (let i = 0; i < 16; i++) {
				this.handleButtons.push({
					action: "add" + i,
					label: "新增测试" + i,
					click: this.add
				});
			}
		},
		search() {},
		add() {
			console.info(this.searchForm);
		},
		edit(row) {
			console.info(row);
		},
		refuse() {},
		delete() {},
		handleButtonEvent(action) {
			console.info(action);
		},
		change(fileList) {
			console.info(fileList);
		},
		changeStatus(status) {
			return Promise.resolve(true);
		}
	}
};
</script>
<style lang="less" scoped></style>
