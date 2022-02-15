<template>
	<div class="department-list">
		<!--
            作者：yujinjin9@126.com
            时间：2020-09-22
            描述：列表操作栏
        -->
		<action-bar :buttons="handleButtons"></action-bar>
		<!--
            作者：yujinjin9@126.com
            时间：2020-09-23
            描述：数据列表栏
        -->
		<data-table v-bind="dataTable"></data-table>
		<!-- 修改或新增菜单信息 -->
		<dialog-form v-bind="updateDepartmentDialogForm" ref="update-department-dialog-form" :isShow.sync="updateDepartmentDialogForm.isShow" />
	</div>
</template>
<script>
export default {
	data() {
		return {
			handleButtons: [
				{
					action: "refresh",
					label: "刷新",
					click: this.refresh
				}
			],
			dataTable: {
				query: site.api.system.queryDepartmentList,
				queryDataHandle: data => {
					return { items: data };
				},
				dbClick: this.gotoUpdate,
				hasPagination: false,
				table: {
					defaultExpandAll: true
				},
				columns: [
					{
						prop: "name",
						label: "部门名称"
					},
					{
						type: "action",
						label: "操作",
						width: "120px",
						buttons: [
							{
								label: "新增",
								click: this.gotoAdd
							},
							{
								label: "修改",
								click: this.gotoUpdate
							},
							{
								label: "删除",
								click: this.delete
							}
						]
					}
				]
			},
			updateDepartmentDialogForm: {
				isShow: false,
				dialog: {
					title: null
				},
				fields: [
					{
						name: "name",
						label: "部门名称",
						rules: [{ required: true, message: "部门名称不能为空" }]
					}
				],
				submitForm: this.updateDepartment
			}
		};
	},
	methods: {
		init() {},
		delete(row) {
			this.$confirm("确定要删除" + row.name + "信息吗?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			})
				.then(() => {
					return Promise.resolve(true);
				})
				.catch(() => {});
		},
		gotoAdd(row) {
			this.updateDepartmentDialogForm.isShow = true;
			this.updateDepartmentDialogForm.dialog.title = "新增部门信息";
			this.$refs["update-department-dialog-form"].setFieldsValue(null);
		},
		gotoUpdate(row) {
			this.updateDepartmentDialogForm.isShow = true;
			this.updateDepartmentDialogForm.dialog.title = "修改部门：" + row.name;
			this.$refs["update-department-dialog-form"].setFieldsValue(row);
		},
		updateDepartment(formInput) {
			return new Promise((resolve, reject) => {
				console.info(formInput);
				resolve(true);
			});
		}
	}
};
</script>
<style lang="less" scoped></style>
