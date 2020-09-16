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
		<data-table v-bind="dataTable" :filters="filters" @selection-change="selectRows = arguments[0]" />
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
									route: { name: "home" }
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
		refuse() {},
		delete() {},
		handleButtonClick(action) {
			console.info(action);
		}
	}
};
</script>
<style lang="less" scoped></style>
