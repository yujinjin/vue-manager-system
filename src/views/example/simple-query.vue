<template>
	<div class="simple-query">
		<!--
            作者：yujinjin9@126.com
            时间：2020-09-16
            描述：列表过滤栏
        -->
		<search-form :fields="queryFields" @search="search" @change="filterChange" />

		<!--
            作者：yujinjin9@126.com
            时间：2020-09-16
            描述：列表操作栏
        -->
		<action-bar :buttons="handleButtons" @click="handleButtonClick" :isShowTableToggleColumn="true" />

		<!--
            作者：yujinjin9@126.com
            时间：2020-09-16
            描述：数据列表栏
        -->
		<data-table v-bind="dataTable" :filters="filters" ref="data-table" :select-rows.sync="selectRows" />

		<!--
			作者：yujinjin9@126.com
            时间：2020-09-24
            描述：预览
		-->
		<el-dialog :title="viewDialogForm.dialog.title" :visible.sync="viewDialogForm.isShow" width="50%" :close-on-click-modal="false">
			<view-info :fields="viewDialogForm.fields" :value="viewDialogForm.value"></view-info>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" :disabled="!getPrevRow(viewDialogForm.value)" size="small" @click="showPreRow">上一条</el-button>
				<el-button type="primary" :disabled="!getNextRow(viewDialogForm.value)" size="small" @click="showNextRow">下一条</el-button>
				<el-button size="small" @click="viewDialogForm.isShow = false">关闭</el-button>
			</div>
		</el-dialog>
		<!-- <dialog-form v-bind="viewDialogForm" ref="view-dialog-form" @close="viewDialogForm.isShow = false" @input-change="viewDialogForm.formInput = arguments[0]"> </dialog-form> -->
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
					name: "state",
					label: "是否成功",
					type: "select",
					data: [
						{ label: "是", value: true },
						{ label: "否", value: false }
					]
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
			dataTable: {
				query: site.api.common.queryList,
				dialog: {
					title: null
				},
				columns: [
					{
						type: "selection"
					},
					{
						type: "action",
						label: "操作",
						width: "75px",
						buttons: row => {
							return [
								{
									label: "编辑",
									click: this.edit
								},
								{
									label: "查看",
									click: this.gotoView
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
						prop: "price",
						label: "价格",
						width: "100px",
						type: "money"
					},
					{
						prop: "orderNo",
						label: "订单编号",
						width: "75px"
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
						width: "140px",
						type: "datetime"
					}
				]
			},
			viewDialogForm: {
				isShow: false,
				value: {},
				dialog: {
					title: null
				},
				fields: [
					{
						name: "orderNo",
						label: "订单号"
					},
					{
						name: "receiveMan",
						label: "收货人"
					},
					{
						name: "price",
						label: "价格",
						type: "money"
					},
					{
						name: "receiveManTel",
						label: "收货人手机号"
					},
					{
						name: "sendMan",
						label: "购买人"
					},
					{
						name: "fromAbroad",
						label: "是否跨境",
						type: "enum",
						list: "YES_NO"
					},
					{
						name: "tags",
						label: "标签",
						type: "tags"
					},
					{
						name: "sex",
						label: "性别",
						type: "enum",
						list: "SEX"
					},
					{
						name: "imgs",
						label: "图片",
						type: "image"
					},
					{
						name: "activeStatus",
						label: "状态",
						type: "enum",
						list: "ACTIVE_FROZEN"
					},
					{
						name: "createTime",
						label: "创建时间",
						type: "datetime"
					},
					{
						name: "remark",
						label: "备注",
						type: "html"
					}
				]
			}
		};
	},
	methods: {
		init() {},
		search() {},
		edit(row) {},
		add() {
			console.info(this.searchForm);
		},
		gotoView(row) {
			this.viewDialogForm.dialog.title = "查看页面信息，编号：" + row.orderNo;
			this.viewDialogForm.isShow = true;
			this.viewDialogForm.value = row;
		},
		showPreRow() {
			this.viewDialogForm.value = this.getPrevRow(this.viewDialogForm.value);
		},
		showNextRow() {
			this.viewDialogForm.value = this.getNextRow(this.viewDialogForm.value);
		},
		refuse() {},
		delete() {},
		handleButtonClick(action) {
			console.info(action);
		}
	}
};
</script>
<style lang="less" scoped></style>
